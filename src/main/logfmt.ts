import { ConsoleLogger } from './console.js';
import { LogLevel } from './logger.js';
import { toLogfmt } from './util/logfmt.js';

/**
 * Simple console logger that emits logfmt messages.
 */
export class LogfmtLogger extends ConsoleLogger {

    maxDepth = 4;

    override write(level: LogLevel, message: string, data: object): void {
        const msg = toLogfmt({
            time: new Date(),
            level,
            message,
            ...data,
        }, this.maxDepth);
        super.write(level, msg);
    }

}
