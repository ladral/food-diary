import FoodDiaryApiClient from "../FoodDiaryApiClient.ts";
import logger from "../../logging/logger.ts";
import GetDiaryListResponse from "./models/GetDiaryListResponse.ts";
import { Severity } from "../../../models/alerts/Severity.ts";

class DiaryService {
    private apiClient: FoodDiaryApiClient;
    private pageSize: number;
    private addAlert: (message: string, severity: Severity) => void;

    constructor(addAlert: (message: string, severity: Severity) => void) {
        this.apiClient = new FoodDiaryApiClient();
        this.pageSize = 10;
        this.addAlert = addAlert;
    }

    async getDiaryList(page: number): Promise<GetDiaryListResponse | null> {
        try {
            const result = await this.apiClient.getDiary(page, this.pageSize);

            if (result.success) {
                result.data.totalPages = Math.ceil(result.data.count / this.pageSize)
                return result.data;
            } else {
                const error = result.error;
                logger.error(
                    `API Error: ${error.message} ` +
                    `(Status Code: ${error.statusCode}, Error Code: ${error.errorCode})`
                );
                this.addAlert(`Error: ${error.message}`, Severity.Error);
                return null;
            }
        } catch (e) {
            logger.error('Unexpected error in getDiaryList:', e);
            this.addAlert('An unexpected error occurred.', Severity.Error);
            return null;
        }
    }
}

export default DiaryService;