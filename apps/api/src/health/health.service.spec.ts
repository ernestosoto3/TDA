import type { DatabaseService } from '../database/database.service';
import { HealthService } from './health.service';
import type { R2HealthService } from './r2-health.service';

describe('HealthService', () => {
  const checkDatabaseHealth = jest.fn<Promise<void>, []>();
  const checkR2Health = jest.fn();

  const databaseService = {
    checkHealth: checkDatabaseHealth,
  } as unknown as DatabaseService;

  const r2HealthService = {
    checkHealth: checkR2Health,
  } as unknown as R2HealthService;

  let service: HealthService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new HealthService(databaseService, r2HealthService);
  });

  it('reports readiness when PostgreSQL is available and R2 is not configured', async () => {
    checkDatabaseHealth.mockResolvedValue();
    checkR2Health.mockResolvedValue('not_configured');

    await expect(service.checkReadiness()).resolves.toEqual({
      status: 'ok',
      service: 'tda-api',
      checks: {
        postgresql: 'up',
      },
    });
  });

  it('includes R2 when it is configured and available', async () => {
    checkDatabaseHealth.mockResolvedValue();
    checkR2Health.mockResolvedValue('up');

    await expect(service.checkReadiness()).resolves.toEqual({
      status: 'ok',
      service: 'tda-api',
      checks: {
        postgresql: 'up',
        r2: 'up',
      },
    });
  });

  it('fails readiness when PostgreSQL is unavailable', async () => {
    checkDatabaseHealth.mockRejectedValue(new Error('connection unavailable'));
    checkR2Health.mockResolvedValue('not_configured');

    await expect(service.checkReadiness()).resolves.toEqual({
      status: 'error',
      service: 'tda-api',
      checks: {
        postgresql: 'down',
      },
    });
  });

  it('fails readiness when configured R2 is unavailable', async () => {
    checkDatabaseHealth.mockResolvedValue();
    checkR2Health.mockResolvedValue('down');

    await expect(service.checkReadiness()).resolves.toEqual({
      status: 'error',
      service: 'tda-api',
      checks: {
        postgresql: 'up',
        r2: 'down',
      },
    });
  });
});
