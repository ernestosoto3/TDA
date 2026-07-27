# Sports Data Sources & Ingestion Strategy

## Status

- **Decision status:** Approved for Version 1 / MVP
- **MVP ingestion method:** Manual-first administrative entry
- **Future integration strategy:** Licensed and authorized hybrid ingestion

---

## 1. Candidate Sources

The following official organizations and platforms may be used as verification references or future authorized integration candidates:

- [FIBA](https://www.fiba.basketball/en/players)
- [Béisbol Doble A](https://beisboldobleapr.com)
- [Baloncesto Superior Nacional](https://bsnpr.com)
- [Federación Puertorriqueña de Voleibol](https://fedpurvoli.com)
- [Meta Graph API](https://developers.facebook.com)

A source appearing in this list does not automatically authorize TDA to extract, store, or redistribute its information.

---

## 2. Approved MVP Strategy — Manual-First Ingestion

Version 1 will use the protected administrative dashboard to enter and verify supported sports data manually.

Authorized staff may:

- Create and update supported sports entities.
- Enter schedules and game-status changes.
- Publish verified final scores.
- Correct inaccurate records.
- Record the official source used for verification.
- Preserve the person, reason, date, and result of each material change.

The MVP does not depend on an external sports-data provider, scraping process, hidden endpoint, browser-automation service, ingestion worker, or continuously running data pipeline.

---

## 3. Future Strategy — Licensed and Authorized Hybrid Ingestion

After the MVP, TDA may add automated ingestion through:

1. A licensed official API.
2. A direct league or federation feed.
3. A structured export supplied by the data owner.
4. An explicitly authorized official-site importer.
5. The Meta Graph API for approved official announcements and change signals.

Potential future source assignments include:

| Competition or use case | Preferred future source | MVP fallback |
|---|---|---|
| FIBA competitions | Licensed FIBA GDAP access | Manual verification from official FIBA information |
| BSN | Licensed BSN or approved provider feed | Manual entry from official BSN records |
| Béisbol Doble A | Direct federation feed or authorized importer | Manual entry from official schedules and results |
| FPV competitions | Direct FPV/DataFPV agreement or authorized feed | Manual entry from official FPV records |
| Postponements, venue changes, and urgent announcements | Approved official social or league feed | Manual verification |

Each future integration requires separate approval before implementation.

---

## 4. Methods Not Approved for Production

The following are not approved Version 1 production-ingestion methods:

- Treating hidden XHR or JSON endpoints as public APIs.
- Scraping an official website without written permission.
- Using `requests`, BeautifulSoup, Selenium, or Playwright against a source without authorization.
- Bypassing access controls, rate limits, authentication, or anti-automation protections.
- Using social-media posts as the canonical source for scores or standings.
- Depending on an unconfirmed provider for MVP operation.

A technically accessible endpoint does not establish permission to use or redistribute its data.

BeautifulSoup, Selenium, Playwright, or similar tools may only be evaluated after the data owner authorizes the exact access method, frequency, storage, and public-display use.

---

## 5. MVP Data Workflow

The Version 1 workflow is:

1. Identify an official or approved source.
2. Confirm the information relevant to the supported MVP feature.
3. Enter the data through the administrative dashboard.
4. Record the source and direct reference when available.
5. Review the information before public display.
6. Publish it through the NestJS API.
7. Record material changes in the audit history.

Only scheduled games and verified final scores are required for Version 1. Continuously updating live scores remain Post-MVP.

---

## 6. Required Provenance

Sports-data records and material corrections must preserve, when applicable:

- Source organization.
- Source URL or official reference.
- Staff member who entered or verified the information.
- Verification timestamp.
- Internal notes or correction reason.
- Result of the administrative action.

Source records represent provenance and verification. They do not imply that an automated integration exists.

---

## 7. Requirements for a Future Automated Integration

Before adding an automated source, the team must confirm:

- Written authorization or a valid commercial license.
- Public mobile-application display rights.
- Rights to store, cache, and redistribute the data.
- Allowed fields and historical retention.
- Attribution requirements.
- Rate limits and update frequency.
- Media, logo, and athlete-image rights.
- Correction and dispute procedures.
- Technical documentation and provider support.
- Required environment variables, credentials, monitoring, and operational ownership.

The related integration must be proposed and approved through a separate issue before implementation.