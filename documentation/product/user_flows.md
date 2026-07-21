# Primary User and Administrator Flows

## Purpose

This document defines the principal actions that users and administrators will perform in TDA from beginning to completion.

Each flow identifies:

- Starting point
- Authentication requirement
- Principal steps
- Completion point
- Loading, empty, success, and error states

---

# Authentication Summary

| Flow | Public Visitor | Authenticated User | Administrator |
| --- | --- | --- | --- |
| Register or log in | Yes | Not applicable | Not applicable |
| Complete onboarding | Limited | Yes | Not applicable |
| Select favorites | View only | Yes | Not applicable |
| Browse `Siguiendo` | No | Yes | Not applicable |
| Browse `Descubre` | Yes | Yes | Not applicable |
| Search for a sports entity | Yes | Yes | Not applicable |
| Add or remove a favorite | No | Yes | Not applicable |
| View a team page | Yes | Yes | Not applicable |
| View a game and final score | Yes | Yes | Not applicable |
| Open notifications | No | Yes | Not applicable |
| Discover communities | Yes | Yes | Not applicable |
| Join and participate in a community | No | Yes | Not applicable |
| Manage account information | No | Yes | Not applicable |
| Delete an account | No | Yes | Not applicable |
| Create and publish content | No | No | Authorized administrator |
| Moderate reported content | No | No | Authorized moderator or administrator |

Public visitors may browse public sports information whenever possible. Authentication is required for personalized or protected actions such as selecting favorites, accessing `Siguiendo`, receiving notifications, joining communities, sending messages, reporting content, and managing an account.

---

# User Flows

## 1. Register or Log In

**Starting point:** Authentication screen displayed from the first-use experience or after selecting a protected action.

**Authentication required:** No.

### Registration

1. Open TDA.
2. Select **Create Account**.
3. Enter the required account information.
4. Accept the applicable terms and policies.
5. Submit the registration form.
6. Complete account verification when required.
7. Continue to onboarding.

**Completion point:** The account is created and the user enters onboarding.

### Login

1. Open TDA.
2. Select **Log In**.
3. Enter the email address or username and password.
4. Submit the login form.
5. TDA validates the credentials.
6. The Home tab opens.

**Completion point:** The authenticated user reaches the Home tab.

### Guest Access

1. Open TDA.
2. Select **Continue as Guest**.
3. The `Descubre` feed opens.

**Completion point:** The public visitor can browse public content without creating an account.

### States

- **Loading:** Account creation, verification, or login is being processed.
- **Empty:** Required fields have not been completed.
- **Success:** The account is created or the user is authenticated.
- **Error:** Invalid credentials, duplicate account information, failed verification, unavailable service, or network failure.

---

## 2. Complete Onboarding

**Starting point:** A user completes registration and enters TDA for the first time.

**Authentication required:** Yes for saving onboarding selections. A public visitor may view introductory screens but cannot save personalized selections.

### Flow

1. View the introductory TDA screen.
2. Review the basic explanation of the application.
3. Review the four primary tabs:
   - Home
   - Community
   - Search
   - User & Settings
4. Select favorite sports, leagues, teams, and athletes when available.
5. Confirm the selections.
6. Complete onboarding.
7. Open the Home tab with `Siguiendo` selected.

**Completion point:** Onboarding is marked as complete and the user reaches the Home tab.

### States

- **Loading:** Introductory information or available sports entities are loading.
- **Empty:** No entities are available or the user has not selected any favorites.
- **Success:** Onboarding choices are saved.
- **Error:** The selections cannot be loaded or saved.

If favorites are optional, the user may skip the selection step and complete onboarding. The resulting empty state must explain how to add favorites later.

---

## 3. Select Favorite Sports, Leagues, Teams, and Athletes

**Authentication required:** Yes.

### During Onboarding

**Starting point:** Favorite selection step during onboarding.

1. Browse or search the available sports entities.
2. Select one or more sports, leagues, teams, or athletes.
3. Review the selections.
4. Confirm the selections.
5. TDA saves the favorites.

**Completion point:** The selections are saved and used to populate `Siguiendo`, the favorite-team game carousel, and relevant notification options.

### From User & Settings

**Starting point:** User & Settings tab.

