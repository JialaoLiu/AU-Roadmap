# Defect Report — AU Roadmap Project

**Project:** Adelaide University Program Roadmap
**Reported By:** Jialao Liu
**Last Updated:** 14 April 2026
**Total Defects:** 22 (21 Fixed, 1 Open)

---

## Summary Table

| ID | Title | Severity | Priority | Status | Fixed Date |
|----|-------|----------|----------|--------|------------|
| #1 | Search bar redirects unauthenticated users to login | Medium | High | Fixed | Early Mar |
| #2 | Heading text colour unclear on dark backgrounds | Low | Low | Fixed | Early Mar |
| #3 | `.env` database configuration mismatch | High | High | Fixed | Early Mar |
| #4 | Database import errors on re-execution | Medium | High | Fixed | Early Mar |
| #5 | Login fails with 401 due to plaintext password in seed | High | High | Fixed | Early Mar |
| #6 | Console warning: `next()` callback deprecated in navigation guard | Low | Low | Fixed | Early Mar |
| #7 | Roadmap popup displays raw course ID instead of name | Medium | High | Fixed | 14 Apr |
| #8 | Search bar course result navigates to blank page | High | High | Fixed | 14 Apr |
| #9 | Homepage alumni data out of sync with Alumni page | Medium | Medium | Fixed | Late Mar |
| #10 | Post-merge: homepage alumni reverted to static data | High | High | Fixed | Late Mar |
| #11 | `ALTER TABLE ADD COLUMN IF NOT EXISTS` syntax error | High | High | Fixed | 1 Apr |
| #12 | `getConversations` API fails due to MySQL `only_full_group_by` | High | High | Fixed | 1 Apr |
| #13 | Adding `optionalAuth` broke three existing route files | High | High | Fixed | 1 Apr |
| #14 | Alumni user IDs mismatched between live DB and seed.sql | Medium | Medium | Fixed | 1 Apr |
| #15 | Program hero images not displaying on HomePage and ProgramPreviewPage | High | High | Fixed | 14 Apr |
| #16 | Adding a course defaults to CS program; no DB record found | Medium | Medium | Open | — |
| #17 | MIT Roadmap Y1 showed placeholder courses (COMP5101 etc.) | Medium | High | Fixed | 14 Apr |
| #18 | MIT Roadmap Y2S1 showed COMP5201 which student did not enrol in | Medium | High | Fixed | 14 Apr |
| #19 | Community Hub `getConversations` API MySQL GROUP BY error | High | High | Fixed | 1 Apr |
| #20 | Changing `auth.js` export broke three backend route files | High | High | Fixed | 1 Apr |
| #21 | `ALTER TABLE` migration script fails on MySQL | High | High | Fixed | 1 Apr |
| #22 | Alumni user ID mismatch between live DB and seed.sql | Medium | Medium | Fixed | 1 Apr |

---

## Detailed Reports

---

### Defect #1 — Search Bar Redirects Unauthenticated Users to Login Page

| | |
|---|---|
| **Module** | Global / Search Bar |
| **Component** | `frontend/src/components/common/SearchBar.vue` |
| **Severity** | Medium |
| **Priority** | High |
| **Status** | Fixed |

**Summary**
Search results for Alumni and Industry Partners linked to protected routes (`/student/alumni`, `/student/industry`). Unauthenticated users clicking these results were silently redirected to the login page with no explanation.

**Steps to Reproduce**
1. Visit the site without logging in
2. Use the global search bar and search for an alumni name or company
3. Click on an Alumni or Industry result

**Expected Result**
User is navigated to a publicly accessible page with the relevant information.

**Actual Result**
User is redirected to `/login` due to the navigation guard on the target route.

**Root Cause**
`navigateToResult` pointed to `requiresAuth: true` routes for alumni and industry results.

**Fix**
Changed navigation targets to public routes:
- Alumni → `/research/connect`
- Industry → `/research/connect#partner`

---

### Defect #2 — Heading Text Colour Unclear on Dark Backgrounds

| | |
|---|---|
| **Module** | UI / Multiple pages |
| **Severity** | Low |
| **Priority** | Low |
| **Status** | Fixed |

**Summary**
Page headings on dark-background sections used the default text colour, resulting in insufficient contrast and poor readability.

**Root Cause**
CSS did not override the default colour for headings inside dark hero/banner sections.

