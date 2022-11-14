export function toLogfmtEntries(object: object, maxDepth = Infinity): string[] {
    const buffer: string[] = [];
    for (const { path, value } of entries(object, [], [], maxDepth)) {
        const needsQuoting = value.indexOf(' ') > -1 || value.indexOf('=') > -1 || value.length === 0;
        const escaped = value.replace(/["\\]/g, '\\$&');
        const str = needsQuoting ? `"${escaped}"` : escaped;
        const entry = `${path.join('_')}=${str}`;
        buffer.push(entry);
    }
    return buffer;
}

export function toLogfmt(object: object, maxDepth = Infinity): string {
    return toLogfmtEntries(object, maxDepth).join(' ');
}

function* entries(object: object, path: string[] = [], refs: Iterable<any> = [], maxDepth = Infinity): IterableIterator<{ path: string[]; value: string }> {
    if (object == null) {
        return;
    }
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
        }, path, refSet, maxDepth);
        return;
    }
    for (const [key, value] of Object.entries(object)) {
        if (value instanceof Date) {
            yield { path: path.concat(key), value: value.toISOString() };
        }
        if (['string', 'number', 'boolean'].includes(typeof value)) {
            yield { path: path.concat(key), value: String(value) };
        }
        if (typeof value === 'object') {
            yield* entries(value, path.concat(key), refSet, maxDepth);
        }
    }
}
