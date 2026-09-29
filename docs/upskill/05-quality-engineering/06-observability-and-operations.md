# 06 Observability And Operations

## Existing Observability

- Request id header is generated in `middleware.ts:3-8`.
- Structured logger is configured in `src/server/observability/logger.ts`.
- API errors include request id in response envelope at `src/server/api/responses.ts:12-26`.
- Audit logs persist sensitive mutations in `prisma/schema.prisma:327-342`.
- Webhook events persist provider payloads in `prisma/schema.prisma:357-366`.

## What Is Missing Before Production

- Health check route.
- Metrics for checkout latency, webhook failures, Stripe errors, Redis errors.
- Trace spans across route -> service -> Prisma -> Stripe.
- Alerting on webhook unprocessed events.
- Rollback guide for migrations.
- Error boundary pages.

## How Would I Know This Broke?

| Flow | Signal | Anchor |
| --- | --- | --- |
| Login | spike in `AUTH_INVALID_CREDENTIALS` or rate limit | `app/api/v1/auth/login/route.ts:16-27` |
| Checkout | orders stuck `PLACED` without payment id | `src/server/checkout/service.ts:81-150` |
| Webhook | `WebhookEvent` not processed | `app/api/webhooks/stripe/route.ts:51-56` |
| Seller moderation | audit log missing | `src/server/sellers/service.ts:82-97` |
| Catalog | high query latency | `src/server/catalog/queries.ts:12-39` |

## Local Vs Production

- Prisma logs queries in development: `src/server/db/prisma.ts:8-12`.
- Cookies are `secure` only in production: `src/server/auth/session.ts:99-115`.
- Env values are validated on import: `src/server/env.ts:3-15`.

## Drill

Design one dashboard for checkout operations.

Strong dashboard includes:

- checkout attempts,
- created orders,
- Stripe failures,
- orders stuck without payment intent,
- webhook lag,
- transfer failures,
- p95 latency,
- error rate by request id.
