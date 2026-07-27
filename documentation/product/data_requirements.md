# TDA Product Data Requirements (Version 1 / MVP)

## 1. Users
* **Purpose:** Represent registered users on the platform (fans, community members, and administrators).
* **Ownership & Source:** Created directly by the user upon registration.
* **Lifecycle & Deletion:** `Active` -> `Suspended` or `Soft-Deleted`. A verified deletion request immediately soft-deletes the account and starts a 30-day grace period. If the request is not cancelled before processing begins, approved personal identity fields are anonymized and the Clerk identity is permanently deleted. The internal user record may remain to preserve approved authored content, moderation evidence, and audit relationships.

### Information to Store 
| Field | Required/Optional | Source |
|---|---|---|
| Unique user identifier | Required | Internal |
| Email address | Required | User-provided |
| Username | Required | User-provided |
| First and last name | Required | User-provided |
| Profile photo | Optional | User-provided |
| Account status (active, suspended, etc.) | Required | Internal |
| External authentication reference (Clerk ID) | Required | External (Clerk) |
| Registration timestamp | Required | Internal |

### Information to Display
* **Private Account View / Settings:** Email address, username, full name, profile photo, and basic account settings.

### Data Attributes
* **Searchable Fields:** Username, email address, full name.
* **Media / File Attachments:** Profile photo.

### Approved Account-Deletion Behavior

- A deletion request immediately blocks ordinary account access and revokes active sessions.
- The owner may view or cancel the request during the 30-day grace period after recent identity verification.
- Cancellation is no longer permitted once anonymization or permanent Clerk-account deletion begins.
- If the request is completed, email, username, first and last name, profile photo, and the Clerk reference are cleared.
- The retained internal user identifier may continue linking approved posts, comments, messages, moderation evidence, and audit records.
- Retained public content must display the author as **Deleted User**.
- Account deletion must not be used as a moderation punishment.
---

## 1.1 User Preferences

* **Purpose:** Store application-owned settings selected by an authenticated user, beginning with the preferred interface language required by the MVP.
* **Ownership & Source:** Created from system defaults and updated directly by the user.
* **Lifecycle & Deletion:** Created during onboarding or when the user first modifies a preference. Preferences remain editable while the account is active and are no longer used after the account is soft-deleted.

### Information to Store

| Field | Required/Optional | Source |
|---|---|---|
| Associated user | Required | Internal |
| Preferred interface language | Required; defaults to `es-PR` | User-selected / Internal default |
| Creation and update timestamps | Required | Internal |

### Information to Display

* **Private Account View / Settings:** The user’s currently selected application preferences.

### Data Attributes

* **Searchable Fields:** None.
* **Media / File Attachments:** None.
* Authentication, password, MFA, and session-security preferences remain managed by Clerk and are not duplicated as TDA application preferences.

---

## 1.2 Notification Preferences

* **Purpose:** Store the notification categories and push-delivery settings enabled or disabled by an authenticated user.
* **Ownership & Source:** Initialized from platform defaults and managed by the user.
* **Lifecycle & Deletion:** `Active` -> `Updated` -> `Disabled`. Push delivery is disabled when the associated account is soft-deleted.

### Information to Store

| Field | Required/Optional | Source |
|---|---|---|
| Associated user | Required | Internal |
| Global push-notification toggle | Required; disabled until permission or opt-in | User-selected / Internal default |
| Game-reminder preference | Required; defaulted | User-selected / Internal default |
| Game-start preference | Required; defaulted | User-selected / Internal default |
| Final-score preference | Required; defaulted | User-selected / Internal default |
| Schedule-change preference | Required; defaulted | User-selected / Internal default |
| Breaking-news preference | Required; defaulted | User-selected / Internal default |
| Comment-reply preference | Required; defaulted | User-selected / Internal default |
| Community-activity preference | Required; defaulted | User-selected / Internal default |
| Creation and update timestamps | Required | Internal |

### Information to Display

* **Private Account View / Settings:** The current enabled or disabled state of each supported notification category.

### Data Attributes

* **Searchable Fields:** None.
* **Media / File Attachments:** None.
* Entity-specific notification opt-in is also controlled through the notification toggle associated with each favorite.

---

## 1.3 Push Devices

* **Purpose:** Register the mobile devices that may receive approved push notifications for an authenticated user.
* **Ownership & Source:** Created when the user registers a device through the mobile application. Provider tokens originate from Expo Notifications or Firebase Cloud Messaging.
* **Lifecycle & Deletion:** `Active` -> `Disabled` -> `Permanently Removed`. A device may be disabled after logout, token invalidation, account deletion, or repeated delivery failure.

### Information to Store

| Field | Required/Optional | Source |
|---|---|---|
| Unique device-registration identifier | Required | Internal |
| Associated user | Required | Internal |
| Push provider (`expo` or `fcm`) | Required | Mobile application / External provider |
| Mobile platform (`ios` or `android`) | Required | Mobile application |
| Push-delivery token | Required | External push provider |
| Device label | Optional | User-provided / Device-provided |
| Active or disabled status | Required | Internal |
| Last-seen timestamp | Optional | Internal |
| Disabled timestamp | Optional | Internal |
| Creation and update timestamps | Required | Internal |

### Information to Display

* **Private Account View / Settings:** A safe device summary may be displayed for device management.
* Raw push-delivery tokens must never be returned to the user interface or exposed publicly.

