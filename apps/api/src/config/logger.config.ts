import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Options as PinoHttpOptions } from 'pino-http';
import { createRequestId } from '../common/middleware/request-id.middleware';
import type { AppConfiguration } from './environment.validation';

type RequestWithLoggingId = IncomingMessage & {
  id?: string | number;
  requestId?: string;
};

export const sensitiveLogPaths = [
  'req.headers.authorization',
  'req.headers.cookie',
  'req.headers["x-api-key"]',
  'res.headers["set-cookie"]',
  'authorization',
  'cookie',
  'password',
  'token',
  'accessToken',
  'refreshToken',
  'secret',
  'apiKey',
  '*.authorization',
  '*.cookie',
  '*.password',
  '*.token',
  '*.accessToken',
  '*.refreshToken',
  '*.secret',
  '*.apiKey',
];

export function createPinoHttpOptions(configuration: AppConfiguration): PinoHttpOptions {
  return {
    level: configuration.environment === 'test' ? 'silent' : configuration.logLevel,

    redact: {
      paths: sensitiveLogPaths,
      censor: '[REDACTED]',
    },

    genReqId(request: IncomingMessage, response: ServerResponse<IncomingMessage>): string {
      const requestWithId = request as RequestWithLoggingId;
      const requestId = requestWithId.requestId ?? createRequestId();

      requestWithId.requestId = requestId;
      response.setHeader('X-Request-ID', requestId);

      return requestId;
    },

    customProps(request: IncomingMessage) {
      const requestWithId = request as RequestWithLoggingId;

      return {
        requestId: requestWithId.requestId ?? requestWithId.id,
      };
    },

    customSuccessMessage(request, response) {
      return `${request.method} ${request.url} completed with ${response.statusCode}`;
    },

    customErrorMessage(request, response) {
      return `${request.method} ${request.url} failed with ${response.statusCode}`;
    },
  };
}
