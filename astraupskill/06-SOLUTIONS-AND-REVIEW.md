# Exercise solutions and review rubric

**Exercise 1.** The fields are `id` and the previously read `status`. The id selects the order. Status requires the row to retain the state that the transition policy inspected. Seller scope is checked separately and is not revalidated by the status predicate. A status-only predicate would be ambiguous across orders; an id-only predicate is the original stale-write bug.

**Exercise 2.** The update predicate is `{id: orderId, status: "PLACED"}`. The nested event records `PAID`, one audit row records the transition, one buyer notification is sent, and the returned DTO has status `PAID`.

**Exercise 3.** The service throws `ApiError` with code `ORDER_STATUS_CHANGED` and status 409. Audit and notification counts remain zero because the exception occurs before the audit call and before the transaction returns to the notification branch.

**Exercise 4.** The `ownsOrder` condition fails and raises `ORDER_SELLER_SCOPE_FORBIDDEN` with 403. The transaction callback is never invoked, so no update, event, audit, or notification can occur.

**Exercise 5.** The test captures `const failure = new Error(...)`, makes the repository throw it, and asserts rejection with `(error) => error === failure`. Infrastructure failures need their original stack and classification; only a known Prisma no-row conflict is a user-visible stale-state response.

**Exercise 6.** Coordinate two real reads, then commit request A. Request B must match the original `PLACED` predicate and receive 409; final status is `PAID`, with one accepted event and one audit. Notification assertions need a fake or outbox inspection because external delivery should not be called directly by a database test.

**Exercise 7.** A post-completion replay still fails the `NX` set — the key now holds the JSON payload, not "reserved" — so the buyer gets 409 "already being processed" for a checkout that succeeded. True idempotency would read the key on `NX` failure: if the stored value is `"reserved"`, 409 is right (first attempt still in flight); if it parses as a payload, return it with the original success status. A crash between reserve (`ttlSeconds = 60 * 30`) and complete blocks the buyer's retry for up to thirty minutes with no stored outcome. The portable proof is the same stub technique the order-status test uses: supply a fake `redis` whose `set` returns `null` and whose `get` returns the stored payload, and assert the service returns the payload rather than throwing `IDEMPOTENCY_REPLAY`.

Review against [`snapshots/src-server-orders-service.ts.before`](snapshots/src-server-orders-service.ts.before). Approve when the status predicate is visible, `P2025` is the only remapped error, the returned DTO drives effects, and denied sellers cannot enter the transaction. Reject claims of complete concurrency safety or live payment coverage based only on this portable suite.
