# TDA Roles and Permissions

## Purpose

This document defines what each type of TDA user can view, create, modify, moderate, publish, and delete.

It covers the following permission areas:

- Public and personal features
- Authentication requirements
- Official content publishing
- Community moderation
- Report handling
- Sports-data management
- User management
- Role assignment and removal
- Account deletion and personal data
- Prohibited role combinations
- Permission enforcement and auditing

**Status:** Proposed for team approval

**Parent Issue:** [Documentation] Milestone 0 — Project Planning and Architecture

**Dependencies:**

- Define MVP Scope and Exclusions
- Document Primary User Flows

---

# Role Summary

| Role | Primary Responsibility |
| --- | --- |
| Guest | Browse public information without an account. |
| Registered User | Personalize the app, participate in communities, and manage their account. |
| Moderator | Enforce community rules within assigned communities. |
| Editor | Publish official content and manage sports data for assigned entities. |
| Administrator | Manage platform-wide content, users, roles, communities, and system configuration. |

TDA uses one account per person. Staff members may use regular registered-user features from the same account.

Personal actions, such as selecting favorite teams or joining communities, do not determine what a staff member is authorized to manage.

---

# Role Definitions

## 1. Guest

A Guest is a person who uses TDA without registering or logging in.

Guests can:

- View public feeds and posts.
- Search sports entities.
- View public sports, leagues, teams, athletes, schedules, and scores.
- Discover public communities.

Guests cannot:

- Select favorites.
- Receive personalized notifications.
- Join communities.
- Send community messages.
- Report content.
- Manage an account.
- Access staff tools.

---

## 2. Registered User

A Registered User is an authenticated person with access to TDA’s personal and community features.

Registered Users can:

- Select and remove favorites.
- Receive and manage notifications.
- Join and leave public communities.
- Send eligible community messages.
- Edit or remove their own eligible messages.
- Report content or users.
- View the status of their reports.
- Manage their profile and credentials.
- Request account and personal-data deletion.

Registered Users cannot:

- Review reports from other users.
- Moderate communities.
- Publish official content.
- Modify official sports data.
- Manage other users.
- Assign or remove staff roles.

---

## 3. Moderator

A Moderator is a Registered User with permission to enforce community rules within assigned communities.

Moderators can:

- Review reports from assigned communities.
- Hide or restore reported messages/comments.
- Warn users.
- Temporarily mute users within an assigned community.
- Recommend platform-wide suspensions.
- View moderation history for assigned communities.
- Escalate serious reports to an Administrator.

Moderators cannot:

- Moderate communities outside their assigned scope.
- Publish official sports content.
- Modify official sports data.
- Permanently suspend or delete an account.
- Permanently delete moderation evidence.
- Assign or remove roles.

---

## 4. Editor

An Editor is a Registered User who creates official content and manages operational sports data for assigned sports entities.

Editors can:

- Create and edit official-content drafts.
- Publish or schedule official content.
- Edit, archive, and restore official content.
- Manage games, schedules, scores, descriptions, and approved media.
- View publishing and sports-data change history within their assigned scope.

Editors cannot:

- Publish outside their assigned sports entities.
- Moderate communities.
- Review user reports.
- Suspend or restrict users.
- Create or restructure core sports entities.
- Configure sports-data integrations.
- Assign or remove roles.
- Permanently delete official-content records.

---

## 5. Administrator

An Administrator is a trusted staff member with platform-wide management authority.

Administrators can:

- Manage official content across the platform.
- Manage sports entities and sports-data integrations.
- Create, restrict, archive, and restore communities.
- Review reports from all communities.
- Apply platform-wide suspensions.
- Review appeals.
- Manage user accounts when authorized.
- Assign or remove Moderator and Editor roles.
- Define staff assignment scopes.
- Process account-deletion requests.
- Access audit and security records when authorized.

Administrators may use moderation and publishing permissions when necessary. However, routine moderation should belong to Moderators and routine publishing should belong to Editors.

Administrator-role assignments and removals require a separate restricted process.

---

# Roles-and-Permissions Matrix

## 6. Public and Personal Features

| Capability | Guest | Registered User | Moderator | Editor | Administrator |
| --- | :---: | :---: | :---: | :---: | :---: |
| View public feeds, entities, schedules, and scores | Yes | Yes | Yes | Yes | Yes |
| Search public sports entities | Yes | Yes | Yes | Yes | Yes |
| Select and remove favorites | No | Own | Own | Own | Own |
| Manage personal notification preferences | No | Own | Own | Own | Own |
| Receive personal notifications | No | Yes | Yes | Yes | Yes |
| Join or leave public communities | No | Own | Own | Own | Own |
| Send community messages | No | Own | Own | Own | Own |
| Edit or remove own eligible messages | No | Own | Own | Own | Own |
| Report content or a user | No | Yes | Yes | Yes | Yes |
| View own report status | No | Own | Own | Own | Own |
| Manage own profile and credentials | No | Own | Own | Own | Own |
| Request account and personal-data deletion | No | Own | Own | Own | Own |

