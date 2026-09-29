# MarketForge Upskill Lab

This curriculum turns MarketForge into a training lab for a junior engineer growing toward mid-level and senior judgment. It is not a generic TypeScript course. Every important lesson points back to this repository's files, flows, contracts, risks, and contribution opportunities.

## Who This Is For

- A brand-new junior who can read JavaScript or TypeScript but needs help seeing a whole system.
- A junior with basic React or Node familiarity who wants to make safer cross-file changes.
- A mid-level engineer new to this repo who needs the architecture map before owning features.
- A senior engineer reviewing the scaffold for risk, migration paths, and future maintainability.

## Repo Identity In 7 Sentences

MarketForge is a production-style multi-vendor marketplace scaffold. It models three runtime surfaces: buyer storefront, seller operations portal, and platform admin console. The web app uses Next.js App Router pages under `app/`, with reusable UI components under `src/components/`. API routes under `app/api/v1/` delegate to server services, validation schemas, auth guards, and domain rules. The domain layer under `src/domain/` contains pure rules such as checkout splitting and order state transitions. Persistence is described through Prisma models in `prisma/schema.prisma`, with seed data in `prisma/seed.ts`. External side effects are represented through Redis, Stripe Connect, notifications, webhooks, and audit logs.

## How To Use This

### One Weekend

1. Read [00-fast-track.md](00-fast-track.md).
2. Trace checkout in [01-codebase-cartography/05-key-flows.md](01-codebase-cartography/05-key-flows.md).
3. Do two drills in [04-code-reading-gym/01-annotation-drills.md](04-code-reading-gym/01-annotation-drills.md).
4. Pick one easy ticket from [06-contribution-practice/01-good-first-tickets.md](06-contribution-practice/01-good-first-tickets.md).

### Two Weeks

1. Complete all files in `01-codebase-cartography/`.
2. Read `02-stack-and-language-mastery/` while keeping the code open.
3. Work through at least four trace tables and four review katas.
4. Write one PR description using [07-career-and-collaboration/02-writing-prs-and-rfcs.md](07-career-and-collaboration/02-writing-prs-and-rfcs.md).

### Eight Weeks

1. Week 1: cartography and fast track.
2. Week 2: TypeScript, React Server Components, Next route handlers.
3. Week 3: data model, Prisma, transactions, migrations.
4. Week 4: auth, authorization, validation, and security checks.
5. Week 5: testing and debugging.
6. Week 6: performance and observability.
7. Week 7: one mid-level feature ticket.
8. Week 8: one senior design kata and an RFC.

### Ongoing Contribution Practice

Rotate between reading, implementing, testing, reviewing, and writing design notes. Do not only code. The fastest growth comes from connecting a change to invariants, contracts, blast radius, verification, rollback, and reviewer confidence.

## Major Learning Tracks

| Track | Start Here | What You Learn |
| --- | --- | --- |
| Codebase navigation | [01-codebase-cartography/README.md](01-codebase-cartography/README.md) | Repo shape, ownership, reading order, domain terms, key flows |
| Stack mastery | [02-stack-and-language-mastery/README.md](02-stack-and-language-mastery/README.md) | TypeScript, JavaScript runtime, Next.js, React, Prisma, build tools |
| Architecture judgment | [03-architecture-and-patterns/README.md](03-architecture-and-patterns/README.md) | Boundaries, data model, validation, async reliability, pattern recognition |
| Active code reading | [04-code-reading-gym/README.md](04-code-reading-gym/README.md) | Annotation, trace tables, fake-code contrasts, review katas |
| Quality engineering | [05-quality-engineering/README.md](05-quality-engineering/README.md) | Tests, debugging, performance, security, operations |
| Contribution practice | [06-contribution-practice/README.md](06-contribution-practice/README.md) | First tickets, mid-level features, senior projects, refactor katas |
| Collaboration and career | [07-career-and-collaboration/README.md](07-career-and-collaboration/README.md) | Reviews, PRs, RFCs, maintainer communication, interview prep |

## Recommended Paths

- Brand-new junior: read [00-fast-track.md](00-fast-track.md), then [01-codebase-cartography/02-file-reading-order.md](01-codebase-cartography/02-file-reading-order.md), then do drills before touching feature code.
- Junior with stack familiarity: start at [01-codebase-cartography/05-key-flows.md](01-codebase-cartography/05-key-flows.md), then [05-quality-engineering/02-writing-tests-here.md](05-quality-engineering/02-writing-tests-here.md), then pick a good-first ticket.
- Mid-level engineer new to this repo: read [03-architecture-and-patterns/01-boundaries-and-layers.md](03-architecture-and-patterns/01-boundaries-and-layers.md), [03-architecture-and-patterns/06-architecture-critique.md](03-architecture-and-patterns/06-architecture-critique.md), and [06-contribution-practice/02-mid-level-feature-tickets.md](06-contribution-practice/02-mid-level-feature-tickets.md).
- Senior architecture reviewer: read [08-reference/risk-register.md](08-reference/risk-register.md), [03-architecture-and-patterns/06-architecture-critique.md](03-architecture-and-patterns/06-architecture-critique.md), and [06-contribution-practice/03-senior-build-projects.md](06-contribution-practice/03-senior-build-projects.md).

## Conventions

- File anchors use `path:line-line` or relative links such as [../../src/domain/orders/order-state.ts](../../src/domain/orders/order-state.ts#L1-L28).
- Fake code is always labeled `Illustrative fake code: not from this repo`.
- Drills ask you to annotate, predict, trace, review, or design before reading the answer.
- Self-grading uses Basic, Solid, Strong.
- Verification Notes list commands run, files inspected, and uncertainties.

## Senior Mindset

A junior asks, "How do I make it work?" A mid-level engineer adds, "Is this the right pattern for this codebase?" A senior asks, "What does this commit us to, who pays the cost, what fails under load or misuse, and how do we reduce risk before rollout?" Use that ladder throughout this lab.

## Verification Notes

- Inspected file inventory with `rg --files`.
- Inspected root metadata: `README.md`, `package.json`, `.env.example`, `tsconfig.json`, `next.config.mjs`, `vitest.config.ts`, `playwright.config.ts`, `eslint.config.mjs`.
- Inspected UI, API, domain, Prisma, auth, payments, webhooks, tests, and docs files.
- Commands and uncertainty details are recorded in [08-reference/verification-log.md](08-reference/verification-log.md).
