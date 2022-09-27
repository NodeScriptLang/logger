export function toLogfmt(object: object, maxDepth = Infinity): string {
    const buffer: string[] = [];
    for (const { path, value } of entries(object, [], maxDepth)) {
        const needsQuoting = value.indexOf(' ') > -1 || value.indexOf('=') > -1 || value.length === 0;
        const escaped = value.replace(/["\\]/g, '\\$&');
        const str = needsQuoting ? `"${escaped}"` : escaped;
        const entry = `${path.join('_')}=${str}`;
        buffer.push(entry);
    }
    return buffer.join(' ');
}

function* entries(object: object, path: string[] = [], maxDepth = Infinity): IterableIterator<{ path: string[]; value: string }> {
    if (object == null) {
        return;
    }
    if (path.length >= maxDepth) {
        yield { path, value: `<${typeof object}>` };
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
            yield* entries(value, path.concat(key), maxDepth);
        }
    }
}
