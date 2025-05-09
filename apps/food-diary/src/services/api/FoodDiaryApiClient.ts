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

    private createExternalApiException(error: unknown): ApiException {
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
                error: this.createExternalApiException(error)
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
                error: this.createExternalApiException(error)
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
                error: this.createExternalApiException(error)
            };
        }
    }

    async getDiary(page: number, pageSize: number = 10): Promise<Result<GetDiaryListResponse>> {
        return this.getResource("/api/diary/", { page_size: pageSize, page });
    }

    async createIntake(body: CreateFoodIntakeRequest): Promise<Result<CreateFoodIntakeResponse>> {
        return this.createResource("/api/intakes/", body);
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
}

export default FoodDiaryApiClient;