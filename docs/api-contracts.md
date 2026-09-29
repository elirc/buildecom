# API Contracts

All API routes are versioned under `/api/v1`.

## Auth

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`

Access tokens are short-lived. Refresh tokens rotate on every refresh and are stored as hashes.

## Catalog

- `GET /api/v1/products?q=&category=&sellerId=&priceBand=`

Only active products from approved sellers are returned.

## Cart And Checkout

- `POST /api/v1/cart/items`
- `POST /api/v1/checkout/sessions`

Checkout requires an idempotency key. The service creates a placed order, reserves inventory, creates seller split ledger rows, and opens a Stripe PaymentIntent.

## Orders

- `PATCH /api/v1/orders/:orderId/status`
- `POST /api/v1/orders/:orderId/refund`

Order state changes use the shared state machine in `src/domain/orders/order-state.ts`.

## Seller And Admin

- `POST /api/v1/sellers/onboarding`
- `PATCH /api/v1/admin/sellers/:sellerId`
- `PATCH /api/v1/admin/disputes/:disputeId`

Admin mutations write audit logs.
