# 05 Security Checklist

## Repo-Specific Risks

| Risk | Current Anchor | Check |
| --- | --- | --- |
| Authorization | `src/server/auth/guards.ts:11-19` | Every mutation route uses role/resource checks |
| IDOR | `src/server/checkout/service.ts:19-23`, `src/server/checkout/service.ts:37-41` | Resource id is scoped to actor |
| Input validation | `src/server/validation/schemas.ts:5-51` | No route passes raw JSON to service |
| XSS | React escaping by default | Avoid dangerouslySetInnerHTML |
| CSRF | cookies at `src/server/auth/session.ts:99-115` | Add CSRF for cookie-auth mutations |
| SQL injection | Prisma query builder | Avoid raw SQL without parameters |
| Open redirects | `redirect("/")` in `src/server/sellers/queries.ts:9-10` | User-controlled redirects absent |
| Secrets | `.env.example:1-9` | No real secrets in repo |
| Webhooks | `app/api/webhooks/stripe/route.ts:11-18` | Verify signature with raw body |
| Rate limiting | `src/server/security/rate-limit.ts:11-28` | Applied to login/cart/checkout |
| Session cookie flags | `src/server/auth/session.ts:99-115` | httpOnly, sameSite, secure in prod |
| Security headers | `middleware.ts:7-11` | Add CSP/HSTS before prod |

## Pre-Merge Security Checklist

- [ ] Does every request body have a schema?
- [ ] Does every actor-controlled id have owner/resource scoping?
- [ ] Does role auth differ from resource auth where needed?
- [ ] Are sensitive mutations audited?
- [ ] Are external webhooks authenticated?
- [ ] Are retries/idempotency safe for side effects?
- [ ] Are secrets absent from code, logs, tests, and docs?
- [ ] Does the error response avoid stack traces and secrets?

## Drill

Review `app/api/v1/cart/items/route.ts:10-85` for security.

Self-grade:

- Basic: sees buyer role.
- Solid: sees product visibility and buyer cart scope.
- Strong: asks about CSRF and stale cart cookie behavior.
