# Practice exercises

Read [`src/server/orders/service.ts`](../src/server/orders/service.ts), [`src/domain/orders/order-state.ts`](../src/domain/orders/order-state.ts), and [`tests/runtime-order-status.test.mjs`](../tests/runtime-order-status.test.mjs) before answering.

**Exercise 1, 2 points — predicate.** Name the two fields in the staged update `where`. Explain why `status` is a freshness precondition while `id` is identity.

**Exercise 2, 3 points — success trace.** The order read returns `PLACED`, the actor is an admin, and the update returns `PAID`. Predict the event status, audit count, notification count, and returned status.

**Exercise 3, 3 points — conflict trace.** The update throws an object with `code: "P2025"`. Predict the error code/status exposed by the service and the values of audit and notification counters.

**Exercise 4, 3 points — authorization.** A seller requests `SHIPPED`, but no order split has that seller id. Identify the branch that rejects and state whether Prisma’s transaction callback should execute.

**Exercise 5, 4 points — failure taxonomy.** Design a test for an Error with message `database unavailable` and no `code`. Explain why it must preserve identity rather than become `ORDER_STATUS_CHANGED`.

**Exercise 6, 5 points — integration design.** Describe a real database test with two requests reading `PLACED`, one committing `PAID`, and the other attempting `REFUNDED`. Include assertions for final status, event rows, audit rows, and notifications. State which assertions require an outbox or notification test seam.

Grade yourself out of twenty: exact predicate 2, side-effect counts 5, authorization boundary 3, error taxonomy 4, integration plan 4, and one clearly stated limitation 2. Use the next chapter only after writing concrete answers.

For an additional senior review, compare the conflict response with a retry policy. A client may reload and ask the user to choose again, but the service should not silently retry a status transition because the desired state may no longer be legal. Explain how a retry could accidentally bypass a newly inserted event or seller decision. Then identify the smallest production metric you would add: conflict count by route and order, without logging payment secrets or full customer data.
