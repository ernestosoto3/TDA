# Environment and Deployment Strategy

## Overview

TDA will use three deployable environments:

- **Local:** Individual development on a contributor's computer.
- **Staging:** Internal validation in infrastructure that resembles production.
- **Production:** The live system used by the public.

Integration and quality assurance are handled through pull requests, automated checks, and staging. They do not require separate hosted environments for the MVP. This keeps the infrastructure manageable while maintaining separation between development and live user data.

Each environment must use isolated configuration, databases, credentials, storage, and external-service instances. Code may be shared across environments, but data and secrets must not be shared.

## Environment Responsibilities

| Environment | Purpose | Data | Access |
| --- | --- | --- | --- |
| Local | Build features and run tests without affecting shared systems | Local or fictional seed data | Individual contributors |
| Pull-request validation | Run the currently available formatting, linting, type-checking, and testing checks; build validation becomes mandatory after application initialization | Temporary or mocked test data | Automated workflow |
| Staging | Test complete user flows before release | Stable fictional data | Project team and approved testers |
| Production | Serve real users | Real, approved data | Public users and authorized administrators |

Staging should resemble production in architecture and configuration, but it does not need production-level scale during the MVP.

## Service Isolation

| Service | Local | Staging | Production |
| --- | --- | --- | --- |
| NestJS API | Runs locally | Separate Railway API service | Separate Railway API service |
| PostgreSQL | Local database | Separate Railway PostgreSQL service | Separate Railway PostgreSQL service |
| Clerk | Development instance | Separate Clerk application | Production instance |
| Cloudflare R2 | `tda-development` bucket | `tda-staging` bucket | `tda-production` bucket |
| Expo/EAS | `development` environment | `preview` environment | `production` environment |
| Firebase notifications | Development project or credentials | Staging project or credentials when practical | Production project and credentials |
| Admin application | Runs locally | Uses staging API | Uses production API |

The databases are separated by **environment**, not by user or client. TDA uses one shared database within each environment, with authorization enforced by the API.

## Environment Variables

Environment variables keep configuration outside application code. The repository-level `.env.example` contains variable names and safe placeholders only. Contributors create ignored local `.env` files from that example.

### Current Variables

| Variable | Used by | Exposure |
| --- | --- | --- |
| `NODE_ENV` | Node.js tools and server runtime | Internal configuration |
| `API_PORT` | NestJS API | Server only |
| `API_URL` | Local tooling or server configuration | Internal configuration |
| `EXPO_PUBLIC_API_URL` | Expo mobile application | Public |
| `DATABASE_URL` | NestJS API and migration commands | Secret |
| `CLERK_PUBLISHABLE_KEY` | Approved client application | Public |
| `CLERK_SECRET_KEY` | NestJS API | Secret |
| `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` | Expo mobile application | Public |
| `CLOUDFLARE_R2_ACCOUNT_ID` | NestJS API | Server only |
| `CLOUDFLARE_R2_ACCESS_KEY_ID` | NestJS API | Secret |
| `CLOUDFLARE_R2_SECRET_ACCESS_KEY` | NestJS API | Secret |
| `CLOUDFLARE_R2_BUCKET_NAME` | NestJS API | Server only |
| `EXPO_PUBLIC_PROJECT_ID` | Expo mobile application | Public |
| `FIREBASE_PROJECT_ID` | Notification service | Server only |

### Required Additions Before Integration

Add variables only when the related feature is implemented:

```env
# Application
APP_ENV=local
LOG_LEVEL=debug

# Clerk webhook verification
CLERK_WEBHOOK_SIGNING_SECRET=

# Cloudflare R2
CLOUDFLARE_R2_ENDPOINT=
CLOUDFLARE_R2_PUBLIC_BASE_URL=
```

`APP_ENV` identifies TDA's environment. `NODE_ENV` remains available for Node.js and build-tool behavior and must not be used to choose Expo environment files. Expo recommends EAS environments or `eas env:pull` for that purpose.

