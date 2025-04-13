# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock ./

# Install ALL dependencies (including devDependencies)
RUN yarn install --frozen-lockfile

# Copy source code and env files
COPY . .

# Set production environment for build
ENV NODE_ENV=production

# Build the application
RUN yarn build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile --production

# Copy built application and env files from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env.production ./.env.production

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["yarn", "start:prod"] 