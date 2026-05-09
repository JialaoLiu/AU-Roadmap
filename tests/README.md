## API and Performance Testing Assets

This folder contains practical testing assets for the AU Roadmap project.

### Included files

- `api/au-roadmap.postman_collection.json`
  Functional API test collection for public, student, and admin endpoints.
- `api/au-roadmap.local.postman_environment.json`
  Local development environment variables for Postman.
- `api/smoke_test.py`
  Lightweight Python smoke test script for automated regression checks.
- `performance/au-roadmap-public-api-smoke.jmx`
  JMeter test plan for basic public API performance and load testing.
- `performance/au-roadmap-public-api-moderate-load.jmx`
  JMeter test plan for moderate concurrent public API load.
- `performance/au-roadmap-search-roadmap-focus.jmx`
  JMeter test plan focused on roadmap and search endpoints.

### Recommended usage

1. Start the backend server:

```bash
cd backend
npm install
npm run dev
```

2. Make sure the database is seeded and reachable on the local configuration in `backend/.env`.

3. Run one of the following:

#### Postman

- Import the collection and environment files into Postman
- Set `baseUrl` if your backend is not running on `http://localhost:8080/api`
- If needed, paste valid `studentToken` and `adminToken`

#### Python smoke test

```bash
python3 tests/api/smoke_test.py
```

Optional environment variables:

- `AU_TEST_BASE_URL`
- `AU_TEST_STUDENT_TOKEN`
- `AU_TEST_ADMIN_TOKEN`
- `AU_TEST_JWT_SECRET`
- `AU_TEST_STUDENT_ID`
- `AU_TEST_ADMIN_ID`
- `AU_TEST_STUDENT_EMAIL`
- `AU_TEST_ADMIN_EMAIL`

If tokens are not supplied, the script attempts to generate local dev tokens using the JWT secret in `backend/.env`.

#### JMeter

Run in GUI or CLI mode. Example CLI command:

```bash
jmeter -n -t tests/performance/au-roadmap-public-api-smoke.jmx -l tests/performance/results-smoke.jtl
jmeter -n -t tests/performance/au-roadmap-public-api-moderate-load.jmx -l tests/performance/results-moderate.jtl
jmeter -n -t tests/performance/au-roadmap-search-roadmap-focus.jmx -l tests/performance/results-focus.jtl
```

### Notes

- Because registration and login currently require Cloudflare Turnstile CAPTCHA, the automated assets focus on:
  - public endpoints
  - protected endpoints tested with pre-generated local development tokens
- The JMeter plans target public APIs only, which is safer and more repeatable for demo/performance reporting.
- The three prepared scenarios are:
  - smoke baseline load
  - moderate public API load
  - focused roadmap and search endpoint load
