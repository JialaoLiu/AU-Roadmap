#!/bin/bash
# AU Roadmap - Automated Setup Script
# Usage: bash setup.sh

echo "========================================="
echo "  AU Roadmap - Project Setup"
echo "========================================="

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js v18+ first."
    exit 1
fi

echo "Node.js version: $(node -v)"

# Check MySQL
if ! command -v mysql &> /dev/null; then
    echo "Warning: MySQL CLI not found. Please set up the database manually."
    echo "Run: mysql -u root -p < database/schema.sql"
    echo "Run: mysql -u root -p < database/seed.sql"
else
    echo "MySQL found. Setting up database..."
    read -p "Enter MySQL root password: " -s MYSQL_PASSWORD
    echo

    mysql -u root -p"$MYSQL_PASSWORD" < database/schema.sql
    if [ $? -eq 0 ]; then
        echo "Database schema created successfully."
        mysql -u root -p"$MYSQL_PASSWORD" < database/seed.sql
        if [ $? -eq 0 ]; then
            echo "Seed data inserted successfully."
        else
            echo "Warning: Seed data insertion failed."
        fi
    else
        echo "Error: Database setup failed. Please check your MySQL credentials."
        exit 1
    fi
fi

# Backend setup
echo ""
echo "Setting up backend..."
cd backend
npm install
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Created backend/.env from template. Please update with your credentials."
fi
cd ..

# Frontend setup
echo ""
echo "Setting up frontend..."
cd frontend
npm install
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Created frontend/.env from template."
fi
cd ..

echo ""
echo "========================================="
echo "  Setup Complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo "  1. Update backend/.env with your database password and JWT secret"
echo "  2. Start the backend:  cd backend && npm run dev"
echo "  3. Start the frontend: cd frontend && npm run dev"
echo ""
echo "Test accounts (password: 11111111):"
echo "  Student:     student@example.com"
echo "  Prospective: prospect@example.com"
echo "  Admin:       admin@example.com"
