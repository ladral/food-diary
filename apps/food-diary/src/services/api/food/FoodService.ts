import FoodDiaryApiClient from "../FoodDiaryApiClient.ts";
import CreateFoodIntakeResponse from "./models/CreateFoodIntakeResponse.ts";
import CreateFoodIntakeRequest from "./models/CreateFoodIntakeRequest.ts";
import logger from "../../logging/Logger.ts";
import { Severity } from "../../../models/alerts/Severity.ts";
import GetFoodsResponse from "./models/GetFoodsResponse.ts";
import IFoodService from "./IFoodService.ts";
import IErrorHandler from "../../error/IErrorHandler.ts";


class FoodService implements IFoodService {
    private apiClient: FoodDiaryApiClient;
    private errorHandler: IErrorHandler;

    constructor(apiClient: FoodDiaryApiClient, errorHandler: IErrorHandler) {
        this.apiClient = apiClient;
        this.errorHandler = errorHandler;
    }

    async searchFood(foodName: string): Promise<GetFoodsResponse | null> {
        try {
            const result = await this.apiClient.getFoods(foodName);

            if (result.success) {
                return result.data;
            } else {
                logger.error("could not search food")
                return this.errorHandler.handleApiException(result.error)
            }
        } catch (e) {
            return this.errorHandler.handleUnknownExceptions(e, "searchFood")
        }
    }


    async getFoodId(foodName: string): Promise<number | null> {
        const foodResponse = await this.searchFood(foodName);
        if (foodResponse && foodResponse.count > 0) {
            const food = foodResponse.results.find(food => food.name === foodName);
            if (food) {
                return food.id
            }
        }
        return null;
    }


    async createFoodIntake(body: CreateFoodIntakeRequest): Promise<CreateFoodIntakeResponse | null> {
        try {
            const result = await this.apiClient.createIntake(body);

            if (result.success) {
                this.errorHandler.alert('Eintrag erfolgreich hinzugefügt', Severity.Success);
                return result.data;
            } else {
                logger.error("could not create food intake")
                return this.errorHandler.handleApiException(result.error)
            }
        } catch (e) {
            return this.errorHandler.handleUnknownExceptions(e, "createFoodIntake")
        }
    }


    async updateFoodIntake(id: number, body: CreateFoodIntakeRequest): Promise<CreateFoodIntakeResponse | null> {
        try {
            const result = await this.apiClient.updateIntake(id, body);

            if (result.success) {
                this.errorHandler.alert('Eintrag erfolgreich aktualisiert', Severity.Success);
                return result.data;
            } else {
                logger.error("could not update food intake")
                return this.errorHandler.handleApiException(result.error)
            }
        } catch (e) {
            return this.errorHandler.handleUnknownExceptions(e, "updateFoodIntake")
        }
    }

    async deleteFoodIntake(id: number): Promise<void> {
        try {
            const result = await this.apiClient.deleteIntake(id);

            if (result.success) {
                this.errorHandler.alert('Eintrag erfolgreich gelöscht', Severity.Info);
            } else {
                logger.error("could not delete food intake")
                this.errorHandler.handleApiException(result.error)
            }
        } catch (e) {
            this.errorHandler.handleUnknownExceptions(e, "deleteFoodIntake")
        }
    }
}

export default FoodService;
