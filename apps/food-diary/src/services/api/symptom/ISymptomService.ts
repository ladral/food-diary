import GetSymptomsResponse from "./models/GetSymptomsResponse";
import CreateSymptomOccurrenceRequest from "./models/CreateSymptomOccurrenceRequest";
import CreateSymptomOccurrenceResponse from "./models/CreateSymptomOccurrenceResponse";
import CreateSymptomRequest from "./models/CreateSymptomRequest";
import CreateSymptomResponse from "./models/CreateSymptomResponse";

interface ISymptomService {
    updateSymptomOccurrence(id: number, body: CreateSymptomOccurrenceRequest): Promise<CreateSymptomOccurrenceResponse | null>;
    searchSymptom(symptomName: string): Promise<GetSymptomsResponse | null>;
    getSymptomId(symptomName: string): Promise<number | null>;
    createSymptomOccurrence(body: CreateSymptomOccurrenceRequest): Promise<CreateSymptomOccurrenceResponse | null>;
    createSymptom(body: CreateSymptomRequest): Promise<CreateSymptomResponse | null>;
    deleteSymptomOccurrence(id: number): any;
}

export default ISymptomService;