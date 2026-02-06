# Stage 1: Build Prisma Client
FROM node:18-alpine AS prisma-builder

WORKDIR /app/prisma
COPY prisma/package*.json ./
RUN npm install
COPY prisma/ ./
RUN npx prisma generate

# Stage 2: Build Order Service
FROM node:18-alpine

RUN apk add --no-cache openssl

WORKDIR /app

# Copy Prisma package (local dependency)
COPY --from=prisma-builder /app/prisma /app/prisma

# Set up Order Service
WORKDIR /app/services/order-service
COPY services/order-service/package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY services/order-service/ ./

# Expose the service port
EXPOSE 3002

# Start the service
CMD ["npm", "start"]
