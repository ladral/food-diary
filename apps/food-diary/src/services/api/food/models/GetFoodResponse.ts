interface Category {
    id: number;
    name: string;
}

interface Synonym {
    id: number;
    term: string;
}

interface GetFoodResponse {
    id: number;
    name: string;
    categories: Category[];
    synonyms: Synonym[];
}

export default GetFoodResponse;