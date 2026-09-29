# 04 Tooling And Build System

## Package Scripts

`package.json:6-18` defines the project commands. These are inferred commands because dependencies were not installed during documentation.

| Script | Command | Use |
| --- | --- | --- |
| dev | `next dev` | Local development server |
| build | `next build` | Production build and App Router checks |
| lint | `eslint .` | Static linting |
| typecheck | `tsc --noEmit` | Type safety |
| test | `vitest run` | Unit/integration tests |
| test:e2e | `playwright test` | Browser E2E tests |
| db:migrate | `prisma migrate dev` | Local schema migration |
| db:seed | `tsx prisma/seed.ts` | Seed data |

## TypeScript

`tsconfig.json:7-20` enables strict mode and path aliases. This means imports like `@/server/db/prisma` resolve to `src/server/db/prisma.ts`.

Pitfalls:

- Path aliases must also work in test config. `vitest.config.ts:18-21` maps `@` to `src`.
- Generated Next types are included in `tsconfig.json:27-28`.

## ESLint

`eslint.config.mjs:9-13` extends Next core-web-vitals and TypeScript rules while ignoring generated/prototype output. Do not silence lint errors without understanding whether the rule protects runtime, accessibility, or maintainability.

## Testing Tools

- Vitest includes unit and integration tests: `vitest.config.ts:5-7`.
- Coverage thresholds are declared at `vitest.config.ts:8-16`.
- Playwright runs desktop and mobile projects: `playwright.config.ts:10-13`.

## Next Config

`next.config.mjs:3-14` enables typed routes, allows Unsplash image URLs, and disables the powered-by header.

## Prisma

The schema is `prisma/schema.prisma:1-366`; seed data is `prisma/seed.ts:6-108`.

## Drill

You change `src/domain/orders/order-state.ts`. Which commands should run before PR?

Suggested answer:

```bash
npm run typecheck
npm run test -- tests/unit/order-state.test.ts
npm run test
```

Self-grade:

- Basic: runs all tests.
- Solid: runs targeted tests first, then broader checks.
- Strong: updates tests before behavior change and notes migration impact if status enum changes.
