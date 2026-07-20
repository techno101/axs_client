# Client Testing

## Final local browser verification - 2026-07-20

With the guarded local admin API selected only through ignored local configuration, `npm run test:routes` passed all listed routes, custom 404, 360-1440px reflow, 200% zoom, mobile/keyboard interactions and the disabled-payment no-hold boundary. `npm run test:a11y` passed axe on the core public, booking, lookup, contact and 404 views. Lint, typecheck, security boundary scan, 17 unit/component tests and production build also passed on v1.10.

Classification: public browse/disabled-payment client **PASS**; optional email/password account activation, Resend, Google OAuth and HitPay sandbox flow **CONDITIONAL PASS** pending owner systems; production deployment **NOT APPLICABLE** (not authorized).

Run from `axs_client`:

```powershell
npm run check
```

This verifies lint, TypeScript, pinned contract structure, security boundary tests, unit/component tests and production build. Verified local evidence covers the v1.10 pin, disabled-payment stop-before-mutation behavior, aggregate order client calls/result polling, privacy-safe analytics, and the non-indexed account/robots/sitemap/static-structured-data build boundary.

Pending external evidence: a running disposable API/database environment, browser desktop/mobile screenshots against live API data, and a sandbox provider redirect/callback result. Do not start the client against a real environment file merely to obtain screenshots.
