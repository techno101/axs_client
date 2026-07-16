# Client Testing

| Command | Coverage |
| --- | --- |
| `npm run lint`, `npm run typecheck`, `npm run build` | Static and production-build checks |
| `npm run contract:check` | Generated v1 version/checksum and no source sharing |
| `npm run test:security` | No secrets, database/callback authority, or executable CMS sink |
| `npm test` | Unit/component tests including real HTTP adapter mapping/errors |
| `npm run test:routes`, `test:a11y`, `visual:capture` | Browser checks when a live compatible API origin is available |

Phase 4 verification on 2026-07-16: 13 unit/component tests, lint, strict typecheck, contract/security checks, and production build pass. Browser verification loaded `/book` against the disposable live admin API through exact-origin CORS. Payment callback, replay, amount, and database assertions remain admin integration-test responsibilities.

Release QA must rerun the complete client flow against the approved live Billplz sandbox merchant and deployed API, then cover offline/network retry, expiry/conflict, privacy lookup, mobile browsers, screen reader, and true 200% zoom.
