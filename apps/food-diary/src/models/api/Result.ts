import { ExternalApiException } from "../exceptions/ExternalApiException.ts";

export interface Success<T> {
    success: true;
    data: T;
}

export interface Failure {
    success: false;
    error: ExternalApiException;
}

export type Result<T> = Success<T> | Failure;