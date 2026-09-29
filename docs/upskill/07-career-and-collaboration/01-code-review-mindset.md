# 01 Code Review Mindset

Review in layers:

1. Does it work?
2. Is it correct under edge cases?
3. Will it stay correct?
4. Does it fit the codebase?
5. Is it kind to future maintainers?

## Repo-Specific Review Checklist

- Does the route follow the thin route pattern from `app/api/v1/checkout/sessions/route.ts:10-22`?
- Is untrusted input validated like `src/server/validation/schemas.ts:5-51`?
- Does every actor-controlled id have owner scope like `src/server/checkout/service.ts:19-23`?
- Are domain rules centralized like `src/domain/orders/order-state.ts:1-28`?
- Are external APIs behind adapters like `src/server/payments/stripe-connect.ts:23-77`?
- Are sensitive mutations audited like `src/server/sellers/service.ts:76-100`?
- Are tests at the right level like `tests/unit/pricing.test.ts:4-31`?

## Good Review Comments

> Blocking: this fetches the address by id only. Checkout currently scopes address lookup by buyer at `src/server/checkout/service.ts:37-41`; can we keep that invariant and add a cross-user regression test?

> Important: this adds a new order status but only updates Prisma. Please also update the transition table in `src/domain/orders/order-state.ts:5-10` and the unit tests in `tests/unit/order-state.test.ts:4-20`.

> Optional: the route works, but it is carrying business logic. Could we move the orchestration into a service like checkout does at `app/api/v1/checkout/sessions/route.ts:13-19`?

## Drill

Review a fake PR that changes checkout. Write:

- one blocking comment,
- one important comment,
- one optional comment.

Self-grade:

- Basic: finds style issues.
- Solid: finds correctness/security issues.
- Strong: anchors the invariant, suggests a test, and avoids shaming.
