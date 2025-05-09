import FoodDiaryApiClient from "../FoodDiaryApiClient.ts";
import logger from "../../logging/logger.ts";
import GetDiaryListResponse from "./models/GetDiaryListResponse.ts";
import { Severity } from "../../../models/alerts/Severity.ts";
import { ApiException } from "../../../models/exceptions/ApiException.ts";

class DiaryService {
    private apiClient: FoodDiaryApiClient;
    private pageSize: number;
    private addAlert: (message: string, severity: Severity) => void;

    constructor(addAlert: (message: string, severity: Severity) => void) {
        this.apiClient = new FoodDiaryApiClient();
        this.pageSize = 10;
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

    async getDiaryList(page: number): Promise<GetDiaryListResponse | null> {
        try {
            const result = await this.apiClient.getDiary(page, this.pageSize);

            if (result.success) {
                result.data.totalPages = Math.ceil(result.data.count / this.pageSize)
                return result.data;
            } else {
                logger.error("could not get diary list")
                return this.handleApiException(result.error)
            }
        } catch (e) {
            return this.handleUnknownExceptions(e, "y")
        }
    }
}

export default DiaryService;