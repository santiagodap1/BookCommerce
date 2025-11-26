# BookCommerce API

NestJS + PostgreSQL backend that powers authentication and persistent carts for the BookCommerce storefront.

## Requirements

- Node.js 20+
- PostgreSQL 14+
- npm

## Environment variables

Copy `.env.example` to `.env` and adjust values. Key variables:

- `DATABASE_URL` **or** the discrete `DB_*` variables for host-based connections
- `JWT_SECRET`, `JWT_EXPIRES_IN`
- `SEED_USER_*` (optional) to control the credentials created by the seed script

## Install dependencies

```bash
npm install
```

## Database migrations

Migrations are managed through TypeORM. You do **not** need the database beforehand; once PostgreSQL is available, use the following commands from the `backend/` folder:

```bash
# Run pending migrations (creates tables)
npm run migration:run

# Revert last migration
npm run migration:revert

# Generate a new migration (pass the output file path/name)
npm run typeorm -- migration:generate src/database/migrations/<MigrationName>
```

The CLI uses `src/database/data-source.ts`, which reads the same environment variables as the Nest application.

## Seed data

Insert a demo user and sample cart items after migrating:

```bash
npm run db:seed
```

Customize `SEED_USER_EMAIL`, `SEED_USER_PASSWORD`, `SEED_USER_NAME`, and `SEED_USER_IS_ADMIN` in `.env` before running the seed if you want different credentials or an admin user.

## Run the API

```bash
# development mode
npm run start:dev

# production build
npm run build
npm run start:prod
```

The server exposes its routes under `/api`. Primary endpoints:

- `POST /api/auth/register`, `POST /api/auth/login`
- `GET /api/users/me`
- `GET|POST|PATCH|DELETE /api/cart`
- `GET|POST|PATCH|DELETE /api/addresses`
- `GET /api/orders`, `GET /api/orders/:id`, `POST /api/orders`
- `GET /api/health`

## Testing & linting

```bash
npm run test
npm run lint
```
