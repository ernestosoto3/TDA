import { NestFactory } from '@nestjs/core';
import { applicationConfig } from '@tda/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(process.env.PORT ?? applicationConfig.api.defaultPort);
}

void bootstrap();
