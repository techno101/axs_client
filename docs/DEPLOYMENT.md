# Client Deployment

The only runtime value is the public HTTPS API origin:

```text
NEXT_PUBLIC_API_ORIGIN=https://api.example.invalid
```

Developer public values belong in ignored `.env.local`; hosted values belong in the Vercel environment dashboard. Database, Billplz, session, callback, worker, and admin secrets never belong here.

Before release: verify the pinned contract, build, configure the exact matching admin CORS origin, apply nonce CSP/security headers at the hosting edge, validate no-store behavior for availability/status, run booking-to-confirmation against the live merchant sandbox, test domain/TLS/monitoring/rollback, and approve final content/assets. No deployment occurred in Phase 4.
