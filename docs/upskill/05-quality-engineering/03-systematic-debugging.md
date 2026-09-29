# 03 Systematic Debugging

Use this loop:

1. Reproduce.
2. Narrow the layer.
3. Form one hypothesis.
4. Test cheaply.
5. Fix root cause.
6. Add regression coverage.

## Scenario: Product Does Not Appear In Catalog

**Reproduction:** Visit `/` and expected listing missing.
**First question:** Is the bug in data, filters, or UI?
**Narrowing path:**
1. Check query filters in `src/server/catalog/queries.ts:108-135`.
2. Check seller status in `prisma/schema.prisma:115-137`.
3. Check product active flag in `prisma/schema.prisma:139-163`.
4. Check card rendering in `src/components/marketplace/product-card.tsx:7-39`.
**Useful probes:** Prisma query log from `src/server/db/prisma.ts:8-12`.
**Likely root causes:** suspended seller, inactive product, price band filter.
**Regression test:** catalog excludes suspended seller and includes approved seller.
**Senior lesson:** visibility filters are security and product behavior.

## Scenario: Checkout Creates Order But Payment Fails

**First question:** Did failure happen before or after DB transaction?
**Narrowing path:**
1. Check transaction at `src/server/checkout/service.ts:64-133`.
2. Check PaymentIntent call at `src/server/checkout/service.ts:135-142`.
3. Check order payment fields at `src/server/checkout/service.ts:144-150`.
**Likely root causes:** Stripe error, missing env, network failure.
**Regression test:** simulated Stripe failure after DB transaction.
**Senior lesson:** external side effects need recovery design.

## Scenario: Seller Cannot Update Order Status

**First question:** Is it role, ownership, or transition?
**Narrowing path:**
1. Route role guard: `app/api/v1/orders/[orderId]/status/route.ts:13`.
2. Seller allowed statuses: `src/server/orders/service.ts:20-22`.
3. Seller split ownership: `src/server/orders/service.ts:24-30`.
4. State machine: `src/domain/orders/order-state.ts:17-21`.
**Regression test:** seller owns split but attempts `PAID`; seller does not own split but attempts `SHIPPED`.
**Senior lesson:** role authorization and resource authorization are separate.

## Scenario: Login Works But Refresh Fails

**First question:** Is the cookie missing, JWT invalid, or DB token revoked?
**Narrowing path:**
1. Cookie names: `src/server/auth/session.ts:9-10`.
2. Refresh route reads cookie: `app/api/v1/auth/refresh/route.ts:12-16`.
3. Token verification: `src/server/auth/session.ts:74-87`.
4. DB token lookup/revoke: `app/api/v1/auth/refresh/route.ts:18-59`.
**Regression test:** valid refresh rotates; reused refresh revokes family.
**Senior lesson:** auth bugs often cross crypto, cookies, and persistence.

## Scenario: Webhook Retries Keep Failing

**First question:** Signature, event persistence, or processing?
**Narrowing path:**
1. Signature and raw body: `app/api/webhooks/stripe/route.ts:11-18`.
2. Existing processed event: `app/api/webhooks/stripe/route.ts:20-26`.
3. Event type handling: `app/api/webhooks/stripe/route.ts:41-49`.
4. Transfer creation: `app/api/webhooks/stripe/route.ts:91-116`.
**Regression test:** duplicate processed event returns duplicate true; partial transfer failure can retry safely after future refactor.
**Senior lesson:** webhooks require durable idempotency and observable failure states.

## Tools To Use

- Browser devtools/network for UI/API boundaries.
- Server logs from `src/server/observability/logger.ts`.
- Prisma query logging in development via `src/server/db/prisma.ts:8-12`.
- Playwright traces from `playwright.config.ts:6-9`.
- Request ids from `middleware.ts:3-8`.
