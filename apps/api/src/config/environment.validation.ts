import Joi from 'joi';

export const nodeEnvironments = ['development', 'test', 'production'] as const;

export const logLevels = ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'] as const;

export type NodeEnvironment = (typeof nodeEnvironments)[number];
export type LogLevel = (typeof logLevels)[number];

export interface AppConfiguration {
  environment: NodeEnvironment;
  port: number;
  apiPrefix: string;
  apiVersion: string;
  bodyLimit: string;
  corsOrigins: string[];
  logLevel: LogLevel;
}

export interface ValidatedEnvironment extends Record<string, unknown> {
  app: AppConfiguration;
}

interface EnvironmentValues {
  NODE_ENV: NodeEnvironment;
  API_PORT: number;
  API_PREFIX: string;
  API_VERSION: string;
  API_BODY_LIMIT: string;
  CORS_ORIGINS?: string;
  LOG_LEVEL?: LogLevel;
}

const environmentSchema = Joi.object<EnvironmentValues>({
  NODE_ENV: Joi.string()
    .valid(...nodeEnvironments)
    .default('development'),

  API_PORT: Joi.number().port().default(3000),

  API_PREFIX: Joi.string()
    .trim()
    .pattern(/^[a-z0-9][a-z0-9/_-]*$/i)
    .default('api'),

  API_VERSION: Joi.string().trim().pattern(/^\d+$/).default('1'),

  API_BODY_LIMIT: Joi.string()
    .trim()
    .pattern(/^\d+(?:b|kb|mb)$/i)
    .default('1mb'),

  CORS_ORIGINS: Joi.when('NODE_ENV', {
    is: 'production',
    then: Joi.string().trim().min(1).required(),
    otherwise: Joi.string().trim().default('http://localhost:3000,http://localhost:8081'),
  }),

  LOG_LEVEL: Joi.string().valid(...logLevels),
}).unknown(true);

function parseCorsOrigins(corsOrigins: string | undefined): string[] {
  if (!corsOrigins) {
    return [];
  }

  return corsOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
}

export function validateEnvironment(configuration: Record<string, unknown>): ValidatedEnvironment {
  const result = environmentSchema.validate(configuration, {
    abortEarly: false,
    allowUnknown: true,
    convert: true,
  });

  if (result.error) {
    const messages = result.error.details.map((detail) => detail.message).join('; ');

    throw new Error(`Environment validation failed: ${messages}`);
  }

  const values = result.value;

  const defaultLogLevel: LogLevel = values.NODE_ENV === 'production' ? 'info' : 'debug';

  return {
    ...configuration,
    app: {
      environment: values.NODE_ENV,
      port: values.API_PORT,
      apiPrefix: values.API_PREFIX,
      apiVersion: values.API_VERSION,
      bodyLimit: values.API_BODY_LIMIT,
      corsOrigins: parseCorsOrigins(values.CORS_ORIGINS),
      logLevel: values.LOG_LEVEL ?? defaultLogLevel,
    },
  };
}
