# 01 Good First Tickets

## Ticket 1: Add Missing Commission Unit Test

**Difficulty:** Easy
**Estimated time:** 30 minutes
**Skills practiced:** unit testing, domain errors
**Story:** As a maintainer, I want missing seller commission covered so checkout pricing failures stay explicit.
**Why this is a good contribution:** Pure test-only change with low blast radius.
**Acceptance criteria:**
- [ ] Test fails if `CHECKOUT_MISSING_COMMISSION` stops throwing.
**Read these anchors first:**
- `src/domain/checkout/pricing.ts:58-63` - missing commission branch.
- `tests/unit/pricing.test.ts:4-31` - existing test style.
**Files likely touched:**
- `tests/unit/pricing.test.ts` - add test.
**Implementation plan:**
1. Arrange one line for seller `s1`.
2. Pass empty commission list.
3. Assert throw.
**Illustrative fake-code shape:**
```ts
// Illustrative fake code: adapt to the repo.
expect(() => calculateCheckoutPricing(lines, [])).toThrow("CHECKOUT_MISSING_COMMISSION");
```
**What could go wrong:** brittle exact error text.
**Suggested checks:** `npm run test -- tests/unit/pricing.test.ts`
**Review questions:** Does the test protect a real invariant?

## Ticket 2: Add Seller Policy Unit Tests

**Difficulty:** Easy
**Estimated time:** 45 minutes
**Skills practiced:** state policy tests
**Story:** As an admin feature owner, I want seller state rules tested.
**Acceptance criteria:**
- [ ] Tests cover `canApproveSeller`, `canSuspendSeller`, `canSellerListProducts`.
**Read these anchors first:** `src/domain/sellers/seller-policy.ts:1-15`.
**Files likely touched:** `tests/unit/seller-policy.test.ts`.
**Implementation plan:** mirror `tests/unit/order-state.test.ts:4-20`.
**Illustrative fake-code shape:**
```ts
// Illustrative fake code: adapt to the repo.
expect(canApproveSeller("PENDING")).toBe(true);
```
**What could go wrong:** testing implementation instead of behavior.
**Suggested checks:** `npm run test -- tests/unit/seller-policy.test.ts`
**Review questions:** Would this catch an unsafe moderation change?

## Ticket 3: Document Product Detail Visibility

**Difficulty:** Easy
**Estimated time:** 30 minutes
**Skills practiced:** docs, code reading
**Story:** As a learner, I want product detail visibility explained.
**Acceptance criteria:**
- [ ] Add note to `docs/api-contracts.md` or upskill flow.
**Read these anchors first:** `src/server/catalog/queries.ts:72-86`.
**Files likely touched:** docs only.
**Implementation plan:** cite active product and approved seller filters.
**What could go wrong:** claiming tests exist when they do not.
**Suggested checks:** markdown review.
**Review questions:** Is every claim anchored?

## Ticket 4: Add Price Band Unit Tests

**Difficulty:** Easy
**Estimated time:** 30 minutes
**Skills practiced:** edge cases
**Story:** As a catalog owner, I want price filters documented by tests.
**Acceptance criteria:**
- [ ] Under, middle, over, unknown bands covered.
**Read these anchors first:** `src/domain/catalog/price-band.ts:3-12`.
**Files likely touched:** `tests/unit/price-band.test.ts`.
**Implementation plan:** assert returned min/max.
**What could go wrong:** missing boundary values 4999/5000/10000/10001.
**Suggested checks:** targeted test.
**Review questions:** Are money boundaries clear?

## Ticket 5: Add Logout Route Test Plan

**Difficulty:** Easy
**Estimated time:** 45 minutes
**Skills practiced:** auth reading, test planning
**Story:** As an auth maintainer, I want logout behavior testable.
**Acceptance criteria:**
- [ ] Document or add tests for refresh revocation and cookie clearing.
**Read these anchors first:** `app/api/v1/auth/logout/route.ts`, `src/server/auth/session.ts:117-123`.
**Files likely touched:** tests or docs.
**Implementation plan:** mock Prisma updateMany and response cookies.
**What could go wrong:** testing Next internals too closely.
**Suggested checks:** unit or route test once helpers exist.
**Review questions:** Does it verify token hash, not raw token?

## Ticket 6: Add Request Context Tests

**Difficulty:** Easy
**Estimated time:** 1 hour
**Skills practiced:** utility testing
**Story:** As an API maintainer, I want request ids and IP extraction stable.
**Acceptance criteria:**
- [ ] `x-request-id` preserved.
- [ ] first forwarded IP selected.
**Read these anchors first:** `src/server/api/request-context.ts`.
**Files likely touched:** `tests/unit/request-context.test.ts`.
**Implementation plan:** construct minimal NextRequest or extract pure helper first.
**What could go wrong:** too much framework mocking.
**Suggested checks:** unit test.
**Review questions:** Should helper be pure?

## Ticket 7: Add Error Mapping Tests

**Difficulty:** Easy
**Estimated time:** 1 hour
**Skills practiced:** API contracts
**Story:** As an API consumer, I want predictable error envelopes.
**Acceptance criteria:**
- [ ] Zod error maps to 400.
- [ ] `CHECKOUT_*` maps to 409.
**Read these anchors first:** `src/server/api/errors.ts:14-30`.
**Files likely touched:** `tests/unit/errors.test.ts`.
**Implementation plan:** call `toApiError`.
**What could go wrong:** overfitting exact messages.
**Suggested checks:** targeted unit test.
**Review questions:** Are status codes intentional?

