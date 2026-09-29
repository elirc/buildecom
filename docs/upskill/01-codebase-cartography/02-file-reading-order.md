# 02 File Reading Order

Use this as a map, not a checklist to finish in one sitting.

## Junior Path

| Order | File | Why It Matters | Look For | Do Not Get Distracted By |
| --- | --- | --- | --- | --- |
| 1 | `README.md:1-44` | Project identity | Stack, layout, learning order | Missing local setup details |
| 2 | `package.json:6-18` | Commands | dev, build, lint, tests, db scripts | Exact dependency versions |
| 3 | `app/(marketplace)/page.tsx:8-47` | Main buyer page | Search params into server query | Styling classes |
| 4 | `src/components/marketplace/facet-sidebar.tsx:3-60` | Filter UI | Form names: `q`, `category`, `sellerId`, `priceBand` | CSS |
| 5 | `src/components/marketplace/product-card.tsx:7-39` | Product rendering | typed route link and stock label | Image optimization details |
| 6 | `src/server/catalog/queries.ts:9-70` | Data shape for catalog | parallel Prisma queries and view model | Prisma syntax at first pass |
| 7 | `src/domain/orders/order-state.ts:1-28` | Small pure rule | transition table | UI pages |
| 8 | `tests/unit/order-state.test.ts:4-20` | Unit test shape | assertion style | E2E setup |
| 9 | `src/domain/checkout/pricing.ts:30-84` | Cart math | invariants and split calculation | Stripe |
| 10 | `tests/unit/pricing.test.ts:4-31` | Pricing coverage | happy path and oversell test | missing integration fixtures |

## Mid-Level Path

| Order | File | Why It Matters | Look For | Do Not Get Distracted By |
| --- | --- | --- | --- | --- |
| 1 | `app/api/v1/checkout/sessions/route.ts:10-22` | Thin route pattern | context, auth, rate limit, validation, service call | Next request type syntax |
| 2 | `src/server/checkout/service.ts:16-173` | Cross-layer transaction | idempotency, ownership, stock decrement, order creation | order number randomness at first pass |
| 3 | `src/server/security/idempotency.ts:5-18` | Reliability guard | Redis `NX` reservation | Lack of DB idempotency usage |
| 4 | `src/server/payments/stripe-connect.ts:23-77` | Payment boundary | transfer group and metadata | Real Stripe credentials |
| 5 | `app/api/webhooks/stripe/route.ts:7-140` | Async side effects | event persistence, duplicate handling, transfer creation | Full Stripe event taxonomy |
| 6 | `src/server/auth/session.ts:30-128` | Session model | JWT claims, cookie settings, hashing | Auth UI absence |
| 7 | `app/api/v1/auth/refresh/route.ts:8-67` | Refresh rotation | family revoke on invalid token | Exact JWT library details |
| 8 | `src/server/sellers/service.ts:57-136` | Admin mutations | policy checks and audit logs | Missing UI forms |
| 9 | `prisma/schema.prisma:201-266` | Order persistence | Order, OrderItem, OrderSplit, OrderEvent | Generated client |
| 10 | `tests/integration/checkout.test.ts:1-18` | Test gap | mock seam and placeholder | Treating it as full coverage |

## Senior Path

| Order | File | Why It Matters | Senior Questions |
| --- | --- | --- |
| 1 | `prisma/schema.prisma:63-366` | Long-term data contract | What migrations are risky? Which indexes are missing? |
| 2 | `src/server/checkout/service.ts:64-150` | Consistency boundary | What happens if Stripe creation fails after DB commit? |
| 3 | `app/api/webhooks/stripe/route.ts:20-116` | Retry/idempotency | What happens on duplicate event after partial transfers? |
| 4 | `src/server/orders/service.ts:20-32` | Scope and authorization | Does seller order ownership cover all cases? |
| 5 | `src/server/catalog/queries.ts:12-39` | Query performance | Are counts, facets, reviews, and products efficient at scale? |
| 6 | `src/server/api/errors.ts:14-30` | Error contract | Are all domain errors mapped correctly? |
| 7 | `src/server/env.ts:3-15` | Config contract | Does parse-at-import fit build/test/runtime environments? |
| 8 | `middleware.ts:3-18` | Security headers | What is missing: CSP, CSRF, HSTS? |
| 9 | `vitest.config.ts:4-23` | Quality gate | Are coverage thresholds realistic before fixtures exist? |
| 10 | `docs/adr/0001-architecture.md` | Architecture intent | Does code match the ADR? |

## Drill

Pick one file from each path and write:

- Inputs.
- Outputs.
- Dependencies.
- Invariants.
- Side effects.
- Tests.
- Risks.

Self-grade:

- Basic: lists imports and exports.
- Solid: explains ownership and failure modes.
- Strong: proposes a safe follow-up change with tests.
