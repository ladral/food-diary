import React, { useState } from "react";
import styles from "./FoodIntakeForm.module.scss";
import { Autocomplete, TextField } from "@mui/material";
import GetFoodResponse from "../../services/api/food/models/GetFoodResponse.ts";
import IFoodService from "../../services/api/food/IFoodService.ts";

interface CreateIntakeFormProps {
    onClose: () => void;
    onInsert: () => void;
    foodService: IFoodService;
}

const FoodIntakeForm: React.FC<CreateIntakeFormProps> = ({ onClose, onInsert, foodService }) => {
    const [foodName, setFoodName] = useState("");
    const [foodId, setFoodId] = useState(0);
    const [date, setDate] = useState("");
    const [foods, setFoods] = useState<GetFoodResponse[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFoodName("");
        await foodService.createFoodIntake({ food_id: foodId, date });
        onInsert();
        onClose();
    };


    const handleSearch = async (foodSearchString: string) => {
        if (foodSearchString.trim()) {
            const getFoodsResponse = await foodService.searchFood(foodSearchString);
            if (getFoodsResponse && getFoodsResponse.count > 0) {
                setFoods(getFoodsResponse.results);
            } else {
                setFoods([]);
            }
        }
    };

    return (
        <form className={`${styles.form} is-flex is-flex-direction-column`} onSubmit={handleSubmit}>
            <div className={`${styles.form__input} is-flex is-flex-direction-row`}>
                <Autocomplete
                    className={styles.autocomplete}
                    options={foods.map(food => food.name)}
                    inputValue={foodName}
                    onInputChange={(event, newInputValue) => {
                        if (event !== null && event.type === "change") {
                            handleSearch(newInputValue);
                            setFoodName(newInputValue);
                        }
                    }}
                    renderInput={(params) => (
                        <TextField className={styles.autocomplete__input} {...params} label="Lebensmittel"
                                   variant="outlined" />
                    )}
                    onChange={(_event, value) => {
                        setFoods([]);
                        if (value) {
                            const selectedFood = foods.filter(food => food.name === value)[0];
                            setFoodName(selectedFood.name);
                            setFoodId(selectedFood.id);
                        }
                    }}
                />
                <input
                    className={`${styles.form__inputDate} fd-input fd-input--light`}
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

export default FoodIntakeForm;