**Fix**
Applied high-contrast colours (white or near-white) to headings within dark-background components, aligning with WCAG contrast standards.

---

### Defect #3 — `.env` Database Configuration Mismatch

| | |
|---|---|
| **Module** | Backend / Config |
| **Component** | `backend/.env`, `backend/server.js` |
| **Severity** | High |
| **Priority** | High |
| **Status** | Fixed |

**Summary**
The backend failed to connect to MySQL on startup because `.env` values did not match the local MySQL instance, or `dotenv` was not loaded before the DB connection was initialised.

**Root Cause**
`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` either had incorrect values or `require('dotenv').config()` was not called at the top of `server.js` before the DB pool was created.

**Fix**
- Verified all `.env` values match the local MySQL configuration
- Confirmed `require('dotenv').config()` is the first statement in `server.js`

---

### Defect #4 — Database Import Errors on Re-execution

| | |
|---|---|
| **Module** | Database / Setup |
| **Component** | `database/schema.sql`, `database/seed.sql` |
| **Severity** | Medium |
| **Priority** | High |
| **Status** | Fixed |

**Summary**
Running `schema.sql` or `seed.sql` more than once produced fatal errors:
- `ERROR 1050: Table 'users' already exists`
- `ERROR 1062: Duplicate entry`

**Root Cause**
`schema.sql` used `CREATE TABLE` without `IF NOT EXISTS`. `seed.sql` inserted rows unconditionally without checking for duplicates.

**Fix**
- Changed all `CREATE TABLE` statements to `CREATE TABLE IF NOT EXISTS`
- Added guidance to `TRUNCATE` relevant tables before re-running `seed.sql`, or use `INSERT IGNORE`

---

### Defect #5 — Login Fails with 401 (Plaintext Password in Seed Data)

| | |
|---|---|
| **Module** | Auth / Login |
| **Component** | `database/seed.sql`, `backend/controllers/authController.js` |
| **Severity** | High |
| **Priority** | High |
| **Status** | Fixed |

**Summary**
All test accounts failed to log in, returning `Invalid email or password (401)`.

**Steps to Reproduce**
1. Run `seed.sql` on a fresh database
2. Attempt to log in with any seeded user

**Expected Result**
Login succeeds and JWT token is returned.

**Actual Result**
401 Unauthorized.

**Root Cause**
`seed.sql` stored passwords as plaintext strings (e.g. `"11111111"`). The auth controller uses `bcrypt.compare()` which cannot match a plaintext string against itself — it expects a bcrypt hash.

**Fix**
Replaced all plaintext passwords in `seed.sql` with the correct bcrypt hash:
```
$2b$10$gRRlccf5BYvcfJj4U3JDbuyiLrDuMwakSNS8RG6yMoFb5/U0N2J3W
```
(bcrypt hash of `11111111` with salt rounds = 10)

---

### Defect #6 — Console Warning: `next()` Callback Deprecated in Navigation Guard

| | |
|---|---|
| **Module** | Frontend / Router |
| **Component** | `frontend/src/router/index.js` |
| **Severity** | Low |
| **Priority** | Low |
| **Status** | Fixed |

**Summary**
Browser console showed: `The next() callback in navigation guards is deprecated and will be removed in a future release.`

**Root Cause**
`router.beforeEach` used Vue Router 3 style `next()` callbacks which are deprecated in Vue Router 4.

**Fix**
Replaced all `next(...)` calls with `return` statements:
```js
// Before
next({ name: 'Login' })

// After
return { name: 'Login' }
```

---

### Defect #7 — Roadmap Popup Displays Raw Course ID Instead of Course Name

| | |
|---|---|
| **Module** | Level 1 / My Roadmap |
| **Component** | `frontend/src/components/level1/RoadmapTimeline.vue` |
| **Severity** | Medium |
| **Priority** | High |
| **Status** | Fixed (14 Apr 2026) |
| **First Reported** | 18 Mar 2026 |

**Summary**
The course detail panel's Prerequisites and Required For sections displayed raw numeric IDs (e.g. `Course ID: 13`) instead of readable course codes and names.

**Steps to Reproduce**
1. Log in as `jialaoliu@adelaide.edu.au` / `11111111`
2. Navigate to **My Roadmap** (`/student/roadmap`)
3. Click a Year 2 course card
4. Observe the **Prerequisites** section in the right-hand panel

