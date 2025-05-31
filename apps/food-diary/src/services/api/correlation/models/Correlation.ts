import FoodCorrelation from "./FoodCorrelation.ts";


interface Correlation {
    symptom_id: number;
    symptom_name: string;
    food_correlations: FoodCorrelation[];
}

export default Correlation;