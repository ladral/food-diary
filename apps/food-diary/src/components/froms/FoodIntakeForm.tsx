import React, { useEffect, useState } from "react";
import styles from "./FoodIntakeForm.module.scss";
import { Autocomplete, TextField } from "@mui/material";
import GetFoodResponse from "../../services/api/food/models/GetFoodResponse.ts";
import IFoodService from "../../services/api/food/IFoodService.ts";
import DiaryEntry from "../../services/api/diary/models/DiaryEntry.ts";

interface CreateIntakeFormProps {
    onClose: () => void;
    onAction: () => void;
    foodService: IFoodService;
    diaryEntry?: DiaryEntry;
}

const FoodIntakeForm: React.FC<CreateIntakeFormProps> = ({ onClose, onAction, foodService, diaryEntry }) => {
    const [foodName, setFoodName] = useState("");
    const [foodId, setFoodId] = useState(0);
    const [date, setDate] = useState("");
    const [foods, setFoods] = useState<GetFoodResponse[]>([]);
    const [hasError, setHasError] = useState(false);


    useEffect(() => {
        if (hasError) return;

        if (diaryEntry && !hasError) {
            setFoodName(diaryEntry.name);
            setDate(diaryEntry.date);

            const fetchFoodId = async () => {
                const foodId = await foodService.getFoodId(diaryEntry.name);
                if (foodId) {
                    setFoodId(foodId);
                } else {
                    setHasError(true);
                }
            };

            fetchFoodId();
        }

    }, [foodService, diaryEntry, hasError]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFoodName("");

        if (diaryEntry) {
            await foodService.updateFoodIntake(diaryEntry.id, { food_id: foodId, date });
        } else {
            await foodService.createFoodIntake({ food_id: foodId, date });
        }

        onAction();
        onClose();
    };

    const deleteEntry = async (event: React.FormEvent) => {
        event.preventDefault();
        setFoodName("");

        if (diaryEntry) {
            await foodService.deleteFoodIntake(diaryEntry.id);
        }

        onAction();
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
            <div className={`${styles.form__actions} is-flex is-justify-content-space-between`}>
                {diaryEntry && (
                    <button className={`${styles.form__deleteButton} fd-button fd-button--primary`}
                            type="button"
                            onClick={deleteEntry}>
                        Löschen
                    </button>
                )}
                <button className={`${styles.form__submitButton} fd-button fd-button--primary`}
                        type="submit">
                    {diaryEntry ? "Aktualisieren" : "Hinzufügen"}
                </button>
            </div>
        </form>
    );
};

export default FoodIntakeForm;