**Expected Result**
`● COMP SCI7207 — Web and Database Computing`

**Actual Result**
`Course ID: 13`

**Root Cause**
The template directly rendered `prereq.course_id` (an integer FK), with no mapping to course names. The `roadmap` prop already contained all course data but was never used for lookup.

**Fix**
Added `courseMap` computed property to flatten the roadmap into a `{ id: course }` lookup table:
```js
const courseMap = computed(() => {
  const map = {};
  props.roadmap.forEach(year =>
    year.semesters.forEach(sem =>
      sem.courses.forEach(c => { map[c.id] = c; })
    )
  );
  return map;
});
```
Template updated to resolve IDs with graceful fallback:
```html
<span v-if="courseMap[prereq.course_id]">
  {{ courseMap[prereq.course_id].code }} — {{ courseMap[prereq.course_id].name }}
</span>
<span v-else>Course {{ prereq.course_id }}</span>
```

**Verification Checklist**
- [ ] Year 2 course → Prerequisites shows course code + name
- [ ] Year 1 course → Required For shows dependent course name
- [ ] No prerequisites → Section does not render
- [ ] Cross-program prerequisites → Fallback `Course {id}` displayed

---

### Defect #8 — Search Bar Course Result Navigates to Blank Page

| | |
|---|---|
| **Module** | Global / Search Bar |
| **Component** | `frontend/src/components/common/SearchBar.vue`, `backend/controllers/searchController.js` |
| **Severity** | High |
| **Priority** | High |
| **Status** | Fixed (14 Apr 2026) |
| **First Reported** | 18 Mar 2026 |

**Summary**
Clicking a course result in the search dropdown navigated to a blank program detail page.

**Steps to Reproduce**
1. Use the search bar on any page
2. Type a course name (e.g. `Web and Database`)
3. Click any course result

**Expected Result**
Navigates to the program page containing that course (e.g. `/explore/programs/3`).

