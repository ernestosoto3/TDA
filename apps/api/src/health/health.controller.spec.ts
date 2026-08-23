import { HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import { HealthController } from './health.controller';
import type { ReadinessResponseDto } from './health-response.dto';
import type { HealthService } from './health.service';

describe('HealthController', () => {
  const checkReadiness = jest.fn<Promise<ReadinessResponseDto>, []>();

  const healthService = {
    checkReadiness,
  } as unknown as HealthService;

  const setResponseStatus = jest.fn();

  const response = {
    status: setResponseStatus,
  } as unknown as Response;

  let controller: HealthController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new HealthController(healthService);
  });

  it('returns the API liveness status', () => {
    expect(controller.checkLiveness()).toEqual({
      status: 'ok',
      service: 'tda-api',
    });
  });

  it('returns readiness when required dependencies are available', async () => {
    checkReadiness.mockResolvedValue({
      status: 'ok',
      service: 'tda-api',
      checks: {
        postgresql: 'up',
      },
    });

    await expect(controller.checkReadiness(response)).resolves.toEqual({
      status: 'ok',
      service: 'tda-api',
      checks: {
        postgresql: 'up',
      },
    });

    expect(setResponseStatus).not.toHaveBeenCalled();
  });

  it('returns 503 when a required dependency is unavailable', async () => {
    checkReadiness.mockResolvedValue({
      status: 'error',
      service: 'tda-api',
      checks: {
        postgresql: 'down',
      },
    });

    await expect(controller.checkReadiness(response)).resolves.toEqual({
      status: 'error',
      service: 'tda-api',
      checks: {
        postgresql: 'down',
      },
    });

    expect(setResponseStatus).toHaveBeenCalledWith(HttpStatus.SERVICE_UNAVAILABLE);
  });
});
