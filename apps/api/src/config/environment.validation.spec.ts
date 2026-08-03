import { AppConfiguration, validateEnvironment } from './environment.validation';

const validDatabaseEnvironment = {
  DATABASE_URL: 'postgresql://tda_app:password@localhost:5432/tda_local',
  TEST_DATABASE_URL: 'postgresql://tda_app:password@localhost:5432/tda_test',
  DATABASE_SSL_MODE: 'disable',
  DATABASE_POOL_MAX: '10',
  DATABASE_CONNECTION_TIMEOUT_MS: '5000',
  DATABASE_IDLE_TIMEOUT_MS: '30000',
};

function getAppConfiguration(environment: Record<string, unknown> = {}): AppConfiguration {
  return validateEnvironment({
    ...validDatabaseEnvironment,
    ...environment,
  }).app;
}

describe('validateEnvironment', () => {
  it('applies development defaults', () => {
    const configuration = getAppConfiguration();

    expect(configuration).toEqual({
      environment: 'development',
      port: 3000,
      apiPrefix: 'api',
      apiVersion: '1',
      bodyLimit: '1mb',
      corsOrigins: ['http://localhost:3000', 'http://localhost:8081'],
      logLevel: 'debug',
    });
  });

  it('converts and normalizes configured values', () => {
    const configuration = getAppConfiguration({
      NODE_ENV: 'test',
      API_PORT: '4000',
      API_PREFIX: 'service',
      API_VERSION: '2',
      API_BODY_LIMIT: '2mb',
      CORS_ORIGINS: 'https://example.com, https://admin.example.com ',
      LOG_LEVEL: 'warn',
    });

    expect(configuration).toEqual({
      environment: 'test',
      port: 4000,
      apiPrefix: 'service',
      apiVersion: '2',
      bodyLimit: '2mb',
      corsOrigins: ['https://example.com', 'https://admin.example.com'],
      logLevel: 'warn',
    });
  });

  it('requires explicit CORS origins in production', () => {
    expect(() =>
      validateEnvironment({
        ...validDatabaseEnvironment,
        NODE_ENV: 'production',
        DATABASE_SSL_MODE: 'verify-full',
        CORS_ORIGINS: '',
      }),
    ).toThrow('Environment validation failed');
  });

  it('uses info logging by default in production', () => {
    const configuration = getAppConfiguration({
      NODE_ENV: 'production',
      DATABASE_SSL_MODE: 'verify-full',
      CORS_ORIGINS: 'https://tda.example.com',
    });

    expect(configuration.logLevel).toBe('info');
  });

  it('rejects an invalid port', () => {
    expect(() =>
      validateEnvironment({
        ...validDatabaseEnvironment,
        API_PORT: 'invalid',
      }),
    ).toThrow('Environment validation failed');
  });

  it('rejects an invalid API version', () => {
    expect(() =>
      validateEnvironment({
        ...validDatabaseEnvironment,
        API_VERSION: 'version-one',
      }),
    ).toThrow('Environment validation failed');
  });

  it('rejects an invalid body limit', () => {
    expect(() =>
      validateEnvironment({
        ...validDatabaseEnvironment,
        API_BODY_LIMIT: 'unlimited',
      }),
    ).toThrow('Environment validation failed');
  });
});
