import { LogData, Logger, LogLevel } from './logger.js';

export class DelegateLogger extends Logger {

    constructor(
        public delegate: Logger,
        public context: LogData = {},
    ) {
        super();
    }

    write(level: LogLevel, message: string, data: object) {
        this.delegate.write(level, message, { ...this.context, ...data });
    }

}
