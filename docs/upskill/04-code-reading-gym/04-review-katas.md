# 04 Review Katas

## Kata 1: "Let Guests Add Cart Items"

**Author intent:** Improve conversion.
**Fake diff summary:** Removes `requireRole` from cart route.
**Files this resembles:** `app/api/v1/cart/items/route.ts:13-17`
**Your task:** Review this PR.
**Expected findings:**
Blocking:
- Anonymous write path changes auth model and cart ownership.
Important:
- Needs guest-cart design, cookie security, migration plan.
Optional:
- Rename tests for buyer vs guest cart.
**Good review comment example:**
> Blocking: this removes the buyer ownership invariant. Can we write a short design note for guest carts before changing this route?

## Kata 2: "Simplify Checkout By Removing Idempotency"

**Files this resembles:** `src/server/security/idempotency.ts:5-18`, `src/server/checkout/service.ts:16-18`
Blocking:
- Duplicate orders/payments under retry.
Important:
- Need replay behavior tests.
Optional:
- Improve idempotency docs.
Good comment:
> Checkout has external side effects, so idempotency is part of correctness, not optimization.

## Kata 3: "Use findUnique For Address"

**Files this resembles:** `src/server/checkout/service.ts:37-41`
Blocking:
- IDOR: address id without `userId` scope.
Important:
- Add cross-user address test.
Optional:
- Helper for scoped address lookup.

## Kata 4: "Add CANCELLED Order Status"

**Files this resembles:** `prisma/schema.prisma:34-40`, `src/domain/orders/order-state.ts:1-28`
Blocking:
- Missing migration and transition table update.
Important:
- UI labels, webhook behavior, tests.
Optional:
- Document cancellation policy.

## Kata 5: "Inline Stripe In Checkout Route"

**Files this resembles:** `app/api/v1/checkout/sessions/route.ts:10-22`, `src/server/payments/stripe-connect.ts:23-77`
Blocking:
- Breaks adapter boundary.
Important:
- Harder to mock and retry.
Optional:
- Keep route thin.

## Kata 6: "Admin Dispute Update Without Internal Note"

**Files this resembles:** `src/server/validation/schemas.ts:38-42`, `src/server/sellers/service.ts:117-132`
Blocking:
- Weak audit trail for trust decisions.
Important:
- Require reason/resolution tests.
Optional:
- Better UI copy for admin note.

## Kata 7: "Catalog Query Loads All Products"

**Files this resembles:** `src/server/catalog/queries.ts:12-22`
Blocking:
- Unbounded query and visibility leakage if filters removed.
Important:
- Pagination and indexes.
Optional:
- Add limit constant test.

## Kata 8: "Return Raw Error Stack In API"

**Files this resembles:** `src/server/api/errors.ts:14-30`, `src/server/api/responses.ts:12-26`
Blocking:
- Info disclosure.
Important:
- Keep request id and error code.
Optional:
- Improve log correlation.

## Kata 9: "Webhook JSON Parse For Convenience"

**Files this resembles:** `app/api/webhooks/stripe/route.ts:11-18`
Blocking:
- Signature verification may fail or be bypassed.
Important:
- Keep raw body handling.
Optional:
- Add webhook tests.

## Kata 10: "Update Seller Status Outside Transaction"

**Files this resembles:** `src/server/sellers/service.ts:76-100`
Blocking:
- Seller status can change without audit log.
Important:
- Transaction test.
Optional:
- Extract audit helper.

## Review Language Drill

Rewrite "This is wrong" into:

> I think this breaks the buyer ownership invariant in `src/server/checkout/service.ts:19-23`. Could we keep the scoped lookup and add a regression test for another user's cart/address?

Self-grade:

- Basic: identifies an issue.
- Solid: names severity and file anchor.
- Strong: explains invariant, suggests test, and keeps tone constructive.
