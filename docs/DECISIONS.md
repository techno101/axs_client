# Client Decisions

## CL-001 — Independent public client

| Field | Record |
| --- | --- |
| Date | 2026-07-15 |
| Status | Accepted |
| Context | Public booking must deploy independently. |
| Decision | Keep public site/API consumer in `axs_client`; use only versioned API communication. |
| Reason | Separation protects secrets, deployment independence, and ownership. |
| Consequences | No admin imports, database driver, webhooks, or payment secrets. |
| Alternatives | Combined repository or shared source — rejected. |
| Affected documents | Architecture, API, Deployment, AGENTS |
| Supersedes | None |

## CL-002 — Public booking inventory

| Field | Record |
| --- | --- |
| Date | 2026-07-15 |
| Status | Accepted |
| Context | Launch booking scope. |
| Decision | Two fields; morning 09:00–15:00 RM600 and evening 15:00–21:00 RM800; complete blocks only. |
| Reason | Confirmed launch inventory. |
| Consequences | Four field-blocks/day and MYR/sen contract values. |
| Alternatives | Hourly or merchandise booking — rejected. |
| Affected documents | Context, Business Rules, API, Testing |
| Supersedes | None |

## CL-003 — Public contract publication

| Field | Record |
| --- | --- |
| Date | 2026-07-15 |
| Status | Superseded by CL-007 |
| Context | Endpoints are planned but schemas, token lifecycle, and published artifact are absent. |
| Decision | Freeze OpenAPI v1 and client synchronization mechanism before coding. |
| Reason | Avoid handwritten contract drift. |
| Consequences | Client foundation is blocked from authoritative integration. |
| Alternatives | Handwritten interfaces — not approved. |
| Affected documents | API, Architecture, Testing, Memory |
| Supersedes | None |

## CL-004 — Customer policies and public content

| Field | Record |
| --- | --- |
| Date | 2026-07-15 |
| Status | Pending client confirmation |
| Context | Cancellation/refund/reschedule policy, venue content, contacts, legal copy, and final assets are unknown. |
| Decision | Keep policy and content placeholders explicit; do not invent terms. |
| Reason | Legal and operational accuracy. |
| Consequences | Production public copy cannot be finalized. |
| Alternatives | Invented policy text — rejected. |
| Affected documents | Context, Business Rules, Design, Deployment |
| Supersedes | None |

## CL-005 — Phase 1 fixture adapter boundary

| Field | Record |
| --- | --- |
| Date | 2026-07-15 |
| Status | Accepted for Phase 1 only |
| Context | The complete public UI had to be implemented before OpenAPI v1 exists. |
| Decision | Route every UI fixture through one typed `PublicClient` mock adapter; perform no `/v1` request and label booking/payment/content authority as simulated. |
| Reason | Completes visual/state work without inventing a live contract or moving authority into the browser. |
| Consequences | Handwritten types are temporary and Phase 3 must replace them with a pinned generated contract representation. |
| Alternatives | Direct ad hoc fixture imports or invented live fetch calls — rejected. |
| Affected documents | API, Architecture, Structure, Testing, Memory |
| Supersedes | None |

## CL-006 — Temporary Phase 1 media localization

| Field | Record |
| --- | --- |
| Date | 2026-07-15 |
| Status | Accepted temporarily |
| Context | Browser screenshots and route previews required reliable legal demo imagery before venue photography exists. |
| Decision | Store four attributed free Unsplash demo copies under `public/images/demo`, record source/alt/replacement details in `DESIGN.md`, and replace them before production. |
| Reason | Deterministic QA without hotlink instability, club branding, or untracked provenance. |
| Consequences | Files are temporary, globally unoptimized for Phase 1, and cannot be treated as final brand/venue assets. |
| Alternatives | Hotlinked remote images, invented venue imagery, or unlicensed club assets — rejected. |
| Affected documents | Design, Structure, Testing, Memory, Changelog |
| Supersedes | None |

## CL-007 — Pinned generated v1 consumer contract

| Field | Record |
| --- | --- |
| Date | 2026-07-16 |
| Status | Accepted |
| Context | Phase 1 fixture models required an approved contract before live API integration. |
| Decision | Consume a static checksum-pinned v1 artifact copied from the admin-owned OpenAPI generator; never import admin source or share a package. |
| Reason | Detects contract drift while preserving independent repositories and deployments. |
| Consequences | UI fixtures continue until a future typed HTTP adapter is enabled; every contract change requires both repository checks/docs. |
| Alternatives | Handwritten duplicated types or cross-repository source imports — rejected. |
| Affected documents | API, Architecture, Structure, Testing, Deployment, Memory |
| Supersedes | CL-003 |

## CL-008 - Live v1 adapter and backend payment authority

| Field | Record |
| --- | --- |
| Date | 2026-07-16 |
| Status | Accepted |
| Context | Phase 4 requires real booking and content without moving authority or secrets into the public repository. |
| Decision | Bind production pages to one typed v1 HTTP adapter; keep the mock only for isolated tests; treat provider redirect as navigation and poll backend state with the opaque access token. |
| Reason | Preserves independent deployability and makes inventory/payment truth server-controlled. |
| Consequences | A compatible API origin and exact server CORS origin are deployment requirements; failed/expired/conflict states remain explicit customer states. |
| Alternatives | Browser confirmation, provider SDK secrets, direct database access, or cross-repository imports - rejected. |
| Affected documents | API, Architecture, Structure, Testing, Deployment, Memory |
| Supersedes | CL-005 runtime binding portion |
