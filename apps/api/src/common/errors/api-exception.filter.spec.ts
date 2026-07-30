import { type ArgumentsHost, Logger, NotFoundException } from '@nestjs/common';
import type { Response } from 'express';
import { ApiExceptionFilter } from './api-exception.filter';
import { ApiException } from './api.exception';

function createHost(requestId = 'req_test') {
  const setHeader = jest.fn();
  const status = jest.fn();
  const json = jest.fn();

  const response = {
    setHeader,
    status,
    json,
  } as unknown as Response;

  status.mockReturnValue(response);

  const host = {
    switchToHttp: () => ({
      getRequest: () => ({ requestId }),
      getResponse: () => response,
    }),
  } as unknown as ArgumentsHost;

  return {
    host,
    setHeader,
    status,
    json,
  };
}

describe('ApiExceptionFilter', () => {
  it('returns the payload from an ApiException', () => {
    const filter = new ApiExceptionFilter();
    const { host, setHeader, status, json } = createHost();

    const exception = new ApiException(422, {
      code: 'BUSINESS_RULE_VIOLATION',
      message: 'The request violates a business rule.',
    });

    filter.catch(exception, host);

    expect(setHeader).toHaveBeenCalledWith('X-Request-ID', 'req_test');
    expect(status).toHaveBeenCalledWith(422);
    expect(json).toHaveBeenCalledWith({
      error: {
        code: 'BUSINESS_RULE_VIOLATION',
        message: 'The request violates a business rule.',
        requestId: 'req_test',
      },
    });
  });

  it('maps a standard HttpException to the API error format', () => {
    const filter = new ApiExceptionFilter();
    const { host, status, json } = createHost();

    filter.catch(new NotFoundException(), host);

    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith({
      error: {
        code: 'RESOURCE_NOT_FOUND',
        message: 'The requested resource was not found.',
        requestId: 'req_test',
      },
    });
  });

  it('hides unexpected exception details and returns an internal error', () => {
    const loggerError = jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);

    const filter = new ApiExceptionFilter();
    const { host, status, json } = createHost();

    filter.catch(new Error('Private database failure'), host);

    expect(JSON.stringify(loggerError.mock.calls)).not.toContain('Private database failure');
    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred.',
        requestId: 'req_test',
      },
    });

    loggerError.mockRestore();
  });
});
