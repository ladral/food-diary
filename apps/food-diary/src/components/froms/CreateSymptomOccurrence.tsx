import React, { useState } from "react";
import logger from "../../services/logging/logger.ts";
import styles from "./CreateSymptomOccurrence.module.scss"

interface CreateSymptomOccurrenceProps {
    onClose: () => void;
}

const CreateSymptomOccurrence: React.FC<CreateSymptomOccurrenceProps> = ({ onClose }) => {
    const [symptomName, setSymptomName] = useState("");
    const [date, setDate] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        logger.debug("create symptom occurrence");
        // TODO: call symptom service to create new occurrence
        onClose();
    };

    return (
        <form className={`${styles.form} is-flex is-flex-direction-column`} onSubmit={handleSubmit}>
            <div className={`${styles.form__input} is-flex is-flex-direction-row`}>
                <input
                    className="fd-input fd-input--light"
                    type="text"
                    value={symptomName}
                    onChange={(e) => setSymptomName(e.target.value)}
                    placeholder="Symptom"
                    required
                />
                <input
                    className="fd-input fd-input--light"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
            </div>
            <button className={`${styles.form__submitButton} is-align-self-flex-end fd-button fd-button--primary`} type="submit">Submit</button>
        </form>
    );
};

export default CreateSymptomOccurrence;
