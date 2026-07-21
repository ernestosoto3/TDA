# TDA Product Data Requirements (Version 1 / MVP)

## 1. Users
* **Purpose:** Represent registered users on the platform (fans, community members, and administrators).
* **Ownership & Source:** Created directly by the user upon registration.
* **Lifecycle & Deletion:** `Active` -> `Suspended` -> `Soft-Deleted` (grace period before permanent purge).

### Information to Store
* Unique user identifier
* Email address
* Username
* First and last name
* Profile photo (optional)
* Account status (active, suspended, etc.)
* External authentication reference (Clerk ID)
* Registration timestamp

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
* Unique sport identifier
* Sport name
* General description
* Representative icon
* Cover / banner image
* Status (active/inactive)

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
* Unique league identifier
* Associated sport
* League name
* Season or corresponding year
* Region or category
* Official logo
* Description

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
* Unique team identifier
* Associated league
* Official team name
* Short name or abbreviation
* City or home location
* Home venue / stadium
* Official logo

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
* Unique athlete identifier
* First and last name
* Currently assigned team
* Playing position
* Jersey number
* Official athlete photo

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
* Unique game identifier
* Associated league
* Home team
* Away team
* Scheduled start date and time
* Current game status
* Venue or facility location
* Broadcast channel / streaming platform details
* Match cover image

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
* Unique score record identifier
* Associated game
* Home team score
* Away team score
* Basic score breakdown by period (e.g., quarters or halves)
* Winning team identifier
* Last update timestamp

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
* Unique post identifier
* Author user
* Content text
* Attached cover media (images/videos provided officially)
* Related community or game (optional)
* Publication date and time
* Visibility status

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
* Unique preference identifier
* Associated user
* Marked entity type (Team, League, Athlete, or Sport)
* Preferred item identifier
* Notification preference toggle
* Date added

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
* Unique community identifier
* Community name
* Short URL slug
* Description and guidelines
* Avatar / emblem image
* Banner image
* Linked team, league, or sport

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
* Unique message identifier
* Sender user
* Target community
* Message text
* Sent timestamp

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
* Unique notification identifier
* Target user
* Notice title
* Detailed message
* Notification type (e.g., score update, system announcement)
* Read status (read / unread)
* Deep link route
* Generation timestamp

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
* Unique report identifier
* Reporting user
* Reported entity type (Post, Message, User)
* Reported entity identifier
* Reason for report
* Current review status
* Admin internal notes
* Resolving administrator
* Creation timestamp and resolution timestamp

### Information to Display
* **Web Admin Panel:** Moderation queue displaying reporter details, reported content snippet, reason, status, and action buttons.

### Data Attributes
* **Searchable Fields:** Reason for report, moderation notes.
* **Media / File Attachments:** None.