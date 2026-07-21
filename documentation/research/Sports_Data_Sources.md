# Sports Data Sources & Ingestion Strategy

## Sources List:
- https://www.fiba.basketball/en/players (FIBA - International Basketball Federation)
- https://beisboldobleapr.com (Beisbol Doble A - Puerto Rico Amateur Baseball League)
- https://bsnpr.com (BSN - Baloncesto Superior Nacional)
- https://fedpurvoli.com (FPV - Puerto Rican Volleyball Federation)
- https://developers.facebook.com (Meta Graph API)


## Suggestions & Technical Notes:
- Build a custom API using Python libraries like BeautifulSoup4 (BS4) and requests to extract static standings tables, or Selenium / Playwright to capture dynamic content from active seasons.
- Research the Selenium package via PyPI for automated browser interaction as a secondary alternative to Playwright.


## Data Extraction Methods Comparison

| Method | Performance | Stability | Server Resource Usage | Ideal Use Case in Your List |
| :--- | :--- | :--- | :--- | :--- |
| **1. Hidden API (XHR/JSON)** | Extremely Fast | Medium (Breaks if internal API changes) | Minimal | **FIBA** and **BSN** |
| **2. Static Scraping (`requests` + `BS4`)** | Fast | Low (HTML/CSS changes break selectors) | Low | **Beisbol Doble A** and **FPV** |
| **3. Dynamic Scraping (`Playwright` / `Selenium`)** | Slow | Low (Depends on selectors and load times) | High | Fallback for JavaScript-heavy or protected pages |
| **4. Official API (Meta Graph API)** | Fast | High (Officially supported by provider) | Minimal | **Meta Graph API** |


## Proposed Extraction Strategy by Source

1. **Hidden Endpoints (Network / Fetch / XHR):**
   - **Strategy:** Inspect internal JSON requests made by the browser using Browser DevTools (`F12`).
   - **Priority for:** **BSN** and **FIBA**.

2. **Static Scraping (`requests` + `BeautifulSoup4`):**
   - **Strategy:** Download raw HTML and parse standings tables and direct statistics.
   - **Priority for:** **Beisbol Doble A** and **FPV**.

3. **Dynamic Scraping (`Playwright` / `Selenium`):**
   - **Strategy:** Headless browser execution to handle dynamic JavaScript rendering or interactive UI elements.
   - **Priority for:** Backup fallback for **BSN**, **FIBA**, **Beisbol Doble A**, or **FPV** if static requests fail or require client-side execution.

4. **Official API (`Meta Graph API`):**
   - **Strategy:** Consume via developer tokens for legal extraction of official page posts and announcements.
   - **Priority for:** **Meta Graph API**.