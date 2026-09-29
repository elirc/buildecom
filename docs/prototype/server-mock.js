/**
 * Mock marketplace API boundary.
 *
 * This file is intentionally dependency-free. In a real implementation, this
 * would become an Express or Fastify server, or a set of Next.js route handlers.
 * Keep the order of concerns: request id, structured logging, rate limiting,
 * authentication, role checks, validation, handler, error formatter.
 */

const routes = [
  {
    method: "POST",
    path: "/api/v1/auth/login",
    roles: ["guest"],
    notes: [
      "Validate credentials.",
      "Issue short-lived JWT access token.",
      "Store hashed refresh token family in Redis or Postgres.",
      "Set httpOnly, sameSite cookie for refresh token."
    ]
  },
  {
    method: "POST",
    path: "/api/v1/auth/refresh",
    roles: ["buyer", "seller", "admin"],
    notes: [
      "Rotate refresh token on every use.",
      "Detect reuse and revoke the token family.",
      "Return a new access token."
    ]
  },
  {
    method: "GET",
    path: "/api/v1/products",
    roles: ["guest", "buyer", "seller", "admin"],
    notes: [
      "Support search, filters, cursor pagination, and faceted counts.",
      "Cache popular catalog queries in Redis.",
      "Hide listings from suspended sellers."
    ]
  },
  {
    method: "POST",
    path: "/api/v1/cart/items",
    roles: ["buyer"],
    notes: [
      "Validate product id and quantity.",
      "Check stock in a transaction before checkout.",
      "Store cart in Postgres for signed-in users or Redis for guest sessions."
    ]
  },
  {
    method: "POST",
    path: "/api/v1/checkout/sessions",
    roles: ["buyer"],
    notes: [
      "Create an order in placed state.",
      "Create Stripe PaymentIntent with transfer group.",
      "Persist seller split ledger rows.",
      "Move order to paid after Stripe webhook confirms payment."
    ]
  },
  {
    method: "PATCH",
    path: "/api/v1/orders/:orderId/status",
    roles: ["seller", "admin"],
    notes: [
      "Enforce state transitions with a finite state machine.",
      "Reject invalid transitions like delivered to shipped.",
      "Emit buyer and seller notifications."
    ]
  },
  {
    method: "POST",
    path: "/api/v1/sellers/onboarding",
    roles: ["seller"],
    notes: [
      "Create or update seller profile.",
      "Create Stripe Connect onboarding link.",
      "Hold seller in pending state until platform approval."
    ]
  },
  {
    method: "PATCH",
    path: "/api/v1/admin/sellers/:sellerId",
    roles: ["admin"],
    notes: [
      "Approve, suspend, or reject sellers.",
      "Write an audit log entry for every admin action.",
      "Invalidate cached seller and catalog data."
    ]
  },
  {
    method: "PATCH",
    path: "/api/v1/admin/disputes/:disputeId",
    roles: ["admin"],
    notes: [
      "Attach internal notes and evidence.",
      "Issue full or partial refunds through Stripe.",
      "Resolve or escalate dispute state."
    ]
  }
];

const middlewarePipeline = [
  "attachRequestId",
  "structuredLogger",
  "ipAndUserRateLimiter",
  "parseAndValidateJson",
  "authenticateAccessToken",
  "requireRole",
  "handler",
  "formatErrors"
];

function describeMockApi() {
  return {
    version: "v1",
    middlewarePipeline,
    routes
  };
}

// Export shape for future tests once this becomes a real Node module.
if (typeof module !== "undefined") {
  module.exports = { describeMockApi };
}
