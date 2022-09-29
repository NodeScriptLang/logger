export enum LogLevel {
    DEBUG = 'debug',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error',
    MUTE = 'mute',
}

export const LOG_LEVELS: LogLevel[] = [
    LogLevel.DEBUG,
    LogLevel.INFO,
    LogLevel.WARN,
    LogLevel.ERROR,
    LogLevel.MUTE,
];

/**
 * Generic logger interface.
 */
export interface LoggerLike {
    info(message: string, data?: object): void;
    warn(message: string, data?: object): void;
    error(message: string, data?: object): void;
    debug(message: string, data?: object): void;
}

/**
 * Standard logger supports conditional log suppressing based on logger level.
 *
 * Implementation must specify `write`.
 */
export abstract class Logger implements LoggerLike {
    level: LogLevel = LogLevel.INFO;

    abstract write(level: LogLevel, message: string, data: object): void;

    log(level: LogLevel, message: string, data: object) {
        if (level === 'mute' || LOG_LEVELS.indexOf(level) < LOG_LEVELS.indexOf(this.level)) {
            return;
        }
        return this.write(level, message, data);
    }

    info(message: string, data = {}) {
        this.log(LogLevel.INFO, message, data);
    }

    warn(message: string, data = {}) {
        this.log(LogLevel.WARN, message, data);
    }

    error(message: string, data = {}) {
        this.log(LogLevel.ERROR, message, data);
    }

    debug(message: string, data = {}) {
        this.log(LogLevel.DEBUG, message, data);
    }

    setLevel(level: string) {
        if (Object.values(LogLevel).includes(level as any)) {
            this.level = level as LogLevel;
        }
    }
}
