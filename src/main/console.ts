import { Logger, LogLevel } from './logger.js';

/**
 * Simple logger using natively available `console` API.
 */
export class ConsoleLogger extends Logger {

    override write(level: LogLevel, message: string, data?: object): void {
        const log = (console as any)[level];
        if (typeof log === 'function') {
            const args = data == null ? [message] : [message, data];
            log.apply(log, args);
        }
    }

}
