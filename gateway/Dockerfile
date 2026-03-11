# ── Stage 1: Build ──────────────────────────────────────────
FROM node:20-alpine AS builder

# node-pty requires python3 + make + g++ to compile native bindings
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ── Stage 2: Runtime ─────────────────────────────────────────
FROM node:20-alpine

RUN apk add --no-cache bash

WORKDIR /app

COPY package*.json ./
RUN apk add --no-cache python3 make g++
RUN npm install --omit=dev

# Copy compiled output from builder
COPY --from=builder /app/dist ./dist

EXPOSE 4000

CMD ["node", "dist/index.js"]
