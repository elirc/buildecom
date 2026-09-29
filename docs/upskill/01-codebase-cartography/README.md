# 01 Codebase Cartography

This module teaches you where things live and how to read the system without getting lost.

Read in order:

1. [01-system-map.md](01-system-map.md)
2. [02-file-reading-order.md](02-file-reading-order.md)
3. [03-domain-glossary.md](03-domain-glossary.md)
4. [04-runtime-and-tooling-map.md](04-runtime-and-tooling-map.md)
5. [05-key-flows.md](05-key-flows.md)

The main mental model: UI routes render product, seller, and admin experiences; API routes accept public contracts; services coordinate persistence and side effects; domain files own pure business invariants; Prisma describes durable data.

Verification Notes: file inventory came from `rg --files`; root metadata came from `README.md:1-44`, `package.json:1-52`, and `.env.example:1-9`.
