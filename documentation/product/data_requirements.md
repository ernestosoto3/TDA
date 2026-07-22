# TDA Product Data Requirements (Version 1 / MVP)

## 1. Users
* **Purpose:** Represent registered users on the platform (fans, community members, and administrators).
* **Ownership & Source:** Created directly by the user upon registration.
* **Lifecycle & Deletion:** `Active` -> `Suspended` -> `Soft-Deleted` (grace period before permanent purge).

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
* **Purpose:** Store basic information for teams or clubs participating in supported leagues.
* **Ownership & Source:** System administrators / External data providers.
* **Lifecycle & Deletion:** `Active` -> `Inactive` -> `Archived`.

### Information to Store
| Field | Required/Optional | Source |
|---|---|---|
| Unique team identifier | Required | Internal |
| Associated league | Required | Admin-entered |
| Official team name | Required | Admin-entered / External |
| Short name or abbreviation | Optional | Admin-entered / External |
| City or home location | Required | Admin-entered / External |
| Home venue / stadium | Optional | Admin-entered / External |
| Official logo | Required | Admin-entered / External |

### Information to Display
* **Mobile App:** Logo, full name, abbreviation, home city, and competing league.

### Data Attributes
* **Searchable Fields:** Team name, abbreviation, city.
* **Media / File Attachments:** Official team logo.

---

## 5. Athletes
* **Purpose:** Record basic player profiles for match roster identification.
* **Ownership & Source:** System administrators / External data providers.
* **Lifecycle & Deletion:** `Active` -> `Inactive` -> `Archived`.

### Information to Store
| Field | Required/Optional | Source |
|---|---|---|
| Unique athlete identifier | Required | Internal |
| First and last name | Required | Admin-entered / External |
| Currently assigned team | Required | Admin-entered / External |
| Playing position | Required | Admin-entered / External |
| Jersey number | Optional | Admin-entered / External |
| Official athlete photo | Optional | Admin-entered / External |

### Information to Display
* **Mobile App:** Photo, full name, jersey number, position, and current team in basic match rosters.

### Data Attributes
* **Searchable Fields:** First name, last name, position.
* **Media / File Attachments:** Official athlete photo.

---

## 6. Games
* **Purpose:** Represent scheduled sports games or events between two teams.
* **Ownership & Source:** System administrators / Verified data sources.
* **Lifecycle & Deletion:** `Scheduled` -> `In Progress` -> `Finished` -> `Postponed` -> `Canceled`.

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
* **Purpose:** Record periodically updated game results (non-continuous live streaming for V1).
* **Ownership & Source:** System administrators / Verified data updates.
* **Lifecycle & Deletion:** `Pending` -> `Updated` -> `Final Result`.

### Information to Store
| Field | Required/Optional | Source |
|---|---|---|
| Unique score record identifier | Required | Internal |
| Associated game | Required | Internal |
| Home team score | Required | Admin-entered / External |
| Away team score | Required | Admin-entered / External |
| Basic score breakdown by period (e.g., quarters or halves) | Optional | Admin-entered / External |
| Winning team identifier | Required (once final) | Internal (derived) |
| Last update timestamp | Required | Internal |

### Information to Display
* **Mobile App:** Latest score update, basic period breakdown, and winning team highlight.

### Data Attributes
* **Searchable Fields:** N/A (queried via the associated game).
* **Media / File Attachments:** None.

---

## 8. Posts
* **Purpose:** Admin-curated news, official updates, or moderated community discussions.
* **Ownership & Source:** System administrators / Authorized users.
* **Lifecycle & Deletion:** `Draft` -> `Published` -> `Hidden` -> `Soft-Deleted`.

### Information to Store
**Information to Store**
| Field | Required/Optional | Source |
|---|---|---|
| Unique post identifier | Required | Internal |
| Author user | Required | Internal |
| Content text | Required | Author-provided |
| Attached cover media (images/videos provided officially) | Optional | Author-provided |
| Related community or game | Optional | Author-selected |
| Publication date and time | Required | Internal |
| Visibility status | Required | Internal |


### Information to Display
* **Mobile App:** Post header, timestamp, post text, official cover media, and associated game/community tag.

### Data Attributes
* **Searchable Fields:** Content text.
* **Media / File Attachments:** Cover media.

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

---

## 12. Notifications
* **Purpose:** Basic system alerts and push notifications for score updates and official announcements.
* **Ownership & Source:** Automatically generated by the backend system.
* **Lifecycle & Deletion:** `Unread` -> `Read` -> `Permanently Purged` (after expiration).

### Information to Store
| Field | Required/Optional | Source |
|---|---|---|
| Unique notification identifier | Required | Internal |
| Target user | Required | Internal |
| Notice title | Required | Internal (system-generated) |
| Detailed message | Required | Internal (system-generated) |
| Notification type (e.g., score update, system announcement) | Required | Internal |
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
* **Purpose:** Manage user reports for offensive messages or content moderation.
* **Ownership & Source:** Submitted by users; processed manually by administrators.
* **Lifecycle & Deletion:** `Pending` -> `In Review` -> `Resolved` -> `Dismissed`.

### Information to Store
| Field | Required/Optional | Source |
|---|---|---|
| Unique report identifier | Required | Internal |
| Reporting user | Required | Internal |
| Reported entity type (Post, Message, User) | Required | User-selected |
| Reported entity identifier | Required | Internal |
| Reason for report | Required | User-provided |
| Current review status | Required | Internal |
| Admin internal notes | Optional | Admin-entered |
| Resolving administrator | Optional (set on resolution) | Internal |
| Creation timestamp and resolution timestamp | Required (creation) / Optional (resolution, until resolved) | Internal |

### Information to Display
* **Web Admin Panel:** Moderation queue displaying reporter details, reported content snippet, reason, status, and action buttons.

### Data Attributes
* **Searchable Fields:** Reason for report, moderation notes.
* **Media / File Attachments:** None.