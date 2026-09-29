# 05 Pattern Catalog

## Pattern: Thin Route Handler

**Problem it solves:** Prevents HTTP transport code from swallowing business logic.
**General shape:** context -> auth/rate limit -> validate -> service -> response.
**Real example:** `app/api/v1/checkout/sessions/route.ts:10-22`
**Second example:** `app/api/v1/admin/sellers/[sellerId]/route.ts:9-22`
**Why this implementation works:** Routes are readable and reusable helpers carry cross-cutting concerns.
**Failure modes:** Service grows too large; route forgets resource authorization.
**Use it when:** Adding new API endpoint.
**Avoid it when:** The route is a pure static asset or webhook with provider-specific parsing.
**Drill:** Sketch `POST /api/v1/reviews`.

## Pattern: Runtime Schema At Boundary

**Problem it solves:** TypeScript does not validate untrusted JSON.
**General shape:** parse unknown input with schema before service call.
**Real example:** `src/server/validation/request.ts` plus `src/server/validation/schemas.ts:15-19`
**Second example:** `app/api/v1/orders/[orderId]/refund/route.ts:9-20`
**Failure modes:** Schema drift from domain type; over-permissive strings.
**Use it when:** Data crosses network/process boundary.
**Avoid it when:** Data is already compiler-controlled internal value.
**Drill:** Add a fake schema for reviews.

## Pattern: Pure Domain Rule

**Problem it solves:** Keeps business invariants testable without DB or network.
**General shape:** typed input -> deterministic output or domain error.
**Real example:** `src/domain/checkout/pricing.ts:30-84`
**Second example:** `src/domain/orders/order-state.ts:1-28`
**Failure modes:** Hidden side effects; importing Prisma into domain.
**Use it when:** Rule can be expressed without infrastructure.
**Avoid it when:** Rule needs durable locking or external provider state.
**Drill:** Extract a `canRefundOrder` helper on paper.

## Pattern: State Machine

**Problem it solves:** Prevents invalid lifecycle jumps.
**General shape:** finite statuses plus allowed transition table.
**Real example:** `src/domain/orders/order-state.ts:1-28`
**Second example:** Seller policy is simpler but similar at `src/domain/sellers/seller-policy.ts:1-15`.
**Failure modes:** Adding statuses without tests; bypassing assertion in services.
**Use it when:** Object lifecycle matters.
**Avoid it when:** State is free-form metadata.
**Drill:** Add `CANCELLED` and list affected files.

## Pattern: Transactional Write Plus Audit

**Problem it solves:** Sensitive mutation and evidence should commit together.
**General shape:** transaction updates entity and writes audit row.
**Real example:** `src/server/sellers/service.ts:76-100`
**Second example:** `src/server/orders/service.ts:34-65`
**Failure modes:** Audit outside transaction; missing actor/request metadata.
**Use it when:** Admin, security, or money state changes.
**Avoid it when:** Read-only or noisy non-critical actions.
**Drill:** Add audit to dispute resolution mentally.

## Pattern: Visibility Filter

**Problem it solves:** Prevents public reads from leaking hidden tenant data.
**General shape:** every query adds active/status/ownership predicates.
**Real example:** `src/server/catalog/queries.ts:111-116`
**Second example:** Product detail filter at `src/server/catalog/queries.ts:73-78`.
**Failure modes:** Facets use different filters from products.
**Use it when:** Public or tenant-scoped data is queried.
**Avoid it when:** Admin intentionally sees all states.
**Drill:** Find all approved-seller filters.

## Pattern: Resource Ownership Check

**Problem it solves:** Prevents IDOR.
**General shape:** query resource by id plus owner/scope id.
**Real example:** `src/server/checkout/service.ts:19-23`
**Second example:** `src/server/checkout/service.ts:37-41`
**Failure modes:** Fetch by id then check in app after side effect.
**Use it when:** Request includes resource id.
**Avoid it when:** Resource is intentionally public.
**Drill:** Write a test for another user's address id.

