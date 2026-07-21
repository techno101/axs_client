# Client Changelog

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
