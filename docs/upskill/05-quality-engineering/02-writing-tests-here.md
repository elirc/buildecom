# 02 Writing Tests Here

Commands are inferred from `package.json:10-18`.

```bash
npm run test
npm run test -- tests/unit/pricing.test.ts
npm run test:e2e
npm run typecheck
```

## Recipe 1: Happy Path Domain Test

Use `tests/unit/pricing.test.ts:4-21` as the model. Arrange input lines, call pure function, assert totals and split count.

## Recipe 2: Validation Failure

Target route schemas such as `src/server/validation/schemas.ts:15-19`.

Test shape:

```ts
// Illustrative fake code: adapt to the repo.
expect(checkoutSessionSchema.safeParse({ cartId: "bad" }).success).toBe(false);
```

## Recipe 3: Permission Failure

Target `app/api/v1/orders/[orderId]/status/route.ts:13-16` and `src/server/orders/service.ts:20-32`.

Assert seller cannot update another seller's order.

## Recipe 4: Cross-Resource Rejection

Target checkout ownership filters at `src/server/checkout/service.ts:19-23` and `src/server/checkout/service.ts:37-41`.

Arrange buyer A, buyer B address, buyer A checkout request with buyer B address. Expect failure.

## Recipe 5: Async Side Effect

Mock `createMarketplacePaymentIntent` like `tests/integration/checkout.test.ts:3-9`. Assert service writes order before payment fields, or after planned refactor, asserts outbox event.

## Recipe 6: Cache/Idempotency

Target `src/server/security/idempotency.ts:5-18`. Mock Redis `set` returning non-OK and expect `IDEMPOTENCY_REPLAY`.

## Recipe 7: Migration/Schema Behavior

For Prisma schema changes, add seed coverage in `prisma/seed.ts:6-108` and integration tests around required relations.

## Recipe 8: UI State

Use Playwright shape from `tests/e2e/buyer-checkout.spec.ts:3-9`. Prefer user-visible roles and text over CSS selectors.

## Suggested Checks Per Change

| Change Type | Checks |
| --- | --- |
| Domain only | `npm run test -- tests/unit/...`, `npm run typecheck` |
| API route | targeted route/service tests, `npm run test`, `npm run lint` |
| Prisma schema | `npm run db:migrate`, `npm run db:seed`, integration tests |
| UI | `npm run test:e2e`, accessibility checks |
| Auth/security | route tests, negative permission matrix |

## Drill

Add a test plan for `seller suspension hides products`.

Strong plan includes: admin mutation, seller status update, catalog query excludes products, product detail 404, audit log exists.
