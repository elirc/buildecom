# 00 Fast Track

This is the weekend path. The goal is not mastery. The goal is to run or at least understand the project commands, trace two real flows, make one safe documentation or test change, and explain the architecture without guessing.

## Install, Run, Test

The repository declares scripts in `package.json:6-18`.

```bash
npm install
npm run dev
npm run typecheck
npm run lint
npm run test
npm run test:e2e
npm run db:migrate
npm run db:seed
```

Status: inferred from `package.json:6-18`, not run here because dependencies and local services were intentionally not installed.

You also need environment variables shaped like `.env.example:1-9`. Do not commit real secrets.

## Trace These Two Flows

### Flow 1: Buyer Catalog Search

Open these files first:

- `app/(marketplace)/page.tsx:8-15` - page reads search params and calls the catalog query.
- `src/server/catalog/queries.ts:9-39` - query collects products and facets.
- `src/server/catalog/queries.ts:108-135` - filter object enforces active products and approved sellers.
- `src/components/marketplace/facet-sidebar.tsx:3-60` - UI form names match query parameters.
- `src/components/marketplace/product-card.tsx:7-39` - listing display and typed route link.

Pause and predict: if a seller is suspended, which file hides their products?

Answer: `src/server/catalog/queries.ts:111-116` filters to `seller.status: "APPROVED"`.

### Flow 2: Checkout Session

Open these files first:

- `app/api/v1/checkout/sessions/route.ts:10-22` - route handler boundary.
- `src/server/validation/schemas.ts:15-19` - request contract.
- `src/server/checkout/service.ts:16-62` - cart, address, availability, pricing.
- `src/server/checkout/service.ts:64-133` - transaction, stock decrement, order creation.
- `src/server/payments/stripe-connect.ts:23-44` - Stripe PaymentIntent boundary.
- `src/server/security/idempotency.ts:5-18` - duplicate submission guard.

Pause and predict: why does checkout take an idempotency key?

Strong answer: because payment and inventory reservation are side-effectful. Retrying the same request without a stable idempotency boundary can create duplicate orders or duplicate payment attempts.

## First 10 Files To Open

1. `README.md:1-44` - project identity and layout.
2. `package.json:6-18` - available commands.
3. `app/(marketplace)/page.tsx:8-47` - first UI entry point.
4. `src/server/catalog/queries.ts:9-70` - server query shape.
5. `src/domain/checkout/pricing.ts:30-84` - pure pricing logic.
6. `src/domain/orders/order-state.ts:1-28` - state machine.
7. `app/api/v1/checkout/sessions/route.ts:10-22` - thin route pattern.
8. `src/server/checkout/service.ts:16-173` - cross-layer checkout orchestration.
9. `src/server/auth/session.ts:30-128` - token creation and verification.
10. `prisma/schema.prisma:63-366` - persistence model.

## Safe Change To Attempt

Add one more assertion to `tests/unit/pricing.test.ts:4-31` for missing seller commission:

```ts
// Illustrative fake code: adapt to the repo.
expect(() => calculateCheckoutPricing(lines, [])).toThrow("CHECKOUT_MISSING_COMMISSION");
```

Why it is safe: it touches a unit test around pure domain logic and does not affect runtime behavior.

## One Check To Run

```bash
npm run test -- tests/unit/pricing.test.ts
```

Status: inferred. Not run here because dependencies were not installed.

## Teach-Back Exercise

Explain checkout in 90 seconds:

- What enters the route?
- Where is validation?
- Where is authorization?
- Where is the transaction?
- Where does Stripe start?
- What could duplicate submissions break?

Self-grade:

- Basic: names the files.
- Solid: explains the data shape moving between route, service, domain, and Stripe.
- Strong: names invariants: buyer owns cart, items are active, sellers are approved, stock is decremented atomically, payment side effects need idempotency.

## What This Fast Path Does Not Cover

- Deep Prisma migration design.
- Full webhook reliability.
- SSR/React rendering performance.
- Real local services and CI.
- Full security review.

## Verification Notes

- Commands inferred from `package.json:6-18`.
- Env shape verified in `.env.example:1-9`.
- Flow anchors inspected in UI, API, service, domain, payment, and idempotency files.
