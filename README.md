# Evently

Evently is a full-stack event discovery and ticket checkout application built with Next.js, React, Prisma, PostgreSQL, and PayPal.

## Architecture

```text
src/
├── app/                    Next.js pages, layouts, and API entrypoints
├── frontend/               React UI, feature components, navigation, and API clients
├── server/
│   ├── auth/               JWT session handling
│   ├── db/                 Prisma client
│   ├── errors/             Application errors
│   ├── handlers/           HTTP parsing and responses
│   ├── integrations/       PayPal and local file storage
│   ├── repositories/       Prisma and PostgreSQL access
│   └── services/           Business logic and use cases
└── shared/                 Framework-independent types and utilities
```

Every backend request follows one direction:

```text
route.ts → handler → service → repository → Prisma → PostgreSQL
```

The layers have explicit responsibilities:

- API routes are one-line Next.js adapters.
- Handlers manage HTTP input, authentication, status codes, and responses.
- Services implement business rules and coordinate use cases.
- Repositories are the only modules that access Prisma.
- Integrations isolate external systems such as PayPal and file storage.
- Frontend modules communicate with backend features through HTTP endpoints.

## Local development

```bash
npm install
npm run prisma:generate
npm run dev
```

The development application is available at `http://localhost:3000`.

## Docker

```bash
docker compose watch
docker compose logs app -f
docker compose logs app --tail 100
```

Docker starts the application at `http://localhost:3001` and PostgreSQL at `localhost:5432`.

## Database

```bash
npm run prisma:build
npm run prisma:generate
npm run prisma:migrate --name init
```

Prisma model fragments are stored under `prisma/models` and merged into `prisma/schema.prisma` before generation and migration.
