import type { ValidationError } from 'class-validator';
import { createValidationException } from './validation-error.factory';

describe('createValidationException', () => {
  it('creates the standardized validation-error response', () => {
    const errors: ValidationError[] = [
      {
        property: 'scheduledStartAt',
        constraints: {
          isDateString: 'Must be a valid ISO 8601 timestamp.',
        },
        children: [],
      },
    ];

    const exception = createValidationException(errors);

    expect(exception.getStatus()).toBe(400);
    expect(exception.apiError).toEqual({
      code: 'VALIDATION_ERROR',
      message: 'The request contains invalid fields.',
      details: [
        {
          field: 'scheduledStartAt',
          issue: 'Must be a valid ISO 8601 timestamp.',
        },
      ],
    });
  });

  it('creates dot-separated paths for nested fields', () => {
    const errors: ValidationError[] = [
      {
        property: 'team',
        children: [
          {
            property: 'name',
            constraints: {
              isNotEmpty: 'Team name must not be empty.',
            },
            children: [],
          },
        ],
      },
    ];

    const exception = createValidationException(errors);

    expect(exception.apiError.details).toEqual([
      {
        field: 'team.name',
        issue: 'Team name must not be empty.',
      },
    ]);
  });
});
