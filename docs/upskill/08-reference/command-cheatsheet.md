# Command Cheatsheet

Commands are inferred from `package.json:6-18` unless marked verified.

| Task | Command | Status | Evidence |
| --- | --- | --- | --- |
| Install | `npm install` | Inferred | dependencies in `package.json:20-48` |
| Dev server | `npm run dev` | Inferred | `package.json:7` |
| Build | `npm run build` | Inferred | `package.json:8` |
| Start | `npm run start` | Inferred | `package.json:9` |
| Lint | `npm run lint` | Inferred | `package.json:10`, `eslint.config.mjs:9-14` |
| Typecheck | `npm run typecheck` | Inferred | `package.json:11`, `tsconfig.json:1-29` |
| Unit/integration tests | `npm run test` | Inferred | `package.json:12`, `vitest.config.ts:5-7` |
| Watch tests | `npm run test:watch` | Inferred | `package.json:13` |
| E2E tests | `npm run test:e2e` | Inferred | `package.json:14`, `playwright.config.ts:3-14` |
| Prisma generate | `npm run db:generate` | Inferred | `package.json:15` |
| Prisma migrate | `npm run db:migrate` | Inferred | `package.json:16` |
| Prisma deploy | `npm run db:deploy` | Inferred | `package.json:17` |
| Seed | `npm run db:seed` | Inferred | `package.json:18`, `prisma/seed.ts:6-108` |
| Validate JS config syntax | `node --check next.config.mjs` | Verified | passed during docs work |
| Validate package JSON | `node -e "JSON.parse(...)"` | Verified | passed during docs work |

## Targeted Test Examples

```bash
npm run test -- tests/unit/pricing.test.ts
npm run test -- tests/unit/order-state.test.ts
npm run test -- tests/integration/checkout.test.ts
npm run test:e2e -- tests/e2e/buyer-checkout.spec.ts
```

Status: inferred, because dependencies were not installed.

## Database And Services

No Docker or devcontainer files were found during inventory. `.env.example:1-9` implies PostgreSQL, Redis, and Stripe credentials are expected.

## Docs

No docs generator is configured. Markdown files are plain repository docs.
