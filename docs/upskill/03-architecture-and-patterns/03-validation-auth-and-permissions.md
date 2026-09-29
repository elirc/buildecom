# 03 Validation, Auth, And Permissions

## Validation Layers

| Boundary | File | What It Validates |
| --- | --- | --- |
| Login | `src/server/validation/schemas.ts:5-8` | email/password shape |
| Cart item | `src/server/validation/schemas.ts:10-13` | product id and quantity |
| Checkout | `src/server/validation/schemas.ts:15-19` | cart id, address id, idempotency key |
| Order status | `src/server/validation/schemas.ts:21-23` | allowed order status |
| Seller onboarding | `src/server/validation/schemas.ts:25-31` | seller profile fields |
| Admin seller update | `src/server/validation/schemas.ts:33-36` | status and internal note |
| Admin dispute update | `src/server/validation/schemas.ts:38-42` | dispute status/resolution |
| Product query API | `src/server/validation/schemas.ts:44-51` | public catalog query params |

## Authentication

- Access and refresh cookies are named at `src/server/auth/session.ts:9-10`.
- Token pair creation is `src/server/auth/session.ts:30-57`.
- Access token verification is `src/server/auth/session.ts:59-72`.
- Refresh verification is `src/server/auth/session.ts:74-87`.
- Cookie flags are set at `src/server/auth/session.ts:99-115`.

## Authorization

- Role list and permission map live at `src/server/auth/rbac.ts:1-23`.
- Route guard helper is `src/server/auth/guards.ts:7-19`.
- Checkout requires buyer at `app/api/v1/checkout/sessions/route.ts:14`.
- Order status update allows seller/admin at `app/api/v1/orders/[orderId]/status/route.ts:13`.
- Admin seller mutation requires admin at `app/api/v1/admin/sellers/[sellerId]/route.ts:13`.
- Admin dispute mutation requires admin at `app/api/v1/admin/disputes/[disputeId]/route.ts:13`.

## Tenant And Resource Isolation

Important IDOR checks:

- Cart lookup includes `buyerId`: `src/server/checkout/service.ts:19-23`.
- Address lookup includes `userId`: `src/server/checkout/service.ts:37-41`.
- Cart mutation validates existing cart belongs to buyer: `app/api/v1/cart/items/route.ts:31-33`.
- Seller order status update checks seller owns an order split: `src/server/orders/service.ts:24-30`.
- Seller dashboard redirects if session lacks matching seller id: `src/server/sellers/queries.ts:7-14`.

## What A Junior Might Miss

- `findUnique` is not authorization.
- URL params like `sellerId` and `orderId` are attacker-controlled.
- A public catalog still has authorization-like visibility rules.
- Runtime validation is required even with TypeScript.

## What A Senior Checks

- Cross-tenant reads and writes.
- Cookie auth plus mutation routes need CSRF strategy.
- Token claims should not become stale after role or seller status changes.
- Admin actions must be audited.
- Webhook signature is authentication for external system events.

## Drill

Pick `app/api/v1/orders/[orderId]/status/route.ts:9-22`. Mark:

- Authentication.
- Role authorization.
- Resource authorization.
- Validation.
- Side effect.
- Error conversion.

Self-grade:

- Basic: finds `requireRole`.
- Solid: follows into `src/server/orders/service.ts:20-32` for seller scope.
- Strong: proposes tests for seller A attempting to update seller B's order.
