import GetSymptomsResponse from "./models/GetSymptomsResponse";
import CreateSymptomOccurrenceRequest from "./models/CreateSymptomOccurrenceRequest";
import CreateSymptomOccurrenceResponse from "./models/CreateSymptomOccurrenceResponse";
import CreateSymptomRequest from "./models/CreateSymptomRequest";
import CreateSymptomResponse from "./models/CreateSymptomResponse";

interface ISymptomService {
    searchSymptom(symptomName: string): Promise<GetSymptomsResponse | null>;
    createSymptomOccurrence(body: CreateSymptomOccurrenceRequest): Promise<CreateSymptomOccurrenceResponse | null>;
    createSymptom(body: CreateSymptomRequest): Promise<CreateSymptomResponse | null>;
}

export default ISymptomService;