### Data Attributes

* **Searchable Fields:** None in public product search.
* **Media / File Attachments:** None.
* **Sensitive Data:** Push-delivery tokens must be stored securely and excluded from ordinary application logs.

---

## 1.4 Staff Roles and Assignment Scopes

* **Purpose:** Store elevated platform-role assignments and the communities or sports entities in which staff members may perform authorized actions.
* **Ownership & Source:** Created, approved, modified, and revoked through authorized administrative workflows.
* **Lifecycle & Deletion:** `Assigned` -> `Active` -> `Revoked`. Assignment and revocation history must be retained for administrative accountability.

### Information to Store

| Field | Required/Optional | Source |
|---|---|---|
| Unique role-assignment identifier | Required | Internal |
| Assigned user | Required | Internal |
| Platform role (`moderator`, `editor`, or `administrator`) | Required | Administrator-selected |
| Assigning administrator | Required, except for the documented initial bootstrap | Internal |
| Approving administrator | Required when restricted approval applies | Internal |
| Assignment reason | Required | Administrator-entered |
| Assignment timestamp | Required | Internal |
| Revoking administrator | Optional; required when revoked | Internal |
| Revocation reason | Optional; required when revoked | Administrator-entered |
| Revocation timestamp | Optional | Internal |
| Assigned community scope | Required for scoped Moderator permissions | Administrator-selected |
| Assigned sport, league, or team scope | Required for scoped Editor permissions | Administrator-selected |
| Scope assignment and revocation timestamps | Required when applicable | Internal |

### Information to Display

* **Web Admin Panel:** Active role, authorized scopes, assignment reason, approval information, and assignment history.
* Role and scope information must not be included in ordinary public user profiles.

### Data Attributes

* **Searchable Fields:** Staff user, active role, and assigned scope within authorized administrative tools.
* **Media / File Attachments:** None.

### Authorization Requirements

- A user may have only one active staff role.
- A Moderator may moderate only within assigned community scopes.
- An Editor may manage approved content and sports information only within assigned sport, league, or team scopes.
- An Administrator has platform-wide authority subject to restricted-approval and conflict-of-interest requirements.
- A staff member may not assign or approve their own role or scope.
- Revoked assignments must remain available for authorized audit and investigation.

---

## 1.5 Account Deletion Requests

* **Purpose:** Track an authenticated user’s account-deletion request through identity verification, the grace period, cancellation, processing, anonymization, and completion.
* **Ownership & Source:** Initiated by the account owner and processed by the backend system or an authorized Administrator.
* **Lifecycle & Deletion:** `Pending Verification` -> `Verified` -> `Scheduled` -> `Completed`, with `Cancelled` or `Rejected` when applicable. Request history is retained as administrative evidence.

### Information to Store

| Field | Required/Optional | Source |
|---|---|---|
| Unique deletion-request identifier | Required | Internal |
| Associated user | Required | Internal |
| Current request status | Required | Internal |
| Request timestamp | Required | Internal |
| Identity-verification timestamp | Optional; required once verified | Clerk / Internal |
| Scheduled anonymization date and time | Optional; required once scheduled | Internal |
| Processing administrator or approved automated process | Optional | Internal |
| Internal processing or retention reason | Optional | Administrator-entered / Internal |
| Completion timestamp | Optional; required when completed | Internal |
| Cancellation timestamp | Optional; required when cancelled | Internal |
| Creation and update timestamps | Required | Internal |

### Information to Display

* **Private Deletion-Request View:** Current request status, request date, scheduled anonymization date, and whether cancellation remains available.
* **Web Admin Panel:** Minimum processing information required to complete or investigate the request.

### Data Attributes

* **Searchable Fields:** User and request status within authorized administrative tools.
* **Media / File Attachments:** None.
* Only one active deletion request may exist for a user at a time.
* Creating a verified request immediately soft-deletes the account, revokes active sessions and staff assignments, and begins the approved 30-day grace period.
* Cancellation must not be permitted after anonymization or permanent Clerk-account deletion begins.

---

## 1.6 User Blocks

* **Purpose:** Allow an authenticated user to block another user to prevent unwanted interaction through supported platform features.
* **Ownership & Source:** Created and removed directly by the user performing the block.
* **Lifecycle & Deletion:** `Active` -> `Permanently Deleted`. Unblocking removes the relationship.

### Information to Store

| Field | Required/Optional | Source |
|---|---|---|
| Blocking user | Required | Internal |
| Blocked user | Required | User-selected |
| Creation timestamp | Required | Internal |

### Information to Display

* **Private Account View / Settings:** A list of users currently blocked by the account owner.
* Block relationships must not be displayed publicly.

### Data Attributes

* **Searchable Fields:** None in public search.
* **Media / File Attachments:** None.
* A user cannot block themselves.
* Only one active block relationship may exist between the same blocking user and blocked user.
* Blocking another user does not delete either user’s content or grant moderation authority.
* Removing a block permanently deletes the block relationship.

---

## 1.7 User Mutes

* **Purpose:** Allow an authenticated user to hide another user’s community activity without applying a full block or moderation action.
* **Ownership & Source:** Created and removed directly by the user performing the mute.
* **Lifecycle & Deletion:** `Active` -> `Permanently Deleted`. Unmuting removes the relationship.

