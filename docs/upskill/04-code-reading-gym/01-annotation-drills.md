# 01 Annotation Drills

For each drill, write annotations before reading adjacent code.

## Drill 1: Pricing Split

Excerpt: `src/domain/checkout/pricing.ts:30-84`

Annotate:

- Inputs.
- Output.
- Invariants.
- Error cases.
- Whether it has side effects.

Self-grade:

- Basic: says it returns checkout totals.
- Solid: explains empty cart, quantity, stock, missing commission errors.
- Strong: explains rounding and seller grouping.

## Drill 2: Order State

Excerpt: `src/domain/orders/order-state.ts:1-28`

Annotate allowed transitions and terminal states.

Self-grade:

- Basic: lists statuses.
- Solid: identifies `REFUNDED` terminal.
- Strong: predicts files affected by adding `CANCELLED`.

## Drill 3: Catalog Visibility

Excerpt: `src/server/catalog/queries.ts:108-135`

Annotate which predicates protect public visibility.

Self-grade:

- Basic: sees `isActive`.
- Solid: sees `seller.status: "APPROVED"`.
- Strong: notices facets need same visibility rule.

## Drill 4: Checkout Transaction

Excerpt: `src/server/checkout/service.ts:64-133`

Annotate what is atomic and what happens outside transaction.

Self-grade:

- Basic: says it creates order.
- Solid: includes stock decrement and cart clear.
- Strong: identifies Stripe call outside transaction as recovery risk.

## Drill 5: Refresh Rotation

Excerpt: `app/api/v1/auth/refresh/route.ts:18-59`

Annotate token verification, reuse detection, and token replacement.

Self-grade:

- Basic: says refresh creates new token.
- Solid: explains old token revoke.
- Strong: explains family revoke on invalid/reused token.

## Drill 6: Seller Moderation

Excerpt: `src/server/sellers/service.ts:57-101`

Annotate policy check, mutation, audit log, and transaction.

Self-grade:

- Basic: says admin changes seller status.
- Solid: names invalid status checks.
- Strong: connects seller status to catalog visibility.

## Drill 7: Webhook Processing

Excerpt: `app/api/webhooks/stripe/route.ts:20-56`

Annotate provider event persistence and duplicate handling.

Self-grade:

- Basic: sees event stored.
- Solid: explains processed duplicate return.
- Strong: asks what happens after partial processing failure.

## Drill 8: Error Response

Excerpt: `src/server/api/errors.ts:14-30` and `src/server/api/responses.ts:12-26`

Annotate how unknown errors become JSON.

Self-grade:

- Basic: sees `fail`.
- Solid: explains Zod and domain prefix handling.
- Strong: critiques string-prefix error mapping.

## Drill 9: Security Headers

Excerpt: `middleware.ts:3-18`

Annotate which headers are set and which are missing.

Self-grade:

- Basic: lists headers.
- Solid: explains request id.
- Strong: proposes CSP/HSTS and tests.

## Drill 10: E2E Smoke

Excerpt: `tests/e2e/buyer-checkout.spec.ts:3-9`

Annotate what user confidence it gives and what it does not cover.

Self-grade:

- Basic: says it opens homepage.
- Solid: says it verifies navigation to product detail.
- Strong: notes it does not add to cart or checkout.
