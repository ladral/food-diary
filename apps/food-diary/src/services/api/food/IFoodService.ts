import CreateFoodIntakeResponse from "./models/CreateFoodIntakeResponse";
import CreateFoodIntakeRequest from "./models/CreateFoodIntakeRequest";
import GetFoodsResponse from "./models/GetFoodsResponse";

interface IFoodService {
    searchFood(foodName: string): Promise<GetFoodsResponse | null>;
    createFoodIntake(body: CreateFoodIntakeRequest): Promise<CreateFoodIntakeResponse | null>;
}

export default IFoodService;