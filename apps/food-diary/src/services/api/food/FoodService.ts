import FoodDiaryApiClient from "../FoodDiaryApiClient.ts";
import CreateFoodIntakeResponse from "./models/CreateFoodIntakeResponse.ts";
import CreateFoodIntakeRequest from "./models/CreateFoodIntakeRequest.ts";
import logger from "../../logging/logger.ts";
import { Severity } from "../../../models/alerts/Severity.ts";
import GetFoodsResponse from "./models/GetFoodsResponse.ts";
import IFoodService from "./IFoodService.ts";
import { ApiException } from "../../../models/exceptions/ApiException.ts";


class FoodService implements IFoodService {
    private apiClient: FoodDiaryApiClient;
    private addAlert: (message: string, severity: Severity) => void;

    constructor(addAlert: (message: string, severity: Severity) => void) {
        this.apiClient = new FoodDiaryApiClient();
        this.addAlert = addAlert;
    }

    private handleApiException(error: ApiException): null {
        this.addAlert(`Error: ${error.message}`, Severity.Error);
        return null;
    }

    private handleUnknownExceptions(e: any, source: string): null {
        logger.error(`Unexpected error in ${source}:`, e);
        this.addAlert('An unexpected error occurred.', Severity.Error);
        return null;
    }

    async searchFood(foodName: string): Promise<GetFoodsResponse | null> {
        try {
            const result = await this.apiClient.getFoods(foodName);

            if (result.success) {
                return result.data;
            } else {
                logger.error("could not search food")
                return this.handleApiException(result.error)
            }
        } catch (e) {
            return this.handleUnknownExceptions(e, "searchFood")
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
                this.addAlert('Eintrag erfolgreich hinzugefügt', Severity.Success);
                return result.data;
            } else {
                logger.error("could not create food intake")
                return this.handleApiException(result.error)
            }
        } catch (e) {
            return this.handleUnknownExceptions(e, "createFoodIntake")
        }
    }


    async updateFoodIntake(id: number, body: CreateFoodIntakeRequest): Promise<CreateFoodIntakeResponse | null> {
        try {
            const result = await this.apiClient.updateIntake(id, body);

            if (result.success) {
                this.addAlert('Eintrag erfolgreich aktualisiert', Severity.Success);
                return result.data;
            } else {
                logger.error("could not update food intake")
                return this.handleApiException(result.error)
            }
        } catch (e) {
            return this.handleUnknownExceptions(e, "updateFoodIntake")
        }
    }

    async deleteFoodIntake(id: number): Promise<void> {
        try {
            const result = await this.apiClient.deleteIntake(id);

            if (result.success) {
                this.addAlert('Eintrag erfolgreich gelöscht', Severity.Info);
            } else {
                logger.error("could not delete food intake")
                this.handleApiException(result.error)
            }
        } catch (e) {
            this.handleUnknownExceptions(e, "deleteFoodIntake")
        }
    }
}

export default FoodService;
