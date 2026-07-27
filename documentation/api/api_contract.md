# TDA MVP API Contract

## Overview

This document defines the endpoints and data contracts required by the approved TDA MVP screens, user flows, data requirements, database schema, and roles-and-permissions model.

It is the shared contract between:

- The TDA mobile application
- The administrative dashboard
- The NestJS backend
- PostgreSQL and supporting services

The contract covers:

- HTTP methods and routes
- Path and query parameters
- Request and response structures
- Authentication and role requirements
- Error responses
- Pagination, filtering, and sorting
- API versioning
- REST and real-time responsibilities

The MVP begins with verified manual or administrator-managed sports data. It does not depend on an unconfirmed external sports-data provider.

### Project Dependencies Used

- `user_flows.md`
- `data_requirements.md`
- `database_schema.md`
- `roles_and_permissions.md`

The database schema, this API contract, and the roles-and-permissions document use the same approved authorization model: one active staff role per account, separate Moderator and Editor permissions, scoped assignments for those roles, and platform-wide Administrator authority.
## Status

- **Document type:** REST and real-time API contract
- **API version:** `v1`
- **Scope:** Version 1 / MVP
- **Backend:** NestJS
- **Authentication provider:** Clerk
- **Primary database:** PostgreSQL with Drizzle ORM
- **Approval status:** Pending team review

---

## API Design Conventions

### Base URL and Transport

All production requests must use HTTPS.

```text
https://api.<production-domain>/api/v1
```

Local development may use:

```text
http://localhost:<port>/api/v1
```

