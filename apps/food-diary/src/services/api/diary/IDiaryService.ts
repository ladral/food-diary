import GetDiaryListResponse from "./models/GetDiaryListResponse.ts";

interface IDiaryService {
    getDiaryList(page: number): Promise<GetDiaryListResponse | null>
}

export default IDiaryService