1. Open the User & Settings tab.
2. Scroll to the favorites section.
3. Browse or search for an entity.
4. Select the entity.
5. Confirm the change when required.
6. TDA saves the updated favorites.

**Completion point:** The updated entity appears in the appropriate favorites section.

### States

- **Loading:** Available entities or current favorites are loading.
- **Empty:** No supported entities are available or no favorites have been selected.
- **Success:** The favorites are saved.
- **Error:** The entities cannot be loaded or the selections cannot be saved.

---

## 4. Browse the `Siguiendo` Feed

**Starting point:** Home tab.

**Authentication required:** Yes.

### Flow

1. Open TDA.
2. The Home tab opens.
3. Select the `Siguiendo` sub-tab.
4. View content related to favorite sports, leagues, teams, and athletes.
5. Scroll through the available content.
6. Optionally open a post, article, game, or Entity Profile.

**Completion point:** The user views personalized content or opens a related sub-page.

### States

- **Loading:** Personalized content is loading.
- **Empty:** The user has no favorites or no content is available for the selected favorites.
- **Success:** Personalized content appears.
- **Error:** The feed cannot be loaded or refreshed.

The empty state should provide a path to add favorites.

---

## 5. Browse the `Descubre` Feed

**Starting point:** Home tab.

**Authentication required:** No.

### Flow

1. Open TDA.
2. The Home tab opens.
3. Select the `Descubre` sub-tab.
4. Scroll through general content from the sports and leagues supported by TDA.
5. Optionally open a post, article, game, or Entity Profile.

**Completion point:** The user views general content or opens a related sub-page.

### States

- **Loading:** General content is loading.
- **Empty:** No published content is currently available.
- **Success:** General content appears.
- **Error:** The feed cannot be loaded or refreshed.

---

## 6. Search for a Sports Entity

**Starting point:** Search tab.

**Authentication required:** No.

### Flow

1. Open the Search tab from the bottom navigation.
2. Select the search input.
3. Enter the name of a sport, league, team, or athlete.
4. Review the search results.
5. Select a result.
6. Open the corresponding Entity Profile.

**Completion point:** The selected Entity Profile is displayed.

### States

- **Loading:** Search results are being retrieved.
- **Empty:** The search input is empty or no matching results were found.
- **Success:** Matching entities appear and the selected profile opens.
- **Error:** Search results cannot be retrieved.

---

## 7. Add or Remove a Favorite

**Authentication required:** Yes.

### From an Entity Profile

**Starting point:** An Entity Profile.

1. Open the profile of a sport, league, team, or athlete.
2. Select the follow or unfollow control.
3. TDA saves the change.
4. The control updates to represent the current state.

**Completion point:** The entity is added to or removed from the user’s favorites.

### From User & Settings

**Starting point:** User & Settings tab.

1. Open the User & Settings tab.
2. Locate the appropriate favorites section.
3. Select the three-dot menu next to the section title.
4. Select one or more favorites to remove.
5. Confirm the removal when required.
6. TDA saves the changes.

**Completion point:** The removed entities no longer appear in the favorites section.

### States

- **Loading:** Favorites are loading or the change is being saved.
- **Empty:** The user has not selected any favorites.
- **Success:** The favorite status updates.
- **Error:** The favorite cannot be added or removed.

If a public visitor selects the follow control, TDA must request registration or login before saving the favorite.

---

## 8. View a Team Page

**Authentication required:** No.

### From Search

**Starting point:** Search tab.

1. Search for a team.
2. Select the team from the results.
3. Open the team’s Entity Profile.

### From Home

**Starting point:** Home tab.

1. Open a post, article, or game associated with a team.
2. Select the team name or logo.
3. Open the team’s Entity Profile.

### From User & Settings

**Starting point:** User & Settings tab.

1. Select a favorite team.
2. Open the team’s Entity Profile.

**Completion point:** The team page displays its available information, schedule, final scores, related content, and community link when available.

### States

- **Loading:** Team information is loading.
- **Empty:** A section such as schedule, results, roster, or related content has no available information.
- **Success:** The team page appears.
- **Error:** The team information cannot be retrieved.

---

## 9. View a Game and Final Score

**Authentication required:** No.

### From the Home Game Carousel

**Starting point:** Home tab.

1. View the game carousel near the top of the Home feed.
2. Select an upcoming or completed game.
3. Open the Game Summary sub-page.
4. Review the game status, participating teams, date, time, venue when available, and final score when completed.

