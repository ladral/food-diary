import FoodDiaryApiClient from "../FoodDiaryApiClient.ts";
import logger from "../../logging/Logger.ts";
import GetDiaryListResponse from "./models/GetDiaryListResponse.ts";
import IDiaryService from "./IDiaryService.ts";
import IErrorHandler from "../../error/IErrorHandler.ts";

class DiaryService implements IDiaryService {
    private apiClient: FoodDiaryApiClient;
    private pageSize: number;
    private errorHandler: IErrorHandler;

    constructor(apiClient: FoodDiaryApiClient, errorHandler: IErrorHandler) {
        this.apiClient = apiClient;
        this.pageSize = 10;
        this.errorHandler = errorHandler;
    }

    async getDiaryList(page: number): Promise<GetDiaryListResponse | null> {
        try {
            const result = await this.apiClient.getDiary(page, this.pageSize);

            if (result.success) {
                result.data.totalPages = Math.ceil(result.data.count / this.pageSize);
                return result.data;
            } else {
                logger.error("could not get diary list");
                return this.errorHandler.handleApiException(result.error);
            }
        } catch (e) {
            return this.errorHandler.handleUnknownExceptions(e, "getDiaryList");
        }
    }
}

export default DiaryService;