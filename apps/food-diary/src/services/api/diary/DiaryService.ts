import FoodDiaryApiClient from "../FoodDiaryApiClient.ts";
import logger from "../../logging/logger.ts";
import DiaryApiResponse from "../../../models/diary/DiaryApiResponse.ts";

class DiaryService {
    private apiClient: FoodDiaryApiClient;
    private pageSize: number;

    constructor() {
        this.apiClient = new FoodDiaryApiClient();
        this.pageSize = 10;
    }

    async getDiaryList(page: number): Promise<DiaryApiResponse | null> {
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
                // TODO: add global exception handling
                return null;
            }
        } catch (e) {
            logger.error('Unexpected error in getDiaryList:', e);
            // TODO: add global exception handling
            return null;
        }
    }
}

export default DiaryService;