# Testing and debugging the order transition

Use the staged project root and run:

```text
node --experimental-vm-modules --test tests/runtime-order-status.test.mjs
```

The loader imports the real [`src/server/orders/service.ts`](../src/server/orders/service.ts). The test loads the real transition policy and ApiError module. It substitutes the Prisma-like repository, notification and refund functions, `server-only`, and the unused Zod error class. This is more useful than copying the service into a test because the production branching, transaction callback, and side-effect ordering execute unchanged.

Debug a failure in a fixed order. First inspect the order fixture and actor role. Next inspect `updates[0].where`: it must contain the request id and the status returned by the first read. Then check `updates[0].data.events.create`, because the event message must still describe the validated from-state. Force a P2025 and verify audit and notification counters stay zero. Finally force an unrelated Error and assert object identity; broad catches would turn an outage into a misleading conflict.

| Symptom | Likely cause | Investigation |
| --- | --- | --- |
| conflict writes an audit | catch or audit is in the wrong place | inspect transaction order |
| seller denial calls update | scope check moved after transaction | inspect `ownsOrder` branch |
| success notifies old state | notification uses pre-write order | inspect returned DTO |
| all errors become 409 | catch matches every exception | check `error.code === P2025` |

The suite does not run the Next route, real Prisma, a database transaction, Stripe, or the full Vitest setup. A production integration test should perform two concurrent status requests against a test database and assert one accepted event, one conflict, and one notification. The portable check is still valuable because it gives deterministic evidence for the service boundary.
