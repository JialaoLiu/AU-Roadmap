#!/usr/bin/env bash

# AU Roadmap - first-time local setup helper
# Usage:
#   bash setup.sh
#   bash setup.sh --no-db
#   bash setup.sh --no-start

set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

SKIP_DB=false
START_SERVERS=true

for arg in "$@"; do
  case "$arg" in
    --no-db)
      SKIP_DB=true
      ;;
    --no-start)
      START_SERVERS=false
      ;;
    -h|--help)
      echo "Usage: bash setup.sh [--no-db] [--no-start]"
      echo "  --no-db     Skip MySQL schema and seed import"
      echo "  --no-start  Install/configure only; do not run servers"
      exit 0
      ;;
    *)
      echo "Unknown option: $arg"
      echo "Run: bash setup.sh --help"
      exit 1
      ;;
  esac
done

print_step() {
  echo ""
  echo "========================================="
  echo "  $1"
  echo "========================================="
}

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Error: $1 is not installed or not available in PATH."
    echo "$2"
    exit 1
  fi
}

prompt_default() {
  local prompt="$1"
  local default="$2"
  local value
  read -r -p "$prompt [$default]: " value
  echo "${value:-$default}"
}

generate_jwt_secret() {
  if command -v openssl >/dev/null 2>&1; then
    openssl rand -hex 32
  else
    date +%s | shasum -a 256 | awk '{print $1}'
  fi
}

should_write_env() {
  local env_file="$1"
  local answer

  if [ ! -f "$env_file" ]; then
    return 0
  fi

  read -r -p "$env_file already exists. Overwrite it? [y/N]: " answer
  case "$answer" in
    y|Y|yes|YES)
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

print_step "AU Roadmap Setup"
echo "Project root: $ROOT_DIR"

print_step "Checking Runtime"
require_command node "Install Node.js 20.19+ from https://nodejs.org/ or use nvm."
require_command npm "npm should be installed together with Node.js."

NODE_MAJOR="$(node -p "process.versions.node.split('.')[0]")"
echo "Node.js: $(node -v)"
echo "npm: $(npm -v)"

if [ "$NODE_MAJOR" -lt 20 ]; then
  echo "Warning: this project expects Node.js 20.19+ or newer."
fi

print_step "Installing Dependencies"
echo "Installing backend dependencies..."
(cd "$BACKEND_DIR" && npm install)

echo "Installing frontend dependencies..."
(cd "$FRONTEND_DIR" && npm install)

print_step "Environment Configuration"
DB_HOST="$(prompt_default "Database host" "localhost")"
DB_PORT="$(prompt_default "Database port" "3306")"
DB_NAME="$(prompt_default "Database name" "au_roadmap")"
DB_USER="$(prompt_default "Database user" "root")"

read -r -s -p "Database password (leave blank if none): " DB_PASSWORD
echo ""

JWT_SECRET="$(generate_jwt_secret)"
BACKEND_PORT="$(prompt_default "Backend port" "8080")"
FRONTEND_ORIGIN="$(prompt_default "Frontend origin" "http://localhost:5173")"

if should_write_env "$BACKEND_DIR/.env"; then
  cat > "$BACKEND_DIR/.env" <<EOF
DB_HOST=$DB_HOST
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_NAME=$DB_NAME
DB_PORT=$DB_PORT

JWT_SECRET=$JWT_SECRET

PORT=$BACKEND_PORT

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

CORS_ORIGIN=$FRONTEND_ORIGIN
NODE_ENV=development
EOF
  echo "Created backend/.env"
else
  echo "Kept existing backend/.env"
fi

if should_write_env "$FRONTEND_DIR/.env"; then
  cat > "$FRONTEND_DIR/.env" <<EOF
VITE_API_BASE_URL=/api
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
EOF
  echo "Created frontend/.env"
else
  echo "Kept existing frontend/.env"
fi

if [ "$SKIP_DB" = false ]; then
  print_step "Database Setup"
  if command -v mysql >/dev/null 2>&1; then
    MYSQL_ARGS=(-h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER")
    if [ -n "$DB_PASSWORD" ]; then
      MYSQL_ARGS+=("-p$DB_PASSWORD")
    fi

    echo "Importing schema.sql..."
    mysql "${MYSQL_ARGS[@]}" < "$ROOT_DIR/database/schema.sql"

    echo "Importing seed.sql..."
    mysql "${MYSQL_ARGS[@]}" "$DB_NAME" < "$ROOT_DIR/database/seed.sql"

    echo "Database schema and seed data imported."
  else
    echo "MySQL CLI was not found. Skipping automatic database import."
    echo "Run these commands manually after installing MySQL:"
    echo "  mysql -u $DB_USER -p < database/schema.sql"
    echo "  mysql -u $DB_USER -p $DB_NAME < database/seed.sql"
  fi
else
  echo "Skipping database setup because --no-db was provided."
fi

print_step "Setup Complete"
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:$BACKEND_PORT"
echo ""
echo "Test accounts, password for all: 11111111"
echo "  Admin:       admin@example.com"
echo "  Student:     jialaoliu@adelaide.edu.au"
echo "  Prospective: prospect@example.com"

if [ "$START_SERVERS" = true ]; then
  print_step "Starting Development Servers"
  echo "Press Ctrl+C to stop both servers."
  echo ""

  (cd "$BACKEND_DIR" && npm run dev) &
  BACKEND_PID=$!

  (cd "$FRONTEND_DIR" && npm run dev) &
  FRONTEND_PID=$!

  cleanup() {
    echo ""
    echo "Stopping development servers..."
    kill "$BACKEND_PID" "$FRONTEND_PID" >/dev/null 2>&1 || true
  }

  trap cleanup INT TERM EXIT
  wait "$BACKEND_PID" "$FRONTEND_PID"
else
  echo ""
  echo "Start manually with:"
  echo "  cd backend && npm run dev"
  echo "  cd frontend && npm run dev"
fi
