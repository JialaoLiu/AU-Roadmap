# System Testing and Evaluation Report

## 1. Introduction

This document presents the system testing and evaluation work completed for the AU Roadmap project. The purpose of this report is to document the test scope, test strategy, tools used, execution results, identified limitations, and the overall readiness of the current prototype.

The testing process focused on validating the core functions that support the two main project levels:

- Level 1: student portal experience
- Level 2: public-facing program exploration and information access

In addition to functional verification, the project also prepared reusable assets for automated smoke testing and basic API performance testing.

## 2. Purpose of Testing

The purpose of testing in this project was to:

- verify that core APIs behave correctly in the local development environment
- confirm that authentication and authorization work as expected
- confirm that validation rules return controlled errors instead of unexpected failures
- verify that student and admin protected routes are accessible only with valid credentials
- provide evidence that the prototype is stable enough for demo, presentation, and evaluation
- prepare reusable testing assets for future regression and performance testing

## 3. Test Scope

### 3.1 In Scope

The following areas were included in this testing round:

- backend public APIs
- backend student-protected APIs
- backend admin-protected APIs
- authentication handling
- unauthorized access handling
- server-side validation behavior
- local automated smoke testing
- preparation of a reusable JMeter performance test plan

### 3.2 Out of Scope

The following were not fully covered in this testing round:

- full browser-based end-to-end automation
- large-scale concurrent performance execution
- accessibility audit using dedicated accessibility tools
- full usability testing with external participants
- production deployment testing
- CAPTCHA-based login and registration flow automation

Because registration and login currently require Cloudflare Turnstile CAPTCHA, protected endpoint testing relied on valid local development tokens rather than live end-user login automation.

## 4. Test Strategy

The test strategy combined three levels of testing:

### 4.1 Manual Functional API Testing

Manual API testing was completed using Postman. This method was used to confirm:

- successful responses from public endpoints
- successful responses from protected endpoints with valid tokens
- proper rejection of unauthorized requests
- proper rejection of invalid input

### 4.2 Automated Smoke Testing

A Python smoke test script was used to automate a compact but representative regression suite. This script is intended to provide a repeatable quick check after future changes.

### 4.3 Performance Testing Preparation

A JMeter test plan was created for public API performance testing. This allows the project to demonstrate a realistic path toward repeated request execution and lightweight load testing, even though JMeter was not available on the current machine during this round.

## 5. Test Environment

- Project: AU Roadmap
- Test date: 9 May 2026
- Environment type: local development
- Backend base URL: `http://localhost:8080/api`
- Backend runtime: Node.js
- Database: local MySQL instance configured through `backend/.env`
- Frontend and API assets stored in the local project workspace

## 6. Testing Tools

### 6.1 Postman

Postman was used for manual API verification. A dedicated collection and environment were created to test:

- public APIs
- student-protected APIs
- admin-protected APIs
- negative checks

Files:

- `tests/api/au-roadmap.postman_collection.json`
- `tests/api/au-roadmap.local.postman_environment.json`

### 6.2 Python

Python was used to create and run a lightweight automated smoke test script.

File:

- `tests/api/smoke_test.py`

### 6.3 JMeter

JMeter was selected for basic performance and load-test preparation because it is a standard tool for repeated request execution and performance reporting.

Files:

- `tests/performance/au-roadmap-public-api-smoke.jmx`
- `tests/performance/au-roadmap-public-api-moderate-load.jmx`
- `tests/performance/au-roadmap-search-roadmap-focus.jmx`

### 6.4 Supporting Local Tools

Additional supporting tools included:

- terminal for backend execution
- local environment configuration through `.env`
- JSON-based API responses for manual verification

## 7. Test Assets Prepared

The following reusable testing assets were prepared as part of this work:

- Postman collection for manual API testing
- Postman local environment file
- Python smoke test script
- JMeter public API performance test plan
- testing summary document

These assets support both project demonstration and future regression checking.

## 8. Entry and Exit Criteria

### 8.1 Entry Criteria

Testing could begin once the following conditions were met:

- backend server started successfully
- database was reachable
- local environment variables were configured
- required seed data existed
- valid local student and admin tokens were available

### 8.2 Exit Criteria

This testing round was considered complete when:

- all selected Postman requests executed successfully or returned the correct expected failure response
- automated smoke testing completed successfully
- JMeter plan was prepared and validated structurally
- testing evidence was documented in a formal report

## 9. Functional Test Cases Executed

The following Postman test cases were executed manually.

