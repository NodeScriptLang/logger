import assert from 'assert';

import { toLogfmt } from '../main/util/logfmt.js';

describe('logfmt', () => {

    it('converts objects to logfmt entries', () => {
        assert.strictEqual(toLogfmt({
            string: 'foo',
            number: 42,
            boolean: false,
        }), 'string=foo number=42 boolean=false');
    });

    it('handles nested objects', () => {
        assert.strictEqual(toLogfmt({
            foo: { bar: { baz: 123 }, qux: 23 }
        }), 'foo_bar_baz=123 foo_qux=23');
    });

    it('handles escapes', () => {
        assert.strictEqual(toLogfmt({
            field: 'blah"blah',
        }), 'field=blah\\"blah');
    });

    it('handles quotes', () => {
        assert.strictEqual(toLogfmt({
            field: 'blah blah',
        }), 'field="blah blah"');
    });

    it('handles arrays', () => {
        assert.strictEqual(toLogfmt({
            tags: ['one', 'two', 'three'],
        }), 'tags_0=one tags_1=two tags_2=three');
    });

    it('handles dates', () => {
        assert.strictEqual(toLogfmt({
            date: new Date('2022-09-27 16:24:33 UTC+3')
        }), 'date=2022-09-27T13:24:33.000Z');
    });

    it('drops nulls and other stuff', () => {
        assert.strictEqual(toLogfmt({
            nothing: null,
            void: undefined,
            fn: (a: number) => a + 1,
            field: '123'
        }), 'field=123');
    });

    it('handles max depth', () => {
        assert.strictEqual(toLogfmt({
            foo: { bar: { baz: 123 }, qux: 23 }
        }, { maxDepth: 2 }), 'foo_bar=<object> foo_qux=23');
    });

    it('handles circular refs', () => {
        const obj: any = { foo: 1 };
        obj.bar = obj;
        assert.strictEqual(toLogfmt({ obj }), 'obj_foo=1 obj_bar=<object>');
    });

    it('handles max entries', () => {
        const obj: any = { foo: 1, bar: 2, baz: 3 };
        assert.strictEqual(toLogfmt({ obj }, { maxEntries: 2 }), 'obj_foo=1 obj_bar=2');
    });

    it('handles max string size', () => {
        const obj: any = { foo: 'Looooooooong string', bar: 'Veeeeeeeeeeery loooooong one' };
        assert.strictEqual(toLogfmt({ obj }, { maxStringSize: 4 }), 'obj_foo=Looo... obj_bar=Veee...');
    });

});
