# 02 Framework Mental Models

## Next.js App Router

Concept: In App Router, files under `app/` define route segments. Server components can fetch data before rendering. Route handlers under `app/api/**/route.ts` define HTTP endpoints.

Repo examples:

- Buyer page: `app/(marketplace)/page.tsx:8-47`.
- Product detail route: `app/(marketplace)/products/[slug]/page.tsx:7-54`.
- Seller page: `app/(seller)/seller/dashboard/page.tsx:6-71`.
- API route: `app/api/v1/checkout/sessions/route.ts:10-22`.

Failure modes:

- Putting side effects in render paths.
- Importing server-only Prisma or Redis adapters into client components.
- Forgetting that server components run with server credentials.

Drill: mark every import in `app/(marketplace)/page.tsx:1-4` as UI, component, shell, or data access.

## React Server Components

Concept: Server components fetch and render on the server. They do not use browser state or effects.

Repo examples:

- `app/(marketplace)/page.tsx:8-15` awaits server data.
- `app/(seller)/seller/dashboard/page.tsx:6-28` renders metrics from server query.
- `src/components/marketplace/facet-sidebar.tsx:3-60` is currently a plain component with no hooks.

Failure modes:

- Adding `useState` to a component without understanding client/server boundaries.
- Passing database models directly to UI instead of view models.

Drill: convert one mental flow from "component fetches on mount" to "server page fetches before render."

## Next Route Handlers

Concept: A route handler should be a transport boundary, not a business logic junk drawer.

Good repo shape:

- Checkout route delegates to service after auth/rate-limit/validation: `app/api/v1/checkout/sessions/route.ts:13-19`.
- Admin seller route delegates to service: `app/api/v1/admin/sellers/[sellerId]/route.ts:13-18`.
- Errors are translated through shared response helpers: `src/server/api/responses.ts:12-26`.

Failure modes:

- Duplicating validation in the route and service.
- Returning raw thrown errors.
- Embedding Stripe logic directly in every route.

Drill: sketch a new route `POST /api/v1/reviews` using the same route shape.

## Prisma Mental Model

Concept: Prisma maps models to typed query methods. It does not remove the need to think about indexes, transaction boundaries, and query shape.

Repo examples:

- Product/seller schema: `prisma/schema.prisma:115-163`.
- Order schema: `prisma/schema.prisma:201-266`.
- Checkout transaction: `src/server/checkout/service.ts:64-133`.
- Catalog query: `src/server/catalog/queries.ts:12-39`.

Failure modes:

- Loading too many relations.
- Missing `where` ownership filters.
- Assuming `findUnique` implies authorization.

Drill: identify every `where` clause in checkout and say which invariant it protects.

## Stripe Connect Mental Model

Concept: A marketplace payment is not just one charge. It includes platform fee accounting, seller transfers, refunds, and reconciliation.

Repo examples:

- PaymentIntent uses transfer group metadata: `src/server/payments/stripe-connect.ts:23-44`.
- Seller transfers use connected account destinations: `src/server/payments/stripe-connect.ts:46-66`.
- Webhook creates transfers after payment success: `app/api/webhooks/stripe/route.ts:62-116`.

Failure modes:

- Creating transfers before payment success.
- Not storing transfer ids.
- No recovery for partial transfer failure.

Drill: explain why `OrderSplit` is internal and Stripe `Transfer` is external.
