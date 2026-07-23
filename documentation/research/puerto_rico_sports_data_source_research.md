# Puerto Rico Sports Data Sources and Ingestion Strategy

**Research date:** July 23, 2026  
**Decision status:** Pending team approval  
**Scope:** Puerto Rican sports schedules, results, live scores, teams, athletes, standings, statistics, and historical information

---

## 1. Executive Summary

No single publicly documented provider was verified to cover all of the Puerto Rican leagues required by the product. The strongest strategy is therefore a **partner-first hybrid model**:

1. Use a licensed official API for competitions where one is available.
2. Obtain written authorization or a direct structured feed from each domestic league or federation that is not covered by that API.
3. Use the Meta Graph API only for official announcements and correction signals, not as the canonical source of scores or standings.
4. Include a manual administrative workflow for unavailable, delayed, disputed, or corrected data.

### Recommended source assignment

| Competition or use case | Recommended primary source | Secondary or fallback source |
|---|---|---|
| Puerto Rico national basketball teams and FIBA competitions | FIBA GDAP | Manual verification against official FIBA competition pages |
| Baloncesto Superior Nacional (BSN) | Licensed BSN or Sportradar feed, subject to product and redistribution confirmation | Manual entry from official BSN records |
| Liga de Béisbol Superior Doble A | Direct federation agreement or authorized official-site ingestion | Manual entry from official schedules, results, standings, and published files |
| Liga de Voleibol Superior Femenino and Masculino | Direct FPV agreement or authorized feed from FPV/DataFPV | Manual entry from official FPV schedules, standings, bulletins, and live-stat pages |
| Postponements, roster announcements, venue changes, and urgent notices | Official league-owned Facebook Pages through the Meta Graph API | Manual verification from the league website or league staff |

### Key legal finding

A hidden JSON/XHR endpoint is only a technical transport mechanism. It is **not authorization to reuse or redistribute the data**. In particular, the current BSN terms explicitly prohibit mass extraction or scraping without written BSN authorization. FIBA public pages also restrict duplication and redistribution; FIBA's authorized integration path is its subscription-based GDAP platform.

### Recommendation

Proceed with **Option A: Licensed and authorized hybrid ingestion**. Use a manual-first pilot while commercial and federation agreements are negotiated. Do not make unauthorized scraping a production dependency.

---

## 2. Evaluation Method

Each source was reviewed against the issue criteria:

- Puerto Rico sports coverage
- Supported leagues
- Data accuracy and authority
- Update frequency
- Live-score support
- Historical data
- Athlete and statistics coverage
- API availability
- Rate limits
- Pricing
- Licensing and redistribution rights
- Reliability
- Documentation quality
- Integration complexity

The following labels are used throughout this document:

- **Verified:** Confirmed in an official source or official documentation.
- **Partially verified:** The data is visible, but a structured or licensed production method was not confirmed.
- **Not publicly documented:** No public documentation was located; this does not prove that a private product or agreement is unavailable.
- **Requires agreement:** The team must obtain written authorization or a commercial contract before production use.

---

## 3. Candidate Sources

### Primary candidates

