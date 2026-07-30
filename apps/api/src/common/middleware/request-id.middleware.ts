import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';

export type RequestWithId = Request & {
  requestId?: string;
};

export function createRequestId(): string {
  return `req_${randomUUID().replaceAll('-', '')}`;
}

export function requestIdMiddleware(
  request: RequestWithId,
  response: Response,
  next: NextFunction,
): void {
  const requestId = createRequestId();

  request.requestId = requestId;
  response.setHeader('X-Request-ID', requestId);

  next();
}
