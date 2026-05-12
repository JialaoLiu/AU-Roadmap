# API and Performance Testing Summary

## 1. Overview

This document summarises the API functional testing and basic performance testing assets prepared for the AU Roadmap project. The testing work focused on validating public APIs, student-protected APIs, admin-protected APIs, and negative authentication and validation scenarios in the local development environment.

## 2. Testing Environment

- Project: AU Roadmap
- Environment: Local development
- Backend base URL: `http://localhost:8080/api`
- Time of testing: 9 May 2026
- Database: Local MySQL instance configured through `backend/.env`

## 3. Testing Tools Used

### 3.1 Postman

Postman was used for manual functional API testing. A dedicated collection and environment were prepared for:

- public API testing
- student-protected API testing
- admin-protected API testing
- negative validation and authentication testing

Files:

- `tests/api/au-roadmap.postman_collection.json`
- `tests/api/au-roadmap.local.postman_environment.json`

### 3.2 Python Smoke Test Script

A lightweight Python regression script was created to automate a compact set of API checks.

File:

- `tests/api/smoke_test.py`

### 3.3 JMeter

A JMeter test plan was prepared for basic public API performance and load testing.

Files:

- `tests/performance/au-roadmap-public-api-smoke.jmx`
- `tests/performance/au-roadmap-public-api-moderate-load.jmx`
- `tests/performance/au-roadmap-search-roadmap-focus.jmx`

Note:
The JMeter test plans were prepared, validated, and later executed successfully in the local environment.

## 4. Postman Functional Testing Results

The following requests were executed manually in Postman using the prepared collection and local environment.

| Test Case | Endpoint | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| Health Check | `GET /health` | 200 OK | 200 OK | Passed |
| List Programs | `GET /programs?page=1&limit=5` | 200 OK | 200 OK | Passed |
| Program Roadmap | `GET /programs/3/roadmap` | 200 OK | 200 OK | Passed |
| Search Programs | `GET /search?q=computer&type=programs&limit=5` | 200 OK | 200 OK | Passed |
| Get Current User | `GET /auth/me` | 200 OK with valid student token | 200 OK | Passed |
| List Connections | `GET /community/connections` | 200 OK with valid student token | 200 OK | Passed |
| Discussion Validation Check | `POST /discussions/create` with empty title/content | 400 Bad Request | 400 Bad Request | Passed |
| Admin Stats | `GET /admin/stats` | 200 OK with valid admin token | 200 OK | Passed |
| List Courses | `GET /admin/courses` | 200 OK with valid admin token | 200 OK | Passed |
| Unauthorized User Check | `GET /auth/me` without token | 401 Unauthorized | 401 Unauthorized | Passed |

### 4.1 Notes on Token-based Testing

Because registration and login currently depend on Cloudflare Turnstile CAPTCHA, protected route testing was completed using valid local development JWT tokens for:

- student user
- admin user

This approach allowed protected endpoints to be tested consistently in the local environment.

## 5. Python Automated Smoke Test Results

The Python smoke test script was executed successfully against the local backend.

Command used:

```bash
python3 tests/api/smoke_test.py
```

Execution result:

```text
Running smoke tests against: http://localhost:8080/api
PASS  GET /health
PASS  GET /programs
PASS  GET /programs/3/roadmap
PASS  GET /search
PASS  GET /auth/me unauthorized
PASS  GET /auth/me as student
PASS  GET /community/connections as student
PASS  POST /discussions/create validation
PASS  GET /admin/stats as admin

Summary: 9/9 tests passed
```

### 5.1 Automated Checks Covered

The smoke test script verified:

- API health endpoint
- program listing
- roadmap retrieval
- search functionality
- unauthorized authentication handling
- authenticated student access
- student community connections access
- discussion validation handling
- authenticated admin stats access

## 6. JMeter Performance Testing Preparation

JMeter test plans were created for basic public API performance testing. These plans are suitable for demonstrating:

- repeated API requests
- response stability under light load
- public endpoint performance reporting

Prepared target scope:

- `GET /health`
- `GET /programs`
- `GET /programs/3/roadmap`
- `GET /search`

Planned example commands:

```bash
jmeter -n -t tests/performance/au-roadmap-public-api-smoke.jmx -l tests/performance/results-smoke.jtl
jmeter -n -t tests/performance/au-roadmap-public-api-moderate-load.jmx -l tests/performance/results-moderate.jtl
jmeter -n -t tests/performance/au-roadmap-search-roadmap-focus.jmx -l tests/performance/results-focus.jtl
```

Execution status:

- test plan files created
- file format validated
- all three JMeter scenarios executed successfully
- HTML reports generated for each scenario

### 6.1 Executed Scenarios and Results

| Scenario | Requests Executed | Average Response Time | Maximum Response Time | Error Rate |
|---|---:|---:|---:|---:|
| Smoke baseline load | 200 | 4.00 ms | 146 ms | 0.00% |
| Moderate public API load | 640 | 2.39 ms | 52 ms | 0.00% |
| Focused roadmap and search load | 360 | 2.53 ms | 25 ms | 0.00% |

### 6.2 Report Locations

- `tests/performance/results/smoke/report/index.html`
- `tests/performance/results/moderate/report/index.html`
- `tests/performance/results/focus/report/index.html`

## 7. Testing Outcome Summary

The functional API testing results were successful in the current local environment.

- All manually executed Postman test cases passed
- All 9 Python smoke tests passed
- Negative validation and unauthorized access checks behaved correctly
- Protected student and admin routes were successfully accessed with valid local tokens
- Reusable JMeter performance test assets were prepared and executed successfully

## 8. Conclusion

The current testing results show that the core public, student, and admin API endpoints used in the AU Roadmap demo are functioning correctly in the local development environment. In addition, reusable testing assets were prepared and successfully used for manual testing, automated smoke testing, and performance testing.
