import GetCorrelationsListResponse from "./models/GetCorrelationsListResponse.ts";


interface ICorrelationService {

    getCorrelations(foodIdsToIgnore: number[]): Promise<GetCorrelationsListResponse | null>;

}

export default ICorrelationService;