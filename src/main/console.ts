import { Logger, LogPayload } from './logger.js';

/**
 * Simple logger using natively available `console` API.
 */
export class ConsoleLogger extends Logger {

    override write(payload: LogPayload): void {
        const log = (console as any)[payload.level];
        if (typeof log === 'function') {
            log.apply(log, [payload.message, payload.data]);
        }
    }

}
