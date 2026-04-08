# Adelaide University Program Roadmap

A web platform designed for Adelaide University to help **current students** plan their study progression and connect with industry/alumni, and **prospective students** explore programs, career outcomes, and campus life.

Built as part of the Industry Research Project (IRP) course, Semester 1, 2026.

## Features

### Level 1 — Current Students (Authenticated)
- **Dashboard** — personalized overview of enrolled program, progress, and key dates
- **Roadmap** — interactive course roadmap with prerequisites, year/semester layout, and completion tracking
- **Industry Connections** — browse industry partners filtered by partnership type
- **Alumni Network** — featured alumni profiles with success stories
- **Student Resources** — categorized links to academic, career, wellbeing, and technology resources

### Level 2 — Prospective Students (Public)
- **Explore Programs** — search and filter programs by level, faculty, and keywords
- **Program Preview** — detailed program pages with overview, courses, careers, and alumni tabs
- **Career Outcomes** — data visualizations (Chart.js) for salary, employment rates, and demand
- **Campus Life** — highlights of facilities, clubs, city, and accommodation
- **Application Guide** — step-by-step guide, key dates, and FAQ

### Research & Innovation (Public)
- **Research Home** — overview with stats, leadership, performance rankings, ERA results, institutes, centres, facilities
- **Research Impact** — impact stories and Discovery Podcast series
- **Connect With Us** — industry partnerships, ThincLab incubator, graduate research training, commercialisation
- **Research Support** — researcher portal, graduate school, HPC and technology support
- **Research Institutes** — 8 institute cards (AIML, Environment, ISER, IPAS, Robinson, SAiGENCI, Waite, DSI)
- **Research Events** — Research Tuesdays, upcoming events calendar, past highlights

### Admin Panel
- Full CRUD management for programs, courses, alumni, industry partners, career data, and users
- Role-based access control (student / prospective / admin)

### Search
- Unified search across programs, courses, alumni, industry partners, and career paths

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vue.js 3 (Composition API) + Vite + Vue Router 4 + Pinia |
| Backend | Node.js + Express.js (RESTful API) |
| Database | MySQL (14 tables) |
| Auth | JWT + bcrypt with role-based middleware |
| Charts | Chart.js + vue-chartjs |
| Styling | CSS Variables, scoped styles, Material Symbols Outlined icons |

## Project Structure

```
AU-Roadmap/
├── backend/
│   ├── config/          # DB and Cloudinary config
│   ├── controllers/     # Route handlers (auth, admin, program, search)
│   ├── middleware/       # auth, roleGuard, errorHandler
│   ├── routes/          # Express route definitions
│   ├── utils/           # Response helpers
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── api/         # Axios API layer
│   │   ├── assets/      # Images, CSS variables, shared styles
│   │   ├── components/  # Reusable components (Header, Footer, SearchBar, etc.)
│   │   ├── layouts/     # Default, Level1, Level2, Admin layouts
│   │   ├── pages/       # All page components (level1/, level2/, research/, admin/)
│   │   ├── router/      # Vue Router config
│   │   └── stores/      # Pinia stores (auth, ui)
│   └── index.html
├── database/
│   ├── schema.sql       # 14-table schema
│   └── seed.sql         # Test data with 3 programs, courses, alumni, etc.
└── setup.sh             # One-click setup script
```

## Getting Started

### Prerequisites
- Node.js >= 20.19.0
- MySQL 8.0+ 

### 1. Database Setup

```bash
# macOS
mysql -u root < database/schema.sql
mysql -u root au_roadmap < database/seed.sql

# Linux / password-protected MySQL
mysql -u root -p < database/schema.sql
mysql -u root -p au_roadmap < database/seed.sql
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Edit `.env` with your settings:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=          
DB_NAME=au_roadmap
DB_PORT=3306
JWT_SECRET=your_jwt_secret_here
PORT=8080
CORS_ORIGIN=http://localhost:5173
```

Backend runs at `http://localhost:8080`

### 3. Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

### Test Accounts

All test account passwords: `11111111`

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | 11111111 |
| Student | jialaoliu@adelaide.edu.au | 11111111 |
| Prospective | prospect@example.com | 11111111 |



# 3. Roadmap - Git Branch Usage Guide
# IMPORTANT for dev

To ensure clean collaboration, **each team member must work on their own branch**.
**Never commit directly to the `main` branch.** All changes must go through pull requests (PRs).

## Assigned Development Branches

Current dev branches for each member:
(example)
- Jialao: dev/jialao
- Nhat Tan: dev/nhattan
- Deze: dev/deze

## Step 1: Create Your Branch (One-time setup)

Start from the latest `main` branch:

```bash
git checkout main
git pull origin main

git checkout -b dev/yourname
git push -u origin dev/yourname
```

Replace `yourname` with your actual name or alias.

## Step 2: Keep Your Branch Updated with `main`

Before you start working, always sync with the latest `main` to avoid conflicts:

```bash
git checkout main
git pull origin main

git checkout dev/yourname
git rebase main        # or: git merge main
```

If conflicts occur, fix them, then:

```bash
git add .
git rebase --continue
```

Then push your updated branch:

```bash
git push -f     # Use force push only after rebase
```

## Step 3: Commit and Push Your Changes

```bash
git add .
git commit -m "feat: add login page"
git push
```

## Step 4: Submit a Pull Request (PR)

After finishing your task:

1. Go to the GitHub repository
2. Click "Compare & pull request"
3. Fill in PR title and description (e.g., what changed, what was tested)
4. Submit PR → team lead will review and merge

## Step 5: How to Sync main into Your Branch When Behind

If your branch shows something like "33 commits behind main":

1. Go to the repository on GitHub
2. Switch to your branch (e.g., dev/jialao)
3. Click "Compare & pull request" (if available) to merge main into your branch

Or use terminal commands:
```bash
git checkout dev/yourname
git pull origin main
git push origin dev/yourname
```

## Notes

- Never commit or push directly to `main`
- Always work in your own branch (e.g., `dev/yournanme`)
- Sync with `main` regularly using rebase or merge
- All changes must go through a PR

If your branch shows **"nothing to compare"** when opening a PR, it means your branch was not created from the latest `main`. Please recreate your branch correctly or contact Jialao for help.

---

Maintained: **Jialao(Jarvis)**