### Information to Store

| Field | Required/Optional | Source |
|---|---|---|
| Muting user | Required | Internal |
| Muted user | Required | User-selected |
| Creation timestamp | Required | Internal |

### Information to Display

* **Private Account View / Settings:** A list of users currently muted by the account owner.
* Mute relationships must not be displayed publicly.

### Data Attributes

* **Searchable Fields:** None in public search.
* **Media / File Attachments:** None.
* A user cannot mute themselves.
* Only one active mute relationship may exist between the same muting user and muted user.
* Muting affects only the requesting user’s experience and does not hide or delete the muted user’s records for other users.
* Muting another user does not grant moderation authority.
* Removing a mute permanently deletes the mute relationship.

---

## 2. Sports
* **Purpose:** Catalog the controlled selection of sports disciplines supported in Version 1.
* **Ownership & Source:** Manually managed exclusively by system administrators.
* **Lifecycle & Deletion:** `Draft` -> `Active` -> `Inactive` -> `Archived`.

### Information to Store
| Field | Required/Optional | Source |
|---|---|---|
| Unique sport identifier | Required | Internal |
| Sport name | Required | Admin-entered |
| General description | Optional | Admin-entered |
| Representative icon | Required | Admin-entered |
| Cover / banner image | Optional | Admin-entered |
| Status (active/inactive) | Required | Internal |

### Information to Display
* **Mobile App:** Sport name, icon, and banner in navigation filters and main sections.

### Data Attributes
* **Searchable Fields:** Sport name.
* **Media / File Attachments:** Representative icon, banner image.

---

## 3. Leagues
* **Purpose:** Represent verified leagues or championships within a specific sport for Version 1.
* **Ownership & Source:** System administrators / External sports data providers.
* **Lifecycle & Deletion:** `Upcoming` -> `Ongoing` -> `Finished` -> `Archived`.

### Information to Store
| Field | Required/Optional | Source |
|---|---|---|
| Unique league identifier | Required | Internal |
| Associated sport | Required | Admin-entered |
| League name | Required | Admin-entered / External |
| Season or corresponding year | Required | Admin-entered / External |
| Region or category | Optional | Admin-entered / External |
| Official logo | Required | Admin-entered / External |
| Description | Optional | Admin-entered |

### Information to Display
* **Mobile App:** Logo, league name, current season, and associated sport in game listings.

### Data Attributes
* **Searchable Fields:** League name, season, region.
* **Media / File Attachments:** Official league logo.

---

## 4. Teams

* **Purpose:** Store the stable identity and public profile of teams or clubs that participate in supported league seasons.
* **Ownership & Source:** Created and maintained by authorized Administrators using manually entered or verified external information.
* **Lifecycle & Deletion:** `Active` -> `Inactive` -> `Archived`.

### Information to Store

| Field | Required/Optional | Source |
|---|---|---|
| Unique team identifier | Required | Internal |
| Official team name | Required | Administrator-entered / External |
| Short name or abbreviation | Optional | Administrator-entered / External |
| City or home location | Required | Administrator-entered / External |
| Home venue or stadium | Optional | Administrator-entered / External |
| Official logo | Required | Administrator-entered / External |
| Current team status | Required; defaults to `Active` | Internal |
| Archive timestamp | Optional; required when archived | Internal |
| Creation and update timestamps | Required | Internal |

### Information to Display

* **Mobile App:** Official logo, full name, abbreviation, home city, home venue when available, current status, and the supported leagues or seasons in which the team participates.

### Data Attributes

* **Searchable Fields:** Official team name, short name, and city.
* **Media / File Attachments:** Official team logo.
* The stable team identity must be stored only once and must not be duplicated when the team participates in another season or competition.
* League participation is stored separately through the league-team participation requirements below.

---

## 4.1 League-Team Participation

* **Purpose:** Record which teams participate in each supported league-season record without duplicating the team’s stable identity.
* **Ownership & Source:** Created and maintained by authorized Administrators using manually entered or verified external information.
* **Lifecycle & Deletion:** `Active Participation` -> `Ended Participation`. Participation history may be retained when required for game, schedule, or historical relationships.

### Information to Store

| Field | Required/Optional | Source |
|---|---|---|
| Associated league-season | Required | Administrator-selected / External |
| Associated team | Required | Administrator-selected / External |
| Participation start timestamp | Required | Internal |
| Participation end timestamp | Optional | Internal |

### Information to Display

* **Mobile App:** Teams participating in a league season and the league seasons associated with a team.
* **Web Admin Panel:** Current and ended team-participation relationships.

### Data Attributes

* **Searchable Fields:** Team and league-season within authorized administrative tools.
* **Media / File Attachments:** None.
* A team may participate in one or more league-season records.
* The same team and league-season combination must not have duplicate active participation records.
* Both the home team and away team assigned to a game must participate in that game’s selected league season.
* Ending a participation relationship must not delete the stable team record.
* Historical participation may be retained when games or other dependent records reference the relationship.

---
## 5. Athletes

* **Purpose:** Record basic player profiles for match roster identification.
* **Ownership & Source:** Created and maintained by authorized Administrators using manually entered or verified external information.
* **Lifecycle & Deletion:** `Active` -> `Inactive` -> `Archived`.

### Information to Store