**Legend:**

- **Yes:** The capability is allowed.
- **Own:** The capability applies only to the person’s own account, preferences, or content.
- **Assigned:** The capability is limited to an assigned community or sports entity.
- **Limited:** The role has restricted authority over the capability.
- **No:** The capability is not allowed.

Staff members use personal features as ordinary users. Their staff role does not give their personal messages, reports, or favorites special treatment.

---

## 7. Official Content Publishing

| Capability | Guest | Registered User | Moderator | Editor | Administrator |
| --- | :---: | :---: | :---: | :---: | :---: |
| Create an official-content draft | No | No | No | Assigned | Yes |
| Edit own draft | No | No | No | Assigned | Yes |
| Edit another Editor’s draft | No | No | No | Assigned, if granted | Yes |
| Publish official content | No | No | No | Assigned | Yes |
| Schedule official content | No | No | No | Assigned | Yes |
| Edit published official content | No | No | No | Assigned | Yes |
| Archive or restore official content | No | No | No | Assigned | Yes |
| Permanently delete official content | No | No | No | No | Exceptional only |
| View publishing history | No | No | No | Assigned | Yes |

Official content includes:

- Platform announcements
- Sports posts
- News and informational content
- Game information
- Schedules
- Scores
- Content published on behalf of TDA or a sports entity

Community messages are user-generated content and are not considered official publications.

Editor permission must be assigned by sports entity, league, or another documented scope. Editors may publish only within that scope.

Required fields and content validation must pass before publication. Publishing, material edits, archiving, restoration, and exceptional deletion must be recorded.

Permanent deletion is reserved for an Administrator when required by law, privacy policy, security policy, or an approved retention policy. Normal removal should use archiving or unpublishing so the record remains available for review.

---

## 8. Community Moderation

| Capability | Guest | Registered User | Moderator | Editor | Administrator |
| --- | :---: | :---: | :---: | :---: | :---: |
| Review community reports | No | No | Assigned | No | Yes |
| Hide or restore a reported message | No | No | Assigned | No | Yes |
| Warn a user about a community violation | No | No | Assigned | No | Yes |
| Temporarily mute a user in a community | No | No | Limited | No | Yes |
| Recommend a platform-wide suspension | No | No | Yes | No | Yes |
| Suspend or ban a user platform-wide | No | No | No | No | Yes |
| View moderation history | No | No | Assigned | No | Yes |
| Edit community rules or details | No | No | No | No | Yes |
| Create, restrict, archive, or restore a community | No | No | No | No | Yes |
| Permanently delete moderation evidence | No | No | No | No | Exceptional only |

A Moderator may act only within assigned communities.

A temporary mute:

- Applies only to the affected community.
- Must use an approved duration.
- Requires a documented reason.
- Does not prevent the user from accessing unrelated communities.

Administrators handle:

- Platform-wide suspensions
- Appeals
- Serious or repeated violations
- Conflicts of interest
- Cases affecting multiple communities

Every moderation action must record the actor, target, reason, time, scope, and result.

---

## 9. Report Handling

| Capability | Registered User | Moderator | Editor | Administrator |
| --- | :---: | :---: | :---: | :---: |
| Submit a report | Yes | Yes | Yes | Yes |
| View own report status | Yes | Yes | Yes | Yes |
| Review and classify a report | No | Assigned communities | No | All |
| Request additional review | No | Yes | No | Yes |
| Close a community report | No | Assigned communities | No | All |
| Escalate a serious case | No | Yes | No | Yes |
| Decide an appeal | No | No | No | Yes |
| View platform-wide report analytics | No | No | No | Yes |

Reports move through the following statuses:

1. `Open`
2. `Under Review`
3. `Actioned` or `Dismissed`
4. `Closed`

The reviewer must record a reason for the decision.

A person cannot review:

- A report they submitted.
- A report involving their own content.
- An appeal against their own decision.
- A case in which they have a personal conflict.

These cases must be reassigned.

Users receive confirmation when a report is submitted and may receive a limited status update. They must not receive private information about another user’s account or punishment.

---

## 10. Sports-Data Management