Versioning in the URL makes the active contract explicit and allows a future breaking contract to be introduced under `/api/v2` while `/api/v1` remains available during a documented migration period ([Daily.dev](https://daily.dev/blog/api-versioning-strategies-best-practices-guide/), [xMatters](https://www.xmatters.com/blog/api-versioning-strategies)).

### Resource and Route Naming

- Routes use lowercase plural nouns: `/teams`, `/games`, and `/communities`.
- Multiword route segments use kebab case: `/notification-preferences`.
- Resource identifiers are UUIDs.
- Path parameters identify a specific resource.
- Query parameters filter, search, sort, or paginate a collection ([CodeSignal](https://codesignal.com/learn/courses/basics-of-http-requests-with-dart/lessons/introduction-to-path-and-query-parameters-in-dart)).
- Actions that do not map cleanly to CRUD use a subordinate action route, such as `/posts/{postId}/publish`.

### HTTP Methods

TDA uses HTTP methods according to their standard meaning ([MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods), [API7.ai](https://api7.ai/learning-center/api-101/http-methods-in-apis)):

| Method | Use |
|---|---|
| `GET` | Retrieve a resource or collection without changing server state |
| `POST` | Create a resource or execute a non-idempotent action |
| `PUT` | Replace a complete client-managed resource or create an idempotent relationship |
| `PATCH` | Partially update an existing resource |
| `DELETE` | Remove, leave, unfollow, unregister, or soft-delete a resource |

NestJS controllers may group operations by domain. The route contract is independent of whether controller code is organized with object-oriented or functional patterns ([Blair Crumbly](https://medium.com/@blaircrumbly/http-methods-and-routes-exploring-oop-and-functional-programming-7a871d45a74f)).

### JSON and Field Naming

- Requests and responses use `application/json`, except approved media-upload operations.
- API fields use `camelCase`.
- Database columns may remain `snake_case`; the API mapping layer converts between formats.
- Timestamps use ISO 8601 in UTC, for example `2026-07-24T18:30:00Z`.
- Optional values that are absent are omitted unless `null` has a defined meaning.
- Unknown request fields are rejected with `VALIDATION_ERROR`.

Request bodies are described as reusable schemas, consistent with OpenAPI 3 request-body modeling ([Swagger](https://swagger.io/docs/specification/v3_0/describing-request-body/describing-request-body/)).

### Public-Resource Visibility

Public endpoints return only records approved for public display:

- Published posts
- Active sports, teams, athletes, and communities
- Public league seasons
- Public game and verified score data
- Active comments and community messages

Draft, hidden, deleted, internal moderation, private user, and provenance fields require an authorized protected endpoint.

---

## Authentication and Authorization

### Authentication

Clerk handles registration, login, credential verification, password reset, session management, and token issuance. These operations are not reimplemented as TDA REST endpoints.

Protected TDA requests include:

```http
Authorization: Bearer <clerk-session-token>
```

The backend must:

1. Validate the token signature, issuer, audience, and expiration.
2. Resolve the Clerk subject to an active TDA user.
3. Reject suspended accounts and reject soft-deleted accounts from ordinary protected endpoints. During the 30-day deletion grace period, a soft-deleted account may access only the deletion-request status and cancellation flow after recent Clerk identity verification.
4. Authorize the requested action using the server-side role and assignment scope.

Authentication proves identity; authorization determines whether that identity may perform the action ([authentication guide](https://medium.com/@raphyabak/authentication-a-developers-complete-guide-efa42b429569)).

### Contract Roles and Database Mapping

The API uses the documented product-role names. Existing internal database values map as follows:

| Contract role | Internal database value | Scope |
|---|---|---|
| Registered User | No active `user_roles` row | Own account and ordinary authenticated features |
| Moderator | `moderator` | Assigned communities only |
| Editor | `editor` | Assigned sports entities and content only |
| Administrator | `administrator` | Platform-wide administrative authority |

The API follows the documented roles-and-permissions document:

- One staff role per account.
- Moderator and Editor permissions are separate, not cumulative.
- Administrator authority includes platform-wide content and moderation capabilities.
- No staff member may approve their own role, report, appeal, or account action.
- Every staff mutation must verify role, assignment scope, account status, and applicable conflict-of-interest rules.
- Sensitive staff actions may require recent authentication and MFA.

PostgreSQL is the source of truth for application authorization and must enforce one active staff role per account together with the applicable active Moderator or Editor scope assignments.

### Authorization Labels Used in Endpoint Tables

| Label | Meaning |
|---|---|
| Public | No authentication required |
| User | Any active authenticated user |
| Owner | Authenticated user acting on their own resource |
| Member | Active member of the specified community |
| Moderator (scoped) | Moderator assigned to the specified community |
| Editor (scoped) | Editor assigned to the specified sports entity or content scope |
| Administrator | Platform administrator |
| System | Trusted signed service or webhook only |

---

## Standard Response Structures

A predictable JSON structure reduces client branching and improves debugging across mobile and admin clients ([standardized API responses](https://medium.com/@aswinsudhakaran98/why-api-response-structure-should-be-standardized-8a0ad2039a27)).

### Successful Single-Resource Response

```json
{
  "data": {
    "id": "c73c5f5e-9cc8-45c5-bb08-9311fbc61ce9"
  }
}
```

### Successful Collection Response

```json
{
  "data": [],
  "meta": {
    "nextCursor": null,
    "hasMore": false,
    "limit": 20
  }
}
```

### Successful Action Without a Response Body

Use HTTP `204 No Content` for successful delete, leave, unfollow, unregister, and similar actions when no returned representation is needed.

### Standard Error Response

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid fields.",
    "details": [
      {
        "field": "scheduledStartAt",
        "issue": "Must be a valid ISO 8601 timestamp."
      }
    ],
    "requestId": "req_01J3Y8J9M6E4S4"
  }
}
```

Rules:

- `code` is stable and intended for client logic.
- `message` is safe for user-facing or developer-facing display.
- `details` is optional and must not expose secrets, stack traces, private records, or internal authorization logic.
- `requestId` links the client error to server logs.
- The HTTP status remains authoritative; it is not duplicated as a body field.
- Unexpected exceptions are logged internally and returned as a generic `INTERNAL_ERROR`.

Consistent detection, classification, safe reporting, and recovery are required across all handlers ([SportMonks](https://www.sportmonks.com/glossary/error-handling/), [SonarSource](https://www.sonarsource.com/resources/library/error-handling-guide/)).

### HTTP Status and Application Error Codes

| HTTP | Application code | Use |
|---:|---|---|
| `400` | `VALIDATION_ERROR` | Invalid field, parameter, transition, or JSON |
| `400` | `INVALID_CURSOR` | Malformed or expired pagination cursor |
| `401` | `AUTHENTICATION_REQUIRED` | Missing, invalid, or expired token |
| `401` | `RECENT_AUTH_REQUIRED` | Sensitive action requires renewed verification |
| `403` | `FORBIDDEN` | Authenticated user lacks permission |
| `403` | `SCOPE_FORBIDDEN` | Staff role exists but target is outside assigned scope |
| `403` | `MEMBERSHIP_REQUIRED` | Active community membership is required |
| `403` | `ACCOUNT_RESTRICTED` | Account or membership is suspended, muted, banned, or deleted |
| `404` | `RESOURCE_NOT_FOUND` | Resource does not exist or is not visible to requester |
| `409` | `RESOURCE_CONFLICT` | Duplicate unique value or incompatible state |
| `409` | `ALREADY_EXISTS` | Favorite, membership, like, or equivalent already exists |
| `409` | `INVALID_STATE_TRANSITION` | Requested lifecycle change is not allowed |
| `413` | `PAYLOAD_TOO_LARGE` | Body or media exceeds the configured limit |
| `415` | `UNSUPPORTED_MEDIA_TYPE` | Unsupported request content type |
| `422` | `BUSINESS_RULE_VIOLATION` | Structurally valid request violates a domain rule |
| `429` | `RATE_LIMITED` | Request or message rate exceeded |
| `500` | `INTERNAL_ERROR` | Unexpected server failure |
| `502` | `UPSTREAM_ERROR` | Clerk, storage, push, or another dependency failed |
| `503` | `SERVICE_UNAVAILABLE` | Temporary service outage |

Validation failures may contain multiple field-level details. Authentication and authorization errors must not reveal whether a private target exists.

---

## Pagination, Filtering, and Sorting

Pagination limits response size and improves mobile performance ([pagination guide](https://medium.com/@vishnuravichandran.28/understanding-pagination-a-guide-for-developers-dffe3d547d60)).

### Cursor Pagination

All potentially unbounded collections use cursor pagination.

| Query parameter | Type | Default | Rule |
|---|---|---:|---|
| `limit` | integer | `20` | Minimum `1`; maximum `50` |
| `cursor` | opaque string | None | Returned by the previous response; clients must not parse it |

The server must apply a deterministic tie-breaker using `id` after the primary sort field. New items inserted during pagination must not create avoidable duplicates.

### Filtering

- Filters use documented query parameters only.
- Multiple filters use `AND` semantics unless an endpoint explicitly states otherwise.
- Repeated values for the same filter or comma-separated documented values use `OR` semantics.
- Dates use ISO 8601. Date-only filters use `YYYY-MM-DD`.
- Invalid filter names or values return `VALIDATION_ERROR`.
- Filtering removes nonmatching records; sorting only changes record order ([sort and filter guidance](https://medium.com/@colinwbaird/content-designing-a-sort-and-filter-15d41b683422)).
- The API exposes only filters required by approved screens and administrative workflows.

When filtering or ranking would otherwise require expensive joins across separate stores, TDA should use PostgreSQL indexes, search vectors, or a prepared read model instead of assembling an unbounded collection in application memory ([Software Engineering Stack Exchange](https://softwareengineering.stackexchange.com/questions/403449/system-design-for-filtering-sorting-objects-whose-properties-are-stored-in-distr)).

### Sorting

Collections use:

```text
sort=field
sort=-field
```

- No prefix: ascending.
- `-` prefix: descending.
- Only endpoint-approved fields are accepted.
- Default sorting is documented per endpoint.

### Common Collection Parameters

| Parameter | Applies to | Meaning |
|---|---|---|
| `q` | Searchable collections | Search text |
| `status` | Games and admin collections | One or more lifecycle statuses |
| `sportId` | Leagues, posts, search | Filter by sport |
| `leagueId` | Teams, games, posts, search | Filter by league |
| `teamId` | Athletes, games, posts, communities | Filter by team |
| `athleteId` | Posts | Filter by athlete |
| `gameId` | Posts | Filter by game |
| `communityId` | Posts | Filter by community |
| `from` / `to` | Games and admin activity | Inclusive timestamp range |
| `sort` | Approved collections | Approved sort field and direction |

---

## Reusable Data Schemas

The examples below define the fields exposed by the API. A `Summary` schema may be embedded inside another response; a full schema is returned by its detail endpoint.

### User

```json
{
  "id": "uuid",
  "username": "fanatico_pr",
  "firstName": "Ana",
  "lastName": "Rivera",
  "profilePhotoUrl": "https://...",
  "status": "active",
  "onboardingCompleted": true,
  "createdAt": "2026-07-24T18:30:00Z"
}
```

Private `email` is returned only from `/users/me`. Public user responses omit email, Clerk identifiers, account-security data, and staff-only data. A deleted author is represented with `username: null`, `displayName: "Deleted User"`, and no profile image.

### Sport

```json
{
  "id": "uuid",
  "name": "Baloncesto",
  "description": "string",
  "iconUrl": "https://...",
  "bannerUrl": "https://...",
  "isFavorite": false
}
```

### League

```json
{
  "id": "uuid",
  "sport": { "id": "uuid", "name": "Baloncesto" },
  "name": "BSN",
  "seasonLabel": "2026",
  "region": "Puerto Rico",
  "logoUrl": "https://...",
  "description": "string",
  "status": "ongoing",
  "isFavorite": true
}
```

### Team

```json
{
  "id": "uuid",
  "officialName": "Team name",
  "shortName": "TEAM",
  "city": "City",
  "homeVenue": "Venue",
  "logoUrl": "https://...",
  "status": "active",
  "isFavorite": false
}
```

### Athlete

```json
{
  "id": "uuid",
  "firstName": "Name",
  "lastName": "Surname",
  "position": "Guard",
  "jerseyNumber": "10",
  "photoUrl": "https://...",
  "currentTeam": {
    "id": "uuid",
    "officialName": "Team name",
    "logoUrl": "https://..."
  },
  "status": "active",
  "isFavorite": false
}
```

### Game and Score

```json
{
  "id": "uuid",
  "league": { "id": "uuid", "name": "BSN", "seasonLabel": "2026" },
  "homeTeam": { "id": "uuid", "officialName": "Home", "logoUrl": "https://..." },
  "awayTeam": { "id": "uuid", "officialName": "Away", "logoUrl": "https://..." },
  "scheduledStartAt": "2026-07-24T23:00:00Z",
  "status": "finished",
  "venue": "Venue",
  "broadcastDetails": "Channel or platform",
  "coverImageUrl": "https://...",
  "score": {
    "homeScore": 88,
    "awayScore": 82,
    "status": "final",
    "resultType": "home_win",
    "winningTeamId": "uuid",
    "lastUpdatedAt": "2026-07-25T01:20:00Z"
  }
}
```

`score` is `null` when no verified score record exists. `resultType` is one of `home_win`, `away_win`, `draw`, or `no_contest`. Version 1 displays scheduled games and verified final scores only.

### Post

```json
{
  "id": "uuid",
  "contentType": "article",
  "title": "string",
  "excerpt": "string",
  "content": "string",
  "coverMediaUrl": "https://...",
  "coverMediaType": "image",
  "author": { "id": "uuid", "displayName": "Editor name" },
  "relatedEntities": {
    "sports": [],
    "leagues": [],
    "teams": [],
    "athletes": [],
    "games": [],
    "communities": []
  },
  "likeCount": 0,
  "commentCount": 0,
  "viewerHasLiked": false,
  "publishedAt": "2026-07-24T18:30:00Z"
}
```

Feed responses may omit full `content` and return `excerpt`; `/posts/{postId}` returns the complete body.

### Comment

```json
{
  "id": "uuid",
  "postId": "uuid",
  "author": { "id": "uuid", "displayName": "string", "profilePhotoUrl": "https://..." },
  "parentCommentId": null,
  "content": "string",
  "status": "active",
  "createdAt": "2026-07-24T18:30:00Z",
  "updatedAt": "2026-07-24T18:30:00Z",
  "canEdit": true,
  "canDelete": true
}
```

Version 1 supports only one reply level.

### Favorite

```json
{
  "id": "uuid",
  "entityType": "team",
  "entity": { "id": "uuid", "name": "Team name", "imageUrl": "https://..." },
  "notificationsEnabled": true,
  "addedAt": "2026-07-24T18:30:00Z"
}
```

`entityType` is `sport`, `league`, `team`, or `athlete`.

### Community

```json
{
  "id": "uuid",
  "name": "Community name",
  "slug": "community-name",
  "description": "string",
  "guidelines": "string",
  "avatarUrl": "https://...",
  "bannerUrl": "https://...",
  "linkedEntity": { "type": "team", "id": "uuid", "name": "Team name" },
  "status": "active",
  "membership": { "status": "active", "role": "member" },
  "memberCount": 100
}
```

`membership` is `null` for a visitor or nonmember.

### Community Message

```json
{
  "id": "uuid",
  "communityId": "uuid",
  "sender": { "id": "uuid", "displayName": "string", "profilePhotoUrl": "https://..." },
  "messageText": "string",
  "status": "active",
  "sentAt": "2026-07-24T18:30:00Z",
  "canEdit": true,
  "canDelete": true
}
```

Community messages are text-only in Version 1. Reactions, threads, and user-uploaded media are excluded.

### Notification

```json
{
  "id": "uuid",
  "title": "Final",
  "message": "Home 88–82 Away",
  "type": "final_score",
  "isRead": false,
  "deepLinkRoute": "/games/uuid",
  "createdAt": "2026-07-24T18:30:00Z",
  "readAt": null
}
```

### Report

```json
{
  "id": "uuid",
  "reportedEntityType": "message",
  "reportedEntityId": "uuid",
  "reason": "harassment",
  "details": "Optional explanation",
  "status": "pending",
  "createdAt": "2026-07-24T18:30:00Z",
  "updatedAt": "2026-07-24T18:30:00Z"
}
```

Public user responses omit `moderationNotes`, staff identities, private target context, and internal history.

### Admin Audit Metadata

Every protected staff mutation records:

```json
{
  "reason": "Required staff reason",
  "sourceId": "uuid",
  "sourceReferenceUrl": "https://official-source.example/item"
}
```

`sourceId` and `sourceReferenceUrl` are required when modifying verified sports data. `reason` is required for moderation, role, lifecycle, and restoration actions.

---

## MVP Screen-to-Endpoint Matrix

| MVP screen or flow | Required endpoints |
|---|---|
| Register or log in | Clerk SDK; `POST /webhooks/clerk`; `GET /users/me` |
| Complete onboarding | `GET /onboarding/entities`; `PUT /users/me/onboarding` |
| Select favorites | `GET /favorites`; `POST /favorites`; `DELETE /favorites/{favoriteId}` |
| `Favoritos` feed | `GET /feeds/following` |
| `Descubre` feed | `GET /feeds/discover` |
| Search | `GET /search` |
| Entity profile | Detail endpoint for sport, league, team, or athlete plus related collection endpoints |
| Team page | `GET /teams/{teamId}`; team athletes, games, posts, and communities endpoints |
| Game summary | `GET /games/{gameId}` |
| Notifications | `GET /notifications`; notification read endpoints |
| Community discovery | `GET /communities`; `GET /communities/{communityId}` |
| Joined communities | `GET /users/me/communities`; membership endpoints |
| Community chat | Community message endpoints plus the real-time channel |
| Report content | `POST /reports`; `GET /reports/me` |
| User & Settings | `/users/me`, favorites, preferences, notification preferences, and push-device endpoints |
| Delete account | Account deletion-request endpoints |
| Admin publishing | Admin post and publication endpoints |
| Admin sports data | Admin sports, league, team, athlete, game, score, source, and verification endpoints |
| Admin moderation | Admin report, message, membership, and user-action endpoints |

---

## Public and User Endpoints

In the tables below, `Paginated<T>` means the standard collection response containing `T[]` and pagination metadata.

### Authentication, Onboarding, and Users

| Method and route | Parameters or body | Auth | Success |
|---|---|---|---|
| `GET /policies/current` | None | Public | `200` → current required policy versions and public document locations |
| `POST /policy-acceptances` | `{ policyVersionId, acceptanceSource, applicationVersion }` | User | `201` → recorded policy acceptance |
| `POST /webhooks/clerk` | Signed Clerk event | System | `204`; synchronizes creation, identity changes, or deletion state |
| `GET /users/me` | None | User | `200` → `User` including own private account fields |
| `PATCH /users/me` | `{ username?, firstName?, lastName?, profilePhotoUrl? }` | Owner | `200` → updated `User` |
| `GET /users/{userId}` | Path: `userId` | Public | `200` → public `User` |
| `GET /onboarding/entities` | `q?`, `entityType?`, `sportId?`, pagination | Public | `200` → grouped or paginated entity summaries |
| `PUT /users/me/onboarding` | `{ favoriteTargets: [{ entityType, entityId }], skippedFavorites: boolean }` | Owner | `200` → `{ onboardingCompleted, favorites }` |
| `POST /users/me/deletion-requests` | `{ confirmation, reason? }`; recent verification token when required | Owner | `202` → `{ id, status, requestedAt, scheduledAnonymizationAt }` |
| `GET /users/me/deletion-request` | None | Owner | `200` → current deletion-request status |
| `DELETE /users/me/deletion-request` | None; recent identity verification required; allowed only during the 30-day grace period before anonymization or Clerk-account deletion begins | Owner | `204` |

Creating a deletion request immediately revokes active sessions, changes the internal user status to `soft_deleted`, records the deletion timestamp, revokes active staff roles and scopes, and schedules anonymization for 30 days later.

During that grace period, the owner may reauthenticate only to view or cancel the deletion request. Cancellation is no longer allowed once anonymization or Clerk-account deletion begins. If the request is not cancelled, the system anonymizes the approved identity fields after 30 days, permanently deletes the Clerk user, and retains approved authored content, moderation evidence, and audit records under **Deleted User**.

Credential, email verification, password, MFA, and ordinary session operations remain Clerk responsibilities.

Privacy, retention, account deletion, and policy acceptance must follow [`privacy_retention_and_terms.md`](../product/privacy_retention_and_terms.md).

Registration must identify the current Terms of Service and Privacy Policy versions accepted by the user. A missing or outdated required acceptance returns `422 Unprocessable Entity`.

A policy-acceptance request identifies the specific policy version being accepted. The backend records the user, policy version, acceptance timestamp, acceptance source, application version, and any approved security evidence.

### User Preferences and Devices

| Method and route | Body | Auth | Success |
|---|---|---|---|
| `GET /users/me/preferences` | None | Owner | `200` → `{ preferredLanguage }` |
| `PATCH /users/me/preferences` | `{ preferredLanguage? }` | Owner | `200` → updated preferences |
| `GET /users/me/notification-preferences` | None | Owner | `200` → notification preference object |
| `PATCH /users/me/notification-preferences` | Any supported preference booleans | Owner | `200` → updated preferences |
| `POST /users/me/push-devices` | `{ provider, platform, deviceToken, deviceLabel? }` | Owner | `201` → `{ id, provider, platform, isActive }` |
| `DELETE /users/me/push-devices/{deviceId}` | Path: `deviceId` | Owner | `204` |

Notification preference fields are:

```json
{
  "pushEnabled": true,
  "gameRemindersEnabled": true,
  "gameStartEnabled": true,
  "finalScoresEnabled": true,
  "scheduleChangesEnabled": true,
  "breakingNewsEnabled": true,
  "commentRepliesEnabled": true,
  "communityActivityEnabled": true
}
```

Device tokens are write-only and are never returned by the API.

### Sports

| Method and route | Query or path parameters | Auth | Success |
|---|---|---|---|
| `GET /sports` | `q?`, pagination, `sort=name` | Public | `200` → `Paginated<Sport>` |
| `GET /sports/{sportId}` | `sportId` | Public | `200` → `Sport` |
| `GET /sports/{sportId}/leagues` | `status?`, pagination, `sort=-seasonLabel` | Public | `200` → `Paginated<League>` |
| `GET /sports/{sportId}/posts` | pagination, `sort=-publishedAt` | Public | `200` → `Paginated<PostSummary>` |
| `GET /sports/{sportId}/communities` | pagination, `sort=name` | Public | `200` → `Paginated<Community>` |

### Leagues

| Method and route | Query or path parameters | Auth | Success |
|---|---|---|---|
| `GET /leagues` | `q?`, `sportId?`, `status?`, pagination, `sort=-seasonLabel` | Public | `200` → `Paginated<League>` |
| `GET /leagues/{leagueId}` | `leagueId` | Public | `200` → `League` |
| `GET /leagues/{leagueId}/teams` | pagination, `sort=name` | Public | `200` → `Paginated<Team>` |
| `GET /leagues/{leagueId}/games` | `status?`, `from?`, `to?`, pagination, `sort=scheduledStartAt` | Public | `200` → `Paginated<Game>` |
| `GET /leagues/{leagueId}/posts` | pagination, `sort=-publishedAt` | Public | `200` → `Paginated<PostSummary>` |
| `GET /leagues/{leagueId}/communities` | pagination, `sort=name` | Public | `200` → `Paginated<Community>` |

### Teams

| Method and route | Query or path parameters | Auth | Success |
|---|---|---|---|
| `GET /teams` | `q?`, `leagueId?`, `sportId?`, pagination, `sort=name` | Public | `200` → `Paginated<Team>` |
| `GET /teams/{teamId}` | `teamId` | Public | `200` → `Team` |
| `GET /teams/{teamId}/athletes` | pagination, `sort=lastName` | Public | `200` → `Paginated<Athlete>` |
| `GET /teams/{teamId}/games` | `status?`, `from?`, `to?`, pagination, `sort=scheduledStartAt` | Public | `200` → `Paginated<Game>` |
| `GET /teams/{teamId}/posts` | pagination, `sort=-publishedAt` | Public | `200` → `Paginated<PostSummary>` |
| `GET /teams/{teamId}/communities` | pagination | Public | `200` → `Paginated<Community>` |

### Athletes

| Method and route | Query or path parameters | Auth | Success |
|---|---|---|---|
| `GET /athletes` | `q?`, `teamId?`, `leagueId?`, pagination, `sort=lastName` | Public | `200` → `Paginated<Athlete>` |
| `GET /athletes/{athleteId}` | `athleteId` | Public | `200` → `Athlete` |
| `GET /athletes/{athleteId}/posts` | pagination, `sort=-publishedAt` | Public | `200` → `Paginated<PostSummary>` |

### Games and Scores

| Method and route | Query or path parameters | Auth | Success |
|---|---|---|---|
| `GET /games` | `leagueId?`, `teamId?`, `status?`, `from?`, `to?`, pagination, `sort=scheduledStartAt` | Public | `200` → `Paginated<Game>` |
| `GET /games/{gameId}` | `gameId` | Public | `200` → `Game` with verified score when available |
| `GET /games/{gameId}/posts` | pagination, `sort=-publishedAt` | Public | `200` → `Paginated<PostSummary>` |

Allowed public MVP game statuses are `scheduled`, `finished`, `postponed`, and `canceled`. The internal `in_progress` value is reserved for future compatibility and is not exposed in the MVP interface.

### Feeds, Posts, Likes, and Comments

| Method and route | Parameters or body | Auth | Success |
|---|---|---|---|
| `GET /feeds/discover` | `sportId?`, `contentType?`, pagination; default newest/relevance policy | Public | `200` → `Paginated<FeedItem>` |
| `GET /feeds/following` | pagination; personalized ranking | User | `200` → `Paginated<FeedItem>` |
| `GET /posts` | related-entity filters, `contentType?`, pagination, `sort=-publishedAt` | Public | `200` → `Paginated<PostSummary>` |
| `GET /posts/{postId}` | `postId` | Public | `200` → full `Post` |
| `PUT /posts/{postId}/like` | None | User | `200` → `{ liked: true, likeCount }`; idempotent |
| `DELETE /posts/{postId}/like` | None | User | `204`; idempotent |
| `GET /posts/{postId}/comments` | pagination, `sort=createdAt` | Public | `200` → `Paginated<Comment>` |
| `POST /posts/{postId}/comments` | `{ content, parentCommentId? }` | User | `201` → `Comment` |
| `PATCH /comments/{commentId}` | `{ content }` | Owner | `200` → updated `Comment` |
| `DELETE /comments/{commentId}` | None | Owner | `204`; soft-deletes eligible own comment |

`FeedItem` is a discriminated object:

```json
{
  "type": "post",
  "item": {},
  "reason": "followed_team"
}
```

Allowed `type` values are `post` and `game`. `reason` is included only when useful and must not expose ranking internals.

### Favorites

| Method and route | Parameters or body | Auth | Success |
|---|---|---|---|
| `GET /favorites` | `entityType?`, pagination, `sort=-addedAt` | Owner | `200` → `Paginated<Favorite>` |
| `POST /favorites` | `{ entityType, entityId, notificationsEnabled? }` | User | `201` → `Favorite` |
| `PATCH /favorites/{favoriteId}` | `{ notificationsEnabled }` | Owner | `200` → updated `Favorite` |
| `DELETE /favorites/{favoriteId}` | `favoriteId` | Owner | `204` |

The backend derives the owner from the token. A client may not submit another `userId`.

### Search

| Method and route | Query parameters | Auth | Success |
|---|---|---|---|
| `GET /search` | Required `q`; `types?`; `sportId?`; `leagueId?`; `teamId?`; pagination | Public | `200` → `Paginated<SearchResult>` |

`types` accepts one or more of:

```text
sport, league, team, athlete, game, post, community
```

Search result:

```json
{
  "type": "team",
  "id": "uuid",
  "title": "Official team name",
  "subtitle": "City · League",
  "imageUrl": "https://...",
  "deepLinkRoute": "/teams/uuid"
}
```

An empty or whitespace-only `q` returns `VALIDATION_ERROR`. The client may show its local empty-search state before making a request.

### Communities and Memberships

| Method and route | Parameters or body | Auth | Success |
|---|---|---|---|
| `GET /communities` | `q?`, `sportId?`, `leagueId?`, `teamId?`, pagination, `sort=name` | Public | `200` → `Paginated<Community>` |
| `GET /communities/{communityId}` | `communityId` | Public | `200` → `Community` |
| `GET /users/me/communities` | `status?`, pagination, `sort=-joinedAt` | User | `200` → joined `Paginated<Community>` |
| `PUT /communities/{communityId}/membership` | None | User | `200` → `{ status: "active", role: "member", joinedAt }`; rejoins idempotently |
| `DELETE /communities/{communityId}/membership` | None | Member | `204`; records membership as left |

Archived communities are not joinable. Restricted communities apply their configured participation rules.

### Community Messages

| Method and route | Parameters or body | Auth | Success |
|---|---|---|---|
| `GET /communities/{communityId}/messages` | cursor pagination, `limit`; default newest-first cursor traversal | Public | `200` → `Paginated<Message>` |
| `POST /communities/{communityId}/messages` | `{ messageText, clientRequestId }` | Member | `201` → `Message` |
| `PATCH /communities/{communityId}/messages/{messageId}` | `{ messageText }` | Owner and active Member | `200` → updated `Message` |
| `DELETE /communities/{communityId}/messages/{messageId}` | None | Owner | `204`; soft-deletes eligible own message |

`clientRequestId` is a client-generated UUID used to prevent accidental duplicate sends during retries. Message length and rate limits are enforced by server configuration and returned in validation or rate-limit errors.

### Notifications

| Method and route | Parameters or body | Auth | Success |
|---|---|---|---|
| `GET /notifications` | `isRead?`, `type?`, pagination, `sort=-createdAt` | Owner | `200` → `Paginated<Notification>` |
| `PATCH /notifications/{notificationId}` | `{ isRead: true }` | Owner | `200` → updated `Notification` |
| `POST /notifications/read-all` | `{ before? }` | Owner | `200` → `{ updatedCount }` |
| `DELETE /notifications/{notificationId}` | None | Owner | `204` |

Notification deep links are allow-listed internal application routes. The client must not execute arbitrary URLs received in `deepLinkRoute`.

### Reports

| Method and route | Parameters or body | Auth | Success |
|---|---|---|---|
| `POST /reports` | `{ reportedEntityType, reportedEntityId, reason, details? }` | User | `201` → `Report` |
| `GET /reports/me` | `status?`, pagination, `sort=-createdAt` | Owner | `200` → own `Paginated<Report>` |
| `GET /reports/me/{reportId}` | `reportId` | Owner | `200` → own `Report` |

`reportedEntityType` is `post`, `comment`, `message`, or `user`. The target must match its declared type. Duplicate-report and abusive-submission policies may return `RESOURCE_CONFLICT` or `RATE_LIMITED`.

### Personal Safety Controls

| Method and route | Parameters or body | Auth | Success |
|---|---|---|---|
| `GET /users/me/blocks` | pagination | Owner | `200` → paginated public user summaries |
| `PUT /users/{userId}/block` | None | User | `204`; idempotent |
| `DELETE /users/{userId}/block` | None | Owner | `204`; idempotent |
| `GET /users/me/mutes` | pagination | Owner | `200` → paginated public user summaries |
| `PUT /users/{userId}/mute` | None | User | `204`; idempotent |
| `DELETE /users/{userId}/mute` | None | Owner | `204`; idempotent |

A user cannot block or mute themselves. Blocking or muting does not grant moderation authority and does not delete the other user’s records.

---

## Administrative Endpoints

All `/admin` endpoints require authentication, server-side authorization, and audit logging. A successful staff role alone does not bypass assignment-scope checks.

### Admin Content

`AdminPostInput`:

```json
{
  "contentType": "article",
  "title": "Required for articles",
  "excerpt": "Optional summary",
  "content": "Required body",
  "coverMediaUrl": "https://...",
  "coverMediaType": "image",
  "relatedSportIds": [],
  "relatedLeagueIds": [],
  "relatedTeamIds": [],
  "relatedAthleteIds": [],
  "relatedGameIds": [],
  "relatedCommunityIds": [],
  "sourceId": "uuid",
  "sourceReferenceUrl": "https://...",
  "verificationNotes": "Internal notes"
}
```

| Method and route | Parameters or body | Auth | Success |
|---|---|---|---|
| `GET /admin/posts` | `status?`, `contentType?`, related-entity filters, pagination, `sort=-updatedAt` | Editor (scoped) or Administrator | `200` → admin `Paginated<Post>` |
| `POST /admin/posts` | `AdminPostInput` | Editor (scoped) or Administrator | `201` → draft `Post` |
| `GET /admin/posts/{postId}` | `postId` | Editor (scoped) or Administrator | `200` → admin `Post` with verification metadata |
| `PATCH /admin/posts/{postId}` | Partial `AdminPostInput` | Editor (scoped) or Administrator | `200` → updated `Post` |
| `POST /admin/posts/{postId}/publish` | `{ publishAt?, reason? }` | Editor (scoped) or Administrator | `200` → published or scheduled `Post` |
| `POST /admin/posts/{postId}/archive` | `{ reason }` | Editor (scoped) or Administrator | `200` → archived/soft-deleted representation |
| `POST /admin/posts/{postId}/restore` | `{ reason }` | Editor (scoped) or Administrator | `200` → restored draft or published representation |

The server validates every related entity against the Editor’s assignment scope. Publishing outside that scope returns `SCOPE_FORBIDDEN`.

### Admin Sports, Leagues, Teams, and Athletes

Core entity creation, identity changes, relationship changes, archival, and restoration are Administrator-only. Editors may correct operational descriptions and approved media within their assigned scope.

| Method and route | Body or query | Auth | Success |
|---|---|---|---|
| `GET /admin/sports` | `status?`, pagination | Editor (scoped) or Administrator | `200` → admin `Paginated<Sport>` |
| `POST /admin/sports` | Sport fields plus verification metadata | Administrator | `201` → `Sport` |
| `PATCH /admin/sports/{sportId}` | Allowed fields plus verification metadata | Editor (scoped) or Administrator | `200` → updated `Sport` |
| `POST /admin/sports/{sportId}/archive` | `{ reason }` | Administrator | `200` |
| `POST /admin/sports/{sportId}/restore` | `{ reason }` | Administrator | `200` |
| `GET /admin/leagues` | `sportId?`, `status?`, pagination | Editor (scoped) or Administrator | `200` → admin `Paginated<League>` |
| `POST /admin/leagues` | League fields plus verification metadata | Administrator | `201` → `League` |
| `PATCH /admin/leagues/{leagueId}` | Allowed fields plus verification metadata | Editor (scoped) or Administrator | `200` → updated `League` |
| `POST /admin/leagues/{leagueId}/archive` | `{ reason }` | Administrator | `200` |
| `POST /admin/leagues/{leagueId}/restore` | `{ reason }` | Administrator | `200` |
| `GET /admin/teams` | `leagueId?`, `status?`, pagination | Editor (scoped) or Administrator | `200` → admin `Paginated<Team>` |
| `POST /admin/teams` | Team fields and `leagueIds` plus verification metadata | Administrator | `201` → `Team` |
| `PATCH /admin/teams/{teamId}` | Allowed fields plus verification metadata | Editor (scoped) or Administrator | `200` → updated `Team` |
| `PUT /admin/leagues/{leagueId}/teams/{teamId}` | `{ reason, sourceId, sourceReferenceUrl }` | Administrator | `200` → league-team relationship |
| `DELETE /admin/leagues/{leagueId}/teams/{teamId}` | `{ reason }` | Administrator | `204` |
| `POST /admin/teams/{teamId}/archive` | `{ reason }` | Administrator | `200` |
| `POST /admin/teams/{teamId}/restore` | `{ reason }` | Administrator | `200` |
| `GET /admin/athletes` | `teamId?`, `status?`, pagination | Editor (scoped) or Administrator | `200` → admin `Paginated<Athlete>` |
| `POST /admin/athletes` | Athlete fields plus verification metadata | Administrator | `201` → `Athlete` |
| `PATCH /admin/athletes/{athleteId}` | Allowed fields plus verification metadata | Editor (scoped) or Administrator | `200` → updated `Athlete` |
| `POST /admin/athletes/{athleteId}/archive` | `{ reason }` | Administrator | `200` |
| `POST /admin/athletes/{athleteId}/restore` | `{ reason }` | Administrator | `200` |

Example entity inputs:

```json
{
  "sport": {
    "name": "string",
    "description": "string",
    "iconUrl": "https://...",
    "bannerUrl": "https://..."
  },
  "league": {
    "sportId": "uuid",
    "name": "string",
    "seasonLabel": "2026",
    "region": "string",
    "logoUrl": "https://...",
    "description": "string"
  },
  "team": {
    "officialName": "string",
    "shortName": "string",
    "city": "string",
    "homeVenue": "string",
    "logoUrl": "https://..."
  },
  "athlete": {
    "currentTeamId": "uuid",
    "firstName": "string",
    "lastName": "string",
    "position": "string",
    "jerseyNumber": "10",
    "photoUrl": "https://..."
  }
}
```

### Admin Games and Scores

`GameInput`:

```json
{
  "leagueId": "uuid",
  "homeTeamId": "uuid",
  "awayTeamId": "uuid",
  "scheduledStartAt": "2026-07-24T23:00:00Z",
  "status": "scheduled",
  "venue": "string",
  "broadcastDetails": "string",
  "coverImageUrl": "https://...",
  "sourceId": "uuid",
  "sourceReferenceUrl": "https://...",
  "verificationNotes": "string"
}
```

`ScoreInput`:

```json
{
  "homeScore": 88,
  "awayScore": 82,
  "status": "final",
  "resultType": "home_win",
  "winningTeamId": "uuid",
  "sourceId": "uuid",
  "sourceReferenceUrl": "https://...",
  "verificationNotes": "string"
}
```

| Method and route | Parameters or body | Auth | Success |
|---|---|---|---|
| `GET /admin/games` | Public game filters plus pagination | Editor (scoped) or Administrator | `200` → admin `Paginated<Game>` |
| `POST /admin/games` | `GameInput` | Editor (scoped) or Administrator | `201` → `Game` |
| `PATCH /admin/games/{gameId}` | Partial `GameInput` | Editor (scoped) or Administrator | `200` → updated `Game` |
| `PUT /admin/games/{gameId}/score` | `ScoreInput` | Editor (scoped) or Administrator | `200` → updated `Game.score`; idempotent upsert |
| `POST /admin/games/{gameId}/finalize` | Final `ScoreInput` | Editor (scoped) or Administrator | `200` → final `Game` |
| `POST /admin/games/{gameId}/reopen` | `{ reason, sourceId, sourceReferenceUrl }` | Administrator | `200` → corrected nonfinal game state |

Validation rules:

- Home and away teams must differ.
- Both teams must belong to the selected league.
- Scores must be nonnegative integers.
- A final score requires `resultType`.
- `winningTeamId` must match the home or away team for a win and must be `null` for a draw or no contest.
- Final-score correction and game reopening require an audit reason.

### Admin Communities

| Method and route | Parameters or body | Auth | Success |
|---|---|---|---|
| `GET /admin/communities` | `status?`, `q?`, pagination | Administrator | `200` → admin `Paginated<Community>` |
| `POST /admin/communities` | Community input | Administrator | `201` → `Community` |
| `PATCH /admin/communities/{communityId}` | Partial community input | Administrator | `200` → updated `Community` |
| `POST /admin/communities/{communityId}/restrict` | `{ reason }` | Administrator | `200` → restricted `Community` |
| `POST /admin/communities/{communityId}/archive` | `{ reason }` | Administrator | `200` → archived `Community` |
| `POST /admin/communities/{communityId}/restore` | `{ reason }` | Administrator | `200` → active or restricted `Community` |

Community input:

```json
{
  "name": "string",
  "slug": "string",
  "description": "string",
  "guidelines": "string",
  "avatarUrl": "https://...",
  "bannerUrl": "https://...",
  "linkedEntity": { "type": "team", "id": "uuid" }
}
```

Only zero or one linked sport, league, or team is permitted.

### Admin Reports and Community Moderation

| Method and route | Parameters or body | Auth | Success |
|---|---|---|---|
| `GET /admin/reports` | `status?`, `entityType?`, `communityId?`, pagination, `sort=createdAt` | Moderator (scoped) or Administrator | `200` → authorized `Paginated<AdminReport>` |
| `GET /admin/reports/{reportId}` | `reportId` | Moderator (scoped) or Administrator | `200` → report, target context, history |
| `POST /admin/reports/{reportId}/review` | `{ reason }` | Moderator (scoped) or Administrator | `200` → status `in_review` |
| `POST /admin/reports/{reportId}/resolve` | `{ resolution, moderationNotes, action? }` | Moderator (scoped) or Administrator | `200` → status `resolved` |
| `POST /admin/reports/{reportId}/dismiss` | `{ moderationNotes }` | Moderator (scoped) or Administrator | `200` → status `dismissed` |
| `POST /admin/reports/{reportId}/escalate` | `{ moderationNotes }` | Moderator (scoped) or Administrator | `200` → escalation record |
| `POST /admin/comments/{commentId}/hide` | `{ reason }` | Moderator (scoped) or Administrator | `200` → hidden `Comment` |
| `POST /admin/comments/{commentId}/restore` | `{ reason }` | Moderator (scoped) or Administrator | `200` → active `Comment` |
| `POST /admin/communities/{communityId}/messages/{messageId}/hide` | `{ reason }` | Moderator (scoped) or Administrator | `200` → hidden `Message` |
| `POST /admin/communities/{communityId}/messages/{messageId}/restore` | `{ reason }` | Moderator (scoped) or Administrator | `200` → active `Message` |
| `POST /admin/communities/{communityId}/members/{userId}/warn` | `{ reason }` | Moderator (scoped) or Administrator | `201` → warning record |
| `POST /admin/communities/{communityId}/members/{userId}/mute` | `{ reason, expiresAt }` | Moderator (scoped) or Administrator | `200` → muted membership |
| `POST /admin/communities/{communityId}/members/{userId}/unmute` | `{ reason }` | Moderator (scoped) or Administrator | `200` → active membership |

Allowed report resolutions include `no_violation`, `content_hidden`, `user_warned`, `community_muted`, `platform_suspension`, and `escalated`. A Moderator may not apply a platform-wide suspension; the backend must reject that action even if submitted by the client.

### Admin Users and Roles

| Method and route | Parameters or body | Auth | Success |
|---|---|---|---|
| `GET /admin/users` | `q?`, `status?`, pagination | Administrator | `200` → limited admin user summaries |
| `GET /admin/users/{userId}` | `userId` | Administrator | `200` → minimum authorized account data and action history |
| `POST /admin/users/{userId}/suspend` | `{ reason, duration? }` | Administrator | `200` → suspended user |
| `POST /admin/users/{userId}/reactivate` | `{ reason }` | Administrator | `200` → active user |
| `POST /admin/users/{userId}/deletion-requests/{requestId}/process` | `{ reason }` | Administrator | `202` → processing status |
| `GET /admin/staff-assignments` | `role?`, `scopeType?`, pagination | Administrator | `200` → authorized assignments |
| `POST /admin/staff-assignments` | `{ userId, role, scopes, reason, approvedByUserId }` | Administrator with restricted checks | `201` → assignment |
| `PATCH /admin/staff-assignments/{assignmentId}` | `{ scopes, reason, approvedByUserId }` | Administrator with restricted checks | `200` → updated assignment |
| `DELETE /admin/staff-assignments/{assignmentId}` | `{ reason, approvedByUserId }` | Administrator with restricted checks | `204` |

Rules:

- `role` is `moderator` or `editor` through ordinary controls.
- Administrator-role changes use a separate restricted process and are not exposed through these endpoints.
- A user may hold only one staff role.
- The actor may not assign, approve, expand, or remove their own role.
- `approvedByUserId` must identify a different authorized Administrator and is independently verified.
- Private account access and every role mutation are audited.
- Passwords, authentication secrets, and raw security credentials are never returned.

### Data Sources and Verification

| Method and route | Parameters or body | Auth | Success |
|---|---|---|---|
| `GET /admin/data-sources` | `isApproved?`, `type?`, pagination | Editor (read in scope) or Administrator | `200` → `Paginated<DataSource>` |
| `POST /admin/data-sources` | `{ name, type, baseUrl?, isApproved, notes? }` | Administrator | `201` → `DataSource` |
| `PATCH /admin/data-sources/{sourceId}` | Partial source fields | Administrator | `200` → updated `DataSource` |
| `GET /admin/verifications` | target filters, `sourceId?`, pagination | Editor (scoped) or Administrator | `200` → `Paginated<DataVerification>` |
| `POST /admin/verifications` | Verification input | Editor (scoped) or Administrator | `201` → `DataVerification` |

Verification input:

```json
{
  "sourceId": "uuid",
  "targetType": "game",
  "targetId": "uuid",
  "sourceReferenceUrl": "https://...",
  "notes": "Internal verification notes"
}
```

`targetType` is `sport`, `league`, `team`, `athlete`, `game`, `score`, or `post`. The target must fall within the Editor’s assigned scope.

---

## Media Upload Responsibility

TDA stores media metadata and approved object-storage URLs, not media bytes, in PostgreSQL.

For MVP media uploads:

1. The authenticated admin client requests a short-lived upload authorization.
2. The client uploads directly to approved object storage.
3. The client submits the resulting controlled object key or URL in the relevant content endpoint.
4. The backend verifies ownership, file type, size, and approved storage location before saving it.

| Method and route | Body | Auth | Success |
|---|---|---|---|
| `POST /admin/media/uploads` | `{ fileName, mediaType, mimeType, sizeBytes, purpose }` | Editor (scoped) or Administrator | `201` → short-lived upload instructions and `mediaKey` |
| `POST /admin/media/uploads/{mediaKey}/complete` | `{ checksum }` | Same initiating staff user | `200` → `{ mediaUrl, mediaType }` |

User-uploaded community media is not supported in Version 1.

---

## Real-Time Contract

WebSockets are appropriate for community chat because the server must deliver new messages without repeated polling. REST remains the source of truth for creation, validation, persistence, history, and reconnect recovery ([Render](https://render.com/articles/building-real-time-applications-with-websockets)).

### Responsibilities

| Operation | REST | WebSocket |
|---|:---:|:---:|
| Load message history | Yes | No |
| Join or leave a community | Yes | No |
| Create, edit, or delete a message | Yes | Broadcast result only |
| Receive new community messages | Reconnect fallback | Yes |
| Receive message edits or removals | Reconnect fallback | Yes |
| Load a game or final score | Yes | No |
| Receive a verified score/status update - Post MVP | Reconnect fallback | Optional event |
| Notification history and read state | Yes | No |
| Device push notification | Push provider | No |
| Moderation and admin actions | Yes | Broadcast visible result only |

Version 1 requires real-time delivery only for community messages. Real-time game and score events are Post-MVP.

### Connection

```text
wss://api.<production-domain>/api/v1/realtime
```

The client authenticates during the connection handshake using a supported Clerk token mechanism. Tokens must not be written to application logs. The server closes connections for invalid, expired, suspended, or deleted sessions.

### Client Events

```json
{
  "type": "community.subscribe",
  "requestId": "uuid",
  "payload": { "communityId": "uuid" }
}
```

Supported client event types:

| Type | Payload | Authorization |
|---|---|---|
| `community.subscribe` | `{ communityId }` | Public for active public community; membership may be required for restricted community |
| `community.unsubscribe` | `{ communityId }` | Connected client |
| `ping` | `{ timestamp }` | Connected client |

Messages are created through REST, not directly through the socket. This keeps validation, deduplication, rate limiting, persistence, and HTTP error handling consistent.

### Server Events

```json
{
  "type": "community.message.created",
  "eventId": "uuid",
  "occurredAt": "2026-07-24T18:30:00Z",
  "payload": {
    "communityId": "uuid",
    "message": {}
  }
}
```

Supported server event types:

| Type | Purpose |
|---|---|
| `connection.ready` | Confirms authenticated or public connection state |
| `community.subscribed` | Confirms subscription |
| `community.message.created` | Delivers a newly persisted message |
| `community.message.updated` | Delivers an eligible edit |
| `community.message.removed` | Removes a soft-deleted or moderated message from public view |
| `game.status.updated` | Optional verified game-status change |
| `game.score.updated` - Post MVP| Optional verified score change |
| `pong` | Connection-health response |
| `error` | Socket-specific safe error |

Clients:

- Deduplicate events by `eventId` and resources by resource `id`.
- Re-fetch current REST state after reconnecting.
- Use exponential backoff for reconnect attempts.
- Treat WebSocket events as change notifications, not a replacement for authoritative REST retrieval.

Servers:

- Validate every subscription.
- Reevaluate authorization after role, account, community, or membership changes.
- Enforce schema, event-size, connection, and rate limits.
- Use ping/pong health checks and remove dead connections.
- Coordinate broadcasts across instances through an approved shared pub/sub mechanism when horizontally scaled.

---

## Caching, Concurrency, and Request Safety

- Public `GET` responses may use `ETag` and `If-None-Match`.
- Private, personalized, admin, and moderation responses must use `Cache-Control: private, no-store` unless a stricter reviewed policy defines otherwise.
- Mutation responses must not be cached.
- `PUT` is used for idempotent likes, memberships, and score upserts.
- Message creation uses `clientRequestId` for retry deduplication.
- Administrative update endpoints should support optimistic concurrency with:

```http
If-Match: "<resource-version>"
```

An outdated resource version returns `409 RESOURCE_CONFLICT`. This prevents one administrator from silently overwriting another administrator’s newer change.

---

## Security and Operational Requirements

- Validate every request at the API boundary.
- Authorize every protected action in the backend; hidden UI controls are not security.
- Apply least privilege and deny access by default.
- Rate-limit authentication-adjacent, search, report, message, media, and administrative endpoints.
- Restrict CORS to approved application origins.
- Verify Clerk webhook signatures and reject replays.
- Never log bearer tokens, passwords, raw push tokens, signed upload credentials, or unnecessary personal data.
- Store request IDs and structured server logs.
- Record immutable audit events for publishing, sports-data changes, moderation, private-account access, deletion processing, and role changes.
- Prefer hiding, archiving, soft deletion, or anonymization when records are needed for moderation, auditing, or referential integrity.
- Return the same safe not-found behavior when revealing a private resource’s existence would disclose information.
- Define request-body and media-size limits.
- Use health checks for the REST service and real-time service.

Clear requirements reduce ambiguity, rework, and inconsistent implementation across teams ([ASD Team](https://asd.team/blog/software-development-requirements/)).

---

## OpenAPI Implementation Requirements

This Markdown document is the documented human-readable contract pending final team approval. During implementation, the backend should generate or maintain an OpenAPI 3 specification containing:

- Every route and method in this document
- Path and query parameter schemas
- Request-body schemas
- Success and error response schemas
- Bearer authentication requirements
- Role and scope descriptions
- Enum values
- Pagination metadata
- Examples

Required automated contract checks:

- OpenAPI document validates successfully.
- Every implemented controller operation appears in OpenAPI.
- Every protected operation declares its security requirement.
- Request and response DTOs match the shared contract schemas.
- Breaking changes to `/api/v1` fail pull-request validation unless explicitly approved.

---


## References

1. [API7.ai — HTTP Methods Explained](https://api7.ai/learning-center/api-101/http-methods-in-apis)
2. [Blair Crumbly — HTTP Methods and Routes](https://medium.com/@blaircrumbly/http-methods-and-routes-exploring-oop-and-functional-programming-7a871d45a74f)
3. [MDN — HTTP Request Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods)
4. [CodeSignal — Path and Query Parameters](https://codesignal.com/learn/courses/basics-of-http-requests-with-dart/lessons/introduction-to-path-and-query-parameters-in-dart)
5. [Swagger — Describing Request Bodies](https://swagger.io/docs/specification/v3_0/describing-request-body/describing-request-body/)
6. [Aswin Sudhakaran — Standardized API Response Structure](https://medium.com/@aswinsudhakaran98/why-api-response-structure-should-be-standardized-8a0ad2039a27)
7. [Raphael Abayomi — Authentication Guide](https://medium.com/@raphyabak/authentication-a-developers-complete-guide-efa42b429569)
8. [ASD Team — The Role of Requirements in Software Development](https://asd.team/blog/software-development-requirements/)
9. [SportMonks — Error Handling](https://www.sportmonks.com/glossary/error-handling/)
10. [SonarSource — Error Handling Guide](https://www.sonarsource.com/resources/library/error-handling-guide/)
11. [Vishnuravichandran — Understanding Pagination](https://medium.com/@vishnuravichandran.28/understanding-pagination-a-guide-for-developers-dffe3d547d60)
12. [Colin Baird — Content Designing a Sort and Filter](https://medium.com/@colinwbaird/content-designing-a-sort-and-filter-15d41b683422)
13. [Software Engineering Stack Exchange — Filtering and Sorting Across Distributed Storage](https://softwareengineering.stackexchange.com/questions/403449/system-design-for-filtering-sorting-objects-whose-properties-are-stored-in-distr)
14. [Daily.dev — API Versioning Strategies](https://daily.dev/blog/api-versioning-strategies-best-practices-guide/)
15. [xMatters — API Versioning Strategies and Best Practices](https://www.xmatters.com/blog/api-versioning-strategies)
16. [Render — Building Real-Time Applications with WebSockets](https://render.com/articles/building-real-time-applications-with-websockets)