| Field | Required/Optional | Source |
|---|---|---|
| Unique athlete identifier | Required | Internal |
| First and last name | Required | Administrator-entered / External |
| Currently assigned team | Required | Administrator-entered / External |
| Playing position | Required | Administrator-entered / External |
| Jersey number | Optional | Administrator-entered / External |
| Official athlete photo | Optional | Administrator-entered / External |
| Current athlete status | Required; defaults to `Active` | Internal |
| Archive timestamp | Optional; required when archived | Internal |
| Creation and update timestamps | Required | Internal |

### Information to Display

* **Mobile App:** Photo, full name, jersey number, position, current team, and current status in athlete profiles and basic match rosters.

### Data Attributes

* **Searchable Fields:** First name, last name, and position.
* **Media / File Attachments:** Official athlete photo.
* The MVP stores only the athlete’s currently assigned team.
* Historical roster and team-assignment records are deferred until they are required by a future approved feature.

---

## 5.1 Approved Data Sources

* **Purpose:** Catalog the official or otherwise approved sources used to verify sports information and authorized published content.
* **Ownership & Source:** Created and maintained by authorized Administrators. Each record represents the provenance of information and does not automatically represent an active external integration.
* **Lifecycle & Deletion:** `Pending Approval` -> `Approved` -> `Not Approved`. Source records should be retained when they are referenced by verification or audit records.

### Information to Store

| Field | Required/Optional | Source |
|---|---|---|
| Unique data-source identifier | Required | Internal |
| Source or organization name | Required | Administrator-entered |
| Source type (`official federation`, `official league`, `official team`, `approved provider`, or `other verified`) | Required | Administrator-selected |
| Official homepage or feed URL | Optional | Administrator-entered |
| Approval status | Required; defaults to not approved | Internal / Administrator-selected |
| Internal provenance, permission, or usage notes | Optional | Administrator-entered |
| Creation and update timestamps | Required | Internal |

### Information to Display

* **Web Admin Panel:** Source name, type, official URL, approval status, and internal notes.
* Public product views may display approved attribution when required, but must not expose internal notes or administrative approval details.

### Data Attributes

* **Searchable Fields:** Source name and approval status within authorized administrative tools.
* **Media / File Attachments:** None.
* External provider identifiers are not required until a specific provider and integration are formally approved.
* A source record documents provenance and approval; it does not by itself confirm that information was imported automatically.

---

## 5.2 Data Verifications

* **Purpose:** Record which approved source was used to verify a specific sports record or authorized published post.
* **Ownership & Source:** Created by an authorized Editor operating within an assigned scope or by an Administrator.
* **Lifecycle & Deletion:** `Recorded` -> `Retained`. Verification records must remain available while the verified information or related audit evidence is retained.

### Information to Store

| Field | Required/Optional | Source |
|---|---|---|
| Unique verification identifier | Required | Internal |
| Approved data source | Required | Administrator- or Editor-selected |
| Verified target type | Required | Internal / Staff-selected |
| Verified target identifier | Required | Internal |
| Direct source-reference URL | Optional | Staff-entered |
| Verifying staff user | Required | Internal |
| Verification timestamp | Required | Internal |
| Internal verification notes | Optional | Staff-entered |
| Creation timestamp | Required | Internal |

### Supported Verification Targets

A verification record must reference exactly one of the following:

* Sport
* League
* Team
* Athlete
* Game
* Score
* Post or article

### Information to Display

* **Web Admin Panel:** Verified target, approved source, source-reference URL, verifying staff user, verification timestamp, and internal notes.
* Internal verification notes and staff information must not be exposed through ordinary public endpoints.

### Data Attributes

* **Searchable Fields:** Data source, verifying staff user, target type, and verification date within authorized administrative tools.
* **Media / File Attachments:** None.
* More than one verification record may exist for the same target when multiple approved sources are used.
* The verifying staff user must have authorization for the affected sports entity or content scope.
* The verified target must match the target type recorded for the verification.
* Verification records preserve provenance and must not be silently replaced when a newer verification is added.

---

## 6. Games
* **Purpose:** Represent scheduled sports games or events between two teams.
* **Ownership & Source:** System administrators / Verified data sources.
* **Internal Lifecycle:** `Scheduled` -> `In Progress` -> `Finished`, with `Postponed` and `Canceled` when applicable. During the MVP, `In Progress` is internal only and is not displayed in the mobile interface.

### Information to Store
| Field | Required/Optional | Source |
|---|---|---|
| Unique game identifier | Required | Internal |
| Associated league | Required | Admin-entered |
| Home team | Required | Admin-entered |
| Away team | Required | Admin-entered |
| Scheduled start date and time | Required | Admin-entered / External |
| Current game status | Required | Internal |
| Venue or facility location | Optional | Admin-entered / External |
| Broadcast channel / streaming platform details | Optional | Admin-entered / External |
| Match cover image | Optional | Admin-entered |

### Information to Display
* **Mobile App:** Match card (Home Team vs. Away Team), start time, location, status, and broadcast channel.

### Data Attributes
* **Searchable Fields:** Participating team names, venue or location.
* **Media / File Attachments:** Match cover image.

---

## 7. Scores

* **Purpose:** Store the latest verified score and final result for a supported game. Continuous live scoring is excluded from the approved MVP.
* **Ownership & Source:** Created and updated by an authorized Editor within the applicable sports-entity scope or by an Administrator using verified sports information.
* **Lifecycle & Deletion:** `Pending` -> `Updated` -> `Final`. A finalized score may be reopened only through an authorized correction workflow that records the reason and source.

