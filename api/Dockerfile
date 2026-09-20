FROM node:22-bookworm-slim AS build
WORKDIR /usr/src/app
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
RUN npm ci
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npm run db:generate
COPY tsconfig*.json nest-cli.json ./
COPY src ./src
RUN npm run build && npm prune --omit=dev

FROM node:22-bookworm-slim AS runtime
WORKDIR /usr/src/app
ARG APP_VERSION=0.0.1-dev
ARG APP_GIT_SHA=local
ARG APP_BUILD_NUMBER=local
ARG APP_BUILT_AT=unknown
ARG APP_ENVIRONMENT=development
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
ENV NODE_ENV=production
ENV PORT=3000
ENV APP_VERSION=$APP_VERSION
ENV APP_GIT_SHA=$APP_GIT_SHA
ENV APP_BUILD_NUMBER=$APP_BUILD_NUMBER
ENV APP_BUILT_AT=$APP_BUILT_AT
ENV APP_ENVIRONMENT=$APP_ENVIRONMENT
LABEL org.opencontainers.image.version=$APP_VERSION \
  org.opencontainers.image.revision=$APP_GIT_SHA \
  org.opencontainers.image.created=$APP_BUILT_AT
COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/prisma ./prisma
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/v1/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "dist/main.js"]
