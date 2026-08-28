# Multi-stage production Dockerfile for AgroScan
FROM node:20-alpine AS builder

WORKDIR /app

# Enable pnpm
RUN npm install -g pnpm@10

# Copy package definitions and local patches
COPY package.json pnpm-lock.yaml ./
COPY patches ./patches

# Install dependencies with lockfile integrity
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Run validation checks and create production bundle
RUN pnpm run check && pnpm run build

# Runner stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

RUN npm install -g pnpm@10

COPY package.json pnpm-lock.yaml ./
COPY patches ./patches

RUN pnpm install --prod --frozen-lockfile

# Copy compiled production bundle and static assets
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/database ./database

EXPOSE 5000

CMD ["node", "dist/index.js"]
