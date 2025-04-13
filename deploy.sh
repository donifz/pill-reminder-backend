#!/bin/bash

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Error: Docker is not running. Please start Docker Desktop first."
    exit 1
fi

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "Error: .env.production file not found!"
    exit 1
fi

# Stop any running containers
docker-compose down || true

# Clean up unused resources
docker system prune -f

# Pull the latest changes
git pull origin main

# Build the new image with environment variables
docker build \
  --build-arg DATABASE_URL="postgresql://postgres:postgres@localhost:5432/pill_reminder" \
  -t pill-reminder-backend .

# Start the database container first
echo "Starting database container..."
docker-compose --env-file .env.production up -d db

# Wait for the database to be ready
echo "Waiting for database to be ready..."
sleep 10

# Run database migrations with production environment
echo "Running database migrations..."
docker run --rm \
  --env-file .env.production \
  --memory=512m \
  --network pill-reminder-app-network \
  pill-reminder-backend \
  yarn migration:run

# Start the application with resource limits and production environment
echo "Starting application..."
docker-compose --env-file .env.production up -d

# Clean up unused images
docker image prune -f

# Monitor resource usage
echo "Monitoring resource usage..."
docker stats --no-stream 