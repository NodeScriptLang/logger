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
        yield* entries({
            name: object.name,
            message: object.message,
            details: (object as any).details,
            status: (object as any).status,
            code: (object as any).code,
            cause: (object as any).cause,
        }, path, refSet, options);
        return;
    }
    for (const [key, value] of Object.entries(object)) {
        if (value instanceof Date) {
            yield { path: path.concat(key), value: value.toISOString() };
        }
        if (['string', 'number', 'boolean'].includes(typeof value)) {
            yield { path: path.concat(key), value: abbr(value, maxStringSize) };
        }
        if (typeof value === 'object') {
            yield* entries(value, path.concat(key), refSet, options);
        }
    }
}

function abbr(value: string | number | boolean, maxSize: number) {
    const str = String(value);
    if (str.length > maxSize) {
        return str.substring(0, maxSize) + '...';
    }
    return str;
}
