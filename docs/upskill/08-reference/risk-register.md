# Risk Register

| Risk | Evidence | File Anchors | Impact | Likelihood | Suggested Test | Suggested Fix | Confidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Checkout DB commit before Stripe setup | Transaction then Stripe call | `src/server/checkout/service.ts:64-150` | Orders stuck without payment | Medium | mock Stripe failure after transaction | outbox/recovery state | High |
| Partial seller transfer failure | parallel transfers then split update | `app/api/webhooks/stripe/route.ts:91-116` | payout inconsistency | Medium | one transfer succeeds, next fails | transfer attempts table | High |
| Sparse auth/permission coverage | no auth tests found | `tests/` inventory | security regressions | High | route/service permission matrix | add auth tests | High |
| Placeholder integration test | test asserts true | `tests/integration/checkout.test.ts:11-18` | false confidence | High | fail test intentionally | implement or mark todo | High |
| CSRF strategy unclear | cookie auth for mutations | `src/server/auth/session.ts:99-115`, `app/api/v1/cart/items/route.ts:10-85` | forged state changes | Medium | CSRF negative route test | token/double-submit strategy | Medium |
| Stale role claims | role encoded in JWT | `src/server/auth/session.ts:35-40` | permission drift after role change | Medium | role changed after login | token revocation/version claim | Medium |
| Catalog review over-fetch | includes review rows | `src/server/catalog/queries.ts:15-19` | latency at scale | Medium | query plan/payload measurement | aggregate rating summary | Medium |
| Redis outage breaks guarded routes | Redis used for rate/idempotency | `src/server/security/rate-limit.ts:11-28`, `src/server/security/idempotency.ts:5-18` | login/checkout availability | Medium | simulate Redis error | fail-open/closed policy by route | Medium |
| Webhook raw body assumptions | signature uses `request.text()` | `app/api/webhooks/stripe/route.ts:11-18` | invalid webhook verification | Low | signed fixture test | keep raw body path tested | Medium |
| Error prefix coupling | string prefix maps HTTP status | `src/server/api/errors.ts:21-27` | wrong status for new errors | Medium | domain error mapping tests | explicit error classes | High |
| No CI workflow found | no `.github/workflows` in inventory | `rg --files` result | inconsistent checks | Medium | add workflow dry run | CI with lint/type/test | High |
| Missing CSP/HSTS | middleware sets some headers | `middleware.ts:7-11` | browser security gap | Medium | header tests | add CSP/HSTS policy | Medium |

## Confidence Guide

- High: direct file evidence.
- Medium: evidence exists but runtime behavior not executed.
- Low: hypothesis requiring production context.
