import { Result } from "../../models/api/Result";
import { ExternalApiException } from "../../models/exceptions/ExternalApiException";
import useKeycloak from "../../hooks/useKeycloak.ts";
import axios, { AxiosError, AxiosInstance } from "axios";
import logger from "../logging/logger.ts";
import DiaryApiResponse from "../../models/diary/DiaryApiResponse.ts";

class FoodDiaryApiClient {
    private client: AxiosInstance;

    constructor() {
        const { keycloak } = useKeycloak();

        const instance = axios.create({
            baseURL: import.meta.env.VITE_API_BASE_URL as string
        });

        instance.interceptors.request.use((config) => {
            if (keycloak?.token) {
                config.headers.Authorization = `Bearer ${keycloak.token}`;
            }
            return config;
        });

        this.client = instance;
    }

    private createExternalApiException(error: unknown): ExternalApiException {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            return {
                statusCode: axiosError.response?.status || 500,
                message: axiosError.message,
                path: axiosError.config?.url,
                timestamp: new Date().toISOString(),
                details: JSON.stringify(axiosError.response?.data),
                errorCode: axiosError.code
            };
        }

        return {
            statusCode: 500,
            message: error instanceof Error ? error.message : "Unknown error occurred",
            timestamp: new Date().toISOString(),
            errorCode: "UNKNOWN_ERROR"
        };
    }

    async getResource<T>(path: string, params = {}): Promise<Result<T>> {
        try {
            const response = await this.client.get<T>(path, { params });
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            logger.error("Error fetching data:", error);
            return {
                success: false,
                error: this.createExternalApiException(error)
            };
        }
    }

    async getDiary(page: number, pageSize: number = 10): Promise<Result<DiaryApiResponse>> {
        return this.getResource("/api/diary/", { page_size: pageSize, page });
    }

}

export default FoodDiaryApiClient;