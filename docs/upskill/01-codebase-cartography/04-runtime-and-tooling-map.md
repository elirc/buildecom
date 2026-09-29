# 04 Runtime And Tooling Map

## Commands

Scripts are declared in `package.json:6-18`.

| Command | Purpose | Status |
| --- | --- | --- |
| `npm run dev` | Next dev server | Inferred |
| `npm run build` | production build | Inferred |
| `npm run start` | serve built app | Inferred |
| `npm run lint` | ESLint | Inferred |
| `npm run typecheck` | TypeScript check | Inferred |
| `npm run test` | Vitest unit/integration | Inferred |
| `npm run test:e2e` | Playwright E2E | Inferred |
| `npm run db:migrate` | Prisma migration dev | Inferred |
| `npm run db:seed` | Seed database | Inferred |

## Runtime Boundaries

| Runtime | Files | Notes |
| --- | --- | --- |
| Browser | `src/components/marketplace/product-card.tsx:7-39`, `src/components/marketplace/facet-sidebar.tsx:3-60` | Components render UI; currently no client hooks. |
| Server Components | `app/(marketplace)/page.tsx:8-47`, `app/(seller)/seller/dashboard/page.tsx:6-71` | Pages await server queries before render. |
| Route handlers | `app/api/v1/checkout/sessions/route.ts:10-22` | JSON API boundary. |
| Node server adapters | `src/server/db/prisma.ts:1-16`, `src/server/cache/redis.ts:1-18` | Use `server-only`; not browser-safe. |
| External APIs | `src/server/payments/stripe-connect.ts:6-77` | Stripe calls live behind adapter functions. |
| Webhook receiver | `app/api/webhooks/stripe/route.ts:7-60` | Async external event entry point. |
| Tests | `tests/unit/pricing.test.ts:4-31`, `tests/e2e/buyer-checkout.spec.ts:3-9` | Unit/E2E split. |

## Environment Variables

`.env.example:1-9` declares app URL, database URL, Redis URL, JWT secrets, Stripe secrets, platform fee, and log level. Do not expose real values in docs, tests, screenshots, or PRs.

## Build And Type Mental Model

- `tsconfig.json:7-20` enables strict mode and path aliases.
- `next.config.mjs:3-14` enables typed routes, image remote patterns, and disables `poweredByHeader`.
- `vitest.config.ts:5-16` defines test inclusion and coverage thresholds.
- `playwright.config.ts:3-13` defines E2E projects.

## Drill

For each import in `app/api/v1/checkout/sessions/route.ts:1-8`, label it as framework, API helper, auth, service, security, validation, or type.

Self-grade:

- Basic: recognizes route handler.
- Solid: explains why the route stays thin.
- Strong: can add a new route following the same boundary pattern.
