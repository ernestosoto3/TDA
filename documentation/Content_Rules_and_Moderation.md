# Content Policy & Moderation Pipeline

## 1. Content Rules
Our platform exclusively accepts **sports-related content**.

### Allowed Content:
- Sports news and official league announcements
- Live scoreboards and match results
- Team updates, rosters, and trade news
- Game and player highlights
- Official schedules and event calendars

### Prohibited Content:
- **Off-topic Content:** Non-sports related posts.
- **Explicit / Adult Content:** Sexual, graphic, or violent media.
- **Harassment & Hate Speech:** Bullying, offensive language, or targeted attacks.
- **Spam & Misinformation:** Unverified rumors presented as facts, malicious links, or repetitive promotional content.


## 2. Moderation Process

To maintain content quality, all user-generated posts pass through a **hybrid moderation pipeline** before or shortly after publication:

### Step 1: Automated Pre-Screening (AI & Rule Engine)
Before a post goes live, it is processed by automated checks:
- **Text & Keyword Filtering:** Scans for offensive language, known spam links, and banned keywords.
- **Topic Classification:** Uses NLP (Natural Language Processing) models to verify if the text is relevant to sports.
- **Media Safety Inspection:** Computer vision models check uploaded images/videos for explicit or violent material.

### Step 2: Automated Decision & Escalation
- **Approved:** Posts that meet high-confidence safety and topic criteria are published immediately.
- **Rejected:** Posts with clear policy violations are automatically blocked, and the user is notified.
- **Flagged for Review:** Ambiguous posts (e.g., sports combat videos, debate-heavy text) are sent to an Admin Moderation Queue.

### Step 3: Community Reporting & Fact-Checking
- Users can flag published posts for "Misinformation" or "Policy Violation".
- Admin dashboards receive these flags to manually review, edit, or remove incorrect/unverified information.

### Post Lifecycle States (Database Flags)
- `PENDING_AUTOMATED_CHECK`: Default status when submitted.
- `APPROVED`: Passed all automated checks and is visible to users.
- `REJECTED`: Blocked by automated filters.
- `NEEDS_HUMAN_REVIEW`: Ambiguous content sent to Admin Dashboard.
- `FLAGGED`: Published post reported by the community for review.