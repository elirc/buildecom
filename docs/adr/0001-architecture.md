# ADR 0001: Marketplace Architecture

## Status

Accepted.

## Context

MarketForge needs three coordinated products: buyer storefront, seller dashboard, and platform admin console. These products share core marketplace rules around catalog visibility, checkout splitting, order state transitions, seller moderation, disputes, payouts, and auditability.

## Decision

Use Next.js App Router for the web app and API routes, backed by PostgreSQL through Prisma. Keep business rules in `src/domain` and infrastructure adapters in `src/server`. Route handlers must stay thin: validate input, enforce auth/rate limits, call services, and format responses.

## Consequences

- Domain logic can be unit-tested without web or database concerns.
- API handlers share authentication, validation, rate limits, and response envelopes.
- Stripe Connect and Redis remain replaceable adapters.
- Seller and admin workflows can evolve independently while using the same order, payout, and audit models.
