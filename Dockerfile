# syntax=docker/dockerfile:1

# Three stages so the shipped image carries neither the toolchain nor the
# dev dependencies: deps installs, builder compiles, runner holds only the
# standalone server bundle Next emits.

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# The build needs devDependencies (typescript, tailwind, the postcss plugin),
# so this deliberately is not --omit=dev. None of it reaches the final image.
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# `prebuild` runs scripts/check-assets.mjs, so a catalogue referencing a
# missing photo fails the image build rather than shipping a broken tile.
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
# Bind to every interface — Fly's proxy reaches the machine over its private
# network, and the default localhost bind would refuse those connections.
ENV HOSTNAME=0.0.0.0

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# The standalone server serves public/ and .next/static only if they are
# copied in beside it; Next leaves them out on the assumption of a CDN.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
