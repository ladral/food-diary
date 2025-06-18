import FoodDiaryApiClient from "../FoodDiaryApiClient.ts";
import logger from "../../logging/Logger.ts";
import GetCorrelationsListResponse from "./models/GetCorrelationsListResponse.ts";
import ICorrelationService from "./ICorrelationService.ts";
import IErrorHandler from "../../error/IErrorHandler.ts";


class CorrelationService implements ICorrelationService{
    private apiClient: FoodDiaryApiClient;
    private errorHandler: IErrorHandler;

    constructor(apiClient: FoodDiaryApiClient, errorHandler: IErrorHandler) {
        this.apiClient = apiClient;
        this.errorHandler = errorHandler;
    }

    async getCorrelations(foodIdsToIgnore: number[]): Promise<GetCorrelationsListResponse | null> {
        try {
            const result = await this.apiClient.getCorrelations(foodIdsToIgnore);

            if (result.success) {
                return result.data;
            } else {
                logger.error("could not get diary correlations")
                return this.errorHandler.handleApiException(result.error)
            }
        } catch (e) {
            return this.errorHandler.handleUnknownExceptions(e, "getCorrelations")
        }
    }
}

export default CorrelationService;