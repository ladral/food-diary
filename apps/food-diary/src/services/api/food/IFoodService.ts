import CreateFoodIntakeResponse from "./models/CreateFoodIntakeResponse";
import CreateFoodIntakeRequest from "./models/CreateFoodIntakeRequest";
import GetFoodsResponse from "./models/GetFoodsResponse";

interface IFoodService {
    searchFood(foodName: string): Promise<GetFoodsResponse | null>;
    createFoodIntake(body: CreateFoodIntakeRequest): Promise<CreateFoodIntakeResponse | null>;
    getFoodId(name: string): Promise<number | null>;
    updateFoodIntake(id: number, body: CreateFoodIntakeRequest): Promise<CreateFoodIntakeResponse | null>;
    deleteFoodIntake(id: number): Promise<void>
}

export default IFoodService;