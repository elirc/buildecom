# 04 Interview Prep From This Repo

Use MarketForge as interview practice for JavaScript, TypeScript, Python parallels, debugging, system design, and behavioral stories.

## JavaScript And TypeScript Runtime Questions

### Question: When would you use `Promise.all`, and when would you avoid it?

Repo anchor: catalog parallel reads at `src/server/catalog/queries.ts:12-39`; checkout transaction loop at `src/server/checkout/service.ts:65-79`; Stripe transfers at `src/server/payments/stripe-connect.ts:52-65`.

- Junior answer: "`Promise.all` runs async things at the same time."
- Mid-level answer: "Use it for independent reads, avoid it when operations depend on order or need transaction semantics."
- Senior answer: "Use it when concurrency does not violate invariants. For side effects like seller transfers, pair it with idempotency, durable attempt records, and retry strategy."

### Question: Why does TypeScript not replace runtime validation?

Repo anchor: Zod schemas at `src/server/validation/schemas.ts:5-51`.

- Junior: "Types catch errors."
- Mid-level: "Types are compile-time; JSON input is unknown at runtime."
- Senior: "Boundary validation is a contract. It protects API stability, authorization assumptions, and database writes."

### Question: Explain a state machine.

Repo anchor: `src/domain/orders/order-state.ts:1-28`.

- Junior: "It lists statuses."
- Mid-level: "It restricts allowed transitions."
- Senior: "It encodes lifecycle invariants, centralizes policy, and forces migration/test review when states change."

## Python Interview Bridge

This repo is not Python, but it maps to common Python interview topics:

| Interview Topic | MarketForge Example | Python Equivalent |
| --- | --- | --- |
| Request validation | `src/server/validation/schemas.ts:5-51` | Pydantic/FastAPI models |
| Async I/O | `src/server/payments/stripe-connect.ts:23-77` | `asyncio` or sync clients behind service boundary |
| ORM transactions | `src/server/checkout/service.ts:64-133` | SQLAlchemy session transaction |
| State machine | `src/domain/orders/order-state.ts:1-28` | Enum + transition dict |
| Unit tests | `tests/unit/pricing.test.ts:4-31` | pytest pure function tests |
| Mocking external API | `tests/integration/checkout.test.ts:3-9` | `monkeypatch` or `unittest.mock` |

Python prompt: "Design checkout in FastAPI." Strong answer should still include validation, auth, idempotency, transaction, payment adapter, webhook handling, and tests.

## Framework Questions

### Question: What is the difference between a page and an API route in Next.js?

Repo anchors: page `app/(marketplace)/page.tsx:8-47`; API route `app/api/v1/checkout/sessions/route.ts:10-22`.

Strong answer: pages render UI and can fetch server data; API routes are HTTP contracts that validate input, authorize, call services, and return JSON.

### Question: Why use Server Components here?

Repo anchor: `app/(seller)/seller/dashboard/page.tsx:6-28`.

Strong answer: server pages can fetch privileged data without exposing DB access to browser bundles, but you must avoid importing server-only code into client components.

## Debugging Questions

### Question: A buyer reports checkout double-charged them. Where do you look?

Anchors:

- idempotency: `src/server/security/idempotency.ts:5-18`
- checkout transaction: `src/server/checkout/service.ts:64-133`
- Stripe payment: `src/server/payments/stripe-connect.ts:23-44`
- webhook: `app/api/webhooks/stripe/route.ts:20-56`

Senior answer includes: reproduce with same idempotency key, inspect order count, payment intent metadata, webhook duplicate events, and logs by request id.

### Question: Seller cannot ship an order.

Anchors: `app/api/v1/orders/[orderId]/status/route.ts:13-16`, `src/server/orders/service.ts:20-32`.

Senior answer separates role issue, seller ownership issue, and invalid status transition.

## System Design Questions

### Question: Design multi-vendor checkout.

Use:

- `src/domain/checkout/pricing.ts:30-84` for split math.
- `src/server/checkout/service.ts:64-133` for inventory/order transaction.
- `src/server/payments/stripe-connect.ts:23-66` for payment and transfers.
- `app/api/webhooks/stripe/route.ts:62-116` for async confirmation.

Senior answer includes idempotency, stock reservation, seller split ledger, payment webhook, refunds, reconciliation, and auditability.

### Question: Design seller moderation.

Use:

- `src/domain/sellers/seller-policy.ts:1-15`
- `src/server/sellers/service.ts:57-101`
- `src/server/catalog/queries.ts:111-116`

Senior answer includes status policy, audit log, catalog visibility, appeal/review workflow, and tests.

## Code Review Questions

Practice reviewing:

- Missing owner filter in checkout.
- New order status without tests.
- Stripe transfer creation before payment success.
- API route that bypasses shared error envelope.

Strong review answer: severity, invariant, file anchor, suggested test, kind wording.

## Behavioral Prompts

### "Tell me about a time you improved reliability."

Use a contribution around idempotency or webhook retries. Anchor to `src/server/security/idempotency.ts:5-18` and `app/api/webhooks/stripe/route.ts:20-56`.

Junior story: "I added a test."
Mid-level story: "I added a retry-safe path and tests."
Senior story: "I identified failure modes, proposed a migration, added observability, and reduced rollout risk."

### "Tell me about a time you disagreed in code review."

Use CSRF or checkout outbox as topic. Strong answer explains tradeoffs, evidence, and respectful resolution.

## Interview Drill Set

1. Explain checkout end to end in 3 minutes.
2. Write a unit test for missing commission.
3. Review a fake PR that removes buyerId from address lookup.
4. Design a webhook retry mechanism.
5. Translate the checkout design to Python/FastAPI.
6. Explain how TypeScript and Zod work together here.
7. Identify one performance risk in catalog.
8. Identify one security risk in cookie-auth mutations.

Self-grade:

- Basic: can name files.
- Solid: can trace data and write tests.
- Strong: can discuss failure modes, alternatives, rollout, and rollback.
