# 04 Side Effects, Async, And Reliability

## Side Effects Map

| Side Effect | File | Reliability Question |
| --- | --- | --- |
| Redis rate limit | `src/server/security/rate-limit.ts:11-28` | What if Redis is unavailable? |
| Redis idempotency | `src/server/security/idempotency.ts:5-18` | What if key expires while work continues? |
| DB transaction | `src/server/checkout/service.ts:64-133` | What is atomic and what is outside? |
| Stripe PaymentIntent | `src/server/payments/stripe-connect.ts:23-44` | What if Stripe fails after DB commit? |
| Stripe transfers | `src/server/payments/stripe-connect.ts:46-66` | What if one seller transfer fails? |
| Notifications | `src/server/notifications/service.ts:11-33` | Should notification failure fail checkout? |
| Webhook event persistence | `app/api/webhooks/stripe/route.ts:20-56` | What happens on duplicate events? |
| Audit logs | `src/server/sellers/service.ts:82-97` | Are audit logs atomic with admin mutations? |

## Idempotency

Idempotency means a retry has the same effect as one successful call. Checkout reserves a Redis key with `NX` at `src/server/security/idempotency.ts:5-13` and completes it at `src/server/security/idempotency.ts:16-18`.

Failure mode: the response payload is stored, but callers do not currently read the stored completed response. This is an investigate item, not a confirmed bug without running behavior.

## Retries And Compensation

Checkout commits the order before storing Stripe payment fields: `src/server/checkout/service.ts:64-150`. If Stripe fails after the transaction, the system needs one of:

- Mark order as payment setup failed and let buyer retry.
- Outbox job that creates PaymentIntent later.
- Transactional inbox/outbox table and worker.

## Outbox Pattern

Concept: write "what should happen" to the database in the same transaction as business state, then a worker performs external side effects with retries.

Candidate outbox points:

- PaymentIntent creation after order create.
- Low-stock notification after checkout.
- Seller transfers after webhook payment success.

## Backpressure And Timeouts

The Stripe adapter does not configure custom timeouts in `src/server/payments/stripe-connect.ts:6-12`. Before production, review SDK defaults and add operational guidance.

## Failure Visibility

Audit logs exist for seller/admin/order mutations: `src/server/sellers/service.ts:42-52`, `src/server/orders/service.ts:49-62`. Webhook events persist provider payloads at `app/api/webhooks/stripe/route.ts:28-39`.

## Drill

Write a failure timeline for checkout:

1. DB transaction commits.
2. Stripe PaymentIntent creation throws.
3. Buyer retries with same idempotency key.

What should the system return?

Self-grade:

- Basic: says "show error."
- Solid: identifies orphaned placed order risk.
- Strong: proposes outbox or durable recovery with tests.
