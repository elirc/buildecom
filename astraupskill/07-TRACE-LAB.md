# Trace lab: four order requests

Trace the production service in [`src/server/orders/service.ts`](../src/server/orders/service.ts) while reading the runtime fixture. The table separates policy, persistence, and effects.

| Step | Accepted admin | Stale writer | Out-of-scope seller | Database outage |
| --- | --- | --- | --- | --- |
| read order | `PLACED` | `PLACED` | `PAID` | `PLACED` |
| policy | `PLACED -> PAID` valid | valid at read time | fulfillment requested | valid at read time |
| ownership | admin path | admin path | split does not contain seller | admin path |
| update where | id + `PLACED` | id + `PLACED` | never reached | id + `PLACED` |
| repository result | returns `PAID` | throws `P2025` | never reached | throws ordinary Error |
| audit | one | zero | zero | zero |
| notification | one | zero | zero | zero |
| result | accepted DTO | 409 conflict | 403 denial | original failure |

The key trace point is the gap between the first read and the update. Policy is a decision about the observed state; the extended predicate makes the database recheck that state at write time. When the predicate fails, no event or audit row is created by the callback and the notification code after the transaction cannot run.

Change the accepted status to `SHIPPED` while the read remains `PLACED`. The real domain policy rejects before the transaction because `PLACED -> SHIPPED` is not in [`src/domain/orders/order-state.ts`](../src/domain/orders/order-state.ts). For a separate accepted seller trace, start with an order already `PAID`, change the actor to a seller owning a split, and request `SHIPPED`; policy and ownership then pass, so the same CAS boundary protects the fulfillment transition. A trace that shows an audit before the update is inconsistent with the code’s transaction order. Repeat this lab with a live database later to verify schema support for the extended unique predicate.
