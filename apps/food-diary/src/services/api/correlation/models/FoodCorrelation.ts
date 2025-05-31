import OccurrenceCounts from "./OccurrenceCounts.ts";


interface FoodCorrelation {
    food_id: number;
    food_name: string;
    correlation_coefficient: number;
    occurrence_counts: OccurrenceCounts;
}

export default FoodCorrelation;