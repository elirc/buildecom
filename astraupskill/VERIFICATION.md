# Verification record

Executed from the staged buildecom project:

```text
node --experimental-vm-modules --test tests/runtime-order-status.test.mjs
```

Final reviewed result: six tests passed and zero failed. The first executed the real `updateOrderStatus` success path, asserted the id and read-status predicate, checked the event payload, and verified one audit plus one buyer notification. The second forced Prisma-style `P2025` and verified the service’s 409 `ORDER_STATUS_CHANGED` error with zero audit and notification writes. The third verified an out-of-scope seller is denied before the transaction. The fourth makes the update operation inside the catch throw an unrelated Error and verifies its identity is preserved. Two additional cases reject an illegal transition using the real domain rule and preserve the in-scope seller fulfillment path.

The local loader is [`tests/helpers-load-typescript.mjs`](../tests/helpers-load-typescript.mjs), and the exact baseline is [`snapshots/src-server-orders-service.ts.before`](snapshots/src-server-orders-service.ts.before). The test executes the real service source with actual order-policy and ApiError modules plus explicit contracts for Prisma, payment, notification, unused Zod error handling and `server-only`. It does not execute the Next route, Vitest, live Prisma, database transaction isolation, Stripe, or an outbox. A follow-up integration check should race two real status updates and inspect event and audit rows.

The evidence is deliberately scoped to `updateOrderStatus`. It demonstrates the stale status boundary and side-effect ordering; it does not claim checkout inventory safety, refund idempotency, or protection for other order mutations. Review the changed source against the snapshot before delivery.

The staged handoff also records the command, numeric test count, and limitations in the batch checks result. The original file snapshot is byte exact for the baseline service, while the course links the changed service, test, helper, domain policy, and route. This makes the review reproducible: a reviewer can inspect the diff, run the same command from the project directory, and see precisely which database behavior remains unverified.

## Astra execution evidence

The captured focused production-source suite executed 6 tests: all passed, zero failed and zero skipped. Read the [captured output](evidence/crud-b02-astra-runtime.log) and [exact command and limits](evidence/results.json). Earlier check records remain preserved in the workspace.
