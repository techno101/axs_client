# Client Structure and File Catalogue

| Path | Purpose |
| --- | --- |
| `src/app` | Public routes for fields, booking/result/lookup, content, policies, and system states |
| `src/components/booking` | Live availability, hold, customer, booking, and payment interaction |
| `src/lib/api/http-client.ts` | Production typed v1 HTTP adapter |
| `src/lib/api/contract/v1.ts` | Static checksum-pinned contract copied from the admin generator |
| `src/lib/api/types.ts` | Client display model and adapter interface |
| `src/lib/api/mock-client.ts` | Isolated test fixture only; not imported by production pages |
| `tests/unit/http-client.test.ts` | Request, mapping, envelope-error, and authority-boundary checks |
| `scripts/check-contract.mjs` | Contract metadata and repository-independence verification |
| `scripts/security-boundary.mjs` | Secret/database/webhook/executable-content boundary scan |

The repository contains no admin source, shared package, database driver, callback handler, provider secret, or payment-confirmation implementation. Generated build/browser output and real environment files remain ignored.
