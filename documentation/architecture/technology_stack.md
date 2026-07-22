## Final Technology Stack

```text
Mobile
├── React Native
├── Expo
└── TypeScript

Backend
├── NestJS
└── Drizzle ORM

Database
└── PostgreSQL

Authentication
└── Clerk

Admin Panel
└── Protected web dashboard connected to the NestJS API

Storage
└── Cloudflare R2

Notifications
├── Expo Notifications
└── Firebase Cloud Messaging

Hosting
└── Railway

Search
└── PostgreSQL Full-Text Search

Possible Future Additions
├── Redis
├── BullMQ
└── AWS
```

---

## Mobile Application

The mobile application will be built using:

- **React Native**
- **Expo**
- **TypeScript**

React Native will allow the application to support both iOS and Android using one shared codebase.

Expo will simplify development, testing, native configuration, application builds, and access to mobile features such as notifications.

TypeScript will provide static type checking and help keep the code organized and maintainable as the application grows.

---

## Backend

The backend will be built using **NestJS**.

NestJS will handle the application logic and provide the API used by the mobile application and admin panel.

The backend will be responsible for features such as:

- Users
- Teams
- Leagues
- Players
- Schedules
- Games
- Scores
- News
- Posts
- Notifications
- Administrative actions

NestJS was selected because it provides a structured and modular architecture that is suitable for a growing application.

---

## Database

The application will use **PostgreSQL** as its primary database.

PostgreSQL will store information such as:

- User accounts and preferences
- Teams and leagues
- Players
- Schedules and games
- Scores
- News
- Posts and comments
- Followed teams
- Notification preferences
- Administrative records

PostgreSQL was selected because the application contains many related types of data that can be managed effectively with a relational database.

---

## ORM

**Drizzle ORM** will be used to connect the NestJS backend to PostgreSQL.

Drizzle ORM will help define and manage:

- Database tables
- Relationships
- Queries
- Schemas
- Database migrations

It was selected because it provides strong TypeScript support while still allowing control over the SQL and database structure.

---

## Authentication

Authentication will be handled using **Clerk**.

Clerk will manage:

- Account creation
- User login
- User sessions
- Password management
- Email verification
- Social login options
- Authentication tokens

The NestJS backend will verify Clerk authentication tokens before allowing users to access protected resources.

Administrator permissions will also be checked by the backend before allowing access to administrative features.

---

## Admin Panel

The admin panel will work as a separate protected web dashboard connected to the NestJS API.

Authorized administrators will be able to manage application content such as:

- Teams
- Leagues
- Players
- Schedules
- Games
- Scores
- News
- Notifications
- Featured content
- User reports

The admin panel will not connect directly to PostgreSQL. All changes will go through protected administrative endpoints in the NestJS backend.

Clerk will handle administrator authentication, while NestJS will verify administrator roles and permissions.

The exact frontend framework for the admin dashboard will be selected when development of the admin panel begins.

---

## Storage

Application images and media files will be stored using **Cloudflare R2**.

Cloudflare R2 may store:

- Team logos
- League logos
- Player images
- User profile pictures
- News images
- Post images
- Videos
- Other uploaded media

PostgreSQL will store the file metadata and location, while the actual files will remain in Cloudflare R2.

---

## Notifications

Notifications will be handled using:

- **Expo Notifications**
- **Firebase Cloud Messaging**

Expo Notifications will manage notification permissions, device registration, notification tokens, and notification behavior inside the mobile application.

Firebase Cloud Messaging may be used as part of the push notification delivery process, particularly for Android devices.

Notifications may be sent for:

- Final scores
- Upcoming game reminders
- Game start alerts
- Schedule changes
- Team updates
- League updates
- Local sports news
- Community activity

The NestJS backend will determine when notifications should be sent and which users should receive them based on their preferences and followed teams.

---

## Hosting

The NestJS backend and PostgreSQL database will initially be hosted using **Railway**.

Railway may be used to host:

- The NestJS API
- The PostgreSQL database
- Environment variables
- Backend deployments
- Future worker processes

Railway was selected because it provides a simple way to deploy and manage the initial backend infrastructure.

---

## Search

The initial search system will use **PostgreSQL Full-Text Search**.

It may be used to search for:

- Teams
- Leagues
- Players
- News
- Posts
- Games

Using PostgreSQL Full-Text Search avoids adding a separate search service during the first stage of development.

A dedicated search platform may be considered later if the application requires advanced ranking, recommendations, typo tolerance, or larger search workloads.

---

## Possible Future Additions

### Redis

Redis may be added later for:

- Caching
- Rate limiting
- Temporary data
- Frequently requested scores
- Improving API performance
- Real-time functionality

Redis will only be added when there is a clear performance or architectural requirement.

### BullMQ

BullMQ may be added for background and scheduled jobs such as:

- Sending notifications
- Scheduling game reminders
- Processing uploads
- Importing schedules
- Updating scores
- Retrying failed tasks

BullMQ requires Redis, so Redis would need to be added before BullMQ.

### AWS

AWS may be considered later if the application requires more advanced infrastructure, greater control, or additional scalability.

AWS is not necessary for the initial version because Railway and Cloudflare R2 provide the services needed to begin development.

---

## Final Decision

The selected technology stack is:

- **Mobile:** React Native, Expo, and TypeScript
- **Backend:** NestJS
- **ORM:** Drizzle ORM
- **Database:** PostgreSQL
- **Authentication:** Clerk
- **Admin Panel:** Protected web dashboard connected to the NestJS API
- **Storage:** Cloudflare R2
- **Notifications:** Expo Notifications and Firebase Cloud Messaging
- **Hosting:** Railway
- **Search:** PostgreSQL Full-Text Search
- **Possible future additions:** Redis, BullMQ, and AWS

This stack provides a strong starting point for the application while keeping the architecture organized, scalable, and flexible.

Changes may be made later if testing, development requirements, application growth, or infrastructure needs justify using different technologies.
````
