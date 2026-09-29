# 05 Key Flows

## Flow: Buyer Catalog Search

**Why this flow matters:** Catalog visibility is the first multi-tenant boundary. Buyers should see only active products from approved sellers.

**Open these files first:**

- `app/(marketplace)/page.tsx:8-15` - reads URL params and calls the query.
- `src/server/catalog/queries.ts:9-39` - fetches products, counts, categories, sellers.
- `src/server/catalog/queries.ts:108-135` - builds the Prisma filter.
- `src/components/marketplace/facet-sidebar.tsx:3-60` - form fields map to filter params.

**Trace:**

| Step | Owner | File | What happens | Data shape | Risk |
| --- | --- | --- | --- | --- | --- |
| 1 | UI route | `app/(marketplace)/page.tsx:8-15` | Converts `searchParams` into catalog filters | `{ query, category, sellerId, priceBand }` | Misnamed query params break filters |
| 2 | Query service | `src/server/catalog/queries.ts:9-39` | Runs product, count, facet queries in parallel | Prisma results | Parallel queries can overload DB if unbounded |
| 3 | Filter builder | `src/server/catalog/queries.ts:108-135` | Adds approved seller and active product filters | `Prisma.ProductWhereInput` | Missing seller filter causes tenant leakage |
| 4 | UI cards | `src/components/marketplace/product-card.tsx:7-39` | Renders view model | `ProductCardView` | Unsafe image URLs if source not constrained |

**Validation and authorization:** Public catalog has query validation in API form at `src/server/validation/schemas.ts:44-51`; page route currently trusts search params and maps directly.

**Persistence and side effects:** Read-only Prisma queries in `src/server/catalog/queries.ts:12-39`.

**Tests that cover it:** E2E smoke starts on `/` and expects catalog text in `tests/e2e/buyer-checkout.spec.ts:3-8`. No direct unit coverage found for `buildProductWhere`.

**What juniors usually miss:**

- Visibility is authorization, even on a public page.
- Facets must obey the same visibility rules as products.

**What seniors notice:**

- `reviews` are included per product at `src/server/catalog/queries.ts:15-19`; investigate N+1 or over-fetching at scale.
- Page-level params lack Zod validation unlike the API route.

**Drill:** Add a trace row for `priceBand=over-100`.

**Self-grade:**

- Basic: points to the files.
- Solid: names the approved-seller invariant.
- Strong: proposes a test that proves suspended seller products and facets stay hidden.

## Flow: Product Detail

**Why this flow matters:** Detail pages are public, SEO-friendly surfaces, but must preserve catalog visibility and avoid leaking inactive listings.

**Open these files first:**

- `app/(marketplace)/products/[slug]/page.tsx:7-13` - route param and not-found path.
- `src/server/catalog/queries.ts:72-106` - product detail query.
- `src/server/catalog/queries.ts:73-83` - approved seller and active product filters.
- `next.config.mjs:6-13` - allowed remote images.

**Trace:**

| Step | Owner | File | What happens | Data shape | Risk |
| --- | --- | --- | --- | --- | --- |
| 1 | Route | `app/(marketplace)/products/[slug]/page.tsx:7-13` | Reads slug and calls query | `{ slug }` | Bad slug should 404, not crash |
| 2 | Query | `src/server/catalog/queries.ts:72-86` | Fetches product with seller/images/reviews | Product plus relations | Missing status filter leaks inactive products |
| 3 | View model | `src/server/catalog/queries.ts:88-105` | Converts DB shape into detail shape | `ProductDetailsView` | Fallback image must exist |
| 4 | Render | `app/(marketplace)/products/[slug]/page.tsx:15-53` | Shows image, price, stock, rating | JSX | Button is non-functional scaffold |

**Validation and authorization:** Slug is implicit route input; visibility filter is `isActive` and `seller.status` at `src/server/catalog/queries.ts:73-78`.

**Persistence and side effects:** Read-only.

**Tests that cover it:** E2E clicks first product and expects add-to-cart button in `tests/e2e/buyer-checkout.spec.ts:7-8`.

**What juniors usually miss:** `notFound()` is part of the public contract; do not return raw null UI.

**What seniors notice:** Product detail and catalog use duplicate visibility logic; a shared predicate could reduce drift.

