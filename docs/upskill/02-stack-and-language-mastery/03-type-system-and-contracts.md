# 03 Type System And Contracts

## Contract Layers

| Contract | File | Role |
| --- | --- | --- |
| TypeScript domain types | `src/domain/checkout/pricing.ts:3-28` | Compile-time shapes for pricing inputs and outputs |
| Runtime request schemas | `src/server/validation/schemas.ts:5-51` | Validate untrusted API input |
| API response envelope | `src/server/api/responses.ts:4-26` | Consistent JSON success/error shape |
| Database schema | `prisma/schema.prisma:63-366` | Durable persistence contract |
| UI view model | `src/types/marketplace.ts` | Shape passed from server query to components |

## Unions And Narrowing

`src/domain/orders/order-state.ts:1-3` derives `OrderStatus` from a const array. This gives a finite set of statuses to both code and validation. `src/server/validation/schemas.ts:21-23` reuses that finite set in the API schema.

Why it matters: when a new status is added, TypeScript can reveal missing transitions or tests.

Failure modes:

- Adding an enum value in Prisma but not in domain state.
- Accepting arbitrary strings in an API body.
- Using `as OrderStatus` to silence errors.

Drill: pretend you add `CANCELLED`. List all files that must change.

Strong answer includes: Prisma enum, domain transition table, Zod schema, order service logic, tests, UI labels, docs, migration.

## `unknown` At Boundaries

`parseJsonBody` treats request data as unknown until the schema proves it. That is the correct mindset for external input.

Real boundary: `app/api/v1/admin/disputes/[disputeId]/route.ts:13-16` parses an admin body before calling service code.

Failure mode: accepting `request.json()` and passing it directly into Prisma.

## `satisfies`

`src/server/auth/rbac.ts:5-9` uses `satisfies Record<Role, string[]>` to ensure every role has a permission list while preserving literal values.

Why it matters: this is stronger than a loose object because adding a new role should force permission review.

Drill: add a fake `SUPPORT` role on paper. What breaks?

## Type Safety Sharp Edges

- `src/components/marketplace/product-card.tsx:10` casts a dynamic string to `Route`. This is practical, but it can hide invalid route generation.
- `app/api/webhooks/stripe/route.ts:42-48` relies on Stripe event object shapes. Provider SDK types help, but event-type narrowing should be tested.
- `src/server/api/errors.ts:21-27` maps generic `Error` messages by prefix; this is convenient but less precise than explicit error classes.

## Drill

Choose one public API route and write three contracts:

1. Runtime input contract.
2. Domain/service input contract.
3. Persistence contract.

Self-grade:

- Basic: names schemas and types.
- Solid: explains why runtime and compile-time contracts differ.
- Strong: identifies one place where contract drift could occur.
