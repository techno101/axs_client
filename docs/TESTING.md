# Client Testing

## v14 Checkpoint 2 candidate - 2026-08-03

Run from `axs_client`:

```powershell
npm run contract:check
npm test
npm run lint
npm run typecheck
npm run build
```

Focused BFF coverage proves that a reschedule request uses only the exact allowlisted Admin route, opaque customer session and Client CSRF proof. Contract coverage pins the additive customer reschedule/payment-reference shapes. On 2026-08-03, `npm run check` passed lint, typecheck, contract validation, the 76-file Client boundary scan, 34 tests and the production build/bundle scan; `npm audit --omit=dev --json` reported zero production vulnerabilities. Live customer fixtures, database-backed schedule mutation, provider checkout/callback, Vercel deployment and production payment acceptance are separate gates and are not implied by these checks.

## v13 Checkpoint 1 Match Cut candidate - 2026-08-02

Run from `axs_client`:

```powershell
npm run check
node scripts/accessibility-smoke.mjs
node scripts/motion-performance-smoke.mjs
npm audit --omit=dev
```

`npm run check` passed lint, typecheck, pinned-contract validation, the 76-source-file Client security scan, 33 Vitest tests, production build and browser-bundle scan. Axe passed `/`, `/bm`, booking, finder, contact, customer auth/recovery and 404 routes. Normal motion passed with LCP `1288.0ms`, CLS `0.000` and three long tasks; reduced motion uses native scrolling with visible content. Direct Chrome checks prove keyboard settling preserves the immediate booking link and a deliberately failed title artwork shows the semantic Exo heading. Touch and reduced modes both compute `.match-cut-opening` opacity as `0`.

`visual:capture` captures all home viewports against the current owner dev server but cannot complete `/book` there because the matching isolated Admin fixture cannot start while the shared Next development lock is held. A separate production-fixture attempt is correctly rejected by the Client's production loopback safety boundary. This is `BLOCKED` environmental visual-fixture evidence, not a booking or security regression. No provider clip, Vercel deployment, controlled HitPay callback or live acceptance is claimed.

## v12 release-candidate evidence - 2026-08-02

Run from `axs_client`:

```powershell
npm run check
npm run test:routes
npm run test:a11y
npm run test:motion
npm run visual:capture
npm audit --omit=dev
```

`npm run check` passes lint, typecheck, pinned-contract validation, the 75-file Client security-boundary scan, 33 Vitest tests and the Next.js production build/browser-bundle scan. The route suite passes English/BM document language, canonical/hreflang and sitemap assertions; all listed routes; 360/390/720/768/1024/1440 responsive overflow; mobile navigation; keyboard booking; 200% reflow; and the disabled-payment pre-mutation boundary. Axe passes `/`, `/bm`, booking, finder, contact, authentication/recovery and 404 routes. Motion checks pass desktop smooth scroll at LCP 1280 ms/CLS 0.000 and reduced-motion native scroll. Visual capture covers English/BM desktop/mobile, tablet/laptop, fields and booking. Production dependency audit reports zero vulnerabilities.

These results use the standalone contract-shaped fixture and prove local Client behavior only. Provider checkout, callback confirmation, Vercel deployment and live post-deploy capture are `BLOCKED`/not performed, not passed.

## Checkpoint 3 booking ownership, lookup and download - 2026-07-30

- Focused wizard, BFF and proxy tests passed; full suite passed 32 tests. Lint passed with one pre-existing `brand-mark.tsx` image warning; TypeScript, contract, security and production build passed.
- Route, axe and visual capture passed through a temporary matching local Admin/Client BFF configuration only. No ignored environment file, Vercel setting, provider credential or deployment was changed.
- Visual capture stubs reserved fixture media hosts rather than requesting them, and covers desktop/mobile booking layouts. Live Customer login, email delivery, provider payment and deployed HTTPS acceptance remain unperformed.

Checkpoint 2 adds focused tests for cross-site Customer-BFF rejection, opaque Client-cookie handling with raw token stripping, labelled keyboard-accessible account forms and full account-route analytics exclusion. The required route/a11y/visual/full-check commands remain the evidence source; no live Google or Resend provider request is part of this checkpoint.

## Checkpoint 1 same-origin integration - 2026-07-30

Focused proxy/adapter/component tests passed, including Customer-BFF cookie/token stripping, origin rejection and keyboard-labelled account forms, followed by contract check, security scan, 32 unit/component tests, lint (one pre-existing branding `<img>` warning), TypeScript and production build. Route/reflow/keyboard/mobile checks, accessibility and visual captures passed against a controlled disposable Admin fixture; the capture harness substitutes the reserved fixture CDN image rather than making an external request. No Vercel deployment, live Google/Resend provider, or real payment mutation was performed.

## v1.12 consumer verification - 2026-07-25

The client holds a byte-identical copy of the admin-owned v1.12.0 contract at `cf7e1aa1d733a66d5556879b3fffaa3e3a25a2d1ebbe253144d85750b6e18f9b`. Contract check, security scan, lint, TypeScript, all 17 unit/component tests, and the production Next.js build pass. With Next.js 16.2.11 and patched Sharp 0.35.3, the production-dependency audit reports zero vulnerabilities.

No public UI, customer authentication, Google route, database connection, provider secret, or POS authority was added. Admin security/export/email/update shapes remain server-owned contract information only.

Current external gates remain the deployed API/domain, final venue/contact/legal content, production images, HitPay sandbox callback, and browser checks against a deployed environment. Deployment was not authorized or performed.

Run from `axs_client`:

```powershell
npm run check
```
