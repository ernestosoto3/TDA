import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import type { AppConfiguration } from './environment.validation';
import { createCorsOptions } from './cors.config';

const baseConfiguration: AppConfiguration = {
  environment: 'development',
  port: 3000,
  apiPrefix: 'api',
  apiVersion: '1',
  bodyLimit: '1mb',
  corsOrigins: ['http://localhost:3000', 'http://localhost:8081'],
  logLevel: 'debug',
};

function checkOrigin(options: CorsOptions, origin: string | undefined): Promise<boolean> {
  return new Promise((resolve, reject) => {
    if (typeof options.origin !== 'function') {
      reject(new Error('The CORS origin option is not a function.'));
      return;
    }

    options.origin(origin, (error, allowed) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(Boolean(allowed));
    });
  });
}

describe('createCorsOptions', () => {
  it('allows a configured origin', async () => {
    const options = createCorsOptions(baseConfiguration);

    await expect(checkOrigin(options, 'http://localhost:8081')).resolves.toBe(true);
  });

  it('allows requests without an Origin header', async () => {
    const options = createCorsOptions(baseConfiguration);

    await expect(checkOrigin(options, undefined)).resolves.toBe(true);
  });

  it('rejects an origin that is not configured', async () => {
    const options = createCorsOptions(baseConfiguration);

    await expect(checkOrigin(options, 'https://untrusted.example.com')).resolves.toBe(false);
  });

  it('uses a longer preflight cache in production', () => {
    const options = createCorsOptions({
      ...baseConfiguration,
      environment: 'production',
      corsOrigins: ['https://tda.example.com'],
      logLevel: 'info',
    });

    expect(options.maxAge).toBe(86400);
  });

  it('exposes the request identifier header', () => {
    const options = createCorsOptions(baseConfiguration);

    expect(options.exposedHeaders).toContain('X-Request-ID');
  });
});
