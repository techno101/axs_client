# ArmourXSports Client Instructions

## Boundary

This repository owns only the public website and customer booking experience. It consumes the admin-owned `/v1` API. It has no admin pages, database driver/ORM, provider secret, webhook handler, authoritative price/availability calculation, or direct import from `axs_admin`.

## Docs-first workflow (MANDATORY)

1. Route the task: root `project/docs/ROUTING.md` → this repo's `docs/INDEX.md` (quick-find table: feature → file → how to edit).
2. For simple edits, consult root `project/docs/CANONICAL-SURFACES.md` — most copy/image/color edits are one-file changes documented there.
3. Read [docs/START-HERE.md](docs/START-HERE.md), then [docs/MEMORY.md](docs/MEMORY.md). Read the documents routed for the task; use broader context for major, uncertain, payment, or cross-repository work.
4. Read the exact target code and tests before editing once code exists. Documentation can be stale.
5. Make the smallest safe change and run the checks required by `docs/TESTING.md`.
6. Update every affected document in the same pass: current state in `MEMORY.md`, completed work in `CHANGELOG.md`, durable choices in `DECISIONS.md`, and `CANONICAL-SURFACES.md` when a documented surface changes. Plan non-trivial work under root `project/docs/plans/` before coding.

Never invent endpoints, states, or business rules. API contract changes require synchronization with `axs_admin` (version bump + regen + repin), consumer contract checks, and documentation updates in both repositories. Never trust browser payment-return parameters, expose secrets/PII, or leave important knowledge only in chat. Report documentation updates in the final response. Do not create new documentation files without explicit approval.

## Skills

Use root `project/docs/SKILLS.md` to pick a skill for UI design (frontend-design/apple-design), motion (gsap-*), or UI audits (web-design-guidelines). Zero skills by default.
