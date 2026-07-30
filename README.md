# ArmourXSports Client

The independent public website and customer booking interface. Production pages consume the admin-owned v1 API through a typed HTTP adapter; this repository has no database, provider secrets, callback, or admin authority.

Read [AGENTS.md](AGENTS.md), [docs/START-HERE.md](docs/START-HERE.md), and [docs/MEMORY.md](docs/MEMORY.md) before changing it.

## Local development

Requirements: Node.js 24 and npm. Set the public API origin using the tracked [.env.example](.env.example) shape, with actual values only in ignored `.env.local` or the hosting environment.

```bash
npm ci
npm run dev
```

The tracked `.npmrc` keeps npm's optional cross-framework peer resolution deterministic for `@vercel/analytics`; it does not add a Vue/Nuxt runtime to this Next.js application.

## Verification

```bash
npm run lint
npm run typecheck
npm run contract:check
npm run test:security
npm test
npm run build
```

The current copied contract is v1.12.0 (`cf7e1aa1d733a66d5556879b3fffaa3e3a25a2d1ebbe253144d85750b6e18f9b`). This update adds admin/POS control shapes only; it does not add customer authentication or client UI. Provider redirects never confirm payment; live merchant sandbox verification and deployment remain external release gates.
