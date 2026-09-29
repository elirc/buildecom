# 01 Boundaries And Layers

## Concept

A boundary defines what a layer owns and what callers may depend on. Good boundaries reduce blast radius: a change in Stripe code should not force UI rewrites; a page should not know how refresh-token rotation works.

## Layer Map

| Layer | Owns | Must Not Own | Example |
| --- | --- | --- | --- |
| UI pages | Routing, layout, rendering | Payment side effects, database transactions | `app/(marketplace)/page.tsx:8-47` |
| UI components | Display and form field names | Auth decisions, Prisma queries | `src/components/marketplace/facet-sidebar.tsx:3-60` |
| API routes | HTTP method, context, auth, validation, response | Deep business rules | `app/api/v1/checkout/sessions/route.ts:10-22` |
| Services | Orchestration, transactions, side effects | Raw unvalidated request parsing | `src/server/checkout/service.ts:16-173` |
| Domain | Pure rules and invariants | Prisma, Redis, Stripe | `src/domain/checkout/pricing.ts:30-84` |
| Persistence | Data model and indexes | UI display decisions | `prisma/schema.prisma:63-366` |
| Integration adapters | Provider-specific calls | Product policy | `src/server/payments/stripe-connect.ts:23-77` |
| Tests | Confidence at right scope | Reimplementation of production logic | `tests/unit/pricing.test.ts:4-31` |

## Good Boundaries

- Checkout route is thin: auth, rate limit, validation, service call, response at `app/api/v1/checkout/sessions/route.ts:13-21`.
- Pricing is pure and testable: `src/domain/checkout/pricing.ts:30-84`.
- Stripe calls are isolated: `src/server/payments/stripe-connect.ts:23-77`.

## Boundary Leaks Or Watch Points

- Admin and seller dashboard pages import server query functions directly, which is fine for server components, but query services must remain server-only: `app/(seller)/seller/dashboard/page.tsx:4-7`, `src/server/sellers/queries.ts:1-4`.
- `src/server/api/errors.ts:21-27` maps domain errors by string prefix. This keeps route code small but couples error names to HTTP semantics.
- Product route uses `as Route` cast at `src/components/marketplace/product-card.tsx:10`; typed routes are useful, but dynamic route validation is weaker here.

## Drill

Move one rule mentally from the wrong layer to the right layer:

- "Only approved sellers appear in catalog."
- "Checkout request must include idempotency key."
- "Stripe transfer destination uses connected account id."

Self-grade:

- Basic: names a layer.
- Solid: names the file that should own the rule.
- Strong: explains test placement and failure modes.
