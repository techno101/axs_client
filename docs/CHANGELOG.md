# Client Changelog

## 2026-07-16 - Phase 4 live contract consumer

- Replaced all production-page fixture bindings with the typed v1 HTTP adapter while retaining fixture data only for isolated tests.
- Connected fields, availability, holds, booking creation, payment-attempt navigation, authoritative result polling, privacy lookup, pages, articles, and FAQs.
- Removed browser payment authority: provider redirect values never confirm a booking, and the result page polls backend state using the opaque access token.
- Added dynamic Malaysia-local booking dates, safe structured-content mapping, HTTP adapter tests, updated generated contract pin, and live exact-origin CORS/browser verification.
- Lint, typecheck, 13 tests, contract/security checks, and production build pass. Production deployment and live merchant sandbox verification remain external gates.

## 2026-07-15 — Documentation initialization

- Populated the approved client documentation, repository instructions, and Copilot guidance.
- Recorded client-only boundaries, planned v1 consumer contract, booking rules, design/testing/deployment plans, and open decisions.
- No application code, dependencies, tests, deployment files, or API contract artifact were created.

Future meaningful completed changes append dated entries here. Current status belongs in [MEMORY.md](MEMORY.md).

## 2026-07-15 — Phase 1 public client UI

- Initialized the independent Next.js 16, React 19, TypeScript, Tailwind CSS 4 public client.
- Implemented the full public route set, bespoke night-field visual system, five-step booking shell, secure-lookup/result previews, content/policy/system states, and responsive navigation.
- Added one typed mock adapter with the approved two fields, morning/evening complete blocks, all public availability/payment states, and no live API/backend behavior.
- Localized and documented four temporary free Unsplash demo images for deterministic preview; final venue photography remains required.
- Added 9 unit/component tests, all-route/custom-404 smoke, 360/390/720/768/1024/1440 overflow checks, keyboard/mobile interaction smoke, six-route Axe coverage, and five inspected screenshots.
- Corrected mobile-menu hiding, 390px booking overflow, image-loading determinism, and small-text green contrast during browser QA.
- Production build passes with the official WASM/Webpack SWC fallback; native Windows SWC download remains a workstation tooling warning.

## 2026-07-16 — Phase 3 pinned API contract and environment gate

- Added the static v1 generated contract artifact, version/checksum metadata, consumer structural test and no-source-import verification.
- Kept all public UI data on the existing mock adapter; the client still has no database, payment secret, webhook, live request or browser authority.
- Added a public-only environment template, explicit Vercel/local storage guidance and baseline response-security headers.
- Added client boundary/security checks; lint, typecheck, contract check and 10 tests pass.