### From an Entity Profile

**Starting point:** A team or league Entity Profile.

1. Locate the schedule or previous results.
2. Select a game.
3. Open the Game Summary sub-page.
4. Review the available game information.

**Completion point:** The selected Game Summary is displayed.

### States

- **Loading:** Game information is loading.
- **Empty:** No game information or final score is available.
- **Success:** The available schedule information or verified final score appears.
- **Error:** The game information cannot be retrieved.

An in-progress status may be displayed when verified, but Version 1 does not promise continuously updating live scores, live box scores, or play-by-play information.

---

## 10. Open Notifications

**Starting point:** Home tab or a device push notification.

**Authentication required:** Yes.

### From the Home Header

1. Open the Home tab.
2. Select the bell icon in the header.
3. Open the Notifications sub-page.
4. Select a notification.
5. Open its related game, article, Entity Profile, comment, or community when a destination is available.

### From a Push Notification

1. Select a TDA push notification on the device.
2. TDA opens.
3. The user is authenticated when necessary.
4. TDA opens the destination associated with the notification.

**Completion point:** The Notifications sub-page or the notification’s related destination is displayed.

### States

- **Loading:** Notifications or the related destination are loading.
- **Empty:** The user has no notifications.
- **Success:** Notifications appear and the selected destination opens.
- **Error:** Notifications or the selected destination cannot be loaded.

Notifications are accessed through the Home header and do not require a fifth tab.

---

## 11. Discover and Join a Community

**Authentication required:** Authentication is not required to discover public communities. It is required to join or participate.

### Through Community Search

**Starting point:** Community tab.

1. Open the Community tab.
2. Select the magnifying-glass icon.
3. Search for a public community.
4. Select a result.
5. Review the community information.
6. Select **Join Community**.
7. TDA saves the membership.
8. Open the Community Chat.

### Through Community Discovery

**Starting point:** Community tab.

1. Browse the available public communities.
2. Select a community.
3. Review the community information.
4. Select **Join Community**.
5. TDA saves the membership.
6. Open the Community Chat.

**Completion point:** The community appears in the user’s joined-community list and the user can participate in its Community Chat.

### States

- **Loading:** Communities or membership information are loading.
- **Empty:** No communities are available or no search results match.
- **Success:** The user joins the community.
- **Error:** The communities cannot be loaded or the membership cannot be saved.

If a public visitor attempts to join, TDA must request registration or login.

---

## 12. Send and Report a Community Message

**Authentication required:** Yes. The user must also be a member of the community.

### Send a Message

**Starting point:** A joined Community Chat.

1. Open the Community tab.
2. Select a joined Community Chat.
3. Select the message input.
4. Enter a text message.
5. Select **Send**.
6. TDA publishes the message.
7. The message appears in the Community Chat.

**Completion point:** The message appears in the conversation.

### Report a Message

**Starting point:** A Community Chat containing the message.

1. Press and hold the message.
2. Select **Report**.
3. Select a report reason.
4. Add optional details when supported.
5. Confirm the report.
6. TDA submits the report.
7. A confirmation message appears.

**Completion point:** The report is recorded for moderator review.

### States

- **Loading:** Messages are loading or a message/report is being submitted.
- **Empty:** The Community Chat contains no messages or the message input is empty.
- **Success:** The message is published or the report is submitted.
- **Error:** The message cannot be sent, the report cannot be submitted, or the user no longer has permission to participate.

Version 1 does not include community message reactions, threaded replies, or user-uploaded community media.

---

## 13. Manage Account Information

**Starting point:** User & Settings tab.

**Authentication required:** Yes.

### Edit Profile Information

1. Open the User & Settings tab.
2. Select the pencil icon next to the profile information.
3. Change the screen name or profile picture.
4. Save the changes.
5. Review the updated profile information.

### Edit Personal or Security Information

1. Open the User & Settings tab.
2. Select the gear icon.
3. Open the appropriate account or security setting.
4. Select the email address, username, password, or another supported setting.
5. Enter the updated information.
6. Complete identity verification when required.
7. Save the changes.

**Completion point:** The updated account information is saved and displayed.

### States

