# 02 Writing PRs And RFCs

## PR Template

```md
## What changed

## Why

## How tested

## Risk and rollback

## Screenshots or logs

## Follow-ups
```

## Example PR Summary

```md
## What changed
Added unit coverage for missing seller commission in checkout pricing.

## Why
`calculateCheckoutPricing` throws `CHECKOUT_MISSING_COMMISSION` at `src/domain/checkout/pricing.ts:61-63`, but tests only covered happy path and oversell.

## How tested
`npm run test -- tests/unit/pricing.test.ts`

## Risk and rollback
Test-only change. Revert the test if it blocks unrelated refactor, but keep invariant coverage somewhere.
```

## Commit Messages

Good:

- `test: cover missing seller commission in pricing`
- `feat: add seller suspension catalog regression`
- `docs: document checkout idempotency flow`

Avoid:

- `fix stuff`
- `wip`
- `refactor all`

## When To Write An RFC

Write an RFC when a change affects:

- database schema,
- auth/security behavior,
- money movement,
- external provider workflow,
- public API contract,
- rollout/rollback strategy.

## RFC Template Tailored To MarketForge

```md
# RFC: [Title]

## Problem
Include file anchors.

## Goals

## Non-goals

## Current behavior

## Proposed design

## Data model changes

## API/UI changes

## Security and permissions

## Reliability and idempotency

## Test plan

## Migration and rollout

## Rollback

## Open questions
```

## Drill

Write an RFC for webhook transfer retries using `app/api/webhooks/stripe/route.ts:91-116`.

Self-grade:

- Basic: states problem.
- Solid: includes schema and tests.
- Strong: includes partial failure, retry, alerting, and rollback.
