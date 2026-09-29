# 03 Maintainer Communication

## Ask For Help Without Outsourcing Thinking

Use this shape:

```md
I am trying to [goal].
I read [file anchors].
I expected [behavior].
I observed [behavior].
I tried [probes].
My current hypothesis is [hypothesis].
Can you confirm whether [specific question]?
```

## Bug Report Template

```md
## Reproduction

## Expected

## Actual

## Anchors inspected

## Logs/screenshots

## Suspected layer

## Suggested test
```

## Feature Proposal Template

```md
## User story

## Existing pattern to follow

## Files likely touched

## Acceptance criteria

## Risk and rollback

## Maintainer questions
```

## Responding To Requested Changes

Good:

> Thanks, agreed. I restored the buyer ownership filter from `src/server/checkout/service.ts:19-23` and added a cross-user address test.

Avoid:

> Fixed.

## Respectful Disagreement

Use evidence:

> I see the concern about adding another table. My reason for proposing an outbox is that checkout commits the order before Stripe setup at `src/server/checkout/service.ts:64-150`. Would a smaller `paymentSetupStatus` column satisfy the same recovery need for now?

## Drill

Write a maintainer question about CSRF that includes anchors and a hypothesis.

Self-grade:

- Basic: asks "what should I do?"
- Solid: shows files inspected.
- Strong: proposes two options and asks for direction.
