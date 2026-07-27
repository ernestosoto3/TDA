# Content Policy & Moderation Pipeline

## 1. MVP Content Model

TDA Version 1 supports two distinct content categories:

### Official Content

Official posts and articles may be created and published only by:

- An authorized Editor acting within an assigned sports-entity scope.
- An Administrator with platform-wide authority.

Official content includes:

- Sports news and official league announcements.
- Scheduled-game information.
- Verified final results.
- Team and league updates.
- Game recaps.
- Official schedules and event calendars.
- Platform and community announcements.

### User-Generated Content

Registered Users may contribute only through:

- Text comments on supported posts and articles.
- One basic reply level on supported comments.
- Text-only messages inside joined public communities.

Version 1 does not support:

- General posts or articles created directly by users.
- Fan article submissions.
- User-uploaded images or videos in comments or communities.
- User-created communities.
- Automated AI moderation.

---

## 2. Content Rules

All public content and participation must remain related to the supported sports experience and comply with the applicable platform and community rules.

### Allowed Content

- Official sports news and verified announcements.
- Scheduled-game information and verified final results.
- Team, league, roster, and athlete updates from approved sources.
- Game recaps and sports-related discussion.
- Relevant comments and basic replies on official content.
- Relevant text-only messages inside public sports communities.

### Prohibited Content

- **Off-topic content:** Content unrelated to the supported sports or community topic.
- **Explicit or adult content:** Sexual, graphic, or unnecessarily violent content.
- **Harassment and hate speech:** Bullying, threats, discriminatory language, or targeted attacks.
- **Spam:** Repetitive messages, malicious links, scams, or unauthorized promotion.
- **Misinformation:** Unverified claims presented as confirmed facts.
- **Impersonation:** Misrepresenting another person, team, league, organization, or staff member.
- **Privacy violations:** Sharing another person’s private or sensitive information without authorization.

---

## 3. Official Publishing Process

Official posts and articles follow this process:

1. An authorized Editor or Administrator creates a draft.
2. The backend verifies the staff role and applicable assignment scope.
3. Required content fields and related sports entities are validated.
4. Required source and verification information is recorded.
5. The content may be saved as a draft, scheduled, or published.
6. Publishing, material editing, archiving, restoration, and exceptional deletion are recorded in `audit_events`.

Ordinary Registered Users and Moderators cannot create or publish official posts or articles.

---

## 4. User-Generated Content Process

### Comments and Replies

1. An authenticated user submits a text comment or eligible basic reply.
2. The backend validates account status, content length, supported reply depth, and request limits.
3. The comment or reply is published with status `active`.
4. The author may soft-delete their own eligible comment.
5. Other users may report the comment.
6. An assigned Moderator or Administrator may hide or restore it after review.

### Community Messages

1. An active community member submits a text-only message.
2. The backend validates membership status, message length, and request limits.
3. The message is published with status `active`.
4. The sender may soft-delete their own eligible message.
5. Other users may report the message.
6. A Moderator assigned to that community or an Administrator may hide or restore it after review.

Basic validation, rate limiting, and spam prevention are security controls. They are not an AI content-moderation system.

---

## 5. Reporting and Manual Moderation

Users may report:

- Official posts.
- Comments and basic replies.
- Community messages.
- Other users.

Reports use one shared lifecycle:

1. `pending`
2. `in_review`
3. `resolved` or `dismissed`

`resolved` and `dismissed` are terminal states. An authorized reopen action may return a report to `in_review`, and the action must remain in the report history.

### Manual Review Process

1. A user submits a report.
2. TDA creates the report with status `pending`.
3. An authorized Moderator or Administrator begins review and changes the status to `in_review`.
4. The reviewer examines the reported content, context, prior actions, and applicable rules.
5. The reviewer may:
   - Dismiss the report.
   - Hide or restore content.
   - Warn a user.
   - Temporarily mute a user within a community.
   - Escalate the case.
   - Recommend or apply another authorized action.