**Drill:** Write a fake failing test name for inactive product detail visibility.

**Self-grade:**

- Basic: explains slug to query.
- Solid: identifies visibility filters.
- Strong: designs a shared visibility helper and test plan.

## Flow: Add Item To Cart

**Why this flow matters:** Cart mutation is the first buyer-authenticated write path and has inventory and ownership constraints.

**Open these files first:**

- `app/api/v1/cart/items/route.ts:10-17` - context, role, rate limit, validation.
- `src/server/validation/schemas.ts:10-13` - cart item request contract.
- `app/api/v1/cart/items/route.ts:19-29` - product visibility and stock check.
- `app/api/v1/cart/items/route.ts:31-79` - buyer-owned cart mutation and cookie.

**Trace:**

| Step | Owner | File | What happens | Data shape | Risk |
| --- | --- | --- | --- | --- | --- |
| 1 | API | `app/api/v1/cart/items/route.ts:10-17` | Requires buyer and parses body | `{ productId, quantity }` | Missing auth allows anonymous cart writes |
| 2 | Product lookup | `app/api/v1/cart/items/route.ts:19-25` | Requires active product and approved seller | Product | IDOR if seller visibility filter removed |
| 3 | Stock check | `app/api/v1/cart/items/route.ts:27-29` | Rejects obvious oversell | quantity vs stock | Race remains until checkout transaction |
| 4 | Persistence | `app/api/v1/cart/items/route.ts:31-70` | Finds buyer cart or creates one | Cart + CartItems | Cookie cart id must be scoped to buyer |
| 5 | Response | `app/api/v1/cart/items/route.ts:72-81` | Sets cart cookie and returns count | JSON | Cookie flags matter |

**Validation and authorization:** `cartItemSchema` validates product id and quantity at `src/server/validation/schemas.ts:10-13`; `requireRole` enforces buyer at `app/api/v1/cart/items/route.ts:14`.

**Persistence and side effects:** Prisma cart writes and cookie mutation.

**Tests that cover it:** No direct route test found.

**What juniors usually miss:** Cart stock check is not sufficient for checkout consistency because stock can change later.

**What seniors notice:** There is no explicit CSRF protection for cookie-authenticated mutations; investigate before production.

**Drill:** Add a trace row for stale `mf_cart_id` cookie.

**Self-grade:**

- Basic: identifies route and schema.
- Solid: explains buyer cart ownership check.
- Strong: proposes route tests for cross-buyer cart cookie rejection.

## Flow: Checkout Session And Payment Start

**Why this flow matters:** Checkout touches money, inventory, order records, Stripe, idempotency, and notifications.

**Open these files first:**

- `app/api/v1/checkout/sessions/route.ts:10-22` - thin API boundary.
- `src/server/validation/schemas.ts:15-19` - checkout request shape.
- `src/server/security/idempotency.ts:5-18` - Redis idempotency reservation.
- `src/server/checkout/service.ts:16-62` - cart, address, availability, pricing.
- `src/server/checkout/service.ts:64-150` - transaction and payment metadata.
- `src/server/payments/stripe-connect.ts:23-44` - PaymentIntent creation.

**Trace:**

| Step | Owner | File | What happens | Data shape | Risk |
| --- | --- | --- | --- | --- | --- |
| 1 | Route | `app/api/v1/checkout/sessions/route.ts:13-17` | Buyer auth, rate limit, schema parse | `{ cartId, shippingAddressId, idempotencyKey }` | Missing idempotency causes duplicate side effects |
| 2 | Idempotency | `src/server/checkout/service.ts:16-18` | Reserves key in Redis | Redis key | Reservation can expire mid-flow |
| 3 | Ownership | `src/server/checkout/service.ts:19-42` | Finds buyer cart and address | Cart + Address | IDOR if buyerId filters removed |
| 4 | Domain math | `src/server/checkout/service.ts:50-62` | Calculates splits | `CheckoutPricing` | Missing commission causes runtime error |
| 5 | Transaction | `src/server/checkout/service.ts:64-133` | Decrements stock, creates order/items/splits/events, clears cart | DB records | DB commit before Stripe creates compensation need |
| 6 | Payment | `src/server/checkout/service.ts:135-150` | Creates PaymentIntent and stores ids | Stripe metadata | Stripe failure after DB commit |
| 7 | Notifications | `src/server/checkout/service.ts:152-162` | Low-stock notification | Notification rows | Notification failure after order creation |
| 8 | Response | `src/server/checkout/service.ts:164-173` | Returns client secret and pricing | JSON | Client secret exposure must be scoped |

