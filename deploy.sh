#!/bin/bash

# Stop any running containers
docker-compose down || true

# Clean up unused resources
docker system prune -f

# Pull the latest changes
git pull origin main

# Build the new image
docker build -t pill-reminder-backend .

# Run database migrations
docker run --rm \
  --env-file .env.production \
  --memory=512m \
  pill-reminder-backend \
  yarn migration:run

# Start the application with resource limits
docker-compose up -d

# Clean up unused images
docker image prune -f

# Monitor resource usage
echo "Monitoring resource usage..."
docker stats --no-stream 