# Privacy, Data Retention, and Terms Architecture

## 1. Purpose and Status

This document defines TDA’s approved product and technical requirements for privacy disclosures, personal-data retention, account deletion, Terms of Service acceptance, and policy-version tracking.

It is an architecture and product-policy document, not final legal language. The public Privacy Policy and Terms of Service must receive legal review before production release.

## 2. Minimum-Age Policy

TDA is intended for users who are at least 13 years old. Registration must require the user to confirm that they meet the minimum-age requirement.

TDA must not knowingly create accounts for children under 13. If TDA later allows users under 13, the team must design and approve a COPPA-compliant parental notice, consent, access, and deletion process before collecting their personal information.

## 3. Information TDA Collects

TDA may process the following categories of information:

| Category | Examples | Purpose |
|---|---|---|
| Account information | Clerk identifier, email address, username, profile information | Authentication and account management |
| Preferences | Favorite sports, leagues, teams, athletes, notification settings | Personalization |
| Community content | Messages, posts, reports, and moderation records | Community participation and safety |
| Device information | Push-notification token, application version, device platform | Notifications and technical support |
| Security information | Login events, IP address, audit events, and access failures | Security, abuse prevention, and investigation |
| Staff authorization | Role assignments, scopes, approvals, and revocations | Administrative access control |

TDA must not collect information that is not required for an approved product, security, legal, or operational purpose.

## 4. Third-Party Services

TDA may send limited information to approved service providers required to operate the platform, including:

- Clerk for authentication and identity management
- Expo and Firebase Cloud Messaging for push notifications
- Cloudflare R2 for approved media storage
- Railway for application and database hosting
- The selected sports-data provider for sports information

The public Privacy Policy must identify the categories of providers used, the information shared, and the purpose of the sharing. Service providers may process information only for approved TDA purposes and under applicable contractual protections.

TDA does not sell personal information. Advertising or unrelated tracking must not be introduced without a separate privacy review and updated user disclosure.

## 5. Retention Schedule

| Information | Retention period | Deletion or disposition |
|---|---|---|
| Active account and profile information | While the account remains active | Included in the account-deletion process |
| Favorite and preference records | While the account remains active | Deleted when the account is permanently processed |
| Push-notification tokens | Until invalid, replaced, notifications are disabled, or the account is deleted | Permanently deleted |
| Notifications | 90 days after creation | Automatically deleted |
| Public community messages and posts | While needed for the community record | Deleted or retained in anonymized form after account deletion |
| Deleted or moderated content | 180 days after removal | Permanently deleted unless connected to an active investigation |
| Reports, warnings, and moderation actions | Two years after final resolution | Permanently deleted or anonymized |
| Authentication and security logs | 90 days | Permanently deleted unless preserved for an active security investigation |
| Staff role and scope history | Two years after revocation | Permanently deleted or anonymized unless required for an investigation |
| Immutable audit events | Two years after creation | Permanently deleted through an authorized retention process |
| Account-deletion requests | Two years after completion | Retained with only the minimum evidence required to prove completion |
| Terms and privacy-policy acceptances | Life of the account plus five years | Deleted after the retention period expires |
| Database backups | Maximum of 35 days after creation | Expire automatically through backup rotation |

Retention periods must be enforced through scheduled deletion or anonymization jobs. Information must not be kept indefinitely merely because storage is available.

## 6. Account-Deletion Process

1. The authenticated user requests account deletion and completes identity verification.
2. TDA immediately creates an `account_deletion_requests` record.
3. All active Clerk sessions are revoked.
4. The internal account becomes `soft_deleted`, and active staff roles and scopes are revoked.
5. The user immediately loses access to authenticated features.
6. Permanent processing is scheduled for 30 days after the verified request.
7. At the scheduled execution time, TDA permanently deletes the Clerk user.
8. TDA deletes or anonymizes internal personal information that is not covered by an approved retention exception.
9. The request becomes `completed` only after the Clerk deletion and internal processing both succeed.
10. Failures remain pending, are recorded in `audit_events`, and must be retried or escalated.

Backups may retain encrypted copies until their normal rotation period expires. Deleted information must not be restored to active systems except when required for disaster recovery, after which the deletion must be reapplied.

## 7. Retention Exceptions

Information may be retained beyond the ordinary period only when reasonably necessary for:

- An active security, fraud, abuse, or moderation investigation
- Compliance with a valid legal obligation or preservation request
- Establishing, exercising, or defending legal claims
- Preserving the integrity of an immutable security or administrative audit record

Every exception must document:

- The information being retained
- The reason for retention
- The approving Administrator
- The date the exception began
- The scheduled review or expiration date

A retention exception must not preserve more personal information than necessary. When the exception expires, the information must be deleted or anonymized.

## 8. User-Facing Privacy Disclosures

Before registration, users must be able to open the current Privacy Policy and Terms of Service.

The Privacy Policy must clearly explain:

- What information TDA collects
- Why each category is collected
- Which service-provider categories receive information
- How long information is retained
- How users can change preferences or disable notifications
- How users can request account and data deletion
- What information may be retained after deletion and why
- How to contact TDA with a privacy question
- The policy’s effective date and version

Material privacy-policy changes require renewed acceptance before the user continues using authenticated features.

## 9. Terms Acceptance

Registration must not complete until the user affirmatively accepts the current Terms of Service and acknowledges the current Privacy Policy.

Acceptance must use an unchecked control. Silence, continued browsing, or a preselected checkbox does not count as acceptance.

Each acceptance record must store:

- Internal user identifier
- Policy type
- Policy version
- Policy effective date
- Acceptance timestamp
- Acceptance source, such as mobile registration or administrative login
- Application version
- IP address or equivalent security evidence, when approved and disclosed

Staff users must accept both the general user policies and any applicable administrative-use policy.

## 10. Policy Versions and Changes

Each published policy must have:

- A unique immutable version
- Policy type
- Publication date
- Effective date
- Public document location
- Change summary
- Whether renewed acceptance is required
- Publishing Administrator
- Approval status

Previously accepted text must remain retrievable for audit purposes. Editing an existing published version is prohibited; a change creates a new version.

Nonmaterial changes may be announced without renewed acceptance. Material changes affecting data collection, use, sharing, retention, deletion, user rights, or dispute terms require renewed acceptance.

## 11. Required Persistence

The database must include:

### `policy_versions`

Stores every immutable Terms of Service, Privacy Policy, and administrative-policy version.

### `policy_acceptances`

Stores each user’s acceptance of a specific policy version.

A uniqueness constraint must prevent duplicate acceptance records for the same user and policy version.

The API must reject registration when required policy versions have not been accepted. Authenticated access must be limited when a user has not accepted a newly required material version.

## 12. Security and Access

Personal information must be available only to authorized personnel with a legitimate operational purpose. Administrative access must follow the approved role-and-scope model and produce immutable audit events.

Secrets, passwords, complete session tokens, and unnecessary personal information must never be written to application logs.

## 13. Ownership and Review

Administrators are responsible for publishing approved policy versions. Legal review is required before the public Privacy Policy or Terms of Service is used in production.

The retention schedule must be reviewed at least annually and whenever TDA introduces a new data category, provider, feature, or legal requirement.