# Stage 1: Build Prisma Client
FROM node:18-alpine AS prisma-builder

WORKDIR /app/prisma
COPY prisma/package*.json ./
RUN npm install
COPY prisma/ ./
RUN npx prisma generate

# Stage 2: Build Auth Service
FROM node:18-alpine

RUN apk add --no-cache openssl

WORKDIR /app

# Copy Prisma package (local dependency)
COPY --from=prisma-builder /app/prisma /app/prisma

# Set up Auth Service
WORKDIR /app/services/auth-service
COPY services/auth-service/package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY services/auth-service/ ./

# Expose the service port
EXPOSE 3001

# Start the service
CMD ["npm", "start"]
