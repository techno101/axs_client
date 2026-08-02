# Client Changelog

## v12 bilingual brand foundation release candidate - 2026-08-02

- Rebuilt the homepage and shared shell around “The field is yours” and “Dusk to floodlights,” using approved venue photography, twin-field geometry and one continuous pitch-line signature.
- Added typed English/Bahasa Melayu homepage and shell dictionaries, explicit `/bm`, locale switching, SSR document language, canonical/hreflang metadata and localized sitemap coverage without browser-language redirects.
- Added GSAP, `@gsap/react` and Lenis for desktop marketing routes only, with cleanup, reduced-motion and touch fallbacks, and native scrolling for booking/account/authentication.
- Added optimized WebP venue/logo derivatives, same-origin media validation, deterministic standalone Client fixtures, motion/performance checks and broader route/metadata/responsive validation.
- Removed customer-facing internal terminology and the booking state gallery; corrected error-document nesting, lint/test warnings, contact-form false success, and disabled-payment copy.
- Local verification passes. Production promotion remains blocked because public checkout is disabled and no controlled sandbox callback/payment confirmation has been evidenced; no `main` push or Vercel deployment is claimed.

## Checkpoint 3 booking ownership, history, lookup and download - 2026-07-30

- Added account-safe contact prefill, optional guest email, reference-only finder, masked grant download and owner-only booking-history/download UI.
- Added result-page references with Copy/Download actions and an explicit no-email save/download warning, including narrow-screen layout support.
- Repinned the additive v1.14 Admin contract to `7c65bf9c056968b9d9bc343469ea80e5bc761e14a4a133752651a9a086489ae5`; no deployment, provider, Admin authority or POS behavior changed.

## Checkpoint 2 customer identity and verification - 2026-07-30

- Added same-origin Customer BFF handlers, Client-origin secure cookie management, Google callback/handoff boundary and strict customer-route allowlist.
- Added responsive sign-up/sign-in/verify/recovery/reset/Google-return/account/profile/security routes with guest navigation retained.
- Repinned the static Admin OpenAPI consumer artifact to v1.14.0. No deployment, live OAuth, Resend delivery, payment or POS work was performed.

## Checkpoint 1 same-origin integration - 2026-07-30

- Replaced browser Operations-origin calls and rendered origin props with the allowlisted same-origin `/api/axs` BFF.
- Added server-only Admin origin, Client origin and proxy-secret validation; bounded bodies, timeouts, request IDs, stable errors, exact state-change origin checks, narrow header forwarding and Admin-media URL rewriting.
- Added proxy/security tests and a post-build browser-bundle scan. No deployment, customer authentication, payment enablement or provider change occurred.

## Official branding - 2026-07-28

- Replaced the recreated shield/type treatment with the exact supplied transparent ArmourXSports wordmark in the responsive header, footer and metadata.
- Kept the existing public booking contract and business behavior unchanged.

## v1.12 contract pin - 2026-07-25

- Repinned the admin-generated v1.12.0 contract at `cf7e1aa1d733a66d5556879b3fffaa3e3a25a2d1ebbe253144d85750b6e18f9b`.
- No public UI, customer authentication, booking logic, database, provider, or POS authority changed.
- Updated Next.js to 16.2.11, pinned patched Sharp 0.35.3, and retained deterministic npm peer resolution; the production-dependency audit reports zero vulnerabilities.

## v1.11 contract pin - 2026-07-24

- Repinned the admin-generated v1.11.0 contract at `181432b9a86d4fe2ba5d55f75c3779737f93b84726b4de9007f250a367b55a43`.
- Public client behavior and authority are unchanged; POS enrollment, staff Google access, sale email requests, and media administration remain admin/POS concerns.

## v1.10 safe operational report proxy - 2026-07-21

- Repinned the admin contract at `bc84b03bb50f1c83048c955794539e26167943dc9045ddb815d4c4425411f667`.
- Added a bounded same-origin server route for safe client error/payment-state reports. It rate-limits, allowlists/redacts details and uses a server-only source token to call admin; the public browser never receives that token.

## v1.10 lifecycle contract pin - 2026-07-21

- Repinned the unchanged-version admin contract at checksum `a4d207f885b4b6250d8a8c2b83ff2badc2a50baf91d4cf2618022fe5f7f3a6ff`, including POS lifecycle/admin device-management types. Public client behavior did not change and it still has no POS authority.

## v1.10 pin and local API smoke - 2026-07-20

- Pinned the v1.10.0 admin-generated artifact (`2e87ee580902c0253b79b3901e8c60a2b9bb312672ad4bab7c2f7a8035b569cd`) without importing admin source.
- Confirmed public guest booking still requires email while public customer accounts, Google and email delivery remain inactive boundaries.
- With the local API origin configured only in ignored `.env.local`, route/reflow/keyboard/mobile smoke and axe checks passed; lint, typecheck, security scan, 17 tests and production build passed. No deployment or payment enablement occurred.

## Local browser verification - 2026-07-19

- Passed local API-backed native-Chrome route, responsive, keyboard/mobile, disabled-payment and axe smoke checks without enabling online payment.

## v1.9 contract and public-readiness boundary - 2026-07-19

- Pinned the v1.9.0 admin-generated artifact (`ebb59cb379d90e637dc0e95eb821838792a9ddf4eb60a252e97d6bfeb7b228ed`) without importing admin source.
- Added static `robots.txt`, sitemap and safe static WebSite structured data; protected lookup/result/account/maintenance/legal routes stay non-indexed.
- Added an inactive optional-account boundary that keeps guest booking default, prevents guest-history backfill and makes no Google OAuth request until owner-approved admin implementation exists.

No Vercel deployment, production payment enablement, account activation, Resend delivery, Google OAuth setup or real environment read occurred.

## Contract pin refresh - 2026-07-19

- Pinned the then-current admin-owned v1.8.0 artifact. Public client behavior was unchanged; POS-only availability and correction additions remained outside this repository.

## v1.5 order consumer â€” 2026-07-19

- Pinned the admin-owned v1.5.0 contract.
- Moved the public booking wizard to grouped hold/order/payment-attempt flow with a maximum 20-slot basket.
- Updated result polling to authoritative order status and retained disabled-payment pre-mutation behavior.

No Vercel deployment, production payment enablement or real environment read occurred.
