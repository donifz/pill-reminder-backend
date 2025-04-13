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

# Build the new image
docker build -t pill-reminder-backend .

# Run database migrations with production environment
docker run --rm \
  --env-file .env.production \
  --memory=512m \
  pill-reminder-backend \
  yarn migration:run

# Start the application with resource limits and production environment
docker-compose --env-file .env.production up -d

# Clean up unused images
docker image prune -f

# Monitor resource usage
echo "Monitoring resource usage..."
docker stats --no-stream 