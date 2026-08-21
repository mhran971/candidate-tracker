# Multi-stage production build for Fastify API
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root configurations and workspace definitions
COPY package.json tsconfig.base.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/api/package.json ./apps/api/

# Install dependencies across monorepo
RUN npm install

# Copy source code and schemas
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api

# Generate Prisma Client & Build
WORKDIR /app/apps/api
RUN npx prisma generate
RUN npm run build

# Production Runner Stage
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001
ENV HOST=0.0.0.0

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/shared ./packages/shared
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json

EXPOSE 3001

WORKDIR /app/apps/api
CMD ["node", "dist/server.js"]
