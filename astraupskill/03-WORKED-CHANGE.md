# Worked change: guard the order status write

The exact baseline is [`snapshots/src-server-orders-service.ts.before`](snapshots/src-server-orders-service.ts.before). Before the fix, the transaction contained `tx.order.update({ where: { id: input.orderId }, data: ... })`. The service had already read `order.status`, checked seller ownership, and called `assertOrderTransition`. That sequence created a stale validation window: the `where` clause did not require the row to remain in the status that was validated.

The staged version changes the narrow seam and keeps the event and audit payloads intact:

```ts
let updatedOrder;
try {
  updatedOrder = await tx.order.update({
    where: { id: input.orderId, status: order.status },
    data: {
      status: input.status,
      events: { create: { status: input.status, message: `Order moved from ${order.status} to ${input.status}.` } }
    }
  });
} catch (error) {
  if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
    throw new ApiError("ORDER_STATUS_CHANGED", 409, "Order status changed before this update was saved.");
  }
  throw error;
}
```

Because the exception occurs inside the transaction callback, the audit create is unreachable on conflict and the transaction rolls back. The notification is after the transaction, so it is also unreachable. On success, the returned `updatedOrder` supplies the buyer id, order number, and accepted status to the existing notification call.

The test at [`tests/runtime-order-status.test.mjs`](../tests/runtime-order-status.test.mjs) asserts id and status in the predicate, the new status and event payload, one audit, and one notification. It also forces `P2025`, denies an out-of-scope seller, and rethrows an unrelated error. This scope deliberately leaves refund behavior and checkout stock reservations unchanged; those paths require separate findings and evidence.

The important ordering detail is that the event is nested in the same update call. A conflict prevents both the state mutation and event creation as one database operation. The audit call remains after the update, so its metadata describes an accepted transition. Buyer notification remains outside the transaction because it is an application side effect, but it is reached only when the transaction returns successfully. That ordering is the practical reason the change belongs at the persistence boundary.
