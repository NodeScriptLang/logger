import { LogFormatter, LogPayload } from '../logger.js';

export class DefaultLogFormatter implements LogFormatter {

    format(payload: LogPayload): LogPayload {
        return payload;
    }

}