### Information to Store

| Field | Required/Optional | Source |
|---|---|---|
| Unique score-record identifier | Required | Internal |
| Associated game | Required | Internal |
| Home-team score | Required | Administrator- or Editor-entered / External verified source |
| Away-team score | Required | Administrator- or Editor-entered / External verified source |
| Score status (`pending`, `updated`, or `final`) | Required | Internal / Staff-selected |
| Final result type (`home_win`, `away_win`, `draw`, or `no_contest`) | Optional before finalization; required when final | Staff-selected / Internal |
| Winning-team identifier | Optional; required only for `home_win` or `away_win` | Internal |
| Basic score breakdown by period | Optional; not required for the MVP | Staff-entered / External verified source |
| Last-update timestamp | Required | Internal |
| Creation timestamp | Required | Internal |

### Information to Display

* **Mobile App:** Verified final home-team score, away-team score, result type, winning-team highlight when the result is a home or away win, and the last-update timestamp when applicable.
* For a `draw` or `no_contest`, no winning team is displayed.
* Pending or periodically updated scores are not required for public MVP display.
* Live score updates, live box scores, advanced statistics, and period-by-period score presentation are Post-MVP.

### Data Attributes

* **Searchable Fields:** None; scores are retrieved through their associated game.
* **Media / File Attachments:** None.
* One game may have no score record or one current score record.
* Home-team and away-team scores must be nonnegative integers.
* A final score must include exactly one valid result type.
* For `home_win`, the winning-team identifier must match the game’s home team.
* For `away_win`, the winning-team identifier must match the game’s away team.
* For `draw` and `no_contest`, the winning-team identifier must be empty.
* The winning-team identifier, when present, must reference one of the two teams participating in the associated game.
* Period-by-period score data is optional and must not block MVP implementation.
* Reopening or correcting a finalized score requires an authorized staff member, a documented reason, verified source information, and an audit record.

---

## 8. Posts

* **Purpose:** Store official news, articles, announcements, and sports updates published on behalf of TDA or an approved sports entity.
* **Ownership & Source:** Created by an authorized Editor within an assigned sports-entity scope or by an Administrator. Registered Users and Moderators cannot create general posts or articles.
* **Lifecycle & Deletion:** `Draft` -> `Scheduled` or `Published` -> `Archived`, `Hidden`, or `Soft-Deleted`.

### Information to Store

| Field | Required/Optional | Source |
|---|---|---|
| Unique post identifier | Required | Internal |
| Authorized staff author | Required | Internal |
| Content type (`post` or `article`) | Required | Staff-selected |
| Title | Required for articles / Optional for short posts | Staff-entered |
| Excerpt | Optional | Staff-entered |
| Content body | Required | Staff-entered |
| Official cover media | Optional | Authorized staff-provided |
| Related sports entities, game, or community | Optional | Staff-selected |
| Publication or scheduled-publication date and time | Required when applicable | Internal / Staff-selected |
| Visibility and lifecycle status | Required | Internal |

### Information to Display

* **Mobile App:** Official author information, publication timestamp, title or excerpt when applicable, content body, official cover media, and related sports-entity, game, or community tags.

### Data Attributes

* **Searchable Fields:** Title, excerpt, and content.
* **Media / File Attachments:** Official cover media only.
* **MVP Exclusion:** General user-created posts, user-created articles, and user-uploaded community media are not supported.


## 8.1 Comments and Replies

* **Purpose:** Allow authenticated users to participate through text comments and basic replies on supported published content.
* **Ownership & Source:** Created by the authenticated user who submits the comment or reply.
* **Lifecycle & Deletion:** `Active` -> `Hidden` or `Soft-Deleted`.

### Information to Store

| Field | Required/Optional | Source |
|---|---|---|
| Unique comment identifier | Required | Internal |
| Associated post or article | Required | Internal |
| Author user | Required | Internal |
| Parent comment identifier | Optional | User-selected when submitting a reply |
| Comment text | Required | User-provided |
| Status | Required | Internal |
| Creation and update timestamps | Required | Internal |
| Soft-deletion timestamp | Optional | Internal |

### Information to Display

* **Mobile App:** Author display information, comment text, timestamp, and basic reply relationship.
* After account deletion, retained comments or replies display the author as **Deleted User**.

### Data Attributes

* **Searchable Fields:** Excluded from public MVP search.
* **Media / File Attachments:** None.
* **Reply Depth:** Version 1 supports one basic reply level.
* **Moderation:** Comments and replies may be reported and reviewed manually by an assigned Moderator or an Administrator.

---

## 8.2 Post Likes

* **Purpose:** Allow authenticated users to express basic engagement by liking an approved published post or article.
* **Ownership & Source:** Created and removed directly by the authenticated user performing the action.
* **Lifecycle & Deletion:** `Active` -> `Permanently Deleted`. Removing a like deletes the relationship between the user and the post.

### Information to Store

| Field | Required/Optional | Source |
|---|---|---|
| Associated post or article | Required | Internal |
| Associated user | Required | Internal |
| Creation timestamp | Required | Internal |

### Information to Display

* **Mobile App:** Total like count for the post or article and whether the authenticated viewer has liked it.
* Individual like relationships and the identities of users who liked a post are not required for public display in the MVP.