**Validation and authorization:** route validates with `checkoutSessionSchema` and buyer role at `app/api/v1/checkout/sessions/route.ts:14-17`.

**Persistence and side effects:** Prisma transaction at `src/server/checkout/service.ts:64-133`, Stripe at `src/server/payments/stripe-connect.ts:23-44`, Redis at `src/server/security/idempotency.ts:5-18`, notification at `src/server/notifications/service.ts:17-24`.

**Tests that cover it:** Unit pricing coverage exists in `tests/unit/pricing.test.ts:4-31`; integration checkout test is placeholder in `tests/integration/checkout.test.ts:11-18`.

**What juniors usually miss:** Pure price math is not the same as safe checkout.

**What seniors notice:** Payment side effects after DB commit need an outbox, compensation, or durable recovery job.

**Drill:** Mark which steps are safe to retry and which need idempotency.

**Self-grade:**

- Basic: traces route to service.
- Solid: explains stock transaction and seller splits.
- Strong: proposes recovery for Stripe failure after order creation.

## Flow: Auth Login And Refresh Rotation

**Why this flow matters:** Authentication is the trust boundary for every buyer, seller, and admin mutation.

**Open these files first:**

- `app/api/v1/auth/login/route.ts:12-59` - login route.
- `src/server/validation/schemas.ts:5-8` - login schema.
- `src/server/auth/session.ts:30-57` - token pair creation.
- `src/server/auth/session.ts:99-115` - cookie settings.
- `app/api/v1/auth/refresh/route.ts:18-59` - refresh rotation.

**Trace:**

| Step | Owner | File | What happens | Data shape | Risk |
| --- | --- | --- | --- | --- | --- |
| 1 | Login route | `app/api/v1/auth/login/route.ts:16-18` | Rate limit and parse credentials | email/password | Brute force risk |
| 2 | Credential check | `app/api/v1/auth/login/route.ts:19-27` | Load user and verify password | User | Timing and enumeration |
| 3 | Token issue | `src/server/auth/session.ts:30-57` | Creates access and refresh JWTs | TokenPair | Secret rotation plan needed |
| 4 | Token storage | `app/api/v1/auth/login/route.ts:36-43` | Stores refresh hash/family | RefreshToken | Store hash, never raw token |
| 5 | Cookie write | `src/server/auth/session.ts:99-115` | Writes httpOnly cookies | response cookies | CSRF considerations |
| 6 | Refresh | `app/api/v1/auth/refresh/route.ts:18-59` | Verifies refresh, revokes old token, creates new one | token family | Reuse detection revokes family |

**Validation and authorization:** Login validates input; refresh validates token cryptographically and by database state.

**Persistence and side effects:** `RefreshToken` model at `prisma/schema.prisma:83-95`.

**Tests that cover it:** No auth tests found.

**What juniors usually miss:** JWT verification alone is not enough for refresh rotation; the DB record matters.

**What seniors notice:** Access tokens include role and sellerId at `src/server/auth/session.ts:35-40`; role changes may need token invalidation.

**Drill:** Design a test for refresh token reuse detection.

**Self-grade:**

- Basic: explains login cookies.
- Solid: explains hash storage and family revoke.
- Strong: proposes token invalidation strategy for role changes.

## Flow: Seller And Admin Moderation

**Why this flow matters:** Marketplace platforms need trust controls. Seller state controls catalog visibility and admin actions need auditability.

**Open these files first:**

- `app/api/v1/sellers/onboarding/route.ts:10-21` - seller onboarding route.
- `src/server/sellers/service.ts:19-55` - seller upsert and audit log.
- `app/api/v1/admin/sellers/[sellerId]/route.ts:9-22` - admin seller moderation route.
- `src/server/sellers/service.ts:57-101` - seller policy checks and audit log.
- `src/domain/sellers/seller-policy.ts:1-15` - status rules.

**Trace:**

