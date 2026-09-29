# 04 Refactor And Design Katas

## Kata 1: Identify A Boundary Leak

Find one place where provider or persistence details leak upward. Candidate: route/page importing server query directly is acceptable in Server Components, but think about where it would fail.

Self-grade: Strong answer distinguishes allowed server imports from client boundary leaks.

## Kata 2: Propose An Outbox

Use checkout anchors `src/server/checkout/service.ts:64-150`.

Deliverable: one-page RFC with schema, worker, retries, tests, rollout.

## Kata 3: Split A Large Module

Candidate: `src/server/checkout/service.ts:16-181`.

Goal: separate order creation, payment setup, notification scheduling without changing behavior.

Self-grade: Strong answer keeps transaction boundary explicit.

## Kata 4: Improve Type Safety

Candidate: `src/components/marketplace/product-card.tsx:10`.

Goal: reduce `as Route` reliance or isolate it in helper.

Self-grade: Strong answer balances typedRoutes constraints with practical dynamic slugs.

## Kata 5: Design A Migration

Add `Order.statusReason`.

Deliverable: migration steps, code changes, tests, rollback.

Self-grade: Strong answer handles existing rows and optional-to-required rollout.

## Kata 6: Reduce N+1 Or Over-Fetch

Candidate: reviews include in `src/server/catalog/queries.ts:15-19`.

Deliverable: measurement plan and aggregate design.

Self-grade: Strong answer measures before changing.

## Kata 7: Write An RFC

Topic: CSRF protection for cookie-auth mutations.

Anchors: `src/server/auth/session.ts:99-115`, mutating API routes under `app/api/v1/`.

Self-grade: Strong answer considers compatibility, rollout, and tests.

## Kata 8: Review A Flawed PR

Use [04-code-reading-gym/04-review-katas.md](../04-code-reading-gym/04-review-katas.md). Pick one kata and write three review comments: blocking, important, optional.

Self-grade: Strong answer is specific, kind, anchored, and test-oriented.