| Capability | Guest | Registered User | Moderator | Editor | Administrator |
| --- | :---: | :---: | :---: | :---: | :---: |
| View public sports data | Yes | Yes | Yes | Yes | Yes |
| Create or edit games, schedules, and scores | No | No | No | Assigned | Yes |
| Correct operational sports data | No | No | No | Assigned | Yes |
| Update descriptions and approved media | No | No | No | Assigned | Yes |
| Create a sport, league, team, or athlete | No | No | No | No | Yes |
| Change entity identity or relationships | No | No | No | No | Yes |
| Archive or restore a sports entity | No | No | No | No | Yes |
| Configure a sports-data source or integration | No | No | No | No | Yes |
| View sports-data change history | No | No | No | Assigned | Yes |

Editors may manage the following for assigned entities:

- Games
- Schedules
- Scores
- Descriptions
- Approved media
- Operational corrections

Only Administrators may:

- Create core sports entities.
- Change official entity names.
- Change relationships between sports, leagues, teams, and athletes.
- Archive or restore sports entities.
- Configure data sources or integrations.

All sports-data changes must identify their source and the staff member who made the change.

---

## 11. User Management

| Capability | Guest | Registered User | Moderator | Editor | Administrator |
| --- | :---: | :---: | :---: | :---: | :---: |
| View another user’s public profile | Yes | Yes | Yes | Yes | Yes |
| View private account data | No | Own | No | No | Limited |
| Change another user’s profile or credentials | No | No | No | No | No |
| Apply a community-specific temporary mute | No | No | Assigned | No | Yes |
| Suspend or reactivate an account platform-wide | No | No | No | No | Yes |
| Process an account-deletion request | No | No | No | No | Yes |
| Export audit or security records | No | No | No | No | Limited |

Administrators may access only the minimum private account information required for:

- Account support
- User safety
- Platform security
- Fraud prevention
- A valid legal purpose

Access to private account information must be recorded.

Passwords, authentication secrets, and security credentials must never be visible to staff.

Staff members cannot directly change another user’s password. They may only initiate an approved password-reset or account-recovery process.

---

## 12. Role Management

| Capability | Guest | Registered User | Moderator | Editor | Administrator |
| --- | :---: | :---: | :---: | :---: | :---: |
| Assign or remove the Moderator role | No | No | No | No | Yes |
| Assign or remove the Editor role | No | No | No | No | Yes |
| Define Moderator assignment scope | No | No | No | No | Yes |
| Define Editor assignment scope | No | No | No | No | Yes |
| Expand personal role or scope | No | No | No | No | No |
| Assign or remove the Administrator role | No | No | No | No | Restricted process |

An Administrator may assign or remove Moderator and Editor roles but cannot approve their own role change.

Administrator access must be created or removed through a separately authorized process involving at least one other authorized approver.

Administrator-role changes must not be available through ordinary role-management controls.

---

# Important Capability Rules

## 13. Publish Official Content

- **Allowed roles:** Editor within an assigned scope and Administrator.
- **Conditions:** Required fields and validation must pass, and the person must have access to the target sports entity.
- **Result:** The content becomes public immediately or at its scheduled time, and the publication is recorded.
- **Restrictions:** Moderators cannot publish official content. Editors cannot publish outside their assigned scope.
- **Authentication:** Required.

---

## 14. Hide a Community Message

- **Allowed roles:** Moderator within an assigned community and Administrator.
- **Conditions:** The message violates a community rule or must be hidden during a valid safety review. A reason must be provided.
- **Result:** The message is hidden from users and preserved for review.
- **Restrictions:** Moderators cannot act outside their assigned communities or permanently delete the message record.
- **Authentication:** Required.

---

## 15. Temporarily Mute a User

- **Allowed roles:** Moderator within an assigned community and Administrator.
- **Conditions:** A documented community violation exists. An approved reason and duration must be selected.
- **Result:** The user temporarily loses permission to send messages in that community.
- **Restrictions:** Moderators cannot block the user from other communities or suspend the account platform-wide.
- **Authentication:** Required.

---

## 16. Modify Sports Data

- **Allowed roles:** Editor within an assigned scope and Administrator.
- **Conditions:** The source must be identified, and the person must have access to the affected sports entity.
- **Result:** The validated change becomes visible and is added to the change history.
- **Restrictions:** Editors cannot create or restructure core sports entities or configure data integrations.
- **Authentication:** Required.

---

## 17. Assign or Remove a Staff Role

- **Allowed role:** Administrator, except for Administrator-role changes.
- **Conditions:** The business reason, intended scope, and approving Administrator must be recorded.
- **Result:** The permissions are updated, and active sessions are reevaluated.
- **Restrictions:** No person may assign, approve, or expand their own role. Administrator-role changes require the restricted process.
- **Authentication:** Required. Recent authentication and multi-factor authentication should be required when supported.

