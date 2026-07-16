# Client Current State

## Phase 4 - verified 2026-07-16

Public pages use `createHttpPublicClient`, a typed v1 HTTP adapter configured only by `NEXT_PUBLIC_API_ORIGIN`. Fields, availability, holds, booking creation, Billplz attempt redirect, authoritative status polling, reference-plus-phone lookup, pages, articles, and FAQs are live contract consumers. Booking dates are generated from Malaysia-local current time instead of a phase fixture date.

The booking flow stores only the opaque status access token in session storage for the result transition. Redirect parameters never confirm payment; the result page polls backend booking/payment state. Marketing presentation remains client-owned while inventory identity, availability, price, hold expiry, booking reference, and payment truth remain server-owned.

`src/lib/api/mock-client.ts` is retained only for isolated unit/component fixtures. Production pages do not import it. The client has no PostgreSQL driver, admin code, provider secret, callback, or payment authority.

## Verification

- 13 unit/component tests pass, including the HTTP adapter.
- Lint, strict TypeScript, contract pin, security boundary, and production build pass.
- Browser verification loaded live booking data through exact-origin CORS with no application CORS error.
- Contract checksum: `b19c254c40a4624ace71cfd07de3cad5a96b0291e4e3713799ce03e2bc061a7c`.

## External gates

Set the approved API origin in the Vercel environment, complete a live Billplz merchant sandbox flow, approve final venue/legal/policy/media content, configure production headers/domain/monitoring, and deploy. Never place server or provider secrets in this repository.
