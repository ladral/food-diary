import React, { useState } from "react";
import styles from "./CreateIntakeForm.module.scss";
import FoodService from "../../services/api/food/FoodService.ts";
import { useAlert } from "../../context/AlertContext.tsx";

interface CreateIntakeFormProps {
    onClose: () => void;
}

const CreateIntakeForm: React.FC<CreateIntakeFormProps> = ({ onClose }) => {
    const [foodName, setFoodName] = useState("");
    const [foodId, setFoodId] = useState(0); // TODO: set default value to 0
    const [date, setDate] = useState("");
    const { addAlert } = useAlert();
    const foodService = new FoodService(addAlert);

    const handleSubmit = async (e: React.FormEvent) => {
        setFoodId(13)
        e.preventDefault();
        await foodService.createFoodIntake({ food_id: foodId, date });
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
            <button className={`${styles.form__submitButton} is-align-self-flex-end fd-button fd-button--primary`} type="submit">
                Hinzufügen
            </button>
        </form>
    );
};

export default CreateIntakeForm;
