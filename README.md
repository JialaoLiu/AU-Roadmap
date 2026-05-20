# AU Roadmap

AU Roadmap is a web-based platform developed for the Adelaide University Industry Research Project. It supports two main audiences:

- Current students who need a central portal for program roadmap, timetable, resources, industry connections, and community interaction.
- Prospective students who need a public-facing program discovery experience with program previews, career outcomes, campus life, application guidance, and a short recommendation quiz.

The project uses a Vue 3 frontend, an Express backend, and a MySQL database.

## Quick Start

For a new computer, run the setup script from the project root:

```bash
bash setup.sh
```

The script will:

- Check Node.js and npm.
- Install backend and frontend dependencies.
- Ask for MySQL connection details.
- Generate `backend/.env` and `frontend/.env` after confirmation if those files already exist.
- Import `database/schema.sql` and `database/seed.sql` if MySQL CLI is available.
- Start the backend and frontend development servers.

After setup, open:

- Frontend: `http://localhost:5173`
- Backend health check: `http://localhost:8080/api/health`

Useful setup options:

```bash
bash setup.sh --no-start
bash setup.sh --no-db
bash setup.sh --help
```

## Prerequisites

- Node.js `20.19+` or newer
- npm
- MySQL `8.0+`
- Git

Recommended macOS installation:

```bash
brew install node mysql
brew services start mysql
```

If you do not use Homebrew, install Node.js from `https://nodejs.org/` and MySQL from `https://dev.mysql.com/downloads/mysql/`.

## Test Accounts

All seeded test account passwords are:

```text
11111111
```

| Role | Email |
| --- | --- |
| Admin | `admin@example.com` |
| Current Student | `jialaoliu@adelaide.edu.au` |
| Prospective Student | `prospect@example.com` |

## Manual Setup

Use this section if the setup script is not suitable for your environment.

### 1. Install Dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Configure Environment Files

Create `backend/.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=au_roadmap
DB_PORT=3306

JWT_SECRET=replace_with_a_long_random_secret

PORT=8080

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

Create `frontend/.env`:

```env
VITE_API_BASE_URL=/api
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

Cloudinary values are optional for most local demo flows. Local avatar and community post image uploads use the project public folders.

### 3. Create and Seed the Database

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p au_roadmap < database/seed.sql
```

If your local MySQL root account has no password, omit `-p`.

### 4. Run the Application

Open two terminal windows.

Terminal 1:

```bash
cd backend
npm run dev
```

Terminal 2:

```bash
cd frontend
npm run dev
```

## Main Features

### Level 1 Student Portal

- Dashboard overview with roadmap-oriented program summary.
- My Study Roadmap with year/semester course structure.
- Community Hub with posts, image upload, replies, and student/alumni interaction.
- Timetable page using Adelaide timezone handling.
- Industry connections and student resources.
- My Profile with read-only account information and avatar upload.

### Level 2 Public Website

- Homepage and program discovery entry points.
- Explore Programs with filtering and program cards.
- Program Preview pages for detailed program information.
- Program Recommendation Quiz.
- Application Guide.
- Campus Life.
- Career Outcomes.

### Admin Portal

- Admin dashboard.
- Manage programs, courses, alumni, industry data, career data, and users.
- Program-course relationship management for roadmap data.

### Research Pages

- Research homepage.
- Research impact.
- Research support.
- Research institutes.
- Research events.
- Research connection page.

## Project Structure

```text
AU Roadmap/
├── backend/
│   ├── config/          Database configuration
│   ├── controllers/     Express controller logic
│   ├── middleware/      Auth, role guard, and error handling
│   ├── routes/          API route definitions
│   ├── utils/           Shared response helpers
│   ├── .env.example     Backend environment template
│   └── server.js        Backend entry point
├── database/
│   ├── schema.sql       MySQL schema
│   └── seed.sql         Demo data and test accounts
├── docs/                Project documentation and reports
├── frontend/
│   ├── public/          Static public files and uploaded demo assets
│   ├── src/
│   │   ├── api/         Axios API wrappers
│   │   ├── assets/      Images and global styles
│   │   ├── components/  Shared Vue components
│   │   ├── layouts/     Default, Level 1, Level 2, and admin layouts
│   │   ├── pages/       Page-level Vue components
│   │   ├── router/      Vue Router configuration
│   │   └── stores/      Pinia stores
│   ├── .env.example     Frontend environment template
│   └── index.html
├── tests/               API, smoke, and performance test materials
├── README.md
└── setup.sh
```

## API Overview

Default backend base URL:

```text
http://localhost:8080/api
```

Main route groups:

- `/api/auth`
- `/api/programs`
- `/api/admin`
- `/api/search`
- `/api/discussions`
- `/api/community`
- `/api/health`

The frontend development server proxies `/api` requests to `http://localhost:8080`.

## Development Commands

Backend:

```bash
cd backend
npm run dev
npm start
```

Frontend:

```bash
cd frontend
npm run dev
npm run build
```

## Testing Materials

Testing files and supporting reports are stored under:

```text
tests/
docs/
```

The project includes API testing, smoke testing, and performance testing materials prepared for the final project documentation.

## Common Issues

### Vite shows `ECONNREFUSED` for `/api/...`

The frontend is running, but the backend is not running. Start the backend:

```bash
cd backend
npm run dev
```

### MySQL import fails

Check that MySQL is running and your credentials match `backend/.env`.

On macOS with Homebrew:

```bash
brew services start mysql
```

### Favicon or static image does not update immediately

Browsers cache favicons and static assets aggressively. Restart `npm run dev`, hard refresh the page, or open the site in a private browsing window.

### Port already in use

Default ports:

- Frontend: `5173`
- Backend: `8080`
- MySQL: `3306`

Stop the conflicting process or change `PORT` in `backend/.env`.

## Delivery Notes

Before submitting or sharing the source code:

- Do not commit real secrets in `.env` files.
- Use `.env.example` as the safe configuration reference.
- Confirm `database/schema.sql` and `database/seed.sql` are included.
- Confirm `README.md`, `setup.sh`, `docs/`, and `tests/` are included.
- Run `cd frontend && npm run build` to confirm the frontend builds successfully.
