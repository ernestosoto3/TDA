import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { R2HealthService } from './r2-health.service';

@Module({
  controllers: [HealthController],
  providers: [HealthService, R2HealthService],
})
export class HealthModule {}
