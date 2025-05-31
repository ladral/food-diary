import { Result } from "../../models/api/Result";
import { ApiException } from "../../models/exceptions/ApiException.ts";
import useKeycloak from "../../hooks/useKeycloak.ts";
import axios, { AxiosError, AxiosInstance } from "axios";
import logger from "../logging/logger.ts";
import GetDiaryListResponse from "./diary/models/GetDiaryListResponse.ts";
import CreateFoodIntakeRequest from "./food/models/CreateFoodIntakeRequest.ts";
import CreateFoodIntakeResponse from "./food/models/CreateFoodIntakeResponse.ts";
import GetFoodsResponse from "./food/models/GetFoodsResponse.ts";
import GetSymptomsResponse from "./symptom/models/GetSymptomsResponse.ts";
import CreateSymptomOccurrenceRequest from "./symptom/models/CreateSymptomOccurrenceRequest.ts";
import CreateSymptomOccurrenceResponse from "./symptom/models/CreateSymptomOccurrenceResponse.ts";
import CreateSymptomResponse from "./symptom/models/CreateSymptomResponse.ts";
import CreateSymptomRequest from "./symptom/models/CreateSymptomRequest.ts";
import GetCorrelationsListResponse from "./correlation/models/GetCorrelationsListResponse.ts";

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

    private createApiException(error: unknown): ApiException {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            const apiException = {
                statusCode: axiosError.response?.status || 500,
                message: axiosError.message,
                path: axiosError.config?.url,
                timestamp: new Date().toISOString(),
                details: JSON.stringify(axiosError.response?.data),
                errorCode: axiosError.code
            };

            logger.error(
                `API Error: ${apiException.message} ` +
                `(Status Code: ${apiException.statusCode}, Error Code: ${apiException.errorCode})`
            );

            return apiException;
        }

        return {
            statusCode: 500,
            message: error instanceof Error ? error.message : "Unknown error occurred",
            timestamp: new Date().toISOString(),
            errorCode: "UNKNOWN_ERROR"
        };
    }

    private async getResource<T>(path: string, params = {}): Promise<Result<T>> {
        logger.debug(`GET ${path}`, params);
        try {
            const response = await this.client.get<T>(path, { params });
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            logger.error("error fetching data:", error);
            return {
                success: false,
                error: this.createApiException(error)
            };
        }
    }

    private async createResource<T>(path: string, body = {}): Promise<Result<T>> {
        try {
            logger.debug(`POST ${path}`, body);
            const response = await this.client.post<T>(path, body);
            logger.debug("resource created: ", response.data);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            logger.error("error creating resource:", error);
            return {
                success: false,
                error: this.createApiException(error)
            };
        }
    }

    private async updateResource<T>(path: string, body = {}): Promise<Result<T>> {
        try {
            logger.debug(`PUT ${path}`, body);
            const response = await this.client.put<T>(path, body);
            logger.debug("resource updated: ", response.data);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            logger.error("error updating resource:", error);
            return {
                success: false,
                error: this.createApiException(error)
            };
        }
    }

    private async deleteResource<T>(path: string): Promise<Result<null>> {
        try {
            logger.debug(`DELETE ${path}`);
            await this.client.delete<T>(path);
            logger.debug("resource deleted");
            return {
                success: true,
                data: null
            };
        } catch (error) {
            logger.error("error deleting resource:", error);
            return {
                success: false,
                error: this.createApiException(error)
            };
        }
    }

    async getDiary(page: number, pageSize: number = 10): Promise<Result<GetDiaryListResponse>> {
        return this.getResource("/api/diary/", { page_size: pageSize, page });
    }

    async createIntake(body: CreateFoodIntakeRequest): Promise<Result<CreateFoodIntakeResponse>> {
        return this.createResource("/api/intakes/", body);
    }

    async updateIntake(id: number, body: CreateFoodIntakeRequest): Promise<Result<CreateFoodIntakeResponse>> {
        return this.updateResource(`/api/intakes/${id}/`, body);
    }

    async deleteIntake(id: number): Promise<Result<null>> {
        return this.deleteResource(`/api/intakes/${id}/`);
    }

    async getFoods(foodName: string): Promise<Result<GetFoodsResponse>> {
        return this.getResource("/api/food/", { search: foodName });
    }

    async getSymptoms(symptomName: string): Promise<Result<GetSymptomsResponse>> {
        return this.getResource("/api/symptoms/", { search: symptomName });
    }

    async createOccurrence(body: CreateSymptomOccurrenceRequest): Promise<Result<CreateSymptomOccurrenceResponse>> {
        return this.createResource("/api/occurrence/", body);
    }

    async createSymptom(body: CreateSymptomRequest): Promise<Result<CreateSymptomResponse>> {
        return this.createResource("/api/symptoms/", body);
    }

    async updateOccurrence(id: number, body: CreateSymptomOccurrenceRequest): Promise<Result<CreateSymptomOccurrenceResponse>> {
        return this.updateResource(`/api/occurrence/${id}/`, body);
    }

    async deleteOccurrence(id: number): Promise<Result<null>> {
        return this.deleteResource(`/api/occurrence/${id}/`);
    }

    async getCorrelations(): Promise<Result<GetCorrelationsListResponse>> {
        return this.getResource(`/api/correlations/`);
    }
}

export default FoodDiaryApiClient;