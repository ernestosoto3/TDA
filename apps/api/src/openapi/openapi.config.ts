import type { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, type OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import type { AppConfiguration } from '../config/environment.validation';

export function createOpenApiDocument(app: INestApplication): OpenAPIObject {
  const configuration = new DocumentBuilder()
    .setTitle('TDA API')
    .setDescription('Versioned REST API for the TDA Puerto Rico sports platform.')
    .setVersion('1.0.0')
    .build();

  return SwaggerModule.createDocument(app, configuration);
}

export function setupOpenApi(app: INestApplication): void {
  const configService = app.get(ConfigService);
  const configuration = configService.getOrThrow<AppConfiguration>('app');
  const document = createOpenApiDocument(app);

  SwaggerModule.setup(`v${configuration.apiVersion}/docs`, app, document, {
    useGlobalPrefix: true,
  });
}
