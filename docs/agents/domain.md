# Domain documentation

This project has one domain context. Follow the existing product and technical document owners named in the root `AGENTS.md`; this file defines how to use terminology and decision records.

## Read and use

- Before domain work, read root `GLOSSARY.md` when it exists. Read only relevant records in `docs/adr/` when that directory exists.
- If either source is absent, continue silently. Do not create empty files or suggest scaffolding.
- Use established glossary terms. Add a term only when work resolves vocabulary that future work needs to share.

## Decisions

- Record an ADR only for a durable choice made after a real trade-off; keep product behavior and technical reference in their existing owners.
- When proposed work conflicts with an existing ADR, identify the record and the conflicting contract, then surface the conflict for a decision before changing that contract. Do not silently supersede an accepted decision.
