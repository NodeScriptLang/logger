import { ConsoleLogger } from './console.js';
import { LogLevel } from './logger.js';
import { toLogfmt } from './util/logfmt.js';

/**
 * Simple console logger that emits logfmt messages.
 */
export class LogfmtLogger extends ConsoleLogger {

    maxDepth = 4;
    maxEntries = 50;
    maxStringSize = 1000;

    override write(level: LogLevel, message: string, data: object): void {
        const msg = toLogfmt({
            time: new Date(),
            level,
            message,
            ...data,
        }, {
            maxDepth: this.maxDepth,
            maxEntries: this.maxEntries,
            maxStringSize: this.maxStringSize,
        });
        super.write(level, msg);
    }

}
