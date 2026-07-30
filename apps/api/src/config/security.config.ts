import type { HelmetOptions } from 'helmet';
import type { AppConfiguration } from './environment.validation';

const oneYearInSeconds = 31_536_000;

export function createHelmetOptions(configuration: AppConfiguration): HelmetOptions {
  return {
    strictTransportSecurity:
      configuration.environment === 'production'
        ? {
            maxAge: oneYearInSeconds,
            includeSubDomains: true,
            preload: false,
          }
        : false,
  };
}
