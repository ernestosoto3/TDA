import { z } from 'zod';

const databaseUrlSchema = z
  .string()
  .min(1, 'is required')
  .url('must be a valid URL')
  .refine((value) => {
    try {
      const url = new URL(value);
      const databaseName = url.pathname.replace(/^\/+/, '');

      return (
        ['postgresql:', 'postgres:'].includes(url.protocol) &&
        url.hostname.length > 0 &&
        databaseName.length > 0
      );
    } catch {
      return false;
    }
  }, 'must be a complete PostgreSQL URL');

const optionalEnvironmentValue = z.preprocess((value) => {
  if (typeof value === 'string' && value.trim() === '') {
    return undefined;
  }

  return value;
}, z.string().trim().min(1).optional());

const environmentSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'staging', 'production']).default('development'),

    API_PORT: z.coerce.number().int().min(1).max(65535).default(3000),

    DATABASE_URL: databaseUrlSchema,
    TEST_DATABASE_URL: databaseUrlSchema.optional(),

    DATABASE_SSL_MODE: z.enum(['disable', 'verify-full']).default('disable'),

    DATABASE_POOL_MAX: z.coerce.number().int().min(1).max(100).default(10),

    DATABASE_CONNECTION_TIMEOUT_MS: z.coerce.number().int().min(100).max(60000).default(5000),

    DATABASE_IDLE_TIMEOUT_MS: z.coerce.number().int().min(1000).max(600000).default(30000),

    CLOUDFLARE_R2_ACCOUNT_ID: optionalEnvironmentValue,
    CLOUDFLARE_R2_ACCESS_KEY_ID: optionalEnvironmentValue,
    CLOUDFLARE_R2_SECRET_ACCESS_KEY: optionalEnvironmentValue,
    CLOUDFLARE_R2_BUCKET_NAME: optionalEnvironmentValue,
  })
  .passthrough();

export type EnvironmentVariables = z.infer<typeof environmentSchema>;

const r2EnvironmentVariables = [
  'CLOUDFLARE_R2_ACCOUNT_ID',
  'CLOUDFLARE_R2_ACCESS_KEY_ID',
  'CLOUDFLARE_R2_SECRET_ACCESS_KEY',
  'CLOUDFLARE_R2_BUCKET_NAME',
] as const;

function getDatabaseName(connectionString: string): string {
  const url = new URL(connectionString);
  return decodeURIComponent(url.pathname.replace(/^\/+/, ''));
}

export function validateEnvironment(config: Record<string, unknown>): EnvironmentVariables {
  const result = environmentSchema.safeParse(config);

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => {
        const variable = issue.path.join('.') || 'environment';
        return `- ${variable}: ${issue.message}`;
      })
      .join('\n');

    throw new Error(`Environment validation failed:\n${details}`);
  }

  const validated = result.data;
  const additionalErrors: string[] = [];

  const isLocalEnvironment = validated.NODE_ENV === 'development' || validated.NODE_ENV === 'test';

  const isDeployedEnvironment =
    validated.NODE_ENV === 'staging' || validated.NODE_ENV === 'production';

  if (isLocalEnvironment && !validated.TEST_DATABASE_URL) {
    additionalErrors.push('TEST_DATABASE_URL is required in development and test environments.');
  }

  if (isDeployedEnvironment && validated.DATABASE_SSL_MODE === 'disable') {
    additionalErrors.push('DATABASE_SSL_MODE cannot be "disable" in staging or production.');
  }

  if (validated.TEST_DATABASE_URL) {
    const developmentDatabase = getDatabaseName(validated.DATABASE_URL);
    const testDatabase = getDatabaseName(validated.TEST_DATABASE_URL);

    if (developmentDatabase === testDatabase) {
      additionalErrors.push('DATABASE_URL and TEST_DATABASE_URL must use different databases.');
    }
  }

  const configuredR2Variables = r2EnvironmentVariables.filter(
    (variable) => validated[variable] !== undefined,
  );

  if (
    configuredR2Variables.length > 0 &&
    configuredR2Variables.length < r2EnvironmentVariables.length
  ) {
    additionalErrors.push(
      'Cloudflare R2 configuration must provide all four CLOUDFLARE_R2 variables or leave all four empty.',
    );
  }

  if (additionalErrors.length > 0) {
    const details = additionalErrors.map((error) => `- ${error}`).join('\n');

    throw new Error(`Environment validation failed:\n${details}`);
  }

  return validated;
}
