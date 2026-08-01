import type { NextFunction, Response } from 'express';
import { createRequestId, requestIdMiddleware, type RequestWithId } from './request-id.middleware';

describe('requestIdMiddleware', () => {
  it('creates a request identifier in the expected format', () => {
    expect(createRequestId()).toMatch(/^req_[a-f0-9]{32}$/);
  });

  it('assigns the request identifier and exposes it in the response header', () => {
    const request = {} as RequestWithId;
    const setHeader = jest.fn();
    const response = {
      setHeader,
    } as unknown as Response;
    const next = jest.fn() as NextFunction;

    requestIdMiddleware(request, response, next);

    expect(request.requestId).toMatch(/^req_[a-f0-9]{32}$/);
    expect(setHeader).toHaveBeenCalledWith('X-Request-ID', request.requestId);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('generates unique identifiers for different requests', () => {
    expect(createRequestId()).not.toBe(createRequestId());
  });
});