Only values intentionally safe for inclusion in the compiled mobile application may use the `EXPO_PUBLIC_` prefix. Passwords, private keys, tokens, database URLs, Clerk secret keys, Firebase server credentials, and R2 credentials must never use that prefix.

Each hosted environment must define its own values in the applicable Railway, Clerk, Cloudflare, Expo, or Firebase dashboard. Production values must never be copied into staging or local configuration.

## `.gitignore` Rules

The repository `.gitignore` already:

- Ignores `.env` and all `.env.*` files.
- Allows `.env.example` and other `*.example` templates.
- Ignores Firebase service accounts and native Firebase configuration files.
- Ignores signing keys, certificates, and local EAS credentials.
- Ignores dependencies, build output, caches, logs, coverage, and generated Expo native projects.

These rules are consistent with this environment strategy. Before committing, contributors must still inspect staged changes because `.gitignore` does not protect a secret that was already committed.

## Database Rules

- Local, staging, and production use separate PostgreSQL databases.
- Staging must never connect to the production database.
- Production access is limited to the production API, approved migration operations, backups, and authorized maintainers.
- Connections must use TLS when supported by the provider.
- Production data must not be copied into local or staging environments unless it is anonymized and explicitly approved.
- Database backups and restore tests must be defined before public launch.

## Database Migrations

Schema changes are versioned through Drizzle migration files committed to Git.

### Development Procedure

1. Update the Drizzle schema locally.
2. Generate a migration.
3. Review the generated SQL.
4. Apply it to the local database.
5. Run relevant tests.
6. Commit the schema and migration together.

### Release Procedure

1. Back up the target database.
2. Apply the migration to staging.
3. Test affected and critical user flows.
4. Obtain release approval.
5. Apply the reviewed migration to production through Railway's pre-deploy process or another deliberate release command.
6. Run smoke tests and monitor logs.

Migration scripts must be deterministic and safe to run in the intended environment. Destructive or irreversible changes require an explicit data-preservation and recovery plan. Prefer backward-compatible changes and corrective forward migrations because reverting API code does not automatically reverse database changes.

## Seed Data

| Environment | Allowed seed data |
| --- | --- |
| Local | Sports, sample leagues, teams, games, users, posts, and communities |
| Staging | Stable fictional records that support complete user-flow testing |
| Production | Required system records, approved sports, leagues, roles, and verified sources |

Seed scripts must be repeatable and must not create duplicates.

Production seeding must be a deliberate command and must not run automatically on every deployment. Never seed fake public scores, users, or news in production.

Because the MVP uses manual sports-data entry, it will not include scraping or automated data ingestion unless TDA obtains written permission or uses an approved API.

## Railway Strategy

- Use one Railway project with isolated `staging` and `production` environments.
- Run separate NestJS API and PostgreSQL service instances in each environment.
- Configure Railway reference variables so each API connects only to its matching database.
- Use the repository's API workspace as the monorepo deployment source.
- Configure a health-check endpoint such as `/health`.
- Use protected or sealed variables for production secrets.
- Do not deploy the Expo mobile application through Railway.
- Staging deploys approved development changes.
- Production deploys only from the approved stable branch.

Build validation is deferred only while the repository contains placeholder application projects. Each application must define a real build script after initialization, and the automated workflow must require a successful build before the first deployment or release.

A production deployment requires successful formatting, linting, type checking, tests, build, migration review, and staging verification.

## Cloudflare R2

- Use `tda-development`, `tda-staging`, and `tda-production` buckets.
- Create separate, bucket-scoped credentials with the minimum required permissions.
- Provide secret R2 credentials only to the NestJS API.
- Upload from clients through protected API endpoints or temporary presigned URLs.
- Store file metadata in PostgreSQL and file objects in R2.
- Never allow staging to overwrite production objects.
- Do not enable a public `r2.dev` URL by default. Use controlled access or an approved custom public domain only for media intended to be public.

## Clerk

