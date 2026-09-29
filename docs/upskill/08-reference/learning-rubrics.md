# Learning Rubrics

## Junior Engineer Rubric

Observable behaviors:

- Can run or explain commands from `package.json:6-18`.
- Can trace one UI route to query function.
- Can add a unit test near `tests/unit/pricing.test.ts:4-31`.
- Can name validation and authorization files.
- Avoids unrelated refactors.

Checklist:

- [ ] I can explain catalog visibility.
- [ ] I can explain checkout pricing.
- [ ] I can read Prisma models.
- [ ] I can make a small test/docs change.

## Mid-Level Engineer Rubric

Observable behaviors:

- Designs cross-layer changes with schema/API/service/test impact.
- Writes negative tests for permissions and validation.
- Identifies transaction and side-effect boundaries.
- Reviews PRs for correctness, maintainability, and fit.
- Communicates risk and rollback.

Checklist:

- [ ] I can add a route following the thin route pattern.
- [ ] I can modify a Prisma model safely.
- [ ] I can write a permission test.
- [ ] I can debug checkout across route/service/domain/Stripe.

## Senior Engineer Rubric

Observable behaviors:

- Critiques architecture with tradeoffs, not taste alone.
- Identifies hidden coupling and future migration cost.
- Proposes staged rollout and rollback.
- Improves observability and operational safety.
- Teaches others using file anchors and invariants.

Checklist:

- [ ] I can explain checkout failure recovery.
- [ ] I can design webhook idempotency and retry.
- [ ] I can assess security posture.
- [ ] I can write an RFC accepted by maintainers.

## Self-Assessment Scale

| Level | What It Sounds Like |
| --- | --- |
| Weak | "I found the file." |
| Basic | "I can explain what it does." |
| Solid | "I can explain inputs, outputs, invariants, tests, and risks." |
| Strong | "I can change it safely, review alternatives, and reduce rollout risk." |
