# TuDeporte

## Problem Statement

The main problem TDA solves is the lack of a centralized sports platform for local Puerto Rico sports.

Right now, local sports information is spread across sources such as social media, news websites, team accounts, league pages, and older posts. This makes it difficult for users to quickly find information about their favorite teams, leagues, athletes, or recent games.

Finding a final score, schedule, statistic, or update often requires searching through multiple platforms. This is inefficient and can discourage users from following local sports as closely as they would like.

## Overview

TDA is a centralized local sports hub focused on Puerto Rico sports. Currently, there is no major local sports application dedicated to organizing Puerto Rico sports content in one place.

Puerto Rico has a large and passionate sports fan base, especially in baseball, basketball, boxing, combat sports, and volleyball. Although local leagues and athletes continue to grow, their digital presence remains limited compared with larger international leagues such as the NBA and MLB.

The main goal of TDA is to give local sports fans one place to find scores, schedules, entity information, news, and updates related to Puerto Rico sports.

## Target Users

The main target audience is local sports fans in Puerto Rico.

### Casual Sports Fans

Casual sports fans want a simple way to check final scores, schedules, and updates without searching across multiple websites or social media pages.

These users may not follow every game live, but they still want to stay informed about their favorite teams and leagues.

### Daily Sports Enthusiasts

Daily sports enthusiasts want quick access to scores, schedules, previous results, statistics, and updates.

These users may follow multiple sports, leagues, teams, or athletes and need an organized way to find information that is currently spread across different sources.

### People Involved in Sports

This group includes athletes, coaches, team staff, reporters, photographers, editors, and content creators.

TDA can provide more visibility for athletes, teams, and local leagues. It can also help reporters, photographers, and content creators reach more local sports fans.

## Planned Features

These are the core features planned for the first version of the application.

### 1. Home

Home is the main screen users see when they open the application. It presents relevant sports content, including scores, updates, news, and information related to followed entities.

**Why it matters:**  
It gives users a quick overview of what is happening across Puerto Rico sports.

### 2. Search

Search allows users to find sports, leagues, teams, athletes, games, and articles.

**Why it matters:**  
Users need a direct way to find specific information instead of depending entirely on Home.

### 3. Community

Community allows users to discover, join, and participate in moderated public sports communities.

**Why it matters:**  
It gives Puerto Rico sports fans a centralized place to discuss local teams, leagues, athletes, and sporting events.

### 4. User & Settings

User & Settings allows authenticated users to manage their profile, favorites, account information, security options, and application settings.

**Why it matters:**  
It provides one place for managing the user account and personalized sports preferences.

### 5. Entity Profiles

Supported leagues, teams, and athletes can have Entity Profiles containing relevant information, schedules, results, and related updates.

**Why it matters:**  
Users need an organized destination for information related to the entities they follow.

### 6. Game Schedules

The application displays schedules for supported upcoming games.

**Why it matters:**  
Users need to know when and where games will take place.

### 7. Game Summaries and Final Scores

TDA displays verified game information and final scores. Selecting a supported game opens its Game Summary.

**Why it matters:**  
Users can review results without searching through articles or social media posts.

### 8. Notifications

Authenticated users may receive notifications for supported events, including final scores, published content, community activity, and updates related to followed entities.

Notifications are accessed through the bell icon in the Home header and do not require a fifth tab.

**Why it matters:**  
Notifications help users stay informed without repeatedly checking the application.

### 9. Admin Dashboard

Authorized administrators use a protected web dashboard to manage sports information, content, and reported community activity.

The Admin Dashboard is separate from the mobile application.

**Why it matters:**  
Administrative tools are necessary to maintain accurate information and a safe community environment.

## Project Goals

### Core Goal

Provide a centralized platform where Puerto Rico sports fans can access scores, schedules, entity information, news, and updates, reducing the current fragmentation across social media and other websites.

### Product Principles