## Pattern: Idempotency Reservation

**Problem it solves:** Prevents duplicate side effects under retry.
**General shape:** reserve key, do work, store completion.
**Real example:** `src/server/security/idempotency.ts:5-18`
**Second example:** Webhook event idempotency at `app/api/webhooks/stripe/route.ts:20-39`.
**Failure modes:** No completed-response replay; key expires too soon.
**Use it when:** Payment, order, or external side effect can repeat.
**Avoid it when:** Idempotent read query.
**Drill:** Explain checkout double-click behavior.

## Pattern: Adapter Around External Provider

**Problem it solves:** Keeps provider SDK details out of services/routes.
**General shape:** app-specific function wraps provider SDK call.
**Real example:** `src/server/payments/stripe-connect.ts:23-77`
**Second example:** Redis adapter at `src/server/cache/redis.ts:1-18`.
**Failure modes:** Adapter becomes too provider-specific to test; leaking SDK types everywhere.
**Use it when:** Calling Stripe, Redis, email, storage.
**Avoid it when:** No abstraction benefit.
**Drill:** Design an email adapter signature.

## Pattern: Webhook Inbox

**Problem it solves:** Makes external events durable and deduplicated.
**General shape:** verify event, store event id/payload, process, mark processed.
**Real example:** `app/api/webhooks/stripe/route.ts:20-56`
**Second example:** Schema model at `prisma/schema.prisma:357-366`.
**Failure modes:** Partial side effects before processed marker; no retry worker.
**Use it when:** Provider retries events.
**Avoid it when:** Event is not authoritative or can be safely ignored.
**Drill:** Add failed processing state to the model.

## Pattern: View Model Mapping

**Problem it solves:** Prevents UI from depending on raw DB model shape.
**General shape:** query returns UI-specific object.
**Real example:** `src/server/catalog/queries.ts:41-69`
**Second example:** Admin dashboard map at `src/server/sellers/queries.ts:70-86`.
**Failure modes:** Missing fields cause UI drift; over-fetching hidden fields.
**Use it when:** Rendering UI from persistent data.
**Avoid it when:** Internal service already uses domain object.
**Drill:** Add `sellerRating` to ProductCardView safely.

## Pattern: Cookie-Based Session

**Problem it solves:** Keeps tokens unavailable to browser JavaScript.
**General shape:** httpOnly cookies with secure/sameSite settings.
**Real example:** `src/server/auth/session.ts:99-115`
**Second example:** Cart cookie at `app/api/v1/cart/items/route.ts:72-79`.
**Failure modes:** CSRF; stale token claims; insecure local assumptions.
**Use it when:** Server-rendered app with same-site API.
**Avoid it when:** Public SDK needs bearer-token APIs.
**Drill:** List CSRF mitigations.

## Pattern: Shared Response Envelope

**Problem it solves:** Keeps API responses predictable.
**General shape:** success `{ data }`, failure `{ error }`.
**Real example:** `src/server/api/responses.ts:4-26`
**Second example:** error mapping at `src/server/api/errors.ts:14-30`.
**Failure modes:** Leaking internal errors; string-based domain error coupling.
**Use it when:** Public JSON API.
**Avoid it when:** Streaming/file response.
**Drill:** Convert a thrown ZodError to response shape.

## Pattern: Test Pyramid Entry Point

**Problem it solves:** Gives confidence at different costs.
**General shape:** pure rules get unit tests, browser flows get E2E, integration tests mock external seams.
**Real example:** `tests/unit/pricing.test.ts:4-31`
**Second example:** `tests/e2e/buyer-checkout.spec.ts:3-9`
**Failure modes:** Placeholder tests; over-mocking behavior.
**Use it when:** Adding behavior.
**Avoid it when:** Snapshot-only tests replace assertions.
**Drill:** Write test plan for seller suspension.
