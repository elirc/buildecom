# Practice exercises

Read [`src/server/orders/service.ts`](../src/server/orders/service.ts), [`src/domain/orders/order-state.ts`](../src/domain/orders/order-state.ts), and [`tests/runtime-order-status.test.mjs`](../tests/runtime-order-status.test.mjs) before answering.

**Exercise 1, 2 points — predicate.** Name the two fields in the staged update `where`. Explain why `status` is a freshness precondition while `id` is identity.

**Exercise 2, 3 points — success trace.** The order read returns `PLACED`, the actor is an admin, and the update returns `PAID`. Predict the event status, audit count, notification count, and returned status.

**Exercise 3, 3 points — conflict trace.** The update throws an object with `code: "P2025"`. Predict the error code/status exposed by the service and the values of audit and notification counters.

**Exercise 4, 3 points — authorization.** A seller requests `SHIPPED`, but no order split has that seller id. Identify the branch that rejects and state whether Prisma’s transaction callback should execute.

**Exercise 5, 4 points — failure taxonomy.** Design a test for an Error with message `database unavailable` and no `code`. Explain why it must preserve identity rather than become `ORDER_STATUS_CHANGED`.

**Exercise 6, 5 points — integration design.** Describe a real database test with two requests reading `PLACED`, one committing `PAID`, and the other attempting `REFUNDED`. Include assertions for final status, event rows, audit rows, and notifications. State which assertions require an outbox or notification test seam.

Grade yourself out of twenty-four: exact predicate 2, side-effect counts 5, authorization boundary 3, error taxonomy 4, integration plan 4, one clearly stated limitation 2, and the idempotency seam (exercise 7) 4. Use the next chapter only after writing concrete answers.

**Exercise 7, 4 points — the next seam.** Read [`src/server/security/idempotency.ts`](../src/server/security/idempotency.ts) and its two call sites in [`src/server/checkout/service.ts`](../src/server/checkout/service.ts) (reserve at the top of checkout, complete after the transaction). Answer three questions in writing. First: a client times out, received no response, and retries the same `idempotencyKey` *after* checkout completed — what does `reserveIdempotencyKey` return, and is a 409 `IDEMPOTENCY_REPLAY` the idempotent answer, given the completed value stored by `completeIdempotencyKey` is the original response payload? Second: the process crashes between reserve and complete — for how long is that buyer's retry blocked, and by which `ttlSeconds` value? Third: name the smallest change that would return the stored payload on replay instead of an error, and which of the six runtime-test techniques from `tests/runtime-order-status.test.mjs` you would reuse to prove it without Redis.

For an additional senior review, compare the conflict response with a retry policy. A client may reload and ask the user to choose again, but the service should not silently retry a status transition because the desired state may no longer be legal. Explain how a retry could accidentally bypass a newly inserted event or seller decision. Then identify the smallest production metric you would add: conflict count by route and order, without logging payment secrets or full customer data.
