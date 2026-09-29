# 03 Senior Build Projects

## Project 1: Payment Outbox

**Problem statement:** Checkout commits DB before Stripe setup at `src/server/checkout/service.ts:64-150`.
**Product value:** fewer stuck orders and safer retries.
**Design checklist:** outbox schema, worker, retry policy, dead-letter state, observability.
**Likely files/modules:** Prisma schema, checkout service, new worker/service, tests.
**Migration plan:** add outbox table, write events while still direct-calling Stripe, then switch processor.
**Test plan:** Stripe failure, retry success, duplicate idempotency.
**Security plan:** no client secrets in outbox logs.
**Performance plan:** bounded batch worker.
**Rollout/rollback:** feature flag event processing.
**Open questions:** where worker runs.
**Stretch:** dashboard for stuck payment events.

## Project 2: Authorization Test Matrix

**Problem statement:** Routes have guards but sparse tests.
**Product value:** prevent cross-role regressions.
**Likely files:** route tests, auth helpers, fixtures.
**Migration plan:** start with pure guards, then service permission tests, then route harness.
**Rollback:** tests only, no runtime risk.
**Open questions:** route test strategy.

## Project 3: Webhook Reliability And Reconciliation

**Problem statement:** partial transfers can fail at `app/api/webhooks/stripe/route.ts:91-116`.
**Product value:** reliable seller payouts.
**Design checklist:** transfer attempts, idempotency keys, retry worker, reconciliation report.
**Migration plan:** add attempt table, write before transfer, process incomplete attempts.
**Test plan:** one of two transfers fails and retries.
**Security plan:** verify Stripe signature and avoid raw secret logs.

## Project 4: Catalog Scalability

**Problem statement:** catalog includes product relations and facets in one request at `src/server/catalog/queries.ts:12-39`.
**Product value:** fast buyer discovery at scale.
**Design checklist:** pagination, aggregate ratings, cache strategy, indexes.
**Migration plan:** introduce rating summary table, backfill, switch query.
**Test plan:** query tests and performance baseline.
**Rollback:** keep old query behind flag.

## Project 5: Multi-Currency Readiness

**Problem statement:** currency fields exist but checkout assumes USD at `src/server/checkout/service.ts:87`.
**Product value:** international seller growth.
**Design checklist:** product currency, cart currency compatibility, Stripe currency, display, settlement.
**Migration plan:** enforce single-currency cart first.
**Test plan:** mixed-currency rejection.
**Security plan:** prevent price tampering.

## Project 6: Admin Audit Explorer

**Problem statement:** audit logs exist but no UI.
**Product value:** faster incident response.
**Design checklist:** filters by actor/entity/date/request id, pagination, privacy.
**Likely files:** admin route, query service, Prisma indexes.
**Test plan:** admin-only access and filters.
**Rollback:** route hidden from nav.

## Project 7: Contribution-Ready CI

**Problem statement:** scripts exist but no CI workflow.
**Product value:** consistent review gate.
**Design checklist:** lint, typecheck, unit, integration, E2E optional, Prisma validate.
**Test plan:** deliberately failing branch.
**Rollout:** start with non-blocking, then required checks.