- **Simplicity:** The application should be accessible to casual fans and daily sports enthusiasts with minimal friction.
- **Verified information:** Sports information should come from official or verified sources.
- **Community:** The application should connect fans through moderated sports communities.
- **Safe environment:** Violence, explicit content, harassment, and other prohibited behavior will not be tolerated.

### Long-Term Vision

Expand TDA beyond sports information and community participation into a platform that provides greater visibility and opportunities for athletes in Puerto Rico and internationally.

## Repository Structure

TDA uses a pnpm monorepo.

```text
apps/
├── mobile/          # React Native and Expo application
├── api/             # NestJS backend API
└── admin/           # Administrative web application

packages/
├── config/          # Shared project configuration
├── types/           # Shared TypeScript types
├── validation/      # Shared validation schemas
└── localization/    # Shared terminology and translations
```

Project documentation is maintained on the `documentation` branch.

## Requirements

- Git
- Node.js 22 or later
- pnpm 11 or later
- PostgreSQL

Confirm the installed versions:

```bash
git --version
node --version
pnpm --version
```

## Initial Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/ernestosoto3/TDA.git
   ```

2. Enter the repository:

   ```bash
   cd TDA
   ```

3. Install the workspace dependencies:

   ```bash
   pnpm install
   ```

4. Create the local environment file:

   ```bash
   cp .env.example .env
   ```

5. Replace the placeholders with the appropriate local values.

Never commit `.env`, credentials, tokens, private keys, or other secrets.

## PostgreSQL Setup

TDA uses separate PostgreSQL databases for local development and automated testing.

### 1. Open PostgreSQL

Connect using an administrator account:

```bash
psql -U postgres -d postgres
```

### 2. Create the application role

Replace the placeholder with a private local password:

```sql
CREATE ROLE tda_app WITH LOGIN PASSWORD 'your_local_password';
```

### 3. Create the local and test databases

```sql
CREATE DATABASE tda_local OWNER tda_app;
CREATE DATABASE tda_test OWNER tda_app;
```

The databases must remain separate:

- `tda_local` is used during normal local development.
- `tda_test` is used when `NODE_ENV=test`.

### 4. Configure the private environment file

Copy `.env.example` to `.env` and replace the password placeholders with the local `tda_app` password:

```env
DATABASE_URL=postgresql://tda_app:your_local_password@localhost:5432/tda_local
TEST_DATABASE_URL=postgresql://tda_app:your_local_password@localhost:5432/tda_test
DATABASE_SSL_MODE=disable
DATABASE_POOL_MAX=10
DATABASE_CONNECTION_TIMEOUT_MS=5000
DATABASE_IDLE_TIMEOUT_MS=30000
```

The `.env` file is private and must never be committed.

### 5. Configure staging

Staging credentials must be configured through the deployment platform and must not be stored in the repository.

The staging environment must provide:

```env
NODE_ENV=staging
DATABASE_URL=postgresql://user:password@staging-host:5432/staging_database
DATABASE_SSL_MODE=verify-full
DATABASE_POOL_MAX=10
DATABASE_CONNECTION_TIMEOUT_MS=5000
DATABASE_IDLE_TIMEOUT_MS=30000
```

The values shown above are placeholders. Real staging credentials must be stored as private deployment variables.

`TEST_DATABASE_URL` is not required in staging.

### 6. Verify the PostgreSQL connection

Start the API:

```bash
pnpm --filter @tda/api dev
```

A successful startup displays a message similar to:

```text
Connected to PostgreSQL database "tda_local"
```

Stop the API with `Ctrl + C`.

The API validates its environment variables before starting. Startup fails with a clear error when:

- A required database URL is missing or invalid.
- Local and test URLs point to the same database.
- `TEST_DATABASE_URL` is missing during development or testing.
- SSL is disabled in staging or production.
- A numeric pool setting is outside its accepted range.
- PostgreSQL cannot be reached.

### 7. Local and test isolation

TDA selects its database according to `NODE_ENV`:

- `development` uses `DATABASE_URL`.
- `test` uses `TEST_DATABASE_URL`.
- `staging` and `production` use `DATABASE_URL`.

The environment validator prevents `DATABASE_URL` and `TEST_DATABASE_URL` from pointing to the same database.

Run the API environment validation tests with:

```bash
pnpm --filter @tda/api test -- env.validation.spec.ts --runInBand
```

### 8. Reset the local database

Reset the `tda_local` database with:

```bash
pnpm --filter @tda/api db:reset:local
```

This command removes the objects stored in the local `public` schema and creates a clean schema.

For safety, the reset command refuses to run when:

- `NODE_ENV` is `staging` or `production`.
- The database host is not local.
- `DATABASE_URL` does not point to `tda_local`.

The command must never be used with staging or production credentials.

## Development

The root workspace provides these commands:

```bash
pnpm dev
pnpm build
pnpm lint
pnpm test
pnpm typecheck
pnpm check
```

Application-specific commands are being documented because the mobile application, API, and Admin Dashboard are initialized.

## Contributing

Review [CONTRIBUTING.md](CONTRIBUTING.md) before creating a branch, committing changes, or submitting a pull request.

## Tech Stack

The selected technology stack is:

- **Mobile:** React Native, Expo, and TypeScript
- **Backend:** NestJS
- **ORM:** Drizzle ORM
- **Database:** PostgreSQL
- **Authentication:** Clerk
- **Admin Dashboard:** Protected web application connected to the NestJS API
- **Storage:** Cloudflare R2
- **Notifications:** Expo Notifications and Firebase Cloud Messaging
- **Hosting:** Railway
- **Search:** PostgreSQL Full-Text Search
- **Possible future additions:** Redis, BullMQ, and AWS

## Team Members

- Ernesto Soto
- Victor De Jesus

## Current Status

TDA has completed its initial product-planning and architecture phase. The monorepo, mobile application, backend API, Admin Dashboard placeholder, and shared packages have been initialized. The team is now establishing the technical foundation required for feature development.

## API Operational Endpoints

The NestJS API uses the global `/api` prefix and URI-based versioning. Version 1 routes use the `/api/v1` prefix.

Start the API locally:

```bash
pnpm --filter @tda/api dev
```

Unless `API_PORT` is changed, the API is available at `http://localhost:3000`.

