# Client Testing

Run from `axs_client`:

```powershell
npm run check
```

This verifies lint, TypeScript, pinned contract structure, security boundary tests, unit/component tests and production build. Local evidence covers the v1.5 contract pin, disabled-payment stop-before-mutation behavior, aggregate order client calls and result status polling.

Pending external evidence: a running disposable API/database environment, browser desktop/mobile screenshots against live API data, and a sandbox provider redirect/callback result. Do not start the client against a real environment file merely to obtain screenshots.
