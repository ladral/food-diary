export interface ExternalApiException {
    statusCode: number;
    message: string;
    path?: string;
    timestamp: string;
    details?: string;
    errorCode?: string;
}