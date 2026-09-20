# Docker and Jenkins deployment

The API image supports either PostgreSQL or SQL Server 2008. A deployment makes
the choice through `DB_PROVIDER` in its backend env file; there is no separate
application image per database.

`DB_PROVIDER` is deliberately required. The API never guesses from available
credentials, which prevents a deployment from silently connecting to the wrong
database.

## Local Docker

The root Compose file is only an optional local integration environment. It
does not make the three folders one npm project and is not used by the
independent production pipelines below.

Copy the examples without committing the resulting secret files:

```bash
cp docker.env.example docker.env
cp api/.env.example api/.env
cp web/.env.example web/.env.production
```

For PostgreSQL in Docker, set this URL in `api/.env` because `localhost`
inside the API container refers to the API container itself:

```env
DB_PROVIDER=postgresql
DATABASE_URL=postgresql://postgres:password@postgres:5432/app?schema=public
```

Then start PostgreSQL, API, and web under an isolated Compose project name:

```bash
docker compose --env-file docker.env --profile postgres up -d --build
docker compose --env-file docker.env exec api node dist/database/migrate.js
```

For SQL Server 2008, use an existing Windows/remote SQL Server. Microsoft does
not provide a Linux container for SQL Server 2008. On Docker Desktop, a server
running on the host can normally be addressed as `host.docker.internal`:

```env
DB_PROVIDER=mssql
DB_HOST=host.docker.internal
DB_PORT=1433
DB_USER=app_user
DB_PASSWORD=change-me
DB_NAME=app
DB_ENCRYPT=false
DB_TRUST_SERVER_CERTIFICATE=true
```

Start without the PostgreSQL profile, then migrate:

```bash
docker compose --env-file docker.env up -d --build api web
docker compose --env-file docker.env exec api node dist/database/migrate.js
```

Give every local stack a unique `COMPOSE_PROJECT_NAME` and unique host ports in
`docker.env`. This isolates container names, networks, and PostgreSQL volumes.

## Independent Jenkins deployments

The projects do not share a production pipeline:

- `api/Jenkinsfile` builds, migrates, smoke-tests, and deploys only the API.
- `web/Jenkinsfile` builds, smoke-tests, and deploys only the web application.
- Mobile releases use Expo/EAS from `mobile/` and are not coupled to either
  Docker deployment.

Configure two Jenkins jobs using those separate script paths. A web deployment
does not migrate or restart the API, and an API deployment does not rebuild or
replace the web container.

Edit each Jenkinsfile's `DEPLOY_TARGETS` when initializing a real project. Each
target needs a unique key, env directory, live port, and smoke-test port.
`includeInAll` controls whether `DEPLOY_TARGET=all` includes it.

Each target env directory contains:

```text
/var/www/<project>/<target>/be.env
/var/www/<project>/<target>/fe.env
```

Start from the template owned by the corresponding project:

- `api/deployment/be.postgresql.env.example`
- `api/deployment/be.mssql.env.example`
- `web/deployment/fe.env.example`

Do not put release metadata (`APP_VERSION`, Git SHA, build number, build time)
in the env files. Each Jenkins job bakes metadata into its own image; the API
also returns its metadata from the health endpoint.

## Multiple Jenkins jobs on one Docker host

`DEPLOY_NAMESPACE` is part of every image and container name. Use the same
application namespace in both jobs when desired—the `-api` and `-web` suffixes
keep their resources separate. Different applications must use different
namespaces. Target host ports must also be unique on a shared Docker host.

Example:

```text
DEPLOY_NAMESPACE=inventory
DEPLOY_TARGET=manila-postgres
API live/test ports=4100/4110
Web live/test ports=4101/4111
```

Another Jenkins job can deploy at the same time using a different namespace and
ports without removing the first job's containers. Builds of the same namespace
and target intentionally replace that deployment.

## Database and migration safety

- Run migrations before starting a new application version.
- Back up production data before destructive schema changes.
- Append migrations; never rewrite an id already recorded in `app_migrations`.
- Test both migration variants if the application advertises both providers.
- SQL Server 2008 migrations must avoid syntax introduced in SQL Server 2012+
  and use idempotent metadata checks where appropriate.
- The smoke test uses `/api/v1/health`, which returns HTTP 503 if the selected
  database cannot be reached.

Rollback uses a previous build-number image tag. Database migrations are not
automatically reversed, so additive/backward-compatible migrations are safest
for zero-downtime releases.
