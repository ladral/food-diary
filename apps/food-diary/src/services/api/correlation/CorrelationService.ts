import FoodDiaryApiClient from "../FoodDiaryApiClient.ts";
import { Severity } from "../../../models/alerts/Severity.ts";
import { ApiException } from "../../../models/exceptions/ApiException.ts";
import logger from "../../logging/logger.ts";
import GetCorrelationsListResponse from "./models/GetCorrelationsListResponse.ts";


class CorrelationService {
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

    async getCorrelations(foodIdsToIgnore: number[]): Promise<GetCorrelationsListResponse | null> {
        try {
            const result = await this.apiClient.getCorrelations(foodIdsToIgnore);

            if (result.success) {
                return result.data;
            } else {
                logger.error("could not get diary correlations")
                return this.handleApiException(result.error)
            }
        } catch (e) {
            return this.handleUnknownExceptions(e, "getCorrelations")
        }
    }
}

export default CorrelationService;