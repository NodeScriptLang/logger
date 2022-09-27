# Logger

Simple and minimalistic logger interface and implementation.

## Highlights

- 🔥 Zero dependencies
- 🗜 Tidy and compact
- 💻 Works in browser
- 📦 Console and Logfmt implementations in the box

## Usage

```ts
const logger = new ConsoleLogger();
// Logs with level "below" warn (debug, info) will not be emitted
logger.level = 'warn';
logger.info('Something happened, nothing to see here');
logger.warn('User account has been suspended', { accountId: '123' });
```