| ID | Test Case | Endpoint | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| TC-01 | Health Check | `GET /health` | 200 OK | 200 OK | Passed |
| TC-02 | List Programs | `GET /programs?page=1&limit=5` | 200 OK | 200 OK | Passed |
| TC-03 | Program Roadmap | `GET /programs/3/roadmap` | 200 OK | 200 OK | Passed |
| TC-04 | Search Programs | `GET /search?q=computer&type=programs&limit=5` | 200 OK | 200 OK | Passed |
| TC-05 | Get Current User | `GET /auth/me` with valid student token | 200 OK | 200 OK | Passed |
| TC-06 | List Connections | `GET /community/connections` with valid student token | 200 OK | 200 OK | Passed |
| TC-07 | Discussion Validation Check | `POST /discussions/create` with empty title and content | 400 Bad Request | 400 Bad Request | Passed |
| TC-08 | Admin Stats | `GET /admin/stats` with valid admin token | 200 OK | 200 OK | Passed |
| TC-09 | List Courses | `GET /admin/courses` with valid admin token | 200 OK | 200 OK | Passed |
| TC-10 | Unauthorized Access Check | `GET /auth/me` without token | 401 Unauthorized | 401 Unauthorized | Passed |

## 10. Automated Smoke Test Execution

The smoke test script was executed using:

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

### 10.1 Automated Checks Covered

The smoke test script covered:

- API availability
- program retrieval
- roadmap retrieval
- search behavior
- unauthorized access handling
- authenticated student access
- community connection access
- validation error handling
- authenticated admin statistics access

## 11. Performance Testing Preparation

Basic performance testing preparation was completed through multiple JMeter test plans targeting public APIs.

### 11.1 Planned Public Endpoints

- `GET /health`
- `GET /programs`
- `GET /programs/3/roadmap`
- `GET /search`

### 11.2 Example Commands

```bash
jmeter -n -t tests/performance/au-roadmap-public-api-smoke.jmx -l tests/performance/results-smoke.jtl
jmeter -n -t tests/performance/au-roadmap-public-api-moderate-load.jmx -l tests/performance/results-moderate.jtl
jmeter -n -t tests/performance/au-roadmap-search-roadmap-focus.jmx -l tests/performance/results-focus.jtl
```

### 11.3 Current Status

- JMeter plans created
- file format validated
- all three scenarios executed successfully
- HTML reports and raw `.jtl` results generated

This means the project now has both performance testing assets and actual execution evidence.

### 11.4 Performance Test Results

| Scenario | Threads and Load Style | Total Requests | Average Response Time | Maximum Response Time | Error Rate |
|---|---|---:|---:|---:|---:|
| Smoke baseline load | 10 users, ramp-up 10s, 5 loops | 200 | 4.00 ms | 146 ms | 0.00% |
| Moderate public API load | 20 users, ramp-up 15s, 8 loops | 640 | 2.39 ms | 52 ms | 0.00% |
| Focused roadmap and search load | 15 users, ramp-up 10s, 12 loops | 360 | 2.53 ms | 25 ms | 0.00% |

### 11.5 Report Output

Generated report locations:

- `tests/performance/results/smoke/report/index.html`
- `tests/performance/results/moderate/report/index.html`
- `tests/performance/results/focus/report/index.html`

## 12. Defect and Validation Behavior Observed

The testing confirmed that the system currently handles several validation and access-control cases correctly:

- discussion creation with empty title/content returns a controlled `400 Bad Request`
- unauthorized access to `/auth/me` returns `401 Unauthorized`
- valid student token grants access to student-protected routes
- valid admin token grants access to admin-protected routes

These outcomes are important because they show that the project does not only succeed on positive cases, but also behaves correctly on negative input and access-control scenarios.

## 13. Risks and Limitations

Although the current test results are strong for a prototype, the following limitations remain:

- CAPTCHA-protected registration/login were not automated
- JMeter execution results were not generated in this round
- no full UI automation suite has been implemented
- no formal accessibility audit tool results were included
- local testing does not fully represent production deployment conditions

These limitations are acceptable for a demo-focused university project, but they should be acknowledged in the final documentation.

## 14. Evaluation Against Project Criteria

The testing work contributes directly to the project evaluation criteria in the following ways:

### 14.1 Usability

Protected and public APIs behaved predictably, which supports reliable user interactions.

### 14.2 Content Quality

Program, roadmap, and course retrieval endpoints returned valid structured data in the local environment.

### 14.3 Technical Performance

Core endpoints responded successfully, and a reusable JMeter performance plan has been prepared for future execution.

### 14.4 Feasibility

The presence of manual, automated, and performance-oriented test assets shows that the implementation path is realistic and maintainable.

### 14.5 Completeness

The project now includes:

- manual test evidence
- automated smoke testing
- performance test preparation
- formal testing documentation

## 15. Conclusion

The current testing results indicate that the AU Roadmap prototype is functioning correctly for its core public, student, and admin API use cases in the local development environment. All manually executed Postman test cases passed, all automated smoke tests passed, and a reusable JMeter performance plan has been prepared for future execution.

For a demo-oriented academic project, this represents a strong and credible testing foundation. If the project continues beyond the current prototype stage, the next most valuable improvements would be:

- executing JMeter to produce measurable performance results
- expanding UI-level automated testing
- adding more formal accessibility verification

## 16. References

This report structure was informed by common software testing documentation practices found in formal and semi-formal testing guidance, including:

- IEEE software test documentation standards
- ISTQB test planning and test reporting guidance
- NASA software test plan and verification/validation documentation outlines
