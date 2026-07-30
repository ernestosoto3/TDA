import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import type { ApiErrorInput, ApiErrorResponse } from './api-error.types';
import { ApiException } from './api.exception';
import { createRequestId, type RequestWithId } from '../middleware/request-id.middleware';

interface ErrorDefaults {
  code: string;
  message: string;
}

function getErrorDefaults(statusCode: number): ErrorDefaults {
  switch (statusCode) {
    case 400:
      return {
        code: 'VALIDATION_ERROR',
        message: 'The request is invalid.',
      };
    case 401:
      return {
        code: 'AUTHENTICATION_REQUIRED',
        message: 'Authentication is required.',
      };
    case 403:
      return {
        code: 'FORBIDDEN',
        message: 'You do not have permission to perform this action.',
      };
    case 404:
      return {
        code: 'RESOURCE_NOT_FOUND',
        message: 'The requested resource was not found.',
      };
    case 409:
      return {
        code: 'RESOURCE_CONFLICT',
        message: 'The request conflicts with the current resource state.',
      };
    case 413:
      return {
        code: 'PAYLOAD_TOO_LARGE',
        message: 'The request payload is too large.',
      };
    case 415:
      return {
        code: 'UNSUPPORTED_MEDIA_TYPE',
        message: 'The request media type is not supported.',
      };
    case 422:
      return {
        code: 'BUSINESS_RULE_VIOLATION',
        message: 'The request violates a business rule.',
      };
    case 429:
      return {
        code: 'RATE_LIMITED',
        message: 'Too many requests were submitted.',
      };
    case 502:
      return {
        code: 'UPSTREAM_ERROR',
        message: 'An upstream service returned an error.',
      };
    case 503:
      return {
        code: 'SERVICE_UNAVAILABLE',
        message: 'The service is temporarily unavailable.',
      };
    default:
      return {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred.',
      };
  }
}

function isPayloadTooLargeError(exception: unknown): boolean {
  if (typeof exception !== 'object' || exception === null) {
    return false;
  }

  return (
    Reflect.get(exception, 'status') === HttpStatus.PAYLOAD_TOO_LARGE ||
    Reflect.get(exception, 'statusCode') === HttpStatus.PAYLOAD_TOO_LARGE
  );
}
@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const httpContext = host.switchToHttp();
    const request = httpContext.getRequest<RequestWithId>();
    const response = httpContext.getResponse<Response>();

    const requestId = request.requestId ?? createRequestId();

    response.setHeader('X-Request-ID', requestId);

    let statusCode: number;
    let error: ApiErrorInput;

    if (exception instanceof ApiException) {
      statusCode = exception.getStatus();
      error = exception.apiError;
    } else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      error = getErrorDefaults(statusCode);
    } else if (isPayloadTooLargeError(exception)) {
      statusCode = HttpStatus.PAYLOAD_TOO_LARGE;
      error = getErrorDefaults(statusCode);
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      error = getErrorDefaults(statusCode);

      this.logger.error({
        event: 'unhandled_exception',
        requestId,
        exceptionType: exception instanceof Error ? exception.name : 'UnknownThrownValue',
      });
    }

    const body: ApiErrorResponse = {
      error: {
        ...error,
        requestId,
      },
    };

    response.status(statusCode).json(body);
  }
}
