# JMeter Performance Test Execution Record

## 1. Overview

This document records the actual JMeter performance test execution completed for the AU Roadmap project in the local development environment.

Three JMeter scenarios were executed:

- smoke baseline load
- moderate public API load
- focused roadmap and search load

## 2. Test Environment

- Backend base URL: `http://localhost:8080/api`
- Backend server: local Node.js server running during test execution
- Database: local MySQL instance
- Test tool: Apache JMeter
- Test date: 9 May 2026

## 3. Executed Test Plans

### 3.1 Smoke Baseline Load

File:

- `tests/performance/au-roadmap-public-api-smoke.jmx`

Purpose:

- verify stable baseline performance under light concurrent public traffic

Target endpoints:

- `GET /api/health`
- `GET /api/programs`
- `GET /api/programs/3/roadmap`
- `GET /api/search`

Configuration:

- threads: `10`
- ramp-up: `10 seconds`
- loops: `5`

Result summary:

- total requests: `200`
- average response time: `4.00 ms`
- maximum response time: `146 ms`
- error rate: `0.00%`

Per-endpoint summary:

| Endpoint | Count | Average | Min | Max | Errors |
|---|---:|---:|---:|---:|---:|
| `GET /api/health` | 50 | 3.12 ms | 1 ms | 81 ms | 0 |
| `GET /api/programs` | 50 | 6.24 ms | 2 ms | 146 ms | 0 |
| `GET /api/programs/3/roadmap` | 50 | 4.08 ms | 1 ms | 22 ms | 0 |
| `GET /api/search` | 50 | 2.58 ms | 1 ms | 6 ms | 0 |

Raw result file:

- `tests/performance/results/smoke/results.jtl`

HTML report:

- `tests/performance/results/smoke/report/index.html`

---

### 3.2 Moderate Public API Load

File:

- `tests/performance/au-roadmap-public-api-moderate-load.jmx`

Purpose:

- simulate a slightly heavier public demo workload with more users and more total requests

Target endpoints:

- `GET /api/health`
- `GET /api/programs`
- `GET /api/programs/3/roadmap`
- `GET /api/search`

Configuration:

- threads: `20`
- ramp-up: `15 seconds`
- loops: `8`

Result summary:

- total requests: `640`
- average response time: `2.39 ms`
- maximum response time: `52 ms`
- error rate: `0.00%`

Per-endpoint summary:

| Endpoint | Count | Average | Min | Max | Errors |
|---|---:|---:|---:|---:|---:|
| `GET /api/health` | 160 | 1.28 ms | 0 ms | 20 ms | 0 |
| `GET /api/programs` | 160 | 2.71 ms | 1 ms | 7 ms | 0 |
| `GET /api/programs/3/roadmap` | 160 | 3.36 ms | 1 ms | 52 ms | 0 |
| `GET /api/search` | 160 | 2.23 ms | 0 ms | 4 ms | 0 |

Raw result file:

- `tests/performance/results/moderate/results.jtl`

HTML report:

- `tests/performance/results/moderate/report/index.html`

---

### 3.3 Focused Roadmap and Search Load

File:

- `tests/performance/au-roadmap-search-roadmap-focus.jmx`

Purpose:

- focus testing on two relatively more data-rich public endpoints:
  - roadmap
  - search

Target endpoints:

- `GET /api/programs/3/roadmap`
- `GET /api/search`

Configuration:

- threads: `15`
- ramp-up: `10 seconds`
- loops: `12`

Result summary:

- total requests: `360`
- average response time: `2.53 ms`
- maximum response time: `25 ms`
- error rate: `0.00%`

Per-endpoint summary:

| Endpoint | Count | Average | Min | Max | Errors |
|---|---:|---:|---:|---:|---:|
| `GET /api/programs/3/roadmap` | 180 | 3.04 ms | 1 ms | 25 ms | 0 |
| `GET /api/search` | 180 | 2.02 ms | 1 ms | 4 ms | 0 |

Raw result file:

- `tests/performance/results/focus/results.jtl`

HTML report:

- `tests/performance/results/focus/report/index.html`

## 4. Overall Result

All three JMeter performance test scenarios completed successfully.

### Combined Observations

- all requests completed without errors
- all error rates were `0.00%`
- public APIs remained responsive under light and moderate local test load
- roadmap and search endpoints also remained stable in the focused scenario

## 5. Conclusion

The JMeter test execution indicates that the AU Roadmap public APIs are stable under the current local demo workload. While these results do not represent production-scale benchmarking, they provide credible evidence that the prototype can handle repeated public API access reliably in a local development environment.
