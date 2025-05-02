import GetFoodResponse from "./GetFoodResponse.ts";

interface GetFoodsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: GetFoodResponse[];
}

export default GetFoodsResponse;