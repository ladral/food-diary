import DiaryEntry from "./DiaryEntry.ts";


interface GetDiaryListResponse {
    count: number;
    totalPages: number;
    next: string | null;
    previous: string | null;
    results: DiaryEntry[];
}

export default GetDiaryListResponse;