- Local development uses Clerk development keys.
- Staging uses a separate Clerk application so test users and configuration remain isolated.
- Production uses Clerk production keys and production domains.
- The mobile application receives only its publishable key.
- The NestJS API receives the secret key and webhook signing secret.
- TDA application roles and authorization remain enforced by the NestJS API and PostgreSQL.

## Expo and Notifications

- Use EAS `development`, `preview`, and `production` environments.
- Use different application identifiers for non-production and production builds.
- Point each build to its matching API environment.
- Development and preview builds must not point to the production API by default.
- Separate notification credentials and Firebase projects when practical.
- Store only client-safe values in variables prefixed with `EXPO_PUBLIC_`.
- Reference Expo variables statically, such as `process.env.EXPO_PUBLIC_API_URL`.

## Logging and Error Monitoring

| Environment | Logging |
| --- | --- |
| Local | Readable debug logs |
| Staging | Informational, warning, and error logs |
| Production | Structured logs with timestamp, environment, severity, request ID, route, and error category |

Never log passwords, tokens, authorization headers, secret keys, or unnecessary personal data.

Railway logs provide the initial API deployment logs. Mobile error records must include the application version and environment. Health, authentication, database, upload, notification, and migration failures must be observable. Critical production failures must generate an alert.

An external error-monitoring provider must be selected before public production launch.

## Secret Management

- Never place real secret values in Git, Markdown, screenshots, issues, commits, or pull requests.
- Store local secrets in ignored `.env` files.
- Store staging and production secrets in the applicable provider dashboard.
- Use different credentials for every environment.
- Grant the minimum necessary permissions.
- Restrict production secret and deployment access to authorized maintainers.
- Rotate credentials immediately after suspected exposure or when an authorized contributor leaves.
- Treat any committed secret as compromised even if the commit is later deleted.

## Deployment Process

```text
Pull request
→ Automated validation
→ Deploy to staging
→ Apply staging migration
→ Test critical flows
→ Approve release
→ Back up production database
→ Deploy production
→ Apply production migration
→ Run smoke tests
→ Monitor logs
```

## Rollback Process

- **API failure:** Redeploy the last working Railway deployment.
- **Mobile JavaScript update failure:** Restore or republish the last working Expo update.
- **Database failure:** Prefer a corrective forward migration.
- **Severe data corruption:** Stop writes and restore the most recent verified backup.

Rollback decisions must consider the API and database together. Restoring an earlier API deployment does not reverse an applied database migration.

## Decisions Required Before Production

* Which error-monitoring provider will be used in production?
* Where and how will the admin dashboard be hosted?
* How frequently will production backups occur, and how long will they be retained?
* Which method is approved for accessing sports data?
* Which production domains and application identifiers will be used?
* Who will be authorized to manage production secrets and deployments?

## References

- [What Are Environments in the Context of Software Development?](https://medium.com/@raveenpanditha/what-are-environments-in-the-context-of-software-development-87c184f82655)
- [An Introduction to Environment Variables and How to Use Them](https://medium.com/chingu/an-introduction-to-environment-variables-and-how-to-use-them-f602f66d15fa)
- [Software Migration Steps](https://frisbii.com/blog/software-migration-steps/)
- [Software Migrations and Best Practices](https://medium.com/codex/software-migrations-and-best-practices-2eb12b58385c)
- [Database Seeding](https://seedfa.st/blog/database-seeding)
- [Railway Monorepo Deployments](https://docs.railway.com/deployments/monorepo)
- [Railway Deployments](https://docs.railway.com/deployments)
- [Cloudflare R2: Get Started](https://developers.cloudflare.com/r2/get-started/)
- [Clerk Environment Variables](https://clerk.com/docs/guides/development/clerk-environment-variables)
- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)
- [Log Monitoring Guide](https://web-alert.io/blog/log-monitoring-guide-what-logs-catch-and-miss)
- [Secret Management Best Practices](https://www.jumpserver.com/blog/secret-management-best-practices-2026)
- [Secrets Management Best Practices](https://cycode.com/blog/secrets-management-best-practices/)
- [Understanding Software Rollbacks](https://www.harness.io/blog/understanding-software-rollbacks)