6. The report becomes `resolved` when an authorized action is completed or `dismissed` when no violation is found.
7. The reason, actor, scope, result, and timestamp are preserved.

Moderators may act only within assigned communities. Platform-wide suspensions and other Administrator-only actions must be escalated.

---

## 6. Content and Report Lifecycle States

### Official Posts and Articles

- `draft`
- `scheduled`
- `published`
- `archived`
- `hidden`
- `soft_deleted`

### Comments and Community Messages

- `active`
- `hidden`
- `soft_deleted`

### Reports

- `pending`
- `in_review`
- `resolved`
- `dismissed`

The following obsolete states must not be used in Version 1:

- `PENDING_AUTOMATED_CHECK`
- `APPROVED`
- `REJECTED`
- `NEEDS_HUMAN_REVIEW`
- `FLAGGED`
- `Open`
- `Under Review`
- `Actioned`
- `Closed`

---

## 7. Moderation and Audit Records

Moderation actions must preserve:

- The acting staff user.
- The affected content, report, user, or community.
- The applicable assignment scope.
- The action and reason.
- The previous and resulting status.
- The timestamp and result.

Report history and required moderation evidence must not be modified or deleted through normal staff controls.

Publishing, moderation, report resolution, escalation, protected-information access, role changes, and deletion processing must also generate append-only audit events when required by the approved API and database design.

---

## 8. Post-MVP Automated Moderation Architecture

### Status and Target

Automated moderation is excluded from Version 1. The MVP uses user reports, manual review, staff actions, escalation records, and append-only audit events.

Automated moderation is formally deferred to a dedicated Post-MVP moderation milestone after the Version 1 launch. It must not be implemented until the product, privacy, security, moderation, and architecture owners approve its scope.

No moderation provider, NLP model, media-safety service, confidence threshold, or automatic enforcement policy has been selected.

### Proposed Architecture

A future automated-moderation pipeline may use the following flow:

1. The user submits eligible content.
2. The backend performs the existing synchronous validation, authorization, rate-limiting, and spam-prevention checks.
3. An approved background queue submits eligible content to one or more moderation-provider adapters.
4. Text or media services return normalized policy categories, confidence scores, and provider metadata.
5. A TDA-owned rules engine evaluates the signals against approved thresholds and policy rules.
6. The system creates a moderation assessment and, when required, places the content in a human-review queue.
7. An authorized Moderator or Administrator reviews the content, context, automated signals, and applicable policy.
8. The final action and its actor, reason, result, and supporting evidence are preserved in the moderation and audit history.

The provider adapters must prevent external provider-specific responses from becoming the application’s permanent internal contract.

### Human Review and Enforcement

Automated signals must be treated as decision support unless a separately approved policy authorizes a limited automatic action.

The initial Post-MVP implementation must not automatically suspend users, permanently delete content, issue permanent penalties, or close appeals solely from an automated score.

Authorized staff must remain able to review, override, escalate, and audit automated recommendations. Users must have access to the applicable appeal or review process when an automated signal materially affects their content or account.

### Future Technical Requirements

Before implementation, the Post-MVP moderation milestone must define and approve:

- Supported content types
- Selected text and media moderation providers
- Provider fallback and outage behavior
- Queue and retry architecture
- Rules-engine ownership and versioning
- Policy categories and confidence thresholds
- Human-review requirements
- Allowed automatic actions, if any
- Database entities and retention periods
- API and administrative-dashboard contracts
- Privacy and security controls
- Accuracy, bias, and false-positive testing
- Monitoring, cost limits, and operational ownership
- User notice and appeal requirements

Possible future capabilities include:

- AI or NLP topic and policy classification
- Automated keyword or policy screening
- Computer-vision media screening
- Risk scoring and prioritization
- Moderator recommendations
- Review-queue prioritization
- User-submitted post, article, image, or video review

These requirements are an architecture proposal, not an approved provider selection or Version 1 implementation commitment.
