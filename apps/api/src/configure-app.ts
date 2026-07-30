import { type INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { json, urlencoded } from 'express';
import helmet from 'helmet';
import { createCorsOptions } from './config/cors.config';
import type { AppConfiguration } from './config/environment.validation';
import { ApiExceptionFilter } from './common/errors/api-exception.filter';
import { createValidationException } from './common/errors/validation-error.factory';
import { requestIdMiddleware } from './common/middleware/request-id.middleware';
import { createHelmetOptions } from './config/security.config';

export function configureApp(app: INestApplication): void {
  const configService = app.get(ConfigService);

  const configuration = configService.getOrThrow<AppConfiguration>('app');

  app.use(requestIdMiddleware);

  // Helmet should be registered before the routes and other middleware.
  app.use(helmet(createHelmetOptions(configuration)));

  // Nest's automatic body parser is disabled in main.ts so that the
  // configured limit can be applied explicitly.
  app.use(json({ limit: configuration.bodyLimit }));
  app.use(
    urlencoded({
      extended: true,
      limit: configuration.bodyLimit,
    }),
  );

  app.enableCors(createCorsOptions(configuration));

  app.setGlobalPrefix(configuration.apiPrefix);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: configuration.apiVersion,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: createValidationException,
    }),
  );

  app.useGlobalFilters(new ApiExceptionFilter());

  app.enableShutdownHooks();
}
