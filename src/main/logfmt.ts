import { ConsoleLogger } from './console.js';
import { LogLevel } from './logger.js';
import { toLogfmtEntries } from './util/logfmt.js';

/**
 * Simple console logger that emits logfmt messages.
 */
export class LogfmtLogger extends ConsoleLogger {
    pretty = false;

    setPretty(pretty: boolean) {
        this.pretty = pretty;
    }

    protected override write(level: LogLevel, message: string, data: object): void {
        const entries = toLogfmtEntries({
            time: new Date(),
            level,
            message,
            ...data,
        }).map(e => this.pretty ? this.prettify(e, level) : e);
        super.write(level, entries.join(' '));
    }

    protected prettify(str: string, level: LogLevel) {
        if (str.startsWith('message')) {
            const color =
                level === LogLevel.ERROR ? red :
                    level === LogLevel.WARN ? yellow :
                        level === LogLevel.INFO ? green :
                            cyan;
            return color(str);
        }
        return str;
    }

}

function red(str: string) {
    return `\u001b[31m${str}\u001b[0m`;
}

function yellow(str: string) {
    return `\u001b[33m${str}\u001b[0m`;
}

function green(str: string) {
    return `\u001b[32m${str}\u001b[0m`;
}

function cyan(str: string) {
    return `\u001b[36m${str}\u001b[0m`;
}
