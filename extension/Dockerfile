# Stage 1: build
FROM node:18.2.0 as build

WORKDIR /app

# Install requirements
COPY package.json .
COPY package-lock.json .
RUN npm ci

# Build app
COPY . .
RUN npm run build
