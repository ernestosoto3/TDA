import { Test } from '@nestjs/testing';

describe('Application startup environment validation', () => {
  const originalEnvironment = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnvironment };
    jest.resetModules();
  });

  it('rejects startup when staging disables database SSL', async () => {
    process.env = {
      ...originalEnvironment,
      NODE_ENV: 'staging',
      API_PORT: '3000',
      API_PREFIX: 'api',
      API_VERSION: '1',
      API_BODY_LIMIT: '1mb',
      CORS_ORIGINS: 'https://staging.example.com',
      DATABASE_URL: 'postgresql://tda_app:password@localhost:5432/tda_staging',
      DATABASE_SSL_MODE: 'disable',
      DATABASE_POOL_MAX: '10',
      DATABASE_CONNECTION_TIMEOUT_MS: '5000',
      DATABASE_IDLE_TIMEOUT_MS: '30000',
    };

    delete process.env.TEST_DATABASE_URL;

    const compileApplicationConfiguration = async (): Promise<void> => {
      const { ApiConfigModule } =
        jest.requireActual<typeof import('./config.module.js')>('./config.module');

      await Test.createTestingModule({
        imports: [ApiConfigModule],
      }).compile();
    };

    await expect(compileApplicationConfiguration()).rejects.toThrow(
      'DATABASE_SSL_MODE cannot be "disable" in staging or production.',
    );
  });
});
