# 03 Domain Glossary

| Term | Meaning | Where It Appears | Confusing Neighbor |
| --- | --- | --- | --- |
| Buyer | User who shops and owns carts/orders | `UserRole` in `prisma/schema.prisma:10-14`, checkout auth in `app/api/v1/checkout/sessions/route.ts:14-17` | Customer, user |
| Seller | User with a seller profile and listings | `SellerProfile` in `prisma/schema.prisma:115-137`, seller dashboard query in `src/server/sellers/queries.ts:6-46` | Vendor, shop owner |
| Admin | Platform operator | `UserRole` in `prisma/schema.prisma:10-14`, admin route guard in `app/api/v1/admin/sellers/[sellerId]/route.ts:13-16` | Maintainer, operator |
| Product | Sellable listing owned by seller | `Product` in `prisma/schema.prisma:139-163`, card view in `src/types/marketplace.ts` | Listing, SKU |
| Cart | Buyer-owned mutable collection | `Cart` in `prisma/schema.prisma:176-185`, mutation route in `app/api/v1/cart/items/route.ts:10-85` | Checkout session |
| Order | Durable purchase record | `Order` in `prisma/schema.prisma:201-222`, order creation in `src/server/checkout/service.ts:81-128` | Payment |
| OrderItem | Snapshot of purchased product line | `OrderItem` in `prisma/schema.prisma:224-238`, created in `src/server/checkout/service.ts:97-105` | CartItem |
| OrderSplit | Seller payout ledger row for one order | `OrderSplit` in `prisma/schema.prisma:240-254`, created in `src/server/checkout/service.ts:106-113` | Transfer, payout |
| Payout | Money available/paid to seller | `Payout` in `prisma/schema.prisma:298-311`, seller dashboard includes payouts in `src/server/sellers/queries.ts:20-23` | Stripe transfer |
| Dispute | Trust-and-safety issue tied to order/seller | `Dispute` in `prisma/schema.prisma:282-296`, admin page in `app/(admin)/admin/disputes/page.tsx:34-58` | Refund |
| Refresh token family | Group of rotating refresh tokens | `familyId` in `prisma/schema.prisma:88-94`, reuse handling in `app/api/v1/auth/refresh/route.ts:28-34` | Access token |
| Idempotency key | Client key preventing duplicate side effects | `src/server/security/idempotency.ts:5-18`, checkout schema in `src/server/validation/schemas.ts:15-19` | Request ID |
| Transfer group | Stripe grouping for marketplace order funds | `src/server/payments/stripe-connect.ts:23-43` | PaymentIntent |
| Audit log | Durable record of sensitive mutation | `AuditLog` in `prisma/schema.prisma:327-342`, seller moderation in `src/server/sellers/service.ts:82-97` | Application log |
| Notification | User-facing event record | `Notification` in `prisma/schema.prisma:313-325`, creation helpers in `src/server/notifications/service.ts:11-33` | Alert, email |

## Drill

Explain the difference between `OrderSplit`, `Payout`, and Stripe `Transfer`.

Self-grade:

- Basic: says all involve money.
- Solid: explains `OrderSplit` is internal ledger, `Transfer` is Stripe side effect, `Payout` is seller settlement.
- Strong: explains why these should not be collapsed into one table: auditability, retries, reconciliation, and external provider failure.
