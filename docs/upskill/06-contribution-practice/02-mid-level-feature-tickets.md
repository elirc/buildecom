# 02 Mid-Level Feature Tickets

Each ticket crosses layers. Write a short design note before implementation.

## Ticket 1: Seller Suspension Hides Catalog And Detail Pages

**Difficulty:** Medium
**Estimated time:** 1 day
**Scope:** admin service, catalog query, tests.
**Design notes required:** visibility invariant and regression matrix.
**Anchors:** `src/server/sellers/service.ts:57-101`, `src/server/catalog/queries.ts:111-116`, `src/server/catalog/queries.ts:73-78`.
**Acceptance criteria:** admin suspends seller; catalog excludes products; product detail 404s; audit log exists.
**Risk:** accidentally hiding from admin views.
**Rollback:** revert query helper change.

## Ticket 2: Implement Review Creation API

**Difficulty:** Medium
**Estimated time:** 1-2 days
**Scope:** schema, route, service, tests.
**Anchors:** `Review` model at `prisma/schema.prisma:268-280`, response helpers at `src/server/api/responses.ts:4-26`.
**Acceptance criteria:** buyer can review purchased product once; rating 1-5; cross-buyer rejected.
**Risk:** review spam, ownership checks.
**Rollback:** disable route.

## Ticket 3: Add CSRF Protection For Cookie Mutations

**Difficulty:** Hard
**Estimated time:** 2 days
**Scope:** middleware/helper, mutating routes, tests.
**Anchors:** cookies at `src/server/auth/session.ts:99-115`, mutations under `app/api/v1/**`.
**Acceptance criteria:** unsafe methods require CSRF token; E2E still passes.
**Risk:** breaks API consumers.
**Rollback:** feature flag enforcement.

## Ticket 4: Checkout Recovery State

**Difficulty:** Hard
**Estimated time:** 2-3 days
**Scope:** Prisma migration, service, tests.
**Anchors:** `src/server/checkout/service.ts:64-150`.
**Acceptance criteria:** Stripe failure after DB commit leaves recoverable state.
**Risk:** order lifecycle complexity.
**Rollback:** keep existing direct path while feature-flagged.

## Ticket 5: Webhook Transfer Attempt Table

**Difficulty:** Hard
**Estimated time:** 3 days
**Scope:** schema, webhook, payment adapter, tests.
**Anchors:** `app/api/webhooks/stripe/route.ts:91-116`, `prisma/schema.prisma:240-254`.
**Acceptance criteria:** each split transfer has status and retry.
**Risk:** reconciliation complexity.
**Rollback:** manual transfer fallback.

## Ticket 6: Product Creation Server Action

**Difficulty:** Medium
**Estimated time:** 1-2 days
**Scope:** UI form, validation, seller auth, Prisma write, tests.
**Anchors:** new listing page at `app/(seller)/seller/products/new/page.tsx`, Product model `prisma/schema.prisma:139-163`.
**Acceptance criteria:** approved seller can draft product; pending seller blocked.
**Risk:** slug collisions.
**Rollback:** keep page read-only.

## Ticket 7: Admin Dispute Resolution With Refund

**Difficulty:** Hard
**Estimated time:** 2-3 days
**Scope:** dispute service, refund service, audit, tests.
**Anchors:** `src/server/sellers/service.ts:103-136`, `src/server/orders/service.ts:76-124`.
**Acceptance criteria:** resolution can trigger refund and close dispute atomically where possible.
**Risk:** external refund after DB change.
**Rollback:** two-step manual review.

## Ticket 8: API Contract Tests

**Difficulty:** Medium
**Estimated time:** 2 days
**Scope:** route test harness, validation, response envelope.
**Anchors:** `src/server/api/responses.ts:4-26`, `src/server/validation/schemas.ts:5-51`.
**Acceptance criteria:** route tests for invalid body and forbidden role.
**Risk:** brittle Next request mocks.
**Rollback:** schema/service tests first.

## Ticket 9: Catalog Pagination

**Difficulty:** Medium
**Estimated time:** 1-2 days
**Scope:** query, API schema, UI, tests.
**Anchors:** `src/server/catalog/queries.ts:7-22`, `src/server/validation/schemas.ts:49-50`.
**Acceptance criteria:** cursor pagination; limit enforced.
**Risk:** duplicate/missing products under new inserts.
**Rollback:** retain current first page behavior.

## Ticket 10: Notification Center UI

**Difficulty:** Medium
**Estimated time:** 1-2 days
**Scope:** query, UI, read mutation.
**Anchors:** `Notification` model `prisma/schema.prisma:313-325`, helpers `src/server/notifications/service.ts:11-33`.
**Acceptance criteria:** user sees unread notifications and can mark read.
**Risk:** cross-user notification visibility.
**Rollback:** hide UI route.
