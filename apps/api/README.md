# TDA API

NestJS API for the TDA sports platform.

## API conventions

- Base path: `/api/v1`
- Default local URL: `http://localhost:3000/api/v1`
- Default request-body limit: `1mb`
- Supported request formats: JSON and URL-encoded forms
- Request validation removes unknown properties and rejects invalid data types.

## Health endpoint

```http
GET /api/v1/health
```

Successful response:

```json
{
  "status": "ok",
  "service": "tda-api"
}
```

## Environment configuration

Copy the root environment template before starting the API:

```bash
cp .env.example .env
```

The API foundation uses these variables:

| Variable         | Default                                          | Description                                                  |
| ---------------- | ------------------------------------------------ | ------------------------------------------------------------ |
| `NODE_ENV`       | `development`                                    | Runtime environment: `development`, `test`, or `production`. |
| `API_PORT`       | `3000`                                           | Port used by the API server.                                 |
| `API_PREFIX`     | `api`                                            | Global API route prefix.                                     |
| `API_VERSION`    | `1`                                              | Global API version.                                          |
| `API_BODY_LIMIT` | `1mb`                                            | Maximum JSON and URL-encoded request-body size.              |
| `CORS_ORIGINS`   | Local development origins                        | Comma-separated browser origins allowed by CORS.             |
| `LOG_LEVEL`      | `debug` outside production; `info` in production | Minimum structured-log level.                                |

See the root `.env.example` for database, authentication, storage, mobile, and notification variables.

## CORS behavior

In development and test environments, the default permitted origins are:

```text
http://localhost:3000
http://localhost:8081
```

`CORS_ORIGINS` accepts a comma-separated list:

```env
CORS_ORIGINS=https://app.example.com,https://admin.example.com
```

Production requires at least one explicit origin. The API will fail during startup if production CORS configuration is missing.

## Request-body limits

`API_BODY_LIMIT` controls the maximum size of JSON and URL-encoded request bodies.

Example:

```env
API_BODY_LIMIT=1mb
```

Requests exceeding the configured limit return HTTP `413` using the standard API error format.

## Request identifiers

Every request receives an `X-Request-ID` response header.

The API generates an identifier for every request in this format:

```text
req_0123456789abcdef0123456789abcdef
```

The same identifier is included in structured logs and API error responses so a request can be traced across the application.

## Error responses

API errors use a consistent response structure:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid fields.",
    "details": [
      {
        "field": "name",
        "issue": "name must be a string"
      }
    ],
    "requestId": "req_0123456789abcdef0123456789abcdef"
  }
}
```

The `details` field is included only when additional error information is available.

Unexpected internal errors are logged, but implementation details and stack traces are not returned to clients.

## Logging and security

The API produces structured logs through Pino. Logs include the request identifier and redact configured sensitive headers and fields.

Security headers are applied through Helmet. HTTP Strict Transport Security is enabled in production and disabled in development and test environments.

Do not commit secrets or populated `.env` files.

## Local commands

Run these commands from the repository root.

```bash
# Install workspace dependencies
pnpm install

# Start the API in watch mode
pnpm --filter @tda/api dev

# Run linting
pnpm --filter @tda/api lint

# Run TypeScript checking
pnpm --filter @tda/api typecheck

# Run unit tests
pnpm --filter @tda/api test

# Run E2E tests
pnpm --filter @tda/api test:e2e

# Create a production build
pnpm --filter @tda/api build

# Run the compiled production build
pnpm --filter @tda/api start:prod
```

## Graceful shutdown

The API enables NestJS shutdown hooks. When the process receives a supported termination signal, NestJS closes registered application resources before the process exits.