---

## 18. Delete an Account

- **Allowed roles:** The account owner may request deletion. An Administrator or approved automated process may execute the request.
- **Conditions:** The account owner’s identity and confirmation must be verified. Applicable retention requirements must also be reviewed.
- **Result:** Personal data is deleted or anonymized, and the account can no longer be used.
- **Restrictions:** Account deletion cannot replace suspension. Protected records must be handled under the approved retention policy.
- **Authentication:** Required. Recent identity verification may also be required.

---

# Authentication Requirements

The following actions are public and do not require authentication:

- View public feeds and posts.
- View public sports entities.
- View public schedules and scores.
- Search public sports entities.
- Discover and view public communities.

Authentication is required to:

- Select or remove favorites.
- Manage notification preferences.
- Receive personal notifications.
- Join or leave a community.
- Send, edit, or remove an eligible community message.
- Submit a report.
- View the status of a report.
- Manage a profile.
- Change account credentials.
- Request account deletion.
- Use moderation tools.
- Publish official content.
- Modify sports data.
- Manage users.
- Assign or remove roles.

Authentication alone does not authorize a staff action.

Before allowing a staff action, the backend must verify:

- The person’s active role.
- The person’s assigned scope.
- The person’s account status.
- Any required recent authentication.
- Any required multi-factor authentication.
- Whether the person has a conflict of interest.

---

# Account Deletion and Personal Data

- Authenticated users may request deletion of their own account and personal data.
- The request requires confirmation and identity verification because it is destructive.
- Only an Administrator or an approved automated process may execute the request.
- Staff cannot delete an account merely as a moderation action.
- Suspension and deletion are separate actions.
- Personal data must be deleted or anonymized according to the approved privacy and retention policy.
- Records required for security, fraud prevention, legal obligations, moderation review, or auditing may be retained with restricted access.
- Personal identifiers in retained records should be minimized when possible.
- Public community content retained after account deletion must no longer expose the deleted user’s personal identity unless legally required.
- The system must record the request, verification, status, and completion date without retaining unnecessary deleted data.

---

# Prohibited Role Combinations and Conflicts

TDA grants one staff role per account:

- Moderator
- Editor
- Administrator

Registered-user capabilities are included automatically and are not assigned as a second role.

The following role combinations are prohibited:

- Moderator and Editor on the same account.
- Moderator and Administrator on the same account.
- Editor and Administrator on the same account.

The following actions are also prohibited:

- Assigning or approving your own role.
- Expanding your own assignment scope.
- Reviewing a report you submitted.
- Reviewing a report against your own content.
- Reviewing your own moderation decision or appeal.
- Using Editor access to obtain moderation authority.
- Using Moderator access to publish official content or modify sports data.

If a staff member changes responsibilities, the old staff role must be removed before the new role is activated.

Administrator permissions already include emergency platform-wide authority and must not be combined with another staff role.

---

# General Permission Requirements

- Access must be denied unless permission is explicitly granted.
- The backend must authorize every protected action.
- Hiding controls in the interface is not sufficient security.
- Permission checks must consider both the role and its assigned scope.
- Suspended, disabled, or deleted accounts cannot perform protected actions.
- Role and scope changes must invalidate or reevaluate active sessions.
- Staff cannot approve their own role, report, appeal, or account action.
- Hiding or archiving should be preferred over permanent deletion when records may be required for review.
- User-facing errors must not expose private records or internal permission information.

## Audit Requirements

The following actions must be recorded:

- Publishing and editing official content
- Archiving or restoring official content
- Modifying sports data
- Hiding or restoring community messages
- Warning, muting, or suspending users
- Resolving or escalating reports
- Accessing protected user information
- Processing account-deletion requests
- Assigning or removing staff roles
- Changing a staff member’s assignment scope

Each audit record must identify:

- Actor
- Action
- Target
- Assignment scope
- Reason
- Timestamp
- Result

Audit records must not be modified or deleted through normal staff controls.

---

# Approval

This document becomes the approved roles-and-permissions model after the following reviews are completed:

- [ ] Product owner confirms that the roles match the MVP scope and user flows.
- [ ] Technical lead confirms that every permission can be enforced and tested in the backend.
- [ ] Moderation owner confirms the report, mute, suspension, and appeal boundaries.
- [ ] Privacy or project owner confirms the account-deletion and data-retention rules.
- [ ] The team records its approval in the issue or pull request.

**Approval status:** Pending team review.