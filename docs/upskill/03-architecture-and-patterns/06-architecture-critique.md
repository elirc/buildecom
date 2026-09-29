# 06 Architecture Critique

## Strongest Design Choices

1. **Layer separation:** UI, API, service, domain, persistence, and adapters are clearly separated. Example: checkout route at `app/api/v1/checkout/sessions/route.ts:10-22` delegates to `src/server/checkout/service.ts:16-173`.
2. **Pure domain rules:** pricing and order transitions are easy to test at `src/domain/checkout/pricing.ts:30-84` and `src/domain/orders/order-state.ts:1-28`.
3. **Runtime validation:** route schemas are centralized in `src/server/validation/schemas.ts:5-51`.
4. **Multi-tenant visibility:** catalog queries filter active products and approved sellers at `src/server/catalog/queries.ts:111-116`.
5. **Auditability:** seller and order mutations write audit logs at `src/server/sellers/service.ts:82-97` and `src/server/orders/service.ts:49-62`.

## Confirmed Risks

| Risk | Evidence | Impact | Recommendation |
| --- | --- | --- | --- |
| Checkout commits DB before Stripe setup | `src/server/checkout/service.ts:64-150` | Orphaned placed order if Stripe call fails | Add outbox/recovery state |
| Webhook transfer partial failure | `app/api/webhooks/stripe/route.ts:91-116` | Some sellers paid, some not | Persist transfer attempts before provider call |
| Sparse auth tests | no auth tests found under `tests/` | Security regressions | Add route/service auth tests |
| Placeholder integration test | `tests/integration/checkout.test.ts:11-18` | False confidence | Replace with transactional DB fixture |

## Hypotheses To Investigate

- Catalog query may over-fetch reviews at `src/server/catalog/queries.ts:15-19`.
- Cookie-authenticated mutations need CSRF strategy beyond `sameSite` settings at `src/server/auth/session.ts:99-115`.
- Refresh token role claims may become stale after role change at `src/server/auth/session.ts:35-40`.
- Redis idempotency completion is stored but not replayed to callers at `src/server/security/idempotency.ts:16-18`.

## Priority Improvements

1. **Checkout outbox and recovery**
   - Migration: add `OutboxEvent` or `PaymentSetupAttempt`.
   - Tests: simulate Stripe failure after order transaction.
   - Rollback: keep old direct Stripe path behind feature flag until recovery proven.

2. **Webhook transfer reliability**
   - Migration: add transfer attempt status per `OrderSplit`.
   - Tests: one transfer succeeds, second fails, retry only failed split.
   - Rollback: disable auto-transfer and run manual reconciliation.

3. **Authorization test matrix**
   - Add tests for buyer/seller/admin route access.
   - Include cross-resource rejection for cart/address/order.
   - Use factories/builders once DB test setup exists.

4. **Catalog query performance**
   - Replace per-product review include with aggregate rating table or grouped query.
   - Add query plan notes and indexes if needed.

5. **CSRF and security headers**
   - Add CSRF token or double-submit pattern for cookie-authenticated mutations.
   - Add CSP and HSTS in middleware.

## What I Would Change In 3 Months

1. Build transactional test harness and replace placeholder integration test.
2. Introduce outbox for payment setup, seller transfers, and notifications.
3. Add a permission matrix and route contract tests.
4. Add data builders and seed fixtures for buyer/seller/admin.
5. Add observability around checkout, webhook, auth refresh, and catalog latency.
6. Document a migration workflow with rollback examples.

## Drill

Pick one confirmed risk and write a one-page RFC.

Self-grade:

- Basic: describes the problem.
- Solid: proposes migration and tests.
- Strong: includes rollout, rollback, monitoring, and owner impact.
