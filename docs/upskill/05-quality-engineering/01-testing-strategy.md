# 01 Testing Strategy

## Test Layers In This Repo

| Layer | Existing Files | Belongs Here | Does Not Belong Here |
| --- | --- | --- | --- |
| Unit | `tests/unit/pricing.test.ts:4-31`, `tests/unit/order-state.test.ts:4-20` | Pure domain rules | DB, Stripe, browser |
| Integration | `tests/integration/checkout.test.ts:1-18` | Service + DB + mocked providers | Full browser navigation |
| E2E | `tests/e2e/buyer-checkout.spec.ts:3-9` | Critical user paths | Every edge case |
| Contract/API | not yet present | route validation, auth, response shape | UI screenshots |
| Type tests | not yet present | public type guarantees | Runtime behavior |

## What To Test

- Pure invariants: pricing, order transitions, seller policy.
- Permission failures: buyer vs seller vs admin.
- IDOR rejection: another user's cart/address/order.
- Transaction behavior: stock decrement and order creation.
- Webhook idempotency.
- API response envelopes.

## What Not To Test

- Implementation details of Prisma client.
- CSS class names unless accessibility or layout depends on them.
- Stripe SDK internals.
- Next.js itself.

## Fixtures And Isolation

Use builders once DB tests exist:

- `buildBuyer()`
- `buildSeller({ status })`
- `buildProduct({ sellerId, stock })`
- `buildCart({ buyerId, items })`

Control time and randomness for order numbers in `src/server/checkout/service.ts:176-181` before asserting exact values.

## Flake Prevention

- Avoid relying on test order.
- Use unique ids/emails.
- Reset DB between integration tests.
- Mock external providers at adapter boundary: `src/server/payments/stripe-connect.ts:23-77`.
- Avoid E2E tests for every validation branch.

## Drill

Place these tests in the right layer:

- `DELIVERED -> SHIPPED` is rejected.
- Seller A cannot update seller B's order.
- Stripe duplicate webhook is ignored.
- Buyer can open product detail page.

Self-grade:

- Basic: classifies unit vs E2E.
- Solid: explains why permission tests need route/service context.
- Strong: designs fixtures and cleanup.