## Ticket 8: Add Facet Sidebar Accessibility Check

**Difficulty:** Easy
**Estimated time:** 45 minutes
**Skills practiced:** UI accessibility
**Story:** As a buyer, I want filters labeled correctly.
**Acceptance criteria:**
- [ ] Labels match controls.
- [ ] E2E can select by label.
**Read these anchors first:** `src/components/marketplace/facet-sidebar.tsx:7-55`.
**Files likely touched:** E2E or component docs.
**Implementation plan:** add Playwright assertions for labels.
**What could go wrong:** brittle text selectors.
**Suggested checks:** `npm run test:e2e`
**Review questions:** Does the test reflect user behavior?

## Ticket 9: Add Webhook Duplicate Test Plan

**Difficulty:** Easy
**Estimated time:** 1 hour
**Skills practiced:** async reliability
**Story:** As an ops engineer, I want duplicate Stripe events safe.
**Acceptance criteria:**
- [ ] Test plan describes duplicate processed event.
**Read these anchors first:** `app/api/webhooks/stripe/route.ts:20-26`.
**Files likely touched:** docs or tests.
**Implementation plan:** mock existing processed event and assert duplicate response.
**What could go wrong:** not preserving raw signature handling.
**Suggested checks:** route test later.
**Review questions:** What is idempotent here?

## Ticket 10: Add Seed Data Comment

**Difficulty:** Easy
**Estimated time:** 20 minutes
**Skills practiced:** onboarding docs
**Story:** As a learner, I want seed users listed without exposing real secrets.
**Acceptance criteria:**
- [ ] Docs mention seed emails only.
**Read these anchors first:** `prisma/seed.ts:7-84`.
**Files likely touched:** docs.
**Implementation plan:** add seed section in README or upskill command cheatsheet.
**What could go wrong:** normalizing real-looking passwords in docs.
**Suggested checks:** docs review.
**Review questions:** Are secrets clearly fake?

## Ticket 11: Add Middleware Header Test Plan

**Difficulty:** Easy
**Estimated time:** 45 minutes
**Skills practiced:** security headers
**Story:** As a security reviewer, I want expected headers documented/tested.
**Acceptance criteria:**
- [ ] Lists current headers and missing CSP/HSTS follow-up.
**Read these anchors first:** `middleware.ts:3-18`.
**Files likely touched:** docs or tests.
**Implementation plan:** add assertions once middleware test setup exists.
**What could go wrong:** claiming complete security.
**Suggested checks:** docs review.
**Review questions:** Which headers are prod-only?

## Ticket 12: Add Product Query API Contract Test Plan

**Difficulty:** Easy
**Estimated time:** 1 hour
**Skills practiced:** API validation
**Story:** As an API consumer, I want product query params bounded.
**Acceptance criteria:**
- [ ] Valid and invalid limit tests planned.
**Read these anchors first:** `src/server/validation/schemas.ts:44-51`, `app/api/v1/products/route.ts`.
**Files likely touched:** tests/docs.
**Implementation plan:** call schema directly first.
**What could go wrong:** route test too heavy.
**Suggested checks:** unit test.
**Review questions:** Does schema protect unbounded queries?

## Ticket 13: Improve Integration Test Placeholder

**Difficulty:** Medium
**Estimated time:** 2 hours
**Skills practiced:** testing honesty
**Story:** As a maintainer, I want placeholder tests not to imply coverage.
**Acceptance criteria:**
- [ ] Replace `expect(true).toBe(true)` with skipped test or real TODO plan.
**Read these anchors first:** `tests/integration/checkout.test.ts:11-18`.
**Files likely touched:** `tests/integration/checkout.test.ts`.
**Implementation plan:** use `it.todo` or implement test with mocked Prisma.
**What could go wrong:** removing useful seam mock.
**Suggested checks:** `npm run test`
**Review questions:** Is coverage more honest?

## Ticket 14: Add Order Refund Domain Tests

**Difficulty:** Easy
**Estimated time:** 1 hour
**Skills practiced:** lifecycle rules
**Story:** As an order owner, I want refund transition assumptions tested.
**Acceptance criteria:**
- [ ] Tests cover allowed refund from paid/shipped/delivered and blocked from refunded.
**Read these anchors first:** `src/domain/orders/order-state.ts:5-21`.
**Files likely touched:** `tests/unit/order-state.test.ts`.
**Implementation plan:** add cases to existing describe.
**What could go wrong:** changing policy without product decision.
**Suggested checks:** targeted test.
**Review questions:** Is policy documented?

## Ticket 15: Add API Response Envelope Docs

**Difficulty:** Easy
**Estimated time:** 30 minutes
**Skills practiced:** API documentation
**Story:** As an API consumer, I want success/error shape documented.
**Acceptance criteria:**
- [ ] Docs show `{ data }` and `{ error }`.
**Read these anchors first:** `src/server/api/responses.ts:4-26`.
**Files likely touched:** `docs/api-contracts.md`.
**Implementation plan:** add short section.
**What could go wrong:** examples drifting from implementation.
**Suggested checks:** docs review.
**Review questions:** Are examples anchored?
