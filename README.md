# ArmourXSports Client

The independent public website and customer booking interface. Production pages consume the admin-owned v1 API through a typed HTTP adapter; this repository has no database, provider secrets, callback, or admin authority.

Read [AGENTS.md](AGENTS.md), [docs/START-HERE.md](docs/START-HERE.md), and [docs/MEMORY.md](docs/MEMORY.md) before changing it.

## Local development

Requirements: Node.js 20.9+ and npm. Set the public API origin using the tracked [.env.example](.env.example) shape, with actual values only in ignored `.env.local` or the hosting environment.

```bash
npm install
npm run dev
```

## Verification

```bash
npm run lint
npm run typecheck
npm run contract:check
npm run test:security
npm test
npm run build
```

The provider redirect never confirms payment; the result page displays only authoritative status returned by the backend. Live merchant sandbox verification and deployment remain external release gates.
