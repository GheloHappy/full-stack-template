FROM node:22-alpine AS build
WORKDIR /app
ARG APP_VERSION=0.0.1-dev
ARG APP_GIT_SHA=local
ARG APP_BUILD_NUMBER=local
ARG APP_BUILT_AT=unknown
ARG APP_ENVIRONMENT=development
ENV VITE_APP_VERSION=$APP_VERSION
ENV VITE_APP_GIT_SHA=$APP_GIT_SHA
ENV VITE_APP_BUILD_NUMBER=$APP_BUILD_NUMBER
ENV VITE_APP_BUILT_AT=$APP_BUILT_AT
ENV VITE_APP_ENVIRONMENT=$APP_ENVIRONMENT
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.29-alpine
ARG APP_VERSION=0.0.1-dev
ARG APP_GIT_SHA=local
ARG APP_BUILT_AT=unknown
LABEL org.opencontainers.image.version=$APP_VERSION \
  org.opencontainers.image.revision=$APP_GIT_SHA \
  org.opencontainers.image.created=$APP_BUILT_AT
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
CMD ["nginx", "-g", "daemon off;"]
