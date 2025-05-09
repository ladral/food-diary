import FoodDiaryApiClient from "../FoodDiaryApiClient.ts";
import { Severity } from "../../../models/alerts/Severity.ts";
import logger from "../../logging/logger.ts";
import GetSymptomsResponse from "./models/GetSymptomsResponse.ts";
import CreateSymptomOccurrenceRequest from "./models/CreateSymptomOccurrenceRequest.ts";
import CreateSymptomOccurrenceResponse from "./models/CreateSymptomOccurrenceResponse.ts";
import CreateSymptomRequest from "./models/CreateSymptomRequest.ts";
import CreateSymptomResponse from "./models/CreateSymptomResponse.ts";
import ISymptomService from "./ISymptomService.ts";
import { ApiException } from "../../../models/exceptions/ApiException.ts";

class SymptomService implements ISymptomService{
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

    async searchSymptom(symptomName: string): Promise<GetSymptomsResponse | null> {
        try {
            const result = await this.apiClient.getSymptoms(symptomName);

            if (result.success) {
                return result.data;
            } else {
                logger.error("could not search symptoms")
                return this.handleApiException(result.error)
            }
        } catch (e) {
            return this.handleUnknownExceptions(e, "searchSymptom")
        }
    }

    async createSymptomOccurrence(body: CreateSymptomOccurrenceRequest): Promise<CreateSymptomOccurrenceResponse | null> {
        try {
            const result = await this.apiClient.createOccurrence(body);

            if (result.success) {
                this.addAlert('Eintrag erfolgreich hinzugefügt', Severity.Success);
                return result.data;
            } else {
                logger.error("could not create symptomOccurrence")
                return this.handleApiException(result.error)
            }
        } catch (e) {
            return this.handleUnknownExceptions(e, "createSymptomOccurrence")
        }
    }

    async updateSymptomOccurrence(id: number, body: CreateSymptomOccurrenceRequest): Promise<CreateSymptomOccurrenceResponse | null> {
        try {
            const result = await this.apiClient.updateOccurrence(id, body);

            if (result.success) {
                this.addAlert('Eintrag erfolgreich aktualisiert', Severity.Success);
                return result.data;
            } else {
                logger.error("could not update symptom occurrence")
                return this.handleApiException(result.error)
            }
        } catch (e) {
            return this.handleUnknownExceptions(e, "updateSymptomOccurrence")
        }
    }

    async deleteSymptomOccurrence(id: number): Promise<void> {
        try {
            const result = await this.apiClient.deleteOccurrence(id);

            if (result.success) {
                this.addAlert('Eintrag erfolgreich gelöscht', Severity.Info);
            } else {
                logger.error("could not delete symptom occurrence")
                this.handleApiException(result.error)
            }
        } catch (e) {
            this.handleUnknownExceptions(e, "deleteSymptomOccurrence")
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
                return this.handleApiException(result.error)
            }
        } catch (e) {
            return this.handleUnknownExceptions(e, "createSymptom")
        }
    }
}

export default SymptomService;