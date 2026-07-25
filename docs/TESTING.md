# Client Testing

## v1.12 consumer verification - 2026-07-25

The client holds a byte-identical copy of the admin-owned v1.12.0 contract at `cf7e1aa1d733a66d5556879b3fffaa3e3a25a2d1ebbe253144d85750b6e18f9b`. Contract check, security scan, lint, TypeScript, all 17 unit/component tests, and the production Next.js build pass. With Next.js 16.2.11 and patched Sharp 0.35.3, the production-dependency audit reports zero vulnerabilities.

No public UI, customer authentication, Google route, database connection, provider secret, or POS authority was added. Admin security/export/email/update shapes remain server-owned contract information only.

Current external gates remain the deployed API/domain, final venue/contact/legal content, production images, HitPay sandbox callback, and browser checks against a deployed environment. Deployment was not authorized or performed.

Run from `axs_client`:

```powershell
npm run check
```