### Liveness

```http
GET /api/v1/health/live
```

The liveness endpoint confirms that the API process is running. It does not check PostgreSQL, Cloudflare R2, or other external dependencies.

A healthy response returns HTTP `200`:

```json
{
  "status": "ok",
  "service": "tda-api"
}
```

### Readiness

```http
GET /api/v1/health/ready
```

The readiness endpoint determines whether the API is prepared to serve requests.

It checks:

- PostgreSQL connectivity.
- Cloudflare R2 connectivity when all required R2 variables are configured.

The `r2` field is omitted when Cloudflare R2 is not configured. When R2 is fully configured, readiness includes its connectivity status as `up` or `down`.

A ready response returns HTTP `200`:

```json
{
  "status": "ok",
  "service": "tda-api",
  "checks": {
    "postgresql": "up",
    "r2": "up"
  }
}
```

If PostgreSQL or a configured Cloudflare R2 dependency is unavailable, the endpoint returns HTTP `503` with `status` set to `error`.

### Swagger Documentation

Interactive Swagger documentation is available while the API is running:

```text
http://localhost:3000/api/v1/docs
```

The generated OpenAPI document is committed at:

```text
apps/api/openapi.json
```

Generate the document after changing controllers, routes, DTOs, or Swagger metadata:

```bash
pnpm openapi:generate
```

Verify that the committed document is valid, current, and deterministic:

```bash
pnpm openapi:check
```

The root `pnpm check` command performs this validation automatically, including in pull-request CI.
