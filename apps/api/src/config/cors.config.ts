import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import type { AppConfiguration } from './environment.validation';

export function createCorsOptions(configuration: AppConfiguration): CorsOptions {
  const allowedOrigins = new Set(configuration.corsOrigins);

  return {
    origin(origin, callback) {
      // Requests made outside a browser, such as curl or server-to-server
      // requests, may not include an Origin header.
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Accept', 'Authorization', 'Content-Type', 'X-Request-ID'],
    exposedHeaders: ['X-Request-ID'],
    maxAge: configuration.environment === 'production' ? 86400 : 600,
  };
}
