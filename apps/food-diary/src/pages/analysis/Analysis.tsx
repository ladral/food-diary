import React, { useState } from "react";
import styles from "./Analysis.module.scss";
import CorrelationChart from "../../components/charts/CorrelationChart.tsx";
import logger from "../../services/logging/Logger.ts";
import { useAlert } from "../../context/AlertContext.tsx";
import CorrelationService from "../../services/api/correlation/CorrelationService.ts";
import Correlation from "../../services/api/correlation/models/Correlation.ts";
import MultiSelectSearch from "../../components/inputs/MultiSelectSearch.tsx";
import GetFoodResponse from "../../services/api/food/models/GetFoodResponse.ts";
import FoodService from "../../services/api/food/FoodService.ts";
import ErrorHandler from "../../services/error/ErrorHandler.ts";

const Analysis: React.FC = () => {
    const [correlations, setCorrelations] = useState<Correlation[]>([]);
    const [foodsToIgnore, setFoodsToIgnore] = useState<GetFoodResponse[]>([]);
    const [foodOptions, setFoodOptions] = useState<GetFoodResponse[]>([]);
    const { addAlert } = useAlert();
    const errorHandler = new ErrorHandler(addAlert)
    const correlationService = new CorrelationService(errorHandler);
    const foodService = new FoodService(errorHandler);

    const fetchCorrelations = async () => {
        try {
            const result = await correlationService.getCorrelations(foodsToIgnore.map(food => food.id));
            if (result) {
                setCorrelations(result.correlations);
            } else {
                logger.error("No correlations found");
            }
        } catch (error) {
            logger.error("Failed to fetch correlations", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetchCorrelations();
    };

    const searchFoods = async (foodSearchString: string) => {
        if (foodSearchString.trim()) {
            const getFoodsResponse = await foodService.searchFood(foodSearchString);
            if (getFoodsResponse && getFoodsResponse.count > 0) {
                setFoodOptions(getFoodsResponse.results);
            } else {
                setFoodOptions([]);
            }
        }
    };

    const onChange = (newValues: string[]) => {
        const possibleNewFoods = foodOptions.filter(food => newValues.includes(food.name));
        const updatedFoods = [...foodsToIgnore];

        possibleNewFoods.forEach(newFood => {
            if (!updatedFoods.some(food => food.id === newFood.id)) {
                updatedFoods.push(newFood);
            }
        });

        const filteredFoods = updatedFoods.filter(food => newValues.includes(food.name));
        setFoodsToIgnore(filteredFoods);
    };

    return (
        <div>
            <form className={`${styles.form} is-flex is-flex-direction-column`} onSubmit={handleSubmit}>
                <div className={styles.form__input}>
                    <label className={styles.form__inputLabel}>Von der Analyse ausschliessen</label>
                        <MultiSelectSearch
                            values={foodsToIgnore.map(food => food.name)}
                            onSearch={searchFoods}
                            onChange={onChange}
                            options={foodOptions.map(food => food.name)}
                        />
                </div>
                <button className={`${styles.form__submitButton} fd-button fd-button--primary`} type="submit">
                    Analysedaten Aktualisieren
                </button>
            </form>

            <CorrelationChart correlations={correlations} />
        </div>
    );
};

export default Analysis;
