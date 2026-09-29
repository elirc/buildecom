# 04 Performance Thinking

Measure first. Then optimize the bottleneck with the smallest safe change.

## Performance Domains

| Domain | Likely Hotspot | File Anchor |
| --- | --- | --- |
| Render | Product grid image/card rendering | `src/components/marketplace/product-card.tsx:13-36` |
| Network | API route waterfalls | `app/api/v1/**/route.ts` |
| Server | Catalog parallel queries | `src/server/catalog/queries.ts:12-39` |
| DB | Product filters/facets/reviews | `src/server/catalog/queries.ts:13-29` |
| Worker/async | Webhook transfers | `app/api/webhooks/stripe/route.ts:91-116` |
| Bundle | Client components if added | currently mostly server-rendered |
| Startup | Env parse and clients | `src/server/env.ts:3-15`, `src/server/db/prisma.ts:8-16` |
| Cache | Redis rate/idempotency | `src/server/security/rate-limit.ts:11-28` |

## How To Find N+1

Look for loops that call Prisma. Current catalog uses includes instead of a loop at `src/server/catalog/queries.ts:13-19`. That may still over-fetch review rows; measure query count and payload size.

## Serial Async Work

Checkout stock updates are serial inside transaction: `src/server/checkout/service.ts:65-79`. This may be correct for consistency. Do not parallelize transaction writes without understanding lock behavior.

## Unbounded Queries

Catalog has `take: DEFAULT_PAGE_SIZE` at `src/server/catalog/queries.ts:7` and `src/server/catalog/queries.ts:20-21`. Seller/admin dashboards use `take: 20` at `src/server/sellers/queries.ts:16-28` and `src/server/sellers/queries.ts:65-66`.

## Missing Indexes

Check schema indexes:

- Product category/active/price: `prisma/schema.prisma:159-162`.
- Order status/createdAt: `prisma/schema.prisma:219-221`.
- Dispute status/seller: `prisma/schema.prisma:294-295`.

Investigate whether composite indexes are needed for common combined filters.

## Drill

The homepage slows down with 100k products. List your first five probes.

Strong answer:

1. Check DB query count and query plan.
2. Check product/facet query latency separately.
3. Check payload size for reviews/images.
4. Check server render time.
5. Check browser image loading and LCP.
