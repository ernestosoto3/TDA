import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiConfigModule } from './config/config.module';
import type { AppConfiguration } from './config/environment.validation';
import { createPinoHttpOptions } from './config/logger.config';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ApiConfigModule,
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const configuration = configService.getOrThrow<AppConfiguration>('app');

        return {
          pinoHttp: createPinoHttpOptions(configuration),
        };
      },
    }),
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