### Data Attributes

* **Searchable Fields:** None.
* **Media / File Attachments:** None.
* A user may like the same post or article only once.
* Liking an already liked post must not create a duplicate relationship.
* Removing a like permanently deletes the relationship.
* Likes may be created only for supported published posts or articles.
* A like does not grant ownership, editing permissions, or moderation authority over the post.

---

## 8.3 Post-Community Associations and Pinned Announcements

* **Purpose:** Connect an approved post or article to one or more official communities and allow eligible announcements to be pinned within a community.
* **Ownership & Source:** Community associations are created by authorized publishing staff. Pinning and unpinning are performed by an authorized staff user with permission for the affected community and content.
* **Lifecycle & Deletion:** `Associated` -> `Pinned` or `Unpinned` -> `Removed`. Removing an association deletes the relationship without deleting the post or community.

### Information to Store

| Field | Required/Optional | Source |
|---|---|---|
| Associated post or article | Required | Internal / Staff-selected |
| Associated community | Required | Internal / Staff-selected |
| Pinned status | Required; defaults to `false` | Internal / Staff-selected |
| Pin timestamp | Optional; required while pinned | Internal |
| Staff user who pinned the announcement | Optional; required while pinned | Internal |

### Information to Display

* **Mobile App:** Published posts and articles associated with the community.
* **Community View:** Pinned official announcements displayed according to the approved community layout.
* Ordinary public responses do not need to display the staff user who performed the pin.

### Data Attributes

* **Searchable Fields:** Post and community within authorized administrative tools.
* **Media / File Attachments:** None beyond the official media already stored with the associated post or article.
* The same post and community combination must not be duplicated.
* A post or article may be associated with more than one community.
* Only eligible published posts or articles may be displayed or pinned publicly.
* Pinning requires the pin timestamp and the authorized staff user who performed the action.
* Unpinning clears the active pin state without deleting the post-community association.
* Removing the association must not delete the underlying post, article, or community.
* Pinning and unpinning must respect the applicable role and community-scope permissions.
* Required pinning actions must be included in administrative audit history.
* Pinned announcements do not create threaded messages or enable user-uploaded community media.

---

## 9. Favorites
* **Purpose:** Save user preferences to personalize their feed and notification alerts.
* **Ownership & Source:** Created and managed by the end user.
* **Lifecycle & Deletion:** `Active` -> `Permanently Deleted` (removed when unmarking the preference).

### Information to Store
| Field | Required/Optional | Source |
|---|---|---|
| Unique preference identifier | Required | Internal |
| Associated user | Required | Internal |
| Marked entity type (Team, League, Athlete, or Sport) | Required | User-selected |
| Preferred item identifier | Required | User-selected |
| Notification preference toggle | Required (defaulted) | User-configurable |
| Date added | Required | Internal |

### Information to Display
* **Mobile App:** Saved favorites list in settings and toggled favorite icons across the UI.

### Data Attributes
* **Searchable Fields:** N/A.
* **Media / File Attachments:** None.

---

## 10. Communities
* **Purpose:** Pre-defined public discussion channels focused on specific leagues, teams, or sports.
* **Ownership & Source:** Created and managed exclusively by platform administrators.
* **Lifecycle & Deletion:** `Active` -> `Restricted` -> `Archived`.

### Information to Store
| Field | Required/Optional | Source |
|---|---|---|
| Unique community identifier | Required | Internal |
| Community name | Required | Admin-entered |
| Short URL slug | Required | Admin-entered |
| Description and guidelines | Optional | Admin-entered |
| Avatar / emblem image | Optional | Admin-entered |
| Banner image | Optional | Admin-entered |
| Linked team, league, or sport | Optional | Admin-selected |

### Information to Display
* **Mobile App:** Community header (banner, name, description) and internal public chat feed.

### Data Attributes
* **Searchable Fields:** Community name, description.
* **Media / File Attachments:** Avatar image, banner image.

---

## 10.1 Community Memberships

* **Purpose:** Record the relationship between authenticated users and official communities so the platform can identify joined communities, validate participation, and apply community-specific moderation states.
* **Ownership & Source:** Created when an authenticated user joins a community. Membership status and moderation-related changes may be updated by the user, an assigned Moderator, or an Administrator according to their permissions.
* **Lifecycle & Deletion:** `Active` -> `Muted`, `Banned`, or `Left`. Membership records are retained when needed to preserve participation and moderation history.

### Information to Store

| Field | Required/Optional | Source |
|---|---|---|
| Associated community | Required | Internal |
| Associated user | Required | Internal |
| Membership role (`member`, `moderator`, or `admin`) | Required; defaults to `member` | Internal / Administrator-assigned |
| Membership status (`active`, `muted`, `banned`, or `left`) | Required; defaults to `active` | Internal / Moderation action |
| Join timestamp | Required | Internal |
| Leave timestamp | Optional; required when the membership is left | Internal |
| Last update timestamp | Required | Internal |

### Information to Display

* **Mobile App:** Whether the authenticated user has joined the community and their current membership status.
* **Private Account View:** The user’s joined communities.
* **Web Admin Panel:** Membership role, status, join date, leave date, and authorized moderation controls.
* Membership information for other users must be limited to what is required for public community participation and moderation.

### Data Attributes

