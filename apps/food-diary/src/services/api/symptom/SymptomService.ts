import FoodDiaryApiClient from "../FoodDiaryApiClient.ts";
import { Severity } from "../../../models/alerts/Severity.ts";
import logger from "../../logging/Logger.ts";
import GetSymptomsResponse from "./models/GetSymptomsResponse.ts";
import CreateSymptomOccurrenceRequest from "./models/CreateSymptomOccurrenceRequest.ts";
import CreateSymptomOccurrenceResponse from "./models/CreateSymptomOccurrenceResponse.ts";
import CreateSymptomRequest from "./models/CreateSymptomRequest.ts";
import CreateSymptomResponse from "./models/CreateSymptomResponse.ts";
import ISymptomService from "./ISymptomService.ts";
import IErrorHandler from "../../error/IErrorHandler.ts";

class SymptomService implements ISymptomService{
    private apiClient: FoodDiaryApiClient;
    private errorHandler: IErrorHandler;


    constructor(errorHandler: IErrorHandler) {
        this.apiClient = new FoodDiaryApiClient();
        this.errorHandler = errorHandler;
    }

    async searchSymptom(symptomName: string): Promise<GetSymptomsResponse | null> {
        try {
            const result = await this.apiClient.getSymptoms(symptomName);

            if (result.success) {
                return result.data;
            } else {
                logger.error("could not search symptoms")
                return this.errorHandler.handleApiException(result.error)
            }
        } catch (e) {
            return this.errorHandler.handleUnknownExceptions(e, "searchSymptom")
        }
    }

    async getSymptomId(symptomName: string): Promise<number | null> {
        const symptomResponse = await this.searchSymptom(symptomName);
        if (symptomResponse && symptomResponse.count > 0) {
            const symptom = symptomResponse.results.find(symptom => symptom.name === symptomName);
            if (symptom) {
                return symptom.id
            }
        }
        return null;
    }


    async createSymptomOccurrence(body: CreateSymptomOccurrenceRequest): Promise<CreateSymptomOccurrenceResponse | null> {
        try {
            const result = await this.apiClient.createOccurrence(body);

            if (result.success) {
                this.errorHandler.alert('Eintrag erfolgreich hinzugefügt', Severity.Success);
                return result.data;
            } else {
                logger.error("could not create symptomOccurrence")
                return this.errorHandler.handleApiException(result.error)
            }
        } catch (e) {
            return this.errorHandler.handleUnknownExceptions(e, "createSymptomOccurrence")
        }
    }

    async updateSymptomOccurrence(id: number, body: CreateSymptomOccurrenceRequest): Promise<CreateSymptomOccurrenceResponse | null> {
        try {
            const result = await this.apiClient.updateOccurrence(id, body);

            if (result.success) {
                this.errorHandler.alert('Eintrag erfolgreich aktualisiert', Severity.Success);
                return result.data;
            } else {
                logger.error("could not update symptom occurrence")
                return this.errorHandler.handleApiException(result.error)
            }
        } catch (e) {
            return this.errorHandler.handleUnknownExceptions(e, "updateSymptomOccurrence")
        }
    }

    async deleteSymptomOccurrence(id: number): Promise<void> {
        try {
            const result = await this.apiClient.deleteOccurrence(id);

            if (result.success) {
                this.errorHandler.alert('Eintrag erfolgreich gelöscht', Severity.Info);
            } else {
                logger.error("could not delete symptom occurrence")
                this.errorHandler.handleApiException(result.error)
            }
        } catch (e) {
            this.errorHandler.handleUnknownExceptions(e, "deleteSymptomOccurrence")
        }
    }


    async createSymptom(body: CreateSymptomRequest): Promise<CreateSymptomResponse | null> {
        try {
            const result = await this.apiClient.createSymptom(body);

            if (result.success) {
                logger.debug(`symptom with ID ${result.data.id} successfully created`)
                return result.data;
            } else {
                logger.error("could not create Symptom")
                return this.errorHandler.handleApiException(result.error)
            }
        } catch (e) {
            return this.errorHandler.handleUnknownExceptions(e, "createSymptom")
        }
    }
}

export default SymptomService;