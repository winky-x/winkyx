
# 1. Base Image
FROM node:18-alpine AS base
WORKDIR /usr/src/app

# 2. Dependencies
FROM base AS deps
COPY package.json pnpm-lock.yaml* ./
# We need to copy the workspace config to install deps correctly
COPY pnpm-workspace.yaml ./
# Copy server's package.json
COPY apps/server/package.json ./apps/server/
RUN npm install -g pnpm
RUN pnpm install --filter server --prod

# 3. Builder
FROM base AS builder
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=deps /usr/src/app/apps/server/node_modules ./apps/server/node_modules
COPY apps/server/ ./apps/server/
COPY tsconfig.json ./
RUN npm install -g pnpm
# --filter is crucial to only build the server app
RUN pnpm --filter server build

# 4. Runner
FROM base AS runner
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/apps/server/package.json ./package.json
COPY --from=builder /usr/src/app/apps/server/dist ./dist
# Copy only production node_modules
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=deps /usr/src/app/apps/server/node_modules ./node_modules

# Copy .env.example, but it should be mounted as a volume in production
COPY apps/server/.env.example ./.env

EXPOSE 3001
CMD ["node", "dist/index.js"]
