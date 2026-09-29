# MarketForge

MarketForge is a production-style multi-vendor marketplace codebase. It models a buyer storefront, seller operations portal, and platform admin console with shared domain rules, typed API routes, Prisma persistence, Redis-backed security primitives, and Stripe Connect payment boundaries.

This repository is intentionally scaffolded without installing dependencies or running services. The code is written as if it were a corporate production application, but Docker, npm install, database provisioning, and third-party credentials are left to the learner.

## Stack

- Next.js App Router with React Server Components
- TypeScript with strict compiler settings
- Prisma with PostgreSQL
- Redis for rate limits, refresh-token families, sessions, and cache
- Stripe Connect for marketplace payments and seller payouts
- Zod-style request validation
- Pino-style structured logging
- Vitest and Playwright test targets

## Project Layout

- `app/`: Next.js routes, route handlers, and web entry points.
- `src/components/`: reusable UI components for marketplace, seller, admin, and shell surfaces.
- `src/domain/`: pure business rules: checkout splitting, order state machines, seller approval rules, RBAC.
- `src/server/`: infrastructure adapters for database, auth, payments, cache, validation, logging, and API responses.
- `prisma/`: production-grade relational data model.
- `tests/`: unit, integration, and E2E test targets.
- `docs/`: architecture notes, ADRs, and the older static prototype.

## Learning Order

1. Read `src/domain/orders/order-state.ts` and `src/domain/checkout/pricing.ts`.
2. Read `app/api/v1/checkout/sessions/route.ts` and `src/server/payments/stripe-connect.ts`.
3. Read `src/server/auth/session.ts`, `src/server/security/rate-limit.ts`, and `src/server/auth/rbac.ts`.
4. Read `prisma/schema.prisma`.
5. Read `tests/unit/order-state.test.ts` and `tests/integration/checkout.test.ts`.

## Local Setup Later

```bash
npm install
npm run db:migrate
npm run dev
```

Those commands are documented for realism only. They were not run while building this scaffold.
