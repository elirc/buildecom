# Codebase map: from API route to order side effects

The HTTP entry point is [`app/api/v1/orders/[orderId]/status/route.ts`](../app/api/v1/orders/[orderId]/status/route.ts). It parses the route id and body, obtains the actor and request context, then calls `updateOrderStatus` from [`src/server/orders/service.ts`](../src/server/orders/service.ts). The service owns the domain transition and seller scope decisions. [`src/domain/orders/order-state.ts`](../src/domain/orders/order-state.ts) defines the allowed sequence: `PLACED` can become `PAID` or `REFUNDED`, `PAID` can become `SHIPPED` or `REFUNDED`, and so on.

Inside the service, `findUniqueOrThrow` supplies the current order and its splits. Seller actors must request fulfillment states and must own one split. After `assertOrderTransition`, the transaction updates the order while creating an event, then writes `auditLog`. The returned order feeds [`src/server/notifications/service.ts`](../src/server/notifications/service.ts), which tells the buyer about the accepted state. The bounded change is at the update seam: the status read from the order becomes part of the `where` predicate.

| Layer | Question | File |
| --- | --- | --- |
| route | What request and actor reach the service? | `app/api/v1/orders/[orderId]/status/route.ts` |
| service | Who may transition and which writes follow? | `src/server/orders/service.ts` |
| policy | Is `from -> to` legal? | `src/domain/orders/order-state.ts` |
| persistence | Is the order still in the read status? | Prisma `update` predicate |
| effects | What happens after acceptance? | event, audit, notify |

The runtime test at [`tests/runtime-order-status.test.mjs`](../tests/runtime-order-status.test.mjs) loads the service itself and records the predicate, event data, audit count, and notification count. Read the original snapshot beside the staged service to distinguish pre-existing policy from the new freshness guard.

When reviewing callers, remember that the route’s HTTP response is downstream from the service result. A service conflict should become the route’s documented 409 response, while a seller scope denial remains 403. This separation keeps transport formatting out of the transaction and makes the same service usable from jobs or another API. The map therefore follows data and authority through each boundary instead of treating every `update` call as equivalent.
