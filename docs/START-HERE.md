# Start Here: ArmourXSports Client

## Identity and status

This repository owns the public website, customer booking UX, API consumption, and safe rendering of published content. Phase 4 binds production pages to the admin-owned live v1 HTTP contract. It never owns PostgreSQL, provider credentials, callbacks, admin authorization, counter workflows, or infrastructure.

## Reading sequence

1. Workspace and repository `AGENTS.md`.
2. This file and `MEMORY.md`.
3. Read only the task-routed documents below.
4. Inspect exact source and tests before editing.

| Task | Read |
| --- | --- |
| Layout/content | `DESIGN.md`, `STRUCTURE.md` |
| Booking/status/lookup | `BUSINESS-RULES.md`, `API.md`, `TESTING.md` |
| API or contract | Both repositories' `API.md` and `MEMORY.md`, then `ARCHITECTURE.md` |
| Deployment | `DEPLOYMENT.md`, `TESTING.md` |
| Handoff | `MEMORY.md`, `CHANGELOG.md`, `DECISIONS.md` |

The contract artifact is copied and checksum-pinned; never import admin source or create a shared package.
