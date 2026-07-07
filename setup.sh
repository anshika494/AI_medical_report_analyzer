#!/bin/bash

# Exit on error
set -e

echo "=== BioBalance Setup Script for macOS ==="

# 1. Check for Homebrew
if ! command -v brew &> /dev/null; then
    echo "ERROR: Homebrew is not installed. Please install it first from https://brew.sh/"
    exit 1
fi

# 2. Install Brew Dependencies
echo "Installing PostgreSQL 16, Tesseract (OCR), and Poppler (PDF conversion)..."
brew install postgresql@16 tesseract poppler

# Link postgresql if needed
brew link postgresql@16 --force --overwrite || true

# 3. Start PostgreSQL Service
echo "Starting PostgreSQL service..."
brew services start postgresql@16

# Wait for Postgres to be ready
echo "Waiting for PostgreSQL to start..."
sleep 3

# 4. Initialize Database
echo "Configuring BioBalance database..."
# Create user and database
psql postgres -c "CREATE USER biobalance WITH PASSWORD 'biobalance_secret' SUPERUSER;" || echo "User biobalance might already exist, continuing..."
psql postgres -c "CREATE DATABASE biobalance OWNER biobalance;" || echo "Database biobalance might already exist, continuing..."

# 5. Recreate Python Virtual Environment
echo "Recreating Python virtual environment for backend..."
cd backend
rm -rf venv
python3 -m venv venv
source venv/bin/activate
echo "Installing backend dependencies..."
pip install -r requirements.txt
cd ..

# 6. Install Frontend Dependencies
echo "Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo "=== Setup Completed Successfully! ==="
echo ""
echo "To start the application:"
echo ""
echo "1. In one terminal window, start the Backend:"
echo "   PYTHONPATH=backend ./backend/venv/bin/uvicorn app.main:app --reload --port 8000"
echo ""
echo "2. In a second terminal window, start the Frontend:"
echo "   cd frontend && npm run dev"
echo ""
echo "Open http://localhost:3000 in your browser."
