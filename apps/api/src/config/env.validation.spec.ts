import { validateEnvironment } from './env.validation';

const validDevelopmentEnvironment = {
  NODE_ENV: 'development',
  API_PORT: '3000',
  DATABASE_URL: 'postgresql://tda_app:password@localhost:5432/tda_local',
  TEST_DATABASE_URL: 'postgresql://tda_app:password@localhost:5432/tda_test',
  DATABASE_SSL_MODE: 'disable',
  DATABASE_POOL_MAX: '10',
  DATABASE_CONNECTION_TIMEOUT_MS: '5000',
  DATABASE_IDLE_TIMEOUT_MS: '30000',
};

describe('validateEnvironment', () => {
  it('accepts a valid development configuration', () => {
    const result = validateEnvironment(validDevelopmentEnvironment);

    expect(result.NODE_ENV).toBe('development');
    expect(result.API_PORT).toBe(3000);
    expect(result.DATABASE_POOL_MAX).toBe(10);
  });

  it('rejects a missing DATABASE_URL', () => {
    const configuration: Record<string, unknown> = {
      ...validDevelopmentEnvironment,
    };

    delete configuration.DATABASE_URL;

    expect(() => validateEnvironment(configuration)).toThrow('DATABASE_URL');
  });

  it('requires TEST_DATABASE_URL in development', () => {
    const configuration: Record<string, unknown> = {
      ...validDevelopmentEnvironment,
    };

    delete configuration.TEST_DATABASE_URL;

    expect(() => validateEnvironment(configuration)).toThrow(
      'TEST_DATABASE_URL is required in development and test environments.',
    );
  });

  it('rejects development and test URLs that use the same database', () => {
    const configuration = {
      ...validDevelopmentEnvironment,
      TEST_DATABASE_URL: 'postgresql://tda_app:password@localhost:5432/tda_local',
    };

    expect(() => validateEnvironment(configuration)).toThrow(
      'DATABASE_URL and TEST_DATABASE_URL must use different databases.',
    );
  });

  it('rejects disabled SSL in staging', () => {
    const configuration: Record<string, unknown> = {
      ...validDevelopmentEnvironment,
      NODE_ENV: 'staging',
    };

    delete configuration.TEST_DATABASE_URL;

    expect(() => validateEnvironment(configuration)).toThrow(
      'DATABASE_SSL_MODE cannot be "disable" in staging or production.',
    );
  });

  it('accepts staging with verified SSL', () => {
    const configuration: Record<string, unknown> = {
      ...validDevelopmentEnvironment,
      NODE_ENV: 'staging',
      DATABASE_SSL_MODE: 'verify-full',
    };

    delete configuration.TEST_DATABASE_URL;

    const result = validateEnvironment(configuration);

    expect(result.NODE_ENV).toBe('staging');
    expect(result.DATABASE_SSL_MODE).toBe('verify-full');
  });

  it('accepts empty optional R2 configuration', () => {
    const result = validateEnvironment({
      ...validDevelopmentEnvironment,
      CLOUDFLARE_R2_ACCOUNT_ID: '',
      CLOUDFLARE_R2_ACCESS_KEY_ID: '',
      CLOUDFLARE_R2_SECRET_ACCESS_KEY: '',
      CLOUDFLARE_R2_BUCKET_NAME: '',
    });

    expect(result.CLOUDFLARE_R2_ACCOUNT_ID).toBeUndefined();
    expect(result.CLOUDFLARE_R2_BUCKET_NAME).toBeUndefined();
  });

  it('accepts complete R2 configuration', () => {
    const result = validateEnvironment({
      ...validDevelopmentEnvironment,
      CLOUDFLARE_R2_ACCOUNT_ID: 'account-id',
      CLOUDFLARE_R2_ACCESS_KEY_ID: 'access-key',
      CLOUDFLARE_R2_SECRET_ACCESS_KEY: 'secret-key',
      CLOUDFLARE_R2_BUCKET_NAME: 'tda-media',
    });

    expect(result.CLOUDFLARE_R2_ACCOUNT_ID).toBe('account-id');
    expect(result.CLOUDFLARE_R2_BUCKET_NAME).toBe('tda-media');
  });

  it('rejects partial R2 configuration', () => {
    expect(() =>
      validateEnvironment({
        ...validDevelopmentEnvironment,
        CLOUDFLARE_R2_ACCOUNT_ID: 'account-id',
      }),
    ).toThrow(
      'Cloudflare R2 configuration must provide all four CLOUDFLARE_R2 variables or leave all four empty.',
    );
  });
});
