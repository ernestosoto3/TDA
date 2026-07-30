import type { AppConfiguration } from './environment.validation';
import { createHelmetOptions } from './security.config';

function createConfiguration(environment: AppConfiguration['environment']): AppConfiguration {
  return {
    environment,
    port: 3000,
    apiPrefix: 'api',
    apiVersion: '1',
    bodyLimit: '1mb',
    corsOrigins: [],
    logLevel: 'info',
  };
}

describe('security configuration', () => {
  it.each(['development', 'test'] as const)(
    'disables HSTS in the %s environment',
    (environment) => {
      const options = createHelmetOptions(createConfiguration(environment));

      expect(options.strictTransportSecurity).toBe(false);
    },
  );

  it('enables HSTS in production', () => {
    const options = createHelmetOptions(createConfiguration('production'));

    expect(options.strictTransportSecurity).toEqual({
      maxAge: 31_536_000,
      includeSubDomains: true,
      preload: false,
    });
  });
});
