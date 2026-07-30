import { Writable } from 'node:stream';
import pino from 'pino';
import type { AppConfiguration } from './environment.validation';
import { createPinoHttpOptions, sensitiveLogPaths } from './logger.config';

describe('logger configuration', () => {
  it('uses the configured log level outside the test environment', () => {
    const options = createPinoHttpOptions({
      environment: 'development',
      logLevel: 'debug',
    } as AppConfiguration);

    expect(options.level).toBe('debug');
  });

  it('disables logging in the test environment', () => {
    const options = createPinoHttpOptions({
      environment: 'test',
      logLevel: 'debug',
    } as AppConfiguration);

    expect(options.level).toBe('silent');
  });

  it('redacts sensitive values from structured logs', () => {
    const chunks: string[] = [];

    const destination = new Writable({
      write(chunk, _encoding, callback) {
        const serializedChunk: unknown = chunk;

        chunks.push(
          Buffer.isBuffer(serializedChunk)
            ? serializedChunk.toString('utf8')
            : String(serializedChunk),
        );

        callback();
      },
    });

    const logger = pino(
      {
        redact: {
          paths: sensitiveLogPaths,
          censor: '[REDACTED]',
        },
      },
      destination,
    );

    logger.info({
      req: {
        headers: {
          authorization: 'Bearer private-access-token',
          cookie: 'session=private-session',
          'x-api-key': 'private-api-key',
        },
      },
      password: 'private-password',
      account: {
        token: 'private-account-token',
      },
    });

    const output = chunks.join('');

    expect(output).toContain('[REDACTED]');
    expect(output).not.toContain('private-access-token');
    expect(output).not.toContain('private-session');
    expect(output).not.toContain('private-api-key');
    expect(output).not.toContain('private-password');
    expect(output).not.toContain('private-account-token');
  });
});
