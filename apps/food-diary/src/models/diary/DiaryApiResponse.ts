import DiaryEntry from "./DiaryEntry.ts";


interface DiaryApiResponse {
    count: number;
    totalPages: number;
    next: string | null;
    previous: string | null;
    results: DiaryEntry[];
}

export default DiaryApiResponse;