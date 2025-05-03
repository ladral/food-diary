import { ApiException } from "../exceptions/ApiException.ts";

export interface Success<T> {
    success: true;
    data: T;
}

export interface Failure {
    success: false;
    error: ApiException;
}

export type Result<T> = Success<T> | Failure;