# State transitions and compare-and-set

An order transition has two distinct decisions. Authorization and business policy answer whether this actor may request a move. Freshness answers whether the order is still in the state that the policy inspected. Before this change, `updateOrderStatus` made the first decision against `order.status`, then wrote by `{ id }`. The second decision was absent. Two concurrent requests could both validate from `PLACED`; one could commit `PAID`, while the other later writes `REFUNDED` or repeats an event based on stale assumptions.

The repair expresses freshness directly in the write:

```ts
const updatedOrder = await tx.order.update({
  where: { id: input.orderId, status: order.status },
  data: { status: input.status, events: { create: eventData } },
});
```

Prisma returns `P2025` when that extended unique predicate finds no row. The service translates only that known condition into a 409 conflict. The audit and notification calls remain after the update, so a conflict cannot describe or announce an uncommitted state. The returned object is the row accepted by the database, avoiding a second read that could observe another writer.

This is a bounded guarantee. It protects this status update from a row status changing between the read and write. It does not make unrelated edits compare-and-set, guarantee serializable isolation for all transaction operations, or stop a transition that happened before this request read the order. It also assumes the Prisma schema and deployed connector support extended unique filters with `status` alongside the unique `id`.

The runtime test demonstrates the distinction with six cases and the real transition policy. A success records one audit and one notification. A `P2025` records neither. A seller outside the order is rejected before the transaction, and an unrelated database error preserves its original identity. Additional cases preserve an in-scope seller fulfillment transition and reject an illegal transition through the real domain module. Those assertions make state, authorization, and operational failure separate review concerns. Status equality is not a general version check: it does not detect changes to other order fields or seller splits, or an intervening change back to the same status.