1. [FIBA public website](https://www.fiba.basketball/)
2. [FIBA Global Data API Platform](https://gdap-portal.fiba.basketball/)
3. [Baloncesto Superior Nacional](https://www.bsnpr.com/)
4. [Sportradar Sports APIs](https://developer.sportradar.com/)
5. [Béisbol Doble A Puerto Rico](https://beisboldobleapr.com/)
6. [Federación Puertorriqueña de Voleibol](https://fedpurvoli.com/)
7. [DataFPV live statistics](https://www.datafpv.com/)
8. [Meta Graph API](https://developers.facebook.com/docs/graph-api/)

### Validation-only sources

The following consumer services visibly cover portions of Puerto Rican sports, but a public production redistribution license was not verified during this research:

- Sofascore
- Flashscore

They may be useful for manual cross-checking, but they should not be treated as production ingestion sources unless the team signs an appropriate agreement.

---

## 4. Puerto Rico Coverage Matrix

| Source | Puerto Rico coverage | Schedules | Scores/results | Live data | Standings | Teams/rosters | Athlete profiles | Detailed statistics | Historical data |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| FIBA GDAP | Puerto Rico national teams and FIBA-sanctioned competitions | Yes | Yes | Yes, for supported live games | Yes | Yes | Yes | Strong basketball coverage | Yes, within licensed product scope |
| FIBA public site | Same FIBA competition scope | Yes | Yes | Yes on supported game pages | Yes | Yes | Yes | Box scores, play-by-play, shot charts, leaders | Yes |
| BSN official platforms | BSN men's professional basketball | Yes | Yes | Yes on official platforms | Yes | Yes | Yes | Player and team statistics | Current and some prior content; depth must be confirmed |
| Sportradar | BSN relationship verified; exact API package for this application must be confirmed | Expected under contract | Expected under contract | Expected under contract | Expected under contract | Expected under contract | Expected under contract | Expected under contract | Contract-dependent |
| Béisbol Doble A official site | Liga de Béisbol Superior Doble A | Yes | Yes | Live broadcasts exist; structured live feed not verified | Yes | Yes | Inconsistent public profile coverage | Season files and game summaries | Strong: statistics from 2002 and standings archive from 1995 |
| FPV official site and DataFPV | LVSF, LVSM, and other FPV competitions | Yes | Yes | Visible live-stat links; structured API not verified | Yes | Yes | Inconsistent | Match and league statistics vary by competition | Fragmented across pages, PDFs, and bulletins |
| Meta Graph API | Official social posts from authorized Pages | Announcements only | Announcements only | Not suitable as a canonical live feed | No | Roster/news announcements | Limited and unstructured | No normalized sports statistics | Page-post history subject to permissions and retention |

### Coverage gaps

No verified single provider covers all of the following in one normalized and licensed API:

- BSN
- Liga de Béisbol Superior Doble A
- Liga de Voleibol Superior Femenino
- Liga de Voleibol Superior Masculino
- Puerto Rico national-team competitions across sports

Multiple source adapters are therefore required.

---

## 5. Detailed Source Evaluations

### 5.1 FIBA Public Website and FIBA GDAP

#### Supported Puerto Rico coverage

FIBA covers Puerto Rico national basketball teams in FIBA competitions, including men's, women's, boys', and girls' events. Public team and competition pages can include:

- Competition calendars and games
- Final and live game status
- Group standings
- Teams and rosters
- Player profiles
- Box scores
- Play-by-play
- Shot charts
- Team and player statistics
- Venues and officials
- Historical tournament records and achievements

FIBA does **not** replace a BSN source because BSN is a domestic professional league outside the normal national-team competition scope.

#### API availability

FIBA provides the **Global Data API Platform (GDAP)**. Its documentation states that:

- Access requires authentication.
- The customer must have a subscription to the applicable product API.
- FIBA MAP supplies pre-game and post-game competition data.
- FIBA LiveStats Integrator supplies live game data for supported games.
- Some endpoints return validated data rather than live data unless live behavior is specifically documented.
- The integration is pull-based.

#### Update frequency and live support

FIBA's integration guidance recommends polling according to the competition state. During live games, documented guidance supports frequent polling, approximately every 5 to 10 seconds, when the subscribed product and endpoint allow it. Pre-game and post-game calls should be less frequent.

#### Pricing and rate limits

- Public list pricing was not found.
- Fees may depend on the existing FIBA relationship, competition scope, requested use, and product subscription.
- FIBA may impose request or user limits and may require additional terms or charges for higher usage.
- Exact limits must be obtained during onboarding.

#### Licensing and redistribution

GDAP grants a limited, revocable, non-exclusive, non-sublicensable license. Authorized use depends on the customer's agreement with FIBA. Broader publication or redistribution must fit the contract and terms.

The public FIBA website states that its content may not be duplicated, redistributed, or manipulated. Therefore, the team should not scrape the public site for production redistribution. GDAP is the appropriate integration channel.

#### Reliability and documentation

- **Authority:** Very high for FIBA competitions.
- **Reliability:** High, but no guaranteed availability level is promised in the public GDAP terms.
- **Documentation:** High; Swagger/API definitions, integration principles, change logs, and support are available to authorized users.
- **Integration complexity:** Medium. Authentication, product scoping, source IDs, event-state polling, and live-data reconciliation are required.

#### Assessment

**Recommended** for Puerto Rico national basketball teams and FIBA events, subject to contract approval.

---

### 5.2 BSN Official Website and App

#### Supported coverage

The BSN official platforms include:

- Calendar and game results
- Standings
- Teams
- Player directory
- Player profiles
- Player and team statistics
- Live and final score information
- News and notifications

Player pages can include team, number, position, date of birth, origin, and season averages such as points, rebounds, assists, and field-goal percentage.

#### API availability

No public BSN developer API or public API documentation was verified.

The site may use internal integrations or XHR/JSON requests, but those endpoints must not be treated as a public API. BSN's terms state that official statistics, results, and real-time data may originate from official sports-data providers, internal systems, and official league sources.

#### Licensing restriction

The current BSN terms state that the website and app are intended for personal, non-commercial use and explicitly prohibit mass extraction, copying, or scraping without written authorization from BSN. They also restrict commercial reproduction and publication without express written permission.

Therefore:

- Do not build the production system around an unapproved hidden BSN endpoint.
- Do not scrape BSN pages without written authorization.
- Contact BSN to request a direct data agreement, approved endpoint, export, or referral to its authorized data provider.

#### Data quality and reliability

BSN states that it makes reasonable efforts to keep data accurate and current, but does not guarantee uninterrupted or error-free data. If discrepancies occur, official BSN records prevail.

#### Pricing and rate limits

- No public API pricing was found.
- No public API rate limit was found.
- Commercial access must be negotiated with BSN or the relevant licensed provider.

#### Assessment

**Excellent source content, but production ingestion requires written authorization or a licensed provider.**

---

### 5.3 Sportradar

#### Verified BSN relationship

In March 2026, Sportradar announced an expanded BSN partnership. The announcement states that Sportradar holds exclusive worldwide betting and gaming audiovisual and data rights for BSN competitions, along with non-exclusive coaching and talent-scouting rights.

This confirms that Sportradar is an important official BSN data partner. It does **not**, by itself, confirm that the team's intended editorial, fan, or application use is included. The team must ask Sportradar and BSN whether a licensed BSN media/API product is available for this use case and whether the product includes redistribution to end users.

#### API and data capabilities

Sportradar offers B2B sports APIs and can provide:

- Schedules
- Results
- Live scores and event status
- Standings
- Teams and players
- Game and season statistics
- Historical information, depending on the package
- Push feeds, depending on product access

The exact BSN coverage level, schema, latency, and historical depth must be verified in a trial or sample feed.

#### Pricing

- Production pricing is quote-based.
- A 30-day trial is generally available for eligible API products.
- Some products and push feeds require sales approval and cannot be self-issued.

#### Rate limits

The documented default trial limits are:

- 30-day trial
- 1,000 requests per rolling 30-day period
- 1 query per second

Production quotas and QPS limits are product- and contract-specific and are displayed in the customer account.

#### Licensing

Redistribution, display rights, permitted platforms, territories, retention, caching, derived data, logos, images, and commercial use must be specified in the order form or agreement.

#### Reliability and documentation

- **Authority for BSN:** Potentially very high, given the official relationship.
- **Reliability:** High for a commercial feed, subject to contract and SLA.
- **Documentation:** High.
- **Integration complexity:** Medium to high because product onboarding, ID mapping, quotas, and commercial review are required.

#### Assessment

**Most realistic licensed BSN API candidate**, but the team must verify that the available package permits this product's non-betting use and downstream display.

---

### 5.4 Béisbol Doble A Puerto Rico

#### Supported coverage

The official Doble A site publishes:

- Current schedule
- Teams and sections
- Game dates and times
- Venues
- Results and game summaries
- Standings
- Transactions
- Live-broadcast links
- Season statistics files
- Historical standings archives

The site currently links season statistics from 2002 through 2026 and a standings archive from 1995 through 2025. This makes it the strongest verified historical source among the domestic league websites reviewed.

#### Live-score capability

The site publishes current results and game summaries and links to live broadcasts. A structured, documented, real-time scoring API was not verified. Therefore, it should not yet be classified as a guaranteed play-by-play or low-latency live-score provider.

#### API availability

No public developer API, API documentation, rate limits, or formal public feed was found.

#### Extraction options

Subject to written authorization, possible methods include:

1. Direct federation export or private API — preferred.
2. Authorized parsing of official HTML schedules and standings.
3. Authorized ingestion of linked season files.
4. Browser automation only when the approved content cannot be retrieved statically.

#### Pricing, rate limits, and licensing

- Public human access appears free.
- Production API pricing is not publicly documented.
- Rate limits are not publicly documented.
- Broad redistribution rights were not verified.
- The team must request written permission or a direct data agreement before automated production ingestion.

#### Reliability and integration complexity

- **Authority:** Very high for Doble A.
- **Reliability:** Medium; data is official, but formats span web pages and external files.
- **Documentation:** Low for developers.
- **Integration complexity:** Medium to high due to HTML/file parsing, schema differences, and historical format variation.

#### Assessment

**Recommended as the official Doble A source only after authorization.** A direct federation relationship is preferable to scraping.

---

### 5.5 Federación Puertorriqueña de Voleibol and DataFPV

#### Supported coverage

FPV publishes or links:

- LVSF schedules and results
- LVSM content
- Standings
- League bulletins
- Live-stat pages through DataFPV
- Federation news and competition announcements
- Other federation competitions and national-team news

The LVSF schedule includes game number, date, time, visiting team, home team, result, and postponement or rescheduling notes where applicable.

#### Live-score capability

FPV links directly to live results and statistics on DataFPV. This confirms that live information is available for at least some competitions. However, no public structured API documentation, authentication scheme, latency commitment, or redistribution license was verified.

#### Historical data

Historical information exists, but it is fragmented across:

- Competition pages
- PDFs
- Bulletins
- News posts
- DataFPV pages

A normalized historical feed was not verified.

#### Licensing and attribution

An official 2026 LVSF standings document requests that users credit the Federación Puertorriqueña de Voleibol when using the issued statistics. This is an attribution requirement, not necessarily a general commercial redistribution license. The team must obtain written permission for automated ingestion and public redistribution.

#### Pricing and rate limits

- No public API pricing was found.
- No public API rate limits were found.
- A direct FPV/DataFPV agreement is required to confirm technical and commercial conditions.

#### Reliability and integration complexity

- **Authority:** Very high for FPV competitions.
- **Reliability:** Medium; official but distributed across multiple formats and systems.
- **Documentation:** Low for developers.
- **Integration complexity:** High unless FPV or DataFPV provides a private structured feed.

#### Assessment

**Recommended through a direct FPV/DataFPV agreement.** Public pages are useful for manual verification and an authorized MVP importer.

---

### 5.6 Meta Graph API

#### Appropriate use

The Meta Graph API is useful for retrieving posts from official league or team Facebook Pages when the application has the required access and permissions. It can support:

- Postponement notices
- Venue changes
- Schedule corrections
- Roster announcements
- Broadcast announcements
- Emergency updates
- Links back to official sources

#### Inappropriate use

Meta should not be the canonical source for:

- Live scores
- Official standings
- Complete schedules
- Athlete season statistics
- Play-by-play
- Historical sports databases

Social posts are unstructured, may be edited or deleted, and may omit information.

#### Access and review

Access to public content from Pages the application does not manage may require the relevant Meta feature approval and app review. Page access tokens and permissions are required for managed Pages and certain Page endpoints.

#### Pricing and rate limits

- No universal per-request public price was identified.
- Meta applies platform rate limits that depend on the application, token, endpoint, and use case.
- The exact quota must be monitored through Meta's developer tools and response headers.

#### Licensing and reliability

Use must comply with Meta Platform Terms and the content owner's rights. Page content should be stored only as permitted. Reliability is medium for announcements and low for normalized sports data.

#### Integration complexity

Medium to high because of app review, token management, permissions, webhook or polling design, Page ownership, and policy compliance.

#### Assessment

**Use only as an alert and verification layer, not as the sports database.**

---

## 6. Data Field Comparison

Legend: **Yes** = clearly supported; **Partial** = visible or available inconsistently; **Contract** = expected but must be confirmed in the licensed product; **No** = not an appropriate source.

| Data field | FIBA GDAP | BSN licensed source | Sportradar BSN | Doble A official | FPV/DataFPV | Meta Graph API |
|---|---:|---:|---:|---:|---:|---:|
| League/competition | Yes | Yes | Contract | Yes | Yes | Partial |
| Season | Yes | Yes | Contract | Yes | Yes | Partial |
| Schedule | Yes | Yes | Contract | Yes | Yes | Partial |
| Venue | Yes | Yes | Contract | Yes | Partial | Partial |
| Game status | Yes | Yes | Contract | Partial | Partial | Partial |
| Live score | Yes | Yes | Contract | Not verified as structured feed | Visible; API not verified | No |
| Period/quarter score | Yes | Yes | Contract | Partial | Set result visible; detail varies | No |
| Play-by-play | Yes for supported games | Expected; confirm | Contract | Not verified | Not verified | No |
| Box score | Yes | Yes | Contract | Partial/files | Partial | No |
| Standings | Yes | Yes | Contract | Yes | Yes | No |
| Teams | Yes | Yes | Contract | Yes | Yes | Partial |
| Rosters | Yes | Yes | Contract | Partial | Partial | Partial |
| Athlete profile | Yes | Yes | Contract | Inconsistent | Inconsistent | Partial/unstructured |
| Athlete season stats | Yes | Yes | Contract | Available in season files | Varies | No |
| Team season stats | Yes | Yes | Contract | Yes/partial | Varies | No |
| Officials/referees | Yes | Confirm | Contract | Partial | Partial | No |
| Broadcast information | Partial | Yes | Contract | Links available | Partial | Yes, as announcements |
| Transactions | Competition-dependent | Yes/partial | Contract | Yes | Partial | Yes, as announcements |
| Historical seasons | Yes within scope | Confirm | Contract | Strong | Fragmented | Limited posts |
| Stable provider IDs | Yes | Confirm | Yes | Not guaranteed | Not guaranteed | Meta object IDs only |
| Images/logos rights | Separate confirmation | Separate confirmation | Separate package/rights | Not verified | Not verified | Subject to platform/content rights |

---

## 7. Pricing, Rate Limits, Licensing, and Technical Access

| Source | Public pricing | Public rate limits | Production access | Redistribution status |
|---|---|---|---|---|
| FIBA GDAP | Not public; fees may apply | Product-specific; FIBA may impose limits | Authentication and subscribed product | Limited license; contract must permit intended publication |
| BSN official platforms | No public API price | No public API limit | Written authorization or approved feed required | Scraping and mass extraction prohibited without written authorization |
| Sportradar | Quote-based production; eligible 30-day trial | Trial defaults: 1,000 requests per rolling 30 days and 1 QPS; production varies | Commercial account and product subscription | Defined by contract/order form; downstream display must be confirmed |
| Doble A official site | No public API price | Not documented | Direct agreement or written authorization | Not verified; obtain written permission |
| FPV/DataFPV | No public API price | Not documented | Direct agreement or written authorization | Attribution signal exists; broad redistribution still requires permission |
| Meta Graph API | No universal per-call price identified | App-, token-, endpoint-, and use-case-dependent | Meta app, tokens, permissions, and possibly app review | Subject to Meta terms and Page/content-owner rights |

### Questions that must be sent to every commercial or federation source

1. Does the license permit display in a public web or mobile application?
2. Does it permit redistribution through the project's own API?
3. Can data be cached, and for how long?
4. Can historical data be stored permanently?
5. Are derived standings, rankings, and analytics permitted?
6. Are team logos, player images, league marks, and video links included?
7. What territories, languages, platforms, and user volumes are permitted?
8. What are the request quotas, QPS limits, latency targets, and SLA?
9. What is the correction process for disputed or amended results?
10. What attribution is mandatory?
11. What happens to stored data when the agreement ends?
12. Are there separate restrictions for betting, gaming, editorial, scouting, or fan-engagement use?

---

## 8. Live-Score Capability Review

| Source | Live-score status | Expected latency | Recommended use |
|---|---|---|---|
| FIBA GDAP | Verified for supported FIBA games | Live polling guidance supports approximately 5–10 seconds | Canonical FIBA live feed |
| Licensed BSN/Sportradar feed | Likely strong; package must be verified | Contract-dependent | Canonical BSN live feed after approval |
| BSN public website/app | Live data visible | Unknown and unsupported for third-party automation | Human verification only unless BSN authorizes an endpoint |
| Doble A official site | Current results and broadcasts visible; structured live API not verified | Unknown | Schedule/results ingestion and manual live updates |
| FPV/DataFPV | Live statistics visible; public API not verified | Unknown | Use after direct agreement; otherwise manual verification |
| Meta Graph API | Announcement timing only | Minutes or longer; not deterministic | Postponements and correction alerts |

### Live-data rules

- Never label data as **live** unless the source provides a live status and the last successful update is within the league-specific freshness threshold.
- Display a **last updated** timestamp.
- Downgrade stale games from `LIVE` to `LIVE_DATA_DELAYED` rather than showing an apparently current score.
- Reconcile final scores after the game and again after the official record is published.
- Preserve corrections as new versions instead of overwriting audit history.

---

## 9. Realistic Strategy Comparison

### Option A — Licensed and Authorized Hybrid Ingestion

#### Description

Use FIBA GDAP for FIBA events, a licensed BSN/Sportradar channel for BSN, direct federation agreements for Doble A and FPV, and Meta only for announcements. Use a manual admin panel for gaps.

#### Advantages

- Strongest legal and licensing position
- Highest data authority
- Best path to true live scores
- Better schemas and stable identifiers where APIs exist
- Lower risk of selectors breaking
- Easier to define support, correction, and escalation procedures

#### Disadvantages

- Commercial quotes and negotiations are required
- Multiple agreements may be needed
- Integration schemas differ by provider
- Domestic federations may not have developer-ready feeds
- Launch timing may depend on external approvals

#### Cost profile

Medium to high and currently unknown. FIBA and Sportradar require product discussions; domestic league agreements may be free, paid, sponsored, or custom.

#### Overall assessment

**Recommended production strategy.**

---

### Option B — Authorized Official-Website Ingestion for the MVP

#### Description

Obtain written authorization from Doble A and FPV to ingest specific official pages or files. Use `requests` and BeautifulSoup for static content, approved XHR/JSON endpoints where explicitly permitted, and Playwright only as a fallback. Keep BSN out of automated scraping unless BSN provides written approval. Use manual live updates.

#### Advantages

- Lower initial cash cost
- Faster proof of concept for domestic leagues
- Uses official sources
- Can demonstrate the normalized database and admin workflow before purchasing feeds

#### Disadvantages

- Written authorization is still required
- HTML, CSS, PDF, and file formats can change
- Live performance may be limited
- Higher maintenance burden
- Historical formats may be inconsistent
- No provider SLA
- Browser automation consumes more resources and is more fragile

#### Cost profile

Low direct licensing cost if permission is granted, but medium to high engineering and maintenance cost.

#### Overall assessment

**Acceptable for an MVP only with written authorization and a manual fallback.** It should not be treated as the long-term live-data architecture.

---

### Option C — Manual-First Pilot

#### Description

Enter schedules, teams, standings, and final results through an admin panel while pursuing provider agreements. Import CSV files when official organizations can supply them.

#### Advantages

- No unauthorized automation
- Fastest way to validate the product workflow
- Full control over data corrections and schema
- Works even when no provider offers an API

#### Disadvantages

- Labor-intensive
- Not scalable for many competitions
- Slow live updates
- Higher risk of manual errors without review controls

#### Overall assessment

**Recommended only as the initial fallback and pilot mode, not the final product strategy.**

---

## 10. Recommended Technical Architecture

```text
Official APIs / Authorized Feeds / Approved Website Importers / Admin Entries
                                |
                                v
                         Source Adapters
                                |
                                v
                 Validation and Normalization Layer
                                |
                                v
                     Event Queue / Job Scheduler
                                |
                                v
                      Canonical Sports Database
                                |
             +------------------+------------------+
             |                                     |
             v                                     v
      Public Product API                    Admin Review Panel
```

### Suggested source adapters

- `fiba_gdap`
- `sportradar_bsn` or `bsn_authorized`
- `doble_a_authorized`
- `fpv_authorized`
- `meta_announcements`
- `csv_import`
- `manual_admin`

### Core normalization entities

- `Sport`
- `League`
- `Competition`
- `Season`
- `Stage`
- `GroupOrSection`
- `Team`
- `Athlete`
- `RosterMembership`
- `Venue`
- `Game`
- `GameStatus`
- `GameScoreSegment`
- `GameEvent`
- `StandingRow`
- `AthleteStatistic`
- `TeamStatistic`
- `Transaction`
- `Broadcast`
- `SourceRecord`
- `SourceIdentifierMap`
- `IngestionRun`
- `DataCorrection`
- `ManualOverride`

### Required source metadata on every record

- Source provider
- Source URL or source object ID
- Provider record ID
- First-seen timestamp
- Last-fetched timestamp
- Source-published timestamp, when available
- Data confidence
- Verification status
- License/attribution tag
- Ingestion method
- Current version

### Source priority

Use the following precedence when two sources conflict:

1. Licensed official API or direct league feed
2. Official competition record or federation-provided file
3. Authorized official website ingestion
4. Official league or team social announcement
5. Manually verified entry with evidence
6. Consumer aggregator used only as a cross-check

Final official records should override earlier live values while preserving the historical correction log.

---

## 11. Proposed Update Frequencies

These are implementation targets, not provider guarantees.

| Data type | Target frequency |
|---|---|
| League and season metadata | Daily during setup; weekly afterward |
| Teams and rosters | Daily in season; more frequently near roster deadlines |
| Future schedules | Daily; every 15 minutes on game day if the source permits |
| Licensed FIBA live games | Approximately every 5–10 seconds, following endpoint guidance and limits |
| Other licensed live feeds | Provider-defined cadence |
| Authorized local website results | Every 5–15 minutes during likely game windows, only if permitted and technically reasonable |
| Standings | After each final game and once more after official reconciliation |
| Official social announcements | Every 5–15 minutes or via approved webhooks where available |
| Historical imports | One-time batch plus correction jobs |

Polling must respect written authorization, robots controls where applicable, server capacity, and provider limits.

---

## 12. Manual Administrative Fallback

The admin workflow is required because some local data is unavailable through licensed APIs and official sites may be delayed or inconsistent.

### Required admin functions

- Create and edit leagues, seasons, stages, sections, teams, athletes, and venues
- Import schedules and rosters from CSV
- Create, postpone, reschedule, suspend, cancel, and finalize games
- Enter scores by quarter, period, inning, or set
- Record live game status and clock/inning/set when authorized data is unavailable
- Enter or correct standings
- Add roster changes and transactions
- Attach a source URL, document, screenshot reference, or official communication
- Mark a record as provisional, verified, disputed, corrected, or final
- Compare automated data against the manual correction
- Roll back an incorrect change
- View a complete audit log

### Approval controls

- A user may enter a correction.
- A second authorized user should approve final-score or standings changes when practical.
- Every override must include a reason and evidence.
- Manual values must not be overwritten automatically unless a reviewer approves the incoming official correction.

### Suggested status values

- `AUTOMATED_UNVERIFIED`
- `AUTOMATED_VERIFIED`
- `MANUAL_PROVISIONAL`
- `MANUAL_VERIFIED`
- `DISPUTED`
- `CORRECTED`
- `FINAL_OFFICIAL`
- `STALE_SOURCE`

### Fallback triggers

Use the admin workflow when:

- A provider is unavailable.
- A live record exceeds its freshness threshold.
- Two official sources disagree.
- A game is postponed or relocated without a structured update.
- A league issues a correction after the initial final result.
- A source omits a required field.
- An access token, quota, or provider subscription fails.

---

## 13. Data Not Reliably Available from the Reviewed External Sources

The following fields were not verified as consistently available across the required Puerto Rican leagues:

- A normalized real-time play-by-play feed for Doble A and FPV competitions
- Guaranteed game clock, inning, count, possession, or current-set state for every local game
- Stable universal athlete identifiers across leagues and seasons
- Consistent athlete biographies, height, weight, nationality, and headshots
- Complete injury and availability reports
- Uniform transaction data across all leagues
- Machine-readable historical schedules and box scores for every season
- Consistent venue geocodes and venue identifiers
- Officials and referee assignments for every competition
- Broadcast channels and streaming URLs in a consistent schema
- Public service-level agreements for league websites
- Public API pricing and rate limits for BSN, Doble A, FPV, and DataFPV
- Public redistribution rights for official domestic league website data
- Rights to team logos, league marks, player photos, and audiovisual media

These gaps justify both multiple source adapters and the manual admin fallback.

---

## 14. Reliability and Integration Scoring

Scores are project-fit estimates based on publicly verified information. They are not provider guarantees.

Scale: 1 = poor/high difficulty, 5 = excellent/low difficulty.

| Source | Authority | Live capability | Historical depth | Documentation | Licensing clarity | Integration ease | Overall project fit |
|---|---:|---:|---:|---:|---:|---:|---:|
| FIBA GDAP | 5 | 5 | 4 | 5 | 4 | 3 | 5 for FIBA competitions |
| BSN official platforms without agreement | 5 | 4 | 3 | 1 | 1 | 1 | 2 |
| Licensed BSN/Sportradar product | 5 | 5 | 4 | 5 | 4 after contract | 3 | 5 for BSN if available |
| Doble A official source with authorization | 5 | 2 | 5 | 1 | 3 after written approval | 2 | 4 |
| FPV/DataFPV with authorization | 5 | 3 | 3 | 1 | 3 after written approval | 2 | 4 |
| Meta Graph API | 4 for announcements | 1 | 2 | 4 | 3 | 3 | 3 as a supplemental source |
| Consumer score aggregators without contract | 3 | 4 | 3 | 1 | 1 | 1 | 1 for production; 3 for cross-checking |

---

## 15. Implementation Plan

### Phase 0 — Legal and provider validation

- Contact FIBA GDAP for product scope and quote.
- Contact BSN and Sportradar to confirm an editorial/fan-product API and redistribution rights.
- Contact the Federación de Béisbol de Puerto Rico for Doble A data permission or exports.
- Contact FPV and DataFPV for live/statistical feed access.
- Document permitted fields, caching, attribution, rate limits, and media rights.
- Do not begin production scraping before written authorization.

### Phase 1 — Manual-first MVP

- Build canonical league, season, team, athlete, game, score, and standings entities.
- Build the admin panel and audit log.
- Support CSV schedule, roster, and results imports.
- Load one current season from each target domestic league.
- Display source and last-updated information.

### Phase 2 — First official integrations

- Implement FIBA GDAP.
- Implement the approved BSN feed.
- Add provider ID mapping and reconciliation jobs.
- Add stale-data monitoring and incident alerts.

### Phase 3 — Authorized local-league automation

- Implement Doble A direct feed or authorized importer.
- Implement FPV/DataFPV direct feed or authorized importer.
- Add approved Meta Page monitoring for changes and announcements.

### Phase 4 — Historical expansion and quality controls

- Import Doble A historical statistics and standings.
- Normalize FPV historical PDFs and bulletins where permission allows.
- Add duplicate detection, conflict resolution, and correction analytics.
- Measure source latency, completeness, and error rates.

---

## 16. Acceptance Criteria for This Research Issue

- [x] At least two realistic strategies are compared.
- [x] Puerto Rican league coverage is documented.
- [x] Available data fields are compared.
- [x] Public pricing and rate-limit information is documented where available.
- [x] Licensing and redistribution risks are documented.
- [x] Live-score capabilities are evaluated.
- [x] Integration complexity is evaluated.
- [x] The need for multiple sources is determined.
- [x] A manual administrative fallback is defined.
- [x] A recommended provider and combined-data strategy is documented.
- [ ] Provider representatives have confirmed commercial terms and redistribution rights.
- [ ] The team has formally approved the final sports-data strategy.

---

## 17. Decisions Required from the Team

The issue can be closed after the team records decisions for the following:

1. Which leagues are required in the MVP?
2. Is true live scoring required in the MVP, or are final results sufficient for Doble A and FPV?
3. What annual or monthly data budget is acceptable?
4. Will the public product expose data through its own API, or only display it in the application?
5. How much historical depth is required at launch?
6. Are team logos and athlete images required?
7. Who will contact FIBA, BSN/Sportradar, Doble A, and FPV?
8. Who is authorized to perform and approve manual corrections?
9. What freshness threshold will the product use before labeling a live source as delayed?
10. Does the team approve the partner-first hybrid recommendation?

### Proposed approval record

```text
Selected strategy: Option A — Licensed and Authorized Hybrid Ingestion
Temporary MVP fallback: Option C — Manual-First Pilot
Approved by:
Approval date:
Conditions or budget limits:
Provider contacts assigned to:
```

---

## 18. Final Recommendation

Adopt a **multi-source, partner-first architecture**.

- Use **FIBA GDAP** for Puerto Rico's FIBA basketball competitions.
- Pursue a **licensed BSN or Sportradar feed** for BSN.
- Pursue **direct federation agreements** for Doble A and FPV/DataFPV.
- Use the **Meta Graph API only for official announcements and change detection**.
- Keep a **manual administrative workflow** as a permanent operational safety net.
- Do not use hidden endpoints or browser scraping in production unless the data owner grants written authorization for the exact use, frequency, storage, and redistribution model.

This approach provides the best balance of Puerto Rico coverage, data authority, live capability, maintainability, and legal safety.

---

## 19. References

### FIBA

- [FIBA Puerto Rico team profile](https://www.fiba.basketball/en/teams/125-puerto-rico)
- [FIBA players](https://www.fiba.basketball/en/players)
- [FIBA GDAP documentation](https://gdap-portal.fiba.basketball/documentation)
- [FIBA GDAP terms of service](https://gdap-portal.fiba.basketball/terms-of-services)
- [FIBA GDAP products and APIs](https://gdap-portal.fiba.basketball/products-apis)
- [FIBA GDAP integration principles](https://gdap-portal.fiba.basketball/integration-principles)

### BSN and Sportradar

- [BSN official website](https://www.bsnpr.com/)
- [BSN statistics](https://www.bsnpr.com/estadisticas)
- [BSN players](https://www.bsnpr.com/jugadores)
- [BSN terms and conditions](https://wp.bsnpr.com/terminos-y-condiciones/)
- [Sportradar and BSN partnership announcement, March 20, 2026](https://sportradar.com/content-hub/news/sportradar-and-bsn-strengthen-partnership-to-elevate-basketball-in-puerto-rico/)
- [Sportradar developer account, trials, and rate limits](https://developer.sportradar.com/getting-started/docs/your-account)

### Béisbol Doble A

- [Béisbol Doble A official website](https://beisboldobleapr.com/)
- [Doble A 2026 schedule](https://beisboldobleapr.com/calendar/calendario-2026/)
- [Doble A season statistics archive](https://beisboldobleapr.com/estadisticasportemporada/)
- [Doble A 2026 standings](https://beisboldobleapr.com/table/tabla-de-posiciones-2026/)

### Federación Puertorriqueña de Voleibol

- [FPV official website](https://fedpurvoli.com/)
- [LVSF 2026 schedule and results](https://fedpurvoli.com/calendario-y-resultados-lvsf-2026/)
- [DataFPV live statistics](https://www.datafpv.com/)

### Meta

- [Meta Graph API documentation](https://developers.facebook.com/docs/graph-api/)
- [Meta Graph API rate limiting](https://developers.facebook.com/docs/graph-api/overview/rate-limiting/)
- [Page Public Content Access](https://developers.facebook.com/docs/features-reference/page-public-content-access/)
- [Meta Platform Terms](https://developers.facebook.com/terms/)
