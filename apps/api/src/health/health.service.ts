import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { type DependencyStatus, type R2Status, ReadinessResponseDto } from './health-response.dto';
import { R2HealthService } from './r2-health.service';

@Injectable()
export class HealthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly r2HealthService: R2HealthService,
  ) {}

  async checkReadiness(): Promise<ReadinessResponseDto> {
    const [postgresql, r2] = await Promise.all([
      this.checkPostgresql(),
      this.r2HealthService.checkHealth(),
    ]);

    const isReady = postgresql === 'up' && r2 !== 'down';

    return {
      status: isReady ? 'ok' : 'error',
      service: 'tda-api',
      checks: {
        postgresql,
        ...(r2 === 'not_configured' ? {} : { r2 }),
      },
    };
  }

  private async checkPostgresql(): Promise<DependencyStatus> {
    try {
      await this.databaseService.checkHealth();
      return 'up';
    } catch {
      return 'down';
    }
  }
}

export type { R2Status };
