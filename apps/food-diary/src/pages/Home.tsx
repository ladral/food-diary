import React, { useState, useEffect } from "react";
import useKeycloak from "../hooks/useKeycloak";
import createAxiosInstance from "../services/axiosInstance";
import DiaryEntry from "../models/DiaryEntry.ts";
import "./Home.scss";
import axios from "axios";
import logger from "../services/logging/logger.ts";
import ExpandableButton from "../components/buttons/ExpandableButton.tsx";

const HomePage: React.FC = () => {
    const { keycloak, authenticated } = useKeycloak();
    const axiosInstance = createAxiosInstance();

    const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [notification, setNotification] = useState<string | null>(null);

    const handleLogin = () => {
        keycloak?.login();
    };

    const handleLogout = () => {
        keycloak?.logout();
    };

    const getDiaryEntries = async () => {
        try {
            const response = await axiosInstance.get("/api/diary/");
            setDiaryEntries(response.data.results);
        } catch (error) {
            logger.error("Error making API call:", error);
            setNotification(`Error getting all diary entries: ${error}`);
            setTimeout(() => setNotification(null), 3000);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response = await axiosInstance.post("/api/diary/", { title, content });
            logger.debug("Diary entry created:", response.data);
            await getDiaryEntries();
            setTitle("");
            setContent("");
        } catch (error) {
            if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
                    setNotification("You must be logged in to create a diary entry.");
                    setTimeout(() => setNotification(null), 3000);
            } else {
                logger.error("Error creating diary entry:", error);
                setNotification(`Error creating diary entry: ${error}`);
                setTimeout(() => setNotification(null), 3000);
            }
        }
    };

    useEffect(() => {
        if (authenticated) {
            getDiaryEntries();
        }
    }, [authenticated]);

    return (
        <div>
            <div className="user card is-flex is-flex-direction-column is-align-items-center">
                <div className="user__info">
                    {authenticated ? (
                        <p>Hello, {keycloak?.idTokenParsed?.preferred_username}!</p>
                    ) : (
                        <p>Please log in to create new diary entries.</p>
                    )}
                </div>

                {authenticated ? (
                    <button className="user__logout fd-button fd-button--secondary" color="inherit" onClick={handleLogout}>
                        Logout
                    </button>
                ) : (
                    <button className="user__login fd-button fd-button--secondary" color="inherit" onClick={handleLogin}>
                        Login
                    </button>
                )}
            </div>


            <ExpandableButton className="diary__add"/>


            <form className="is-flex is-flex-direction-column form" onSubmit={handleSubmit}>
                <input
                    className="form__diary-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title (max 200 characters)"
                    maxLength={200}
                    required
                />
                <textarea
                    className="form__diary-content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Content"
                    required
                />
                <button className="form__submit fd-button fd-button--primary" type="submit">Submit Diary Entry</button>
            </form>

            {notification && (
                <div className="notification">
                    {notification}
                </div>
            )}

            <div className="diary">
                <h2>Diary Entries</h2>
                <table className="diary__table">
                    <thead>
                    <tr>
                        <th className="diary__header">Date</th>
                        <th className="diary__header">Name</th>
                        <th className="diary__header">Type</th>
                    </tr>
                    </thead>
                    <tbody>
                    {diaryEntries.map((entry) => (
                        <tr key={entry.id} className="diary__entry">
                            <td className="diary__entry-date">{entry.date}</td>
                            <td className="diary__entry-name">{entry.name}</td>
                            <td className="diary__entry-type">{entry.type}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default HomePage;
