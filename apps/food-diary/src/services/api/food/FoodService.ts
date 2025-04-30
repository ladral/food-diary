import FoodDiaryApiClient from "../FoodDiaryApiClient.ts";
import CreateFoodIntakeResponse from "./models/CreateFoodIntakeResponse.ts";
import CreateFoodIntakeRequest from "./models/CreateFoodIntakeRequest.ts";
import logger from "../../logging/logger.ts";
import { Severity } from "../../../models/alerts/Severity.ts";


class FoodService {
    private apiClient: FoodDiaryApiClient;
    private addAlert: (message: string, severity: Severity) => void;

    constructor(addAlert: (message: string, severity: Severity) => void) {
        this.apiClient = new FoodDiaryApiClient();
        this.addAlert = addAlert;
    }


    async createFoodIntake(body: CreateFoodIntakeRequest): Promise<CreateFoodIntakeResponse | null> {
        try {
            const result = await this.apiClient.createIntake(body);

            if (result.success) {
                this.addAlert('Eintrag erfolgreich hinzugefügt', Severity.Success);
                return result.data;
            } else {
                logger.error("could not create food intake")
                const error = result.error;
                logger.error(
                    `API Error: ${error.message} ` +
                    `(Status Code: ${error.statusCode}, Error Code: ${error.errorCode})`
                );
                this.addAlert(`Error: ${error.message}`, Severity.Error);
                return null;
            }
        } catch (e) {
            logger.error('Unexpected error in createFoodIntake:', e);
            this.addAlert('An unexpected error occurred.', Severity.Error);
            return null;
        }
    }
}

export default FoodService;
