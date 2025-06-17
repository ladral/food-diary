enum LogLevel {
    DEBUG = "debug",
    INFO = "info",
    WARN = "warn",
    ERROR = "error"
}

class Logger {
    private levels: LogLevel[];
    private currentLevel: LogLevel;

    constructor() {
        this.levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
        this.currentLevel = this.getInitialLogLevel();
    }

    private getInitialLogLevel(): LogLevel {
        const environment = import.meta.env.VITE_ENVIRONMENT as string;

        if (environment == "DEVELOPMENT") {
            return LogLevel.DEBUG;
        }

        return LogLevel.INFO
    }

    setLevel(level: LogLevel): void {
        if (this.levels.includes(level)) {
            this.currentLevel = level;
        } else {
            console.error(`Invalid log level: ${level}`);
        }
    }

    log<T>(level: LogLevel, message: string, optionalParams?: T[] | null): void {
        const levelIndex = this.levels.indexOf(level);
        const currentLevelIndex = this.levels.indexOf(this.currentLevel);

        if (levelIndex >= currentLevelIndex) {
            const timestamp = new Date().toISOString();
            const logMessage = `[${level.toUpperCase()}] ${timestamp}: ${message}`;

            if (optionalParams && optionalParams.length > 0) {
                console[level](logMessage, ...optionalParams);
            } else {
                console[level](logMessage);
            }
        }
    }

    debug<T>(message: string, ...optionalParams: T[]): void {
        this.log(LogLevel.DEBUG, message, optionalParams);
    }

    info<T>(message: string, ...optionalParams: T[]): void {
        this.log(LogLevel.INFO, message, optionalParams);
    }

    warn<T>(message: string, ...optionalParams: T[]): void {
        this.log(LogLevel.WARN, message, optionalParams);
    }

    error<T>(message: string, ...optionalParams: T[]): void {
        this.log(LogLevel.ERROR, message, optionalParams);
    }
}

const logger = new Logger();

export default logger;
