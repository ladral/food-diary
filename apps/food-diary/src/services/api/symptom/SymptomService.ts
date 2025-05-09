import FoodDiaryApiClient from "../FoodDiaryApiClient.ts";
import { Severity } from "../../../models/alerts/Severity.ts";
import logger from "../../logging/logger.ts";
import GetSymptomsResponse from "./models/GetSymptomsResponse.ts";
import CreateSymptomOccurrenceRequest from "./models/CreateSymptomOccurrenceRequest.ts";
import CreateSymptomOccurrenceResponse from "./models/CreateSymptomOccurrenceResponse.ts";
import CreateSymptomRequest from "./models/CreateSymptomRequest.ts";
import CreateSymptomResponse from "./models/CreateSymptomResponse.ts";
import ISymptomService from "./ISymptomService.ts";

class SymptomService implements ISymptomService{
    private apiClient: FoodDiaryApiClient;
    private addAlert: (message: string, severity: Severity) => void;


    constructor(addAlert: (message: string, severity: Severity) => void) {
        this.apiClient = new FoodDiaryApiClient();
        this.addAlert = addAlert;
    }

    async searchSymptom(symptomName: string): Promise<GetSymptomsResponse | null> {
        try {
            const result = await this.apiClient.getSymptoms(symptomName);

            if (result.success) {
                return result.data;
            } else {
                logger.error("could not search symptoms")
                const error = result.error;
                this.addAlert(`Error: ${error.message}`, Severity.Error);
                return null;
            }
        } catch (e) {
            logger.error('Unexpected error in searchSymptom:', e);
            this.addAlert('An unexpected error occurred.', Severity.Error);
            return null;
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
                const error = result.error;
                this.addAlert(`Error: ${error.message}`, Severity.Error);
                return null;
            }
        } catch (e) {
            logger.error('Unexpected error in createSymptomOccurrence:', e);
            this.addAlert('An unexpected error occurred.', Severity.Error);
            return null;
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
                const error = result.error;
                this.addAlert(`Error: ${error.message}`, Severity.Error);
                return null;
            }
        } catch (e) {
            logger.error('Unexpected error in createFoodIntake:', e);
            this.addAlert('An unexpected error occurred.', Severity.Error);
            return null;
        }
    }

    async deleteSymptomOccurrence(id: number): Promise<void> {
        try {
            const result = await this.apiClient.deleteOccurrence(id);

            if (result.success) {
                this.addAlert('Eintrag erfolgreich gelöscht', Severity.Info);
            } else {
                logger.error("could not delete symptom occurrence")
                const error = result.error;
                this.addAlert(`Error: ${error.message}`, Severity.Error);
            }
        } catch (e) {
            logger.error('Unexpected error in createFoodIntake:', e);
            this.addAlert('An unexpected error occurred.', Severity.Error);
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
                const error = result.error;
                this.addAlert(`Error: ${error.message}`, Severity.Error);
                return null;
            }
        } catch (e) {
            logger.error('Unexpected error in createSymptom:', e);
            this.addAlert('An unexpected error occurred.', Severity.Error);
            return null;
        }
    }
}

export default SymptomService;