# 01 Language Runtime Model

## JavaScript And Node: Event Loop, Promises, And Side Effects

Concept: JavaScript server code runs asynchronous work through promises. `await` makes code look sequential, but it still schedules asynchronous operations. Parallel work is explicit with `Promise.all`.

Why it matters: marketplace code waits on database, Redis, Stripe, and webhook calls. Serial work can add latency; accidental parallel work can break invariants.

Real examples:

- Catalog intentionally runs independent reads in parallel: `src/server/catalog/queries.ts:12-39`.
- Checkout intentionally performs stock updates inside a transaction loop: `src/server/checkout/service.ts:64-79`.
- Stripe seller transfers run in parallel: `src/server/payments/stripe-connect.ts:52-65`.
- Low-stock notifications run in parallel after payment setup: `src/server/checkout/service.ts:152-162`.

Failure modes:

- `Promise.all` with side effects can leave partial external state when one promise rejects.
- `await` inside a loop can be correct for transactions, but slow for independent reads.
- Side effects after a DB commit need recovery.

Drill: classify each async operation in checkout as "must be serial", "may be parallel", or "needs idempotency."

Self-grade:

- Basic: spots `await`.
- Solid: explains why catalog reads are parallel.
- Strong: explains why Stripe transfers need idempotency beyond `Promise.all`.

## TypeScript Runtime Reality

Concept: TypeScript types disappear at runtime. Runtime validation must happen at boundaries.

Real examples:

- Runtime request schemas live in `src/server/validation/schemas.ts:5-51`.
- `parseJsonBody` converts unknown JSON into validated values at `src/server/validation/request.ts`.
- Domain types in `src/domain/checkout/pricing.ts:3-28` guide compile-time usage but do not validate JSON.

Failure modes:

- Trusting a TypeScript type for `request.json()` data.
- Using `as` casts to silence route/link problems, such as the typed route cast in `src/components/marketplace/product-card.tsx:10`.
- Assuming Prisma enum strings protect external API input without Zod.

Drill: explain why `checkoutSessionSchema` at `src/server/validation/schemas.ts:15-19` still matters even though `createCheckoutSession` has a TypeScript input type at `src/server/checkout/service.ts:9-14`.

## Python Interview Bridge

This repo is TypeScript, not Python. Use it to practice transferable interview reasoning:

| Concept | JavaScript/TypeScript Example | Python Parallel |
| --- | --- | --- |
| Runtime validation | `src/server/validation/schemas.ts:5-51` | Pydantic models or dataclass validation |
| Async side effects | `src/server/payments/stripe-connect.ts:23-77` | `asyncio`, Celery tasks, external API clients |
| Transaction boundary | `src/server/checkout/service.ts:64-133` | SQLAlchemy transaction/session block |
| State machine | `src/domain/orders/order-state.ts:1-28` | Enum plus transition table |
| Test seam | `tests/integration/checkout.test.ts:3-9` | pytest monkeypatch/mock |

Interview drill: answer this in both languages: "How would you prevent duplicate checkout submissions?"

Strong answer includes: idempotency key, durable reservation, unique constraint or Redis `NX`, retry semantics, and tests for replay.
