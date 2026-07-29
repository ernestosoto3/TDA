import { Injectable } from '@nestjs/common';
import type { ApplicationName } from '@tda/types';
import { isNonEmptyString } from '@tda/validation';

@Injectable()
export class AppService {
  getHello(): string {
    const applicationName: ApplicationName = 'api';

    return isNonEmptyString(applicationName) ? 'Hello World!' : 'Application name is unavailable.';
  }
}
