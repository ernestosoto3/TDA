import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(() => {
    controller = new HealthController();
  });

  it('returns the API health status', () => {
    expect(controller.check()).toEqual({
      status: 'ok',
      service: 'tda-api',
    });
  });
});
