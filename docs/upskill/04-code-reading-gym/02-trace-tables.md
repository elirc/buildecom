# 02 Trace Tables

## UI-To-API Trace: Add Cart Item

| Step | File/Line | Value Shape | Owner | Transformation | Risk |
| --- | --- | --- | --- | --- | --- |
| Product UI | `src/components/marketplace/product-card.tsx:33-35` | product route link | UI | buyer navigates to detail | no add-to-cart submit yet |
| Detail page | `app/(marketplace)/products/[slug]/page.tsx:46-48` | button | UI | currently visual only | missing client action |
| API request | `app/api/v1/cart/items/route.ts:10-17` | `{ productId, quantity }` | route | auth, rate limit, parse | route tests absent |
| Product check | `app/api/v1/cart/items/route.ts:19-29` | Product | route | active approved seller and stock | stock race |
| Cart write | `app/api/v1/cart/items/route.ts:31-70` | Cart/CartItem | route/Prisma | upsert or create | stale cart cookie |

## Persistence Trace: Checkout

| Step | File/Line | Value Shape | Owner | Transformation | Risk |
| --- | --- | --- | --- | --- | --- |
| Schema | `src/server/validation/schemas.ts:15-19` | cartId/address/idempotency | API | validates JSON | invalid ids rejected |
| Cart fetch | `src/server/checkout/service.ts:19-35` | Cart with items/products/sellers | service | enforces buyer cart | IDOR if buyerId removed |
| Address fetch | `src/server/checkout/service.ts:37-42` | Address | service | enforces buyer address | cross-user address |
| Pricing | `src/server/checkout/service.ts:50-62` | CheckoutPricing | domain | groups seller splits | missing commission |
| DB transaction | `src/server/checkout/service.ts:64-133` | Order rows | service/Prisma | decrements stock, creates order | partial external side effects later |
| Payment | `src/server/checkout/service.ts:135-150` | Stripe ids | adapter | stores payment intent | failure after DB commit |

## Auth/Permission Trace: Seller Updates Order

| Step | File/Line | Value Shape | Owner | Transformation | Risk |
| --- | --- | --- | --- | --- | --- |
| Route guard | `app/api/v1/orders/[orderId]/status/route.ts:13` | SessionUser | route | seller/admin only | role not enough |
| Body parse | `app/api/v1/orders/[orderId]/status/route.ts:14` | status | route | Zod enum | invalid status blocked |
| Order load | `src/server/orders/service.ts:15-18` | Order + splits | service | loads ownership data | missing split relation would break scope |
| Seller status policy | `src/server/orders/service.ts:20-22` | actor/status | service | only fulfillment states | admin not restricted |
| Seller scope | `src/server/orders/service.ts:24-30` | sellerId vs split | service | prevents cross-seller updates | multi-seller order nuance |
| State machine | `src/server/orders/service.ts:32` | from/to status | domain | validates transition | bypass risk |

## Error Trace: Validation Failure

| Step | File/Line | Value Shape | Owner | Transformation | Risk |
| --- | --- | --- | --- | --- | --- |
| Body parse | `src/server/validation/request.ts` | unknown JSON | validation | safeParse | malformed JSON |
| Zod failure | `src/server/api/errors.ts:17-19` | ZodError | error mapper | BAD_REQUEST | details exposure |
| Response | `src/server/api/responses.ts:12-26` | API envelope | route helper | `{ error }` | inconsistent callers if bypassed |

## Webhook Trace

| Step | File/Line | Value Shape | Owner | Transformation | Risk |
| --- | --- | --- | --- | --- | --- |
| Signature | `app/api/webhooks/stripe/route.ts:11-18` | raw body/signature | webhook | constructs Stripe event | body parsing must preserve raw text |
| Inbox | `app/api/webhooks/stripe/route.ts:20-39` | event id/payload | DB | upsert event | duplicate partial work |
| Payment success | `app/api/webhooks/stripe/route.ts:41-44` | PaymentIntent | webhook | dispatches | event type narrowing |
| Transfers | `app/api/webhooks/stripe/route.ts:91-116` | split transfer inputs | Stripe/DB | creates transfers and saves ids | partial transfer failure |

## Drill

Pick one row and write a regression test name.

Self-grade:

- Basic: test name mentions symptom.
- Solid: test name includes invariant.
- Strong: test name includes actor/resource/security boundary.
