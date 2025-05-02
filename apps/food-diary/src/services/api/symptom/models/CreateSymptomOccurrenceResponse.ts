interface Symptom {
    id: number;
    name: string;
}

interface CreateSymptomOccurrenceResponse {
    id: number;
    symptom: Symptom;
    user_id: number;
    date: string;
}

export default CreateSymptomOccurrenceResponse;
