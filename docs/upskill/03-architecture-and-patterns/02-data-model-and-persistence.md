# 02 Data Model And Persistence

## Concept

The database is the durable contract. Changing it is not just editing a file; it is a migration, data backfill, code rollout, rollback plan, and test plan.

## Key Entities

| Entity | Lines | Purpose |
| --- | --- | --- |
| User | `prisma/schema.prisma:63-81` | Auth identity and role |
| RefreshToken | `prisma/schema.prisma:83-95` | Rotating refresh-token storage |
| SellerProfile | `prisma/schema.prisma:115-137` | Seller tenant and status |
| Product | `prisma/schema.prisma:139-163` | Catalog listing |
| Cart/CartItem | `prisma/schema.prisma:176-199` | Mutable buyer cart |
| Order | `prisma/schema.prisma:201-222` | Purchase header |
| OrderItem | `prisma/schema.prisma:224-238` | Purchased product snapshot |
| OrderSplit | `prisma/schema.prisma:240-254` | Seller payout ledger |
| OrderEvent | `prisma/schema.prisma:256-266` | Order state history |
| Dispute | `prisma/schema.prisma:282-296` | Trust-and-safety case |
| Payout | `prisma/schema.prisma:298-311` | Seller settlement |
| Notification | `prisma/schema.prisma:313-325` | User-facing event |
| AuditLog | `prisma/schema.prisma:327-342` | Admin/security audit trail |
| WebhookEvent | `prisma/schema.prisma:357-366` | Provider event idempotency |

## Relationships

- One `User` may own one `SellerProfile`: `prisma/schema.prisma:69`, `prisma/schema.prisma:115-118`.
- One `SellerProfile` owns many `Product` rows: `prisma/schema.prisma:128`, `prisma/schema.prisma:139-143`.
- One `Order` owns many items, splits, disputes, events: `prisma/schema.prisma:212-215`.
- `OrderSplit` links order to seller payout accounting: `prisma/schema.prisma:240-254`.

## Indexes

Examples:

- Product filters: `prisma/schema.prisma:159-162`.
- Order queries: `prisma/schema.prisma:219-221`.
- Audit lookup: `prisma/schema.prisma:339-341`.
- Webhook event lookup: `prisma/schema.prisma:357-366`.

## Transaction Boundaries

Checkout uses one transaction to reserve inventory, create order, create items/splits/events, and clear cart: `src/server/checkout/service.ts:64-133`.

Order status update uses one transaction to update order and write audit log: `src/server/orders/service.ts:34-65`.

Seller moderation uses one transaction to update seller and audit log: `src/server/sellers/service.ts:76-100`.

## How To Safely Change Schema

1. Identify all code anchors reading/writing the model.
2. Add optional nullable column first if backfill is needed.
3. Write migration and seed changes.
4. Update queries/services.
5. Add tests around old and new behavior.
6. Deploy in two phases if code and data cannot change atomically.
7. Add rollback plan.

## Drill

Design a migration for `Product.currency` becoming required for multi-currency support.

Self-grade:

- Basic: changes schema.
- Solid: updates seed, pricing, tests.
- Strong: designs backfill, rollout, Stripe currency handling, and rollback.
