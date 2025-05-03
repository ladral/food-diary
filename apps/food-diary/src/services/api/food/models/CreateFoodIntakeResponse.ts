interface Food {
    id: number;
    name: string;
}

interface CreateFoodIntakeResponse {
    id: number;
    food: Food;
    user_id: number;
    date: string
}

export default CreateFoodIntakeResponse;