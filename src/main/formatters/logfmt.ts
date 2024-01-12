import { LogFormatter, LogPayload } from '../logger.js';
import { toLogfmt } from '../util/logfmt.js';

export class LogfmtFormatter implements LogFormatter {

    maxDepth = 4;
    maxEntries = 50;
    maxStringSize = 1000;

    format(payload: LogPayload) {
        const { level, message, data } = payload;
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
        return {
            level,
            message: msg,
        };
    }

}
