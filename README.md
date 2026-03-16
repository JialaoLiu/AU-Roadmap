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

