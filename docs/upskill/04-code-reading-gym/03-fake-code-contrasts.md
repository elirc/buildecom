# 03 Fake Code Contrasts

Each bad example is illustrative fake code, not from this repo.

## 1. Coupling UI To DB Shape

```ts
// Illustrative fake code: not from this repo.
function ProductCard({ product }: { product: Prisma.ProductGetPayload<any> }) {
  return <div>{product.seller.owner.passwordHash}</div>;
}
```

Better: map DB rows to a view model as in `src/server/catalog/queries.ts:41-69`, then render `ProductCardView` in `src/components/marketplace/product-card.tsx:7-39`.

## 2. Missing Permission Filter

```ts
// Illustrative fake code: not from this repo.
await prisma.cart.findUnique({ where: { id: cartId } });
```

Better: include owner scope like `src/server/checkout/service.ts:19-23`.

## 3. N+1 Query Instinct

```ts
// Illustrative fake code: not from this repo.
for (const product of products) {
  product.seller = await prisma.sellerProfile.findUnique({ where: { id: product.sellerId } });
}
```

Better: include relations intentionally like `src/server/catalog/queries.ts:13-19`, then measure if over-fetching.

## 4. Stale Cache/Idempotency Key

```ts
// Illustrative fake code: not from this repo.
await redis.set(idempotencyKey, "used");
```

Better: reserve with `NX` and TTL as in `src/server/security/idempotency.ts:5-13`.

## 5. Side Effects In Unreliable Place

```ts
// Illustrative fake code: not from this repo.
await stripe.transfers.create(...);
await prisma.order.update(...);
```

Better: persist durable state before provider call; the current webhook code at `app/api/webhooks/stripe/route.ts:91-116` is a teaching point for improving this.

## 6. Swallowing Errors

```ts
// Illustrative fake code: not from this repo.
try { await checkout(); } catch { return Response.json({ ok: false }); }
```

Better: use shared error mapping at `src/server/api/responses.ts:12-26`.

## 7. Overusing `any`

```ts
// Illustrative fake code: not from this repo.
function updateStatus(status: any) {}
```

Better: use finite union from `src/domain/orders/order-state.ts:1-3` and schema at `src/server/validation/schemas.ts:21-23`.

## 8. Changing Public Contracts Casually

```ts
// Illustrative fake code: not from this repo.
return Response.json({ result: order });
```

Better: keep the response envelope from `src/server/api/responses.ts:4-26`.

## 9. Trusting Webhook JSON Without Signature

```ts
// Illustrative fake code: not from this repo.
const event = await request.json();
```

Better: require signature and construct provider event at `app/api/webhooks/stripe/route.ts:11-18`.

## 10. Duplicating State Rules

```ts
// Illustrative fake code: not from this repo.
if (next !== "SHIPPED" && next !== "DELIVERED") throw new Error();
```

Better: call `assertOrderTransition` from `src/domain/orders/order-state.ts:17-21` and keep special role policy separate at `src/server/orders/service.ts:20-32`.

## 11. Logging Secrets

```ts
// Illustrative fake code: not from this repo.
logger.info({ password, refreshToken });
```

Better: logger redacts sensitive paths in `src/server/observability/logger.ts`.

## 12. No Audit On Admin Mutation

```ts
// Illustrative fake code: not from this repo.
await prisma.sellerProfile.update({ data: { status: "SUSPENDED" } });
```

Better: update and audit in one transaction like `src/server/sellers/service.ts:76-100`.
