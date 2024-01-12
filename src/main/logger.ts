import { DefaultLogFormatter } from './index.js';

export enum LogLevel {
    DEBUG = 'debug',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error',
    MUTE = 'mute',
}

export type LogPayload = {
    level: LogLevel;
    message: string;
    data: LogData;
};

export type LogData = Record<string, any>;

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
    info(message: string, data?: LogData): void;
    warn(message: string, data?: LogData): void;
    error(message: string, data?: LogData): void;
    debug(message: string, data?: LogData): void;
}

export interface LogFormatter {
    format(payload: LogPayload): LogPayload;
}

/**
 * Standard logger supports conditional log suppressing based on logger level.
 *
 * Implementation must specify `write`.
 */
export abstract class Logger implements LoggerLike {

    level: LogLevel = LogLevel.INFO;
    formatter: LogFormatter = new DefaultLogFormatter();

    abstract write(payload: LogPayload): void;

    log(level: LogLevel, message: string, data: LogData) {
        if (level === 'mute' || LOG_LEVELS.indexOf(level) < LOG_LEVELS.indexOf(this.level)) {
            return;
        }
        const formatted = this.formatter.format({ level, message, data });
        return this.write(formatted);
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
