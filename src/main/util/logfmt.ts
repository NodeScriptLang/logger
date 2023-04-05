export interface LogfmtOptions {
    maxDepth?: number;
    maxEntries?: number;
    maxStringSize?: number;
}

export function toLogfmtEntries(object: object, options: LogfmtOptions = {}): string[] {
    let i = 0;
    const buffer: string[] = [];
    const { maxEntries = Infinity } = options;
    for (const { path, value } of entries(object, [], [], options)) {
        if (i >= maxEntries) {
            break;
        }
        i += 1;
        const needsQuoting = value.indexOf(' ') > -1 || value.indexOf('=') > -1 || value.length === 0;
        const escaped = value.replace(/["\\]/g, '\\$&');
        const str = needsQuoting ? `"${escaped}"` : escaped;
        const entry = `${path.join('_')}=${str}`;
        buffer.push(entry);
    }
    return buffer;
}

export function toLogfmt(object: object, options: LogfmtOptions = {}): string {
    return toLogfmtEntries(object, options).join(' ');
}

function* entries(
    object: object,
    path: string[],
    refs: Iterable<any>,
    options: LogfmtOptions,
): IterableIterator<{ path: string[]; value: string }> {
    if (object == null) {
        return;
    }
    const { maxDepth = Infinity, maxStringSize = Infinity } = options;
    const refSet = new Set(refs);
    if (path.length >= maxDepth || refSet.has(object)) {
        yield { path, value: `<${typeof object}>` };
        return;
    }
    refSet.add(object);
    if (object instanceof Error) {
        const err: any = object;
        yield* entries({
            name: err.name,
            message: err.message,
            details: err.details,
            status: err.status,
            code: err.code,
            cause: err.cause,
            stack: err.stack,
        }, path, refSet, options);
        return;
    }
    for (const [key, value] of Object.entries(object)) {
        if (value instanceof Date) {
            yield { path: path.concat(key), value: value.toISOString() };
        }
        if (['string', 'number', 'boolean'].includes(typeof value)) {
            yield { path: path.concat(key), value: formatString(value, maxStringSize) };
        }
        if (typeof value === 'object') {
            yield* entries(value, path.concat(key), refSet, options);
        }
    }
}

function formatString(value: string | number | boolean, maxSize: number) {
    let str = String(value);
    if (str.length > maxSize) {
        str = str.substring(0, maxSize) + '...';
    }
    return str.replace(/\s+/g, ' ').trim();
}
