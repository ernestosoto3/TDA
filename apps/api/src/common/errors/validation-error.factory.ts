import type { ValidationError } from 'class-validator';
import type { ApiErrorDetail } from './api-error.types';
import { ApiException } from './api.exception';

function flattenValidationErrors(errors: ValidationError[], parentField = ''): ApiErrorDetail[] {
  return errors.flatMap((error) => {
    const field = parentField ? `${parentField}.${error.property}` : error.property;

    const currentDetails = Object.values(error.constraints ?? {}).map((issue) => ({
      field,
      issue,
    }));

    const childDetails = flattenValidationErrors(error.children ?? [], field);

    return [...currentDetails, ...childDetails];
  });
}

export function createValidationException(errors: ValidationError[]): ApiException {
  return new ApiException(400, {
    code: 'VALIDATION_ERROR',
    message: 'The request contains invalid fields.',
    details: flattenValidationErrors(errors),
  });
}
