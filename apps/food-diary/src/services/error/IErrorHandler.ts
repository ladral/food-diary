import { ApiException } from "../../models/exceptions/ApiException.ts";
import { Severity } from "../../models/alerts/Severity.ts";


interface IErrorHandler {
    handleApiException(error: ApiException): null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleUnknownExceptions(e: any, source: string): null;
    alert(message: string, severity: Severity): void;
}

export default IErrorHandler;