- **Loading:** Account information is loading or changes are being saved.
- **Empty:** A required field has not been completed.
- **Success:** The account information is updated.
- **Error:** Invalid information, duplicate username or email address, failed verification, or save failure.

---

## 14. Delete an Account

**Starting point:** Settings sub-page.

**Authentication required:** Yes. Recent identity verification may be required.

### Flow

1. Open the User & Settings tab.
2. Select the gear icon.
3. Open the account or privacy settings.
4. Select **Delete Account**.
5. Review the deletion warning and its consequences.
6. Confirm the deletion request.
7. Complete identity verification when required.
8. TDA deletes or schedules deletion of the account and associated data.
9. The user is logged out.
10. The authentication screen opens.

**Completion point:** The account is deleted or scheduled for deletion, the session ends, and the authentication screen appears.

### States

- **Loading:** The deletion request is being processed.
- **Empty:** Not applicable.
- **Success:** The account is deleted or scheduled for deletion.
- **Error:** Verification fails or the deletion request cannot be completed.

---

# Administrator Flows

Administrator actions take place in the protected web-based Admin Dashboard, not within the application’s four-tab mobile navigation.

## 15. Create and Publish Content as an Administrator

**Starting point:** Admin Dashboard.

**Authentication required:** Yes. The person must have content-publishing permission.

### Flow

1. Log in to the Admin Dashboard.
2. Open the content-management section.
3. Select **Create Content**.
4. Choose the supported content type.
5. Enter the required title, body, source information, and related sports entities.
6. Upload an image when applicable.
7. Save a draft or continue to preview.
8. Review the preview.
9. Correct any validation errors.
10. Select **Publish**.
11. Confirm publication.
12. Verify that the content appears in the appropriate TDA feed or Entity Profile.

**Completion point:** The content is published and visible in its intended application destination.

### States

- **Loading:** Existing content, media, or the preview is loading.
- **Empty:** No content exists yet or required fields are incomplete.
- **Success:** The draft is saved or the content is published.
- **Error:** Validation fails, media upload fails, publication fails, or the administrator lacks permission.

---

## 16. Moderate Reported Content

**Starting point:** Reports section of the Admin Dashboard.

**Authentication required:** Yes. The person must have moderation permission.

### Flow

1. Log in to the Admin Dashboard.
2. Open the reports section.
3. Review the number of unresolved reports.
4. Select a report.
5. Review the reported content, report reason, relevant context, and available moderation history.
6. Determine whether the content violates the community guidelines.
7. Choose an appropriate action:
   - Dismiss the report
   - Remove the content
   - Warn the user
   - Temporarily restrict the user
   - Suspend the account
   - Escalate the report
8. Enter a moderation reason or internal note.
9. Confirm the action.
10. TDA records the decision and updates the report status.

**Completion point:** The report is resolved or escalated and the moderation action is recorded.

### States

- **Loading:** Reports, content context, or moderation history are loading.
- **Empty:** No unresolved reports are available.
- **Success:** The report is dismissed, resolved, or escalated.
- **Error:** The report cannot be loaded, the moderation action cannot be saved, or the moderator lacks permission.

Permanent account deletion should only be available to authorized administrators and should follow an approved moderation policy. The system should not automatically assume a fixed three-strike rule unless that rule is separately defined and approved.

---

# General Navigation Requirements

- Home, Community, Search, and User & Settings are the only primary tabs.
- Notifications open through the bell icon in the Home header.
- `Siguiendo` and `Descubre` are sub-tabs within Home.
- Dedicated destinations such as Notifications, Game Summary, Article, Settings, Community Chat, and Entity Profile are sub-pages.
- Opening a sub-page displays a back button in the header.
- Back navigation returns the user through the navigation path one sub-page at a time.
- Returning to a previous tab should preserve its prior position and state when possible.
- Protected actions must request registration or login without preventing public visitors from browsing available public sports content.

- ## General System State Definitions

- **Loading:** TDA is retrieving, processing, or saving information. A progress indicator should appear, and repeated submissions should be prevented when necessary.
- **Empty:** The requested section has no information to display. TDA should explain why and provide a relevant next action when possible.
- **Success:** The requested action was completed or the information loaded correctly. The interface should display the updated result or provide clear confirmation.
- **Error:** The requested information or action could not be completed. TDA should explain the problem in clear language and provide a retry or recovery option when possible.