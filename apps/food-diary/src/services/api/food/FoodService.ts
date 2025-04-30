import FoodDiaryApiClient from "../FoodDiaryApiClient.ts";
import CreateFoodIntakeResponse from "./models/CreateFoodIntakeResponse.ts";
import CreateFoodIntakeRequest from "./models/CreateFoodIntakeRequest.ts";
import logger from "../../logging/logger.ts";


class FoodService {
    private apiClient: FoodDiaryApiClient;

    constructor() {
        this.apiClient = new FoodDiaryApiClient();
    }


    async createFoodIntake(body: CreateFoodIntakeRequest): Promise<CreateFoodIntakeResponse | null> {
        try {
            const result = await this.apiClient.createIntake(body);

            if (result.success) {
                return result.data;
            } else {
                logger.error("could not create food intake")
                const error = result.error;
                logger.error(
                    `API Error: ${error.message} ` +
                    `(Status Code: ${error.statusCode}, Error Code: ${error.errorCode})`
                );
                // TODO: add global exception handling
                return null;
            }
        } catch (e) {
            logger.error('Unexpected error in createFoodIntake:', e);
            // TODO: add global exception handling
            return null;
        }
    }
}

export default FoodService;
