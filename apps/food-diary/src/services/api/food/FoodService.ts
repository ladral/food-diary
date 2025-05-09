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
}

export default FoodService;
