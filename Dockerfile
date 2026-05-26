# ─── Build stage ─────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ─── Production stage ─────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

# Only copy the build output + node_modules (no devDeps)
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY package.json .

# Non-root user for security
RUN addgroup -S app && adduser -S app -G app
USER app

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

CMD ["node", "build/index.js"]
