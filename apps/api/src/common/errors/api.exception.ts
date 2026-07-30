import { HttpException } from '@nestjs/common';
import type { ApiErrorInput } from './api-error.types';

export class ApiException extends HttpException {
  constructor(
    statusCode: number,
    public readonly apiError: ApiErrorInput,
  ) {
    super(apiError.message, statusCode);
  }
}
