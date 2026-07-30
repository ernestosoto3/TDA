import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import type { AppConfiguration } from './config/environment.validation';
import { configureApp } from './configure-app';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
    bufferLogs: true,
  });

  app.useLogger(app.get(Logger));
  configureApp(app);

  const configService = app.get(ConfigService);
  const configuration = configService.getOrThrow<AppConfiguration>('app');

  await app.listen(configuration.port);
}

void bootstrap();
