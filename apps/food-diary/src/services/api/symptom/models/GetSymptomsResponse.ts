import GetSymptomResponse from "./GetSymptomResponse.ts";

interface GetSymptomsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: GetSymptomResponse[];
}

export default GetSymptomsResponse;