* **Searchable Fields:** User and community within authorized administrative tools.
* **Media / File Attachments:** None.
* Only one membership record may exist for the same user and community.
* Joining or rejoining a community sets the membership to `active` according to approved participation rules.
* Leaving a community records the membership as `left` rather than erasing required participation or moderation history.
* Only users with an active membership may create community messages.
* Muted or banned members must not be allowed to send new community messages.
* A membership role does not replace the platform staff role and scope requirements defined in the staff authorization model.
* Moderation changes to membership status must be performed only by an assigned Moderator or Administrator and must be recorded in the applicable moderation and audit history.

---

## 11. Messages
* **Purpose:** Text-only public chat interactions within official admin-created communities.
* **Ownership & Source:** Generated by the sending user.
* **Lifecycle & Deletion:** `Sent` -> `Soft-Deleted`.

### Information to Store
| Field | Required/Optional | Source |
|---|---|---|
| Unique message identifier | Required | Internal |
| Sender user | Required | Internal |
| Target community | Required | Internal |
| Message text | Required | User-provided |
| Sent timestamp | Required | Internal |


### Information to Display
* **Mobile App:** Flat chat list with sender username/avatar, message text, and sent timestamp.

### Data Attributes
* **Searchable Fields:** N/A (message history search is excluded for V1).
* **Media / File Attachments:** None (media uploads in community chat are excluded for V1).

### Moderation Behavior

- Eligible authenticated community members may create text-only messages.
- Messages may be hidden or soft-deleted while the underlying record is preserved for review.
- Moderation is performed manually by a Moderator assigned to the community or by an Administrator.
- Automated AI moderation is not included in Version 1 and remains Post-MVP.

---

## 12. Notifications
* **Purpose:** Basic system alerts and push notifications for verified final scores and official announcements. Live score-update notifications are Post-MVP.
* **Ownership & Source:** Automatically generated by the backend system.
* **Lifecycle & Deletion:** `Unread` -> `Read` -> `Permanently Purged` (after expiration).

### Information to Store
| Field | Required/Optional | Source |
|---|---|---|
| Unique notification identifier | Required | Internal |
| Target user | Required | Internal |
| Notice title | Required | Internal (system-generated) |
| Detailed message | Required | Internal (system-generated) |
| Notification type (e.g., final score, official announcement; `score_update` reserved for Post-MVP) | Required | Internal |
| Read status (read / unread) | Required | Internal |
| Deep link route | Optional | Internal |
| Generation timestamp | Required | Internal |

### Information to Display
* **Mobile App:** Notification list with title, description, time elapsed, and unread indicator.

### Data Attributes
* **Searchable Fields:** Title, notification body.
* **Media / File Attachments:** None.

---

## 13. Reports
* **Purpose:** Manage user-submitted reports involving posts, comments, community messages, or users.
* **Ownership & Source:** Submitted by authenticated users and processed manually by a Moderator within an assigned community or by an Administrator.
* **Lifecycle & Deletion:** `Pending` -> `In Review` -> `Resolved` or `Dismissed`.

### Information to Store
| Field | Required/Optional | Source |
|---|---|---|
| Unique report identifier | Required | Internal |
| Reporting user | Required | Internal |
| Reported entity type (Post, Comment, Message, or User) | Required | User-selected |
| Reported entity identifier | Required | Internal |
| Reason for report | Required | User-provided |
| Current review status | Required | Internal |
| Admin internal notes | Optional | Admin-entered |
| Resolving staff user | Optional (required when resolved or dismissed) | Internal |
| Creation timestamp and resolution timestamp | Required (creation) / Optional (resolution, until resolved) | Internal |

### Information to Display
* **Web Admin Panel:** Moderation queue displaying reporter details, reported content snippet, reason, status, and action buttons.

### Data Attributes
* **Searchable Fields:** Reason for report, moderation notes.
* **Media / File Attachments:** None.

---

## 13.1 User Warnings

* **Purpose:** Preserve formal warnings issued to users as the result of an authorized moderation decision.
* **Ownership & Source:** Created by a Moderator operating within an assigned community scope or by an Administrator. A warning may be associated with a moderation report.
* **Lifecycle & Deletion:** `Active` -> `Revoked`. Warning records are retained as moderation history even when revoked.

### Information to Store

| Field | Required/Optional | Source |
|---|---|---|
| Unique warning identifier | Required | Internal |
| Warned user | Required | Internal |
| Associated community | Optional; required for a community-scoped warning | Internal |
| Issuing staff user | Required | Internal |
| Associated report | Optional | Internal |
| Warning reason | Required | Staff-entered |
| Creation timestamp | Required | Internal |
| Revocation timestamp | Optional; required when revoked | Internal |
| Revoking staff user | Optional; required when revoked | Internal |

### Information to Display

* **Web Admin Panel:** Warned user, issuing staff member, affected community when applicable, reason, associated report, creation date, and revocation status.
* Warning records are not required for ordinary public display.

### Data Attributes

* **Searchable Fields:** Warned user, associated community, issuing staff member, and creation date within authorized administrative tools.
* **Media / File Attachments:** None.
* A warning must be based on a documented policy reason.
* A warning does not automatically create a strike count, account suspension, or account-deletion action.
* Only authorized staff may issue or revoke a warning.
* Revoking a warning must preserve the original record and identify the revoking staff member.