| Step | Owner | File | What happens | Data shape | Risk |
| --- | --- | --- | --- | --- | --- |
| 1 | Seller route | `app/api/v1/sellers/onboarding/route.ts:13-17` | Requires seller role and validates profile | onboarding body | Missing role check lets buyers create seller profile |
| 2 | Seller service | `src/server/sellers/service.ts:19-40` | Upserts seller profile | SellerProfile | Re-submission resets to pending |
| 3 | Audit | `src/server/sellers/service.ts:42-52` | Records onboarding action | AuditLog | Missing request metadata weakens incident review |
| 4 | Admin route | `app/api/v1/admin/sellers/[sellerId]/route.ts:13-16` | Requires admin and validates status | status/internalNote | IDOR if non-admin accepted |
| 5 | Policy | `src/server/sellers/service.ts:68-74` | Checks allowed status change | SellerStatus | Policy drift if duplicated |
| 6 | Transaction | `src/server/sellers/service.ts:76-100` | Updates seller and writes audit log | SellerProfile + AuditLog | Need atomicity |

**Validation and authorization:** Schemas at `src/server/validation/schemas.ts:25-35`; role guards in route files.

**Persistence and side effects:** Seller profile and audit log writes.

**Tests that cover it:** No direct service or API tests found.

**What juniors usually miss:** Audit logs are part of product behavior for admin actions, not optional logging.

**What seniors notice:** Seller status affects catalog visibility through `src/server/catalog/queries.ts:111-116`; moderation needs regression tests there too.

**Drill:** Trace what happens to catalog products after a seller is suspended.

**Self-grade:**

- Basic: names seller status.
- Solid: connects admin mutation to catalog visibility.
- Strong: proposes cross-layer tests for seller suspension.

## Flow: Stripe Webhook Payment Completion

**Why this flow matters:** Webhooks are async authority from Stripe. They must be idempotent, durable, and safe under retries.

**Open these files first:**

- `app/api/webhooks/stripe/route.ts:7-18` - signature and event construction.
- `app/api/webhooks/stripe/route.ts:20-39` - webhook event persistence.
- `app/api/webhooks/stripe/route.ts:41-56` - event dispatch and processed marker.
- `app/api/webhooks/stripe/route.ts:62-117` - payment success handling.
- `src/server/payments/stripe-connect.ts:46-66` - seller transfer creation.
- `prisma/schema.prisma:357-366` - webhook event model.

**Trace:**

| Step | Owner | File | What happens | Data shape | Risk |
| --- | --- | --- | --- | --- | --- |
| 1 | Webhook route | `app/api/webhooks/stripe/route.ts:11-18` | Requires signature and constructs event | Stripe event | Signature failure must reject |
| 2 | Idempotency | `app/api/webhooks/stripe/route.ts:20-39` | Checks and upserts event | WebhookEvent | Duplicate after partial processing |
| 3 | Dispatch | `app/api/webhooks/stripe/route.ts:41-49` | Handles payment succeeded/refunded | event type | Unsupported events ignored |
| 4 | Order update | `app/api/webhooks/stripe/route.ts:62-87` | Moves order to paid | Order | No transaction around update and transfers |
| 5 | Transfers | `app/api/webhooks/stripe/route.ts:91-116` | Creates seller transfers and stores ids | OrderSplit | Partial transfer failure |
| 6 | Completion | `app/api/webhooks/stripe/route.ts:51-56` | Marks event processed | timestamp | Marking after partial work matters |

**Validation and authorization:** Stripe signature acts as authentication at `app/api/webhooks/stripe/route.ts:11-18`.

**Persistence and side effects:** Webhook event row, order update, Stripe transfers, order split updates.

**Tests that cover it:** No webhook tests found.

**What juniors usually miss:** Webhooks can run more than once and out of order.

**What seniors notice:** This flow is a candidate for an outbox/job processor because provider calls and DB writes are interleaved.

**Drill:** Write a failure timeline where first transfer succeeds and second transfer throws.

**Self-grade:**

- Basic: identifies the webhook route.
- Solid: explains duplicate event handling.
- Strong: proposes a recovery design with idempotent transfer records.

## Verification Notes

- Flow anchors inspected with line-numbered file reads.
- Tests listed only when files exist under `tests/`.
- Some risks are hypotheses because dependencies and services were not run.