**Actual Result**
Navigates to `/explore/programs/23` (the course's own DB ID), which has no matching program — blank page rendered.

**Root Cause**
Two compounding issues:
1. `SearchBar.vue` used `item.id` (course ID) instead of `program_id` for navigation
2. `searchController.js` courses query did not join `program_courses`, so `program_id` was never returned

**Fix**
Backend — Added `LEFT JOIN program_courses` and returned `MIN(pc.program_id) AS program_id`.

Frontend — Updated navigation:
```js
else if (category === 'courses')
  router.push(item.program_id ? `/explore/programs/${item.program_id}` : '/explore');
```

**Verification Checklist**
- [ ] Course search result → navigates to correct program page
- [ ] Course with no program mapping → falls back to `/explore`
- [ ] Program / Alumni / Industry results unaffected

---

### Defect #9 — Homepage Alumni Data Out of Sync with Alumni Page

| | |
|---|---|
| **Module** | Homepage, Alumni Page |
| **Severity** | Medium |
| **Priority** | Medium |
| **Status** | Fixed |

**Summary**
The alumni carousel on the Homepage showed different alumni records from the Alumni page, causing data inconsistency visible to users.

**Root Cause**
The two pages called different API endpoints or queried different data sources, resulting in different datasets being displayed.

**Fix**
Unified both pages to use the same API endpoint, ensuring data consistency across the application.

---

### Defect #10 — Post-Merge: Homepage Alumni Reverted to Static Data

| | |
|---|---|
| **Module** | Homepage / Alumni |
| **Component** | `backend/controllers/programController.js` |
| **Severity** | High |
| **Priority** | High |
| **Status** | Fixed |

**Summary**
After a branch merge, the homepage alumni carousel stopped fetching from the database and displayed hardcoded static data.

**Root Cause**
After the alumni architecture was refactored (from a standalone `alumni` table to `users JOIN alumni_profiles`), `programController.js` functions `getFeaturedAlumni`, `getAllAlumni`, and `getProgramAlumni` still queried the old `alumni` table which no longer existed in the new schema.

**Fix**
Updated all three functions to query `users JOIN alumni_profiles`. Added `u.avatar_url AS photo_url` field alias to maintain frontend compatibility without requiring frontend changes.

---

### Defect #11 — `ALTER TABLE ADD COLUMN IF NOT EXISTS` Syntax Error

| | |
|---|---|
| **Module** | Database / Migration |
| **Severity** | High |
| **Priority** | High |
| **Status** | Fixed (1 Apr 2026) |

**Summary**
Database migration scripts failed to run because `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` is not supported in MySQL.

**Root Cause**
This syntax is valid in PostgreSQL but not in MySQL. MySQL's `ALTER TABLE ADD COLUMN` does not support conditional execution.

**Fix**
Replaced with a two-step approach:
1. Query `information_schema.columns` to check if the column exists
2. Execute `ALTER TABLE` only if the column is absent

---

### Defect #12 — `getConversations` API Fails Due to MySQL `only_full_group_by`

| | |
|---|---|
| **Module** | Community Hub / Messages |
| **Component** | `backend/controllers/communityController.js` |
| **Severity** | High |
| **Priority** | High |
| **Status** | Fixed (1 Apr 2026) |

**Summary**
The private messaging conversation list API returned a MySQL error, making the Messages tab non-functional.

**Root Cause**
MySQL's default `only_full_group_by` SQL mode rejected the query because `m.content` and `m.created_at` appeared in the `SELECT` clause but were not included in `GROUP BY` or wrapped in an aggregate function.

**Fix**
Restructured the query using a subquery:
1. Inner query: finds `MAX(id)` per conversation pair using `LEAST()/GREATEST()` to normalise direction
2. Outer query: joins back to `messages` on those max IDs to retrieve full message data

---

### Defect #13 — Adding `optionalAuth` Broke Three Existing Route Files

| | |
|---|---|
| **Module** | Backend / Auth Middleware |
| **Component** | `backend/middleware/auth.js`, `routes/auth.js`, `routes/discussions.js`, `routes/admin.js` |
| **Severity** | High |
| **Priority** | High |
| **Status** | Fixed (1 Apr 2026) |

**Summary**
After adding the `optionalAuth` middleware, the backend threw errors on startup and all authenticated routes became inaccessible.

**Root Cause**
`auth.js` was changed from a direct function export (`module.exports = authenticate`) to an object export (`module.exports = { authenticate, optionalAuth }`). The three route files that previously imported it as `const authenticate = require('../middleware/auth')` now received an object instead of a function.

**Fix**
Updated all three route files to use destructured imports:
```js
const { authenticate } = require('../middleware/auth');
```

---

### Defect #14 — Alumni User IDs Mismatched Between Live DB and seed.sql

| | |
|---|---|
| **Module** | Database / Alumni |
| **Component** | `database/seed.sql` |
| **Severity** | Medium |
| **Priority** | Medium |
| **Status** | Fixed (1 Apr 2026) |

**Summary**
After inserting alumni as real users, the `alumni_profiles` foreign key references failed on the live database.

**Root Cause**
`seed.sql` assumed alumni users would receive IDs 4–12 (immediately following the 3 test users). However, the live database had ID gaps from previously deleted records, so the alumni were actually assigned IDs 10–18, causing FK constraint violations when inserting `alumni_profiles`.

**Fix**
- Live DB: manually inserted `alumni_profiles` rows using the correct IDs (10–18)
- `seed.sql`: retained IDs 4–12 which remain correct for a fresh database initialisation

---

### Defect #15 — Program Hero Images Not Displaying

| | |
|---|---|
| **Module** | Homepage, Program Preview Page |
| **Component** | `frontend/src/pages/HomePage.vue`, `frontend/src/pages/level2/ProgramPreviewPage.vue` |
| **Severity** | High |
| **Priority** | High |
| **Status** | Fixed (14 Apr 2026) |

**Summary**
Program cards on the Homepage and the hero banner on the Program Preview page showed no images — only a plain background colour.

**Root Cause**
Two compounding issues:
1. Frontend templates referenced `program.image` / `p.image`, but the database field is named `banner_url`
2. All `banner_url` values in the `programs` table were `NULL` — image paths had never been populated

**Fix**
- Database: set `banner_url` for all 5 programs to `/program/hero-banner-*.jpg`
- `HomePage.vue`: `p.image` → `p.banner_url`
- `ProgramPreviewPage.vue`: `program.image` → `program.banner_url`
- `seed.sql`: updated `INSERT INTO programs` to include `banner_url` column with correct paths

---

### Defect #16 — Adding a Course Defaults to CS Program; No DB Record Found

| | |
|---|---|
| **Module** | TBD |
| **Severity** | Medium |
| **Priority** | Medium |
| **Status** | Open |

**Summary**
When adding a new course through the UI, it defaults to being associated with the Computer Science (CS) program. However, no corresponding record is created or found in the database.

**Root Cause**
To be investigated.

**Fix**
Pending.

---

### Defect #17 — MIT Roadmap Year 1 Showed Placeholder Courses

| | |
|---|---|
| **Module** | Level 1 / My Roadmap |
| **Component** | `database/seed.sql`, `database/program_courses` |
| **Severity** | Medium |
| **Priority** | High |
| **Status** | Fixed (14 Apr 2026) |

**Summary**
The MIT program's Year 1 Roadmap displayed fictional placeholder course codes (COMP5101, COMP5102, COMP5103, COMP5104) instead of the student's real enrolled courses.

**Root Cause**
`seed.sql` used invented course codes for MIT Year 1 that did not correspond to any real Adelaide University courses.

**Fix**
Replaced all Year 1 courses with real AdelaideU course codes and updated both `seed.sql` and the live `program_courses` table:
- Y1 S1: COMP SCI7207, COMP SCI7210, COMP SCI7211, PROJMGNT5021
- Y1 S2: COMP SCI7064, COMP SCI7081, COMP SCI7201, COMP SCI7212, COMP SCI7307

---

### Defect #18 — MIT Roadmap Y2S1 Showed Course Student Did Not Enrol In

| | |
|---|---|
| **Module** | Level 1 / My Roadmap |
| **Component** | `database/seed.sql`, `database/program_courses` |
| **Severity** | Medium |
| **Priority** | High |
| **Status** | Fixed (14 Apr 2026) |

**Summary**
COMP5201 Cybersecurity Fundamentals appeared in the student's Year 2 Semester 1 Roadmap despite the student not being enrolled in that course.

**Root Cause**
`seed.sql` incorrectly mapped COMP5201 to MIT Year 2 Semester 1 in `program_courses`.

**Fix**
Deleted the `program_courses` entry for `(program_id=3, course_id=17, year_level=2, semester=1)` from both the live database and `seed.sql`.

---

### Defect #19 — Community Hub `getConversations` MySQL GROUP BY Error

| | |
|---|---|
| **Module** | Community Hub / Messages |
| **Component** | `backend/controllers/communityController.js` |
| **Severity** | High |
| **Priority** | High |
| **Status** | Fixed (1 Apr 2026) |

**Summary**
*(Duplicate root cause to #12 — same MySQL `only_full_group_by` issue discovered independently in a separate query within `communityController.js`.)*

The `getConversations` endpoint failed, making the Messages tab render an empty list.

**Root Cause / Fix**
Same as Defect #12. Restructured the SQL using a subquery to derive `MAX(id)` per conversation, then joined back to retrieve full message rows.

---

### Defect #20 — Changing `auth.js` Export Broke Three Backend Route Files

| | |
|---|---|
| **Module** | Backend / Auth Middleware |
| **Severity** | High |
| **Priority** | High |
| **Status** | Fixed (1 Apr 2026) |

*(Duplicate of #13 — same root cause and fix.)*

---

### Defect #21 — `ALTER TABLE` Migration Script Fails on MySQL

| | |
|---|---|
| **Module** | Database / Migration |
| **Severity** | High |
| **Priority** | High |
| **Status** | Fixed (1 Apr 2026) |

*(Duplicate of #11 — same root cause and fix.)*

---

### Defect #22 — Alumni User ID Mismatch Between Live DB and seed.sql

| | |
|---|---|
| **Module** | Database / Alumni |
| **Severity** | Medium |
| **Priority** | Medium |
| **Status** | Fixed (1 Apr 2026) |

*(Duplicate of #14 — same root cause and fix, recorded separately when the issue was re-encountered during Community Hub development.)*

---

## Environment

| | |
|---|---|
| OS | macOS 25.1.0 |
| Browser | Chrome (latest) |
| Frontend | Vue 3 + Vite · `http://localhost:5173` |
| Backend | Node.js + Express · `http://localhost:8080` |
| Database | MySQL 8.x · `au_roadmap` |
| Branch | `jialao` |

---

*Report prepared by Jialao Liu · Industry Research Project · Adelaide University · 2026 S1*
