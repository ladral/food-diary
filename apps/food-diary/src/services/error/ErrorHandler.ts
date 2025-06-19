import { Severity } from "../../models/alerts/Severity.ts";
import { ApiException } from "../../models/exceptions/ApiException.ts";
import logger from "../logging/Logger.ts";
import IErrorHandler from "./IErrorHandler.ts";

class ErrorHandler implements IErrorHandler {
    private static instance: ErrorHandler;
    private readonly addAlert: (message: string, severity: Severity) => void;

    private constructor(addAlert: (message: string, severity: Severity) => void) {
        this.addAlert = addAlert;
    }

    public static getInstance(addAlert: (message: string, severity: Severity) => void): ErrorHandler {
        if (!ErrorHandler.instance) {
            ErrorHandler.instance = new ErrorHandler(addAlert);
        }
        return ErrorHandler.instance;
    }

    public handleApiException(error: ApiException): null {
        this.addAlert(`Error: ${error.message}`, Severity.Error);
        return null;
    }

    public handleUnknownExceptions(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        e: any,
        source: string
    ): null {
        logger.error(`Unexpected error in ${source}:`, e);
        this.addAlert("An unexpected error occurred.", Severity.Error);
        return null;
    }

    public alert(message: string, severity: Severity) {
        this.addAlert(message, severity);
    }
}

export default ErrorHandler;