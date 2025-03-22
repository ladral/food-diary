import React, { useState } from "react";
import useKeycloak from "../hooks/useKeycloak";
import viteLogo from "/vite.svg";
import reactLogo from "../assets/react.svg";

const HomePage: React.FC = () => {
    const [count, setCount] = useState(0);
    const { keycloak, authenticated } = useKeycloak();

    const handleLogin = () => {
        keycloak?.login();
    };

    const handleLogout = () => {
        keycloak?.logout();
    };

    return (
        <div>
            <div>
                <a href="https://vite.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <button className="button" onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
            {authenticated ? (
                <div>
                    <p>Hello, {keycloak?.idTokenParsed?.preferred_username}!</p>
                </div>
            ) : (
                <div>
                    <p>Please log in to access your personalized content.</p>
                </div>
            )}

            {authenticated ? (
                <>
                    <button color="inherit" onClick={handleLogout}>
                        Logout
                    </button>
                </>
            ) : (
                <button color="inherit" onClick={handleLogin}>
                    Login
                </button>
            )}
        </div>
    );
};

export default HomePage;