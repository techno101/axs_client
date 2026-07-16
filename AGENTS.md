# ArmourXSports Client Instructions

## Boundary

This repository owns only the public website and customer booking experience. It consumes the admin-owned `/v1` API. It has no admin pages, database driver/ORM, Billplz secret, webhook handler, authoritative price/availability calculation, or direct import from `axs_admin`.

## Required workflow

1. Read [docs/START-HERE.md](docs/START-HERE.md), then [docs/MEMORY.md](docs/MEMORY.md).
2. Read the documents routed for the task; use broader context for major, uncertain, payment, or cross-repository work.
3. Read the exact target code and tests before editing once code exists. Documentation can be stale.
4. Make the smallest safe change and run the checks required by `docs/TESTING.md`.
5. Update every affected document: current state in `MEMORY.md`, meaningful completed work in `CHANGELOG.md`, and durable choices in `DECISIONS.md`.

Never invent endpoints, states, or business rules. API contract changes require synchronization with `axs_admin`, consumer contract checks, and documentation updates in both repositories. Never trust browser payment-return parameters, expose secrets/PII, or leave important knowledge only in chat. Report documentation updates in the final response. Do not create new documentation files without explicit approval.
