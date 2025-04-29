import React, { useState } from "react";
import logger from "../../services/logging/logger.ts";
import styles from "./CreateIntakeForm.module.scss";

interface CreateIntakeFormProps {
    onClose: () => void;
}

const CreateIntakeForm: React.FC<CreateIntakeFormProps> = ({ onClose }) => {
    const [foodName, setFoodName] = useState("");
    const [date, setDate] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        logger.debug("create food intake");
        // TODO: call food service to create new intake
        onClose();
    };

    return (
        <form className={`${styles.form} is-flex is-flex-direction-column`} onSubmit={handleSubmit}>
            <div className={`${styles.form__input} is-flex is-flex-direction-row`}>
                <input
                    className="fd-input fd-input--light"
                    type="text"
                    value={foodName}
                    onChange={(e) => setFoodName(e.target.value)}
                    placeholder="Lebensmittel"
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

export default CreateIntakeForm;