---

## 13.2 Report Actions

* **Purpose:** Preserve the complete chronological history of actions performed while reviewing and resolving a moderation report.
* **Ownership & Source:** Automatically recorded when an authorized Moderator or Administrator performs an action on a report.
* **Lifecycle & Deletion:** `Recorded` -> `Retained`. Report-action records are append-only and must not be edited or deleted through normal staff controls.

### Information to Store

| Field | Required/Optional | Source |
|---|---|---|
| Unique report-action identifier | Required | Internal |
| Associated report | Required | Internal |
| Acting staff user | Required | Internal |
| Action type | Required | Internal / Staff-selected |
| Previous report status | Optional | Internal |
| New report status | Required | Internal |
| Action reason | Required | Staff-entered |
| Creation timestamp | Required | Internal |

### Supported Action Types

Report history may record actions including:

* Assignment
* Review
* Warning
* Content hiding
* Content restoration
* User muting
* Escalation
* Resolution
* Dismissal
* Reopening

### Information to Display

* **Web Admin Panel:** Chronological action history showing the action, acting staff user, status change, reason, and timestamp.
* Report-action history must not be exposed through ordinary public endpoints.

### Data Attributes

* **Searchable Fields:** Report, acting staff user, action type, and date within authorized administrative tools.
* **Media / File Attachments:** None.
* A report action must identify the resulting report status.
* Staff actions must be limited by the actor’s role and assigned scope.
* Existing history records must not be overwritten when a new action occurs.
* A staff member must not review or approve an action when a documented conflict of interest applies.

---

## 13.3 Moderation Escalations

* **Purpose:** Track moderation reports that require review by another authorized staff member or a higher level of authority.
* **Ownership & Source:** Created by an authorized Moderator or Administrator when a report cannot be completed within the current staff member’s authority or scope.
* **Lifecycle & Deletion:** `Open` -> `Reviewing` -> `Resolved`, with `Cancelled` when applicable. Escalation history must be retained.

### Information to Store

| Field | Required/Optional | Source |
|---|---|---|
| Unique escalation identifier | Required | Internal |
| Associated report | Required | Internal |
| Escalating staff user | Required | Internal |
| Assigned reviewing staff user | Optional | Internal |
| Escalation reason | Required | Staff-entered |
| Current escalation status | Required | Internal |
| Creation timestamp | Required | Internal |
| Resolution timestamp | Optional; required when resolved | Internal |
| Resolving staff user | Optional; required when resolved | Internal |

### Information to Display

* **Web Admin Panel:** Associated report, escalation reason, current status, escalating staff member, assigned reviewer, and resolution information.
* Escalation records are not required for public display.

### Data Attributes

* **Searchable Fields:** Report, escalation status, assigned reviewer, and creation date within authorized administrative tools.
* **Media / File Attachments:** None.
* An escalation must remain connected to its original report.
* Resolution must identify the authorized staff member who completed the review.
* A staff member must not approve or resolve an escalation involving their own report, content, or previous moderation decision.
* Cancelling or resolving an escalation must preserve the escalation record.

---

## 13.4 Audit Events

* **Purpose:** Preserve immutable records of security-sensitive, authorization, publishing, sports-data, account-management, and moderation activities.
* **Ownership & Source:** Automatically generated by the backend when an approved staff action, protected operation, or automated process occurs.
* **Lifecycle & Deletion:** `Recorded` -> `Retained`. Audit events are append-only and must not be updated or deleted through ordinary application or staff operations.

### Information to Store

| Field | Required/Optional | Source |
|---|---|---|
| Unique audit-event identifier | Required | Internal |
| Acting user | Optional; omitted only for an approved automated process | Internal |
| Stable action identifier | Required | Internal |
| Target record type | Required | Internal |
| Target record identifier | Optional | Internal |
| Affected scope type | Optional | Internal |
| Affected scope identifier | Optional | Internal |
| Action reason | Optional; required when the protected action requires justification | Staff-entered / Internal |
| Result (`succeeded`, `denied`, or `failed`) | Required | Internal |
| Non-secret supporting metadata | Required; may be empty | Internal |
| Event timestamp | Required | Internal |

### Activities Requiring Audit Records

Audit events must be recorded for actions including:

* Publishing, scheduling, editing, archiving, restoring, or deleting official content.
* Creating or modifying verified sports data.
* Accessing protected administrative information.
* Issuing warnings and performing moderation actions.
* Resolving, dismissing, reopening, or escalating reports.
* Processing account-deletion requests.
* Creating, changing, approving, or revoking staff roles and scopes.
* Successful, denied, and failed protected administrative operations when operationally relevant.

### Information to Display

* **Authorized Audit View:** Actor, action, target, affected scope, reason, result, timestamp, and approved supporting context.
* Audit events must not be exposed through public product endpoints.
* Secrets, authentication tokens, passwords, raw push tokens, and unnecessary personal data must not be stored in audit metadata.

### Data Attributes

* **Searchable Fields:** Actor, action, target type, target identifier, affected scope, result, and timestamp within authorized audit tools.
* **Media / File Attachments:** None.
* Audit records must be immutable after creation.
* An approved automated process may generate an event without an acting user.
* Database and application permissions must prevent ordinary users and staff from modifying or deleting audit history.
* Audit retention must support security investigations, administrative accountability, and moderation evidence.