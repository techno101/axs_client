# Client API Contract View

The admin repository owns OpenAPI v1. This repository consumes the copied artifact at `src/lib/api/contract/v1.ts`, version `1.0.0`, checksum `b19c254c40a4624ace71cfd07de3cad5a96b0291e4e3713799ce03e2bc061a7c`. `npm run contract:check` validates the local pin and the admin command `contract:check-client` compares the exact copy.

`src/lib/api/http-client.ts` calls the configured `NEXT_PUBLIC_API_ORIGIN` and uses the `{ data, meta, error }` envelope. Dynamic inventory/status calls use no-store. Hold, booking, and payment-attempt mutations generate/reuse an idempotency key only for the same request.

| Client action | v1 endpoint |
| --- | --- |
| Public settings/fields | `GET /v1/public/config`, `/fields`, `/fields/{slug}` |
| Live slots | `GET /v1/public/availability?date=` |
| Acquire/read hold | `POST /v1/public/holds`, `GET /holds/{token}` |
| Create booking | `POST /v1/public/bookings` |
| Begin provider payment | `POST /v1/public/bookings/{reference}/payment-attempts` |
| Poll authoritative result | `GET /v1/public/bookings/{reference}/status?accessToken=` |
| Privacy-limited recovery | `POST /v1/public/bookings/find` |
| Published content | `GET /v1/public/pages/{slug}`, `/articles`, `/articles/{slug}`, `/faqs` |

Availability, price, hold expiry, and payment confirmation are never browser authority. The Billplz redirect is navigation only; only verified backend state can produce a paid/confirmed result. The client sends no cookies cross-origin and requires the server's exact-origin CORS response.
