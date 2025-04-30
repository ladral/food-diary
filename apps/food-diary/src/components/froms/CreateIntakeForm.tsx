import React, { useState } from "react";
import styles from "./CreateIntakeForm.module.scss";
import FoodService from "../../services/api/food/FoodService.ts";

interface CreateIntakeFormProps {
    onClose: () => void;
}

const CreateIntakeForm: React.FC<CreateIntakeFormProps> = ({ onClose }) => {
    const [foodName, setFoodName] = useState("");
    const [foodId, setFoodId] = useState(13); // TODO: set default value to 0
    const [date, setDate] = useState("");
    const foodService = new FoodService();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await foodService.createFoodIntake({food_id: foodId, date})
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
            <button className={`${styles.form__submitButton} is-align-self-flex-end fd-button fd-button--primary`} type="submit">Hinzufügen</button>
        </form>
    );
};

export default CreateIntakeForm;
