# Client API Contract View

## Checkpoint 3 booking ownership and private documents

The Client sends no account ID. Its booking/order BFF rules forward only the opaque Customer cookie, letting Admin derive ownership. Public finder accepts a legacy or new AXS reference only; its masked response and short-lived grant stay at the same origin. Guest PDF requests send that grant only to the allowlisted public download route. `/api/customer/bookings`, `/[reference]`, and `/download` are owner-only BFF rules and forward the Customer cookie server-side; the browser never receives an Admin origin, database path, session token, or provider secret.

The Client pins Admin v1.14 contract checksum `7c65bf9c056968b9d9bc343469ea80e5bc761e14a4a133752651a9a086489ae5` for the additive lookup/history/download shapes.

## Customer identity boundary

Customer browser calls use only `/api/customer/*`. That BFF has an exact route/method map to Admin `/v1/customer/*`, validates the canonical Client Origin/Referer for mutations, forwards the trusted proxy context and keeps the opaque Customer session in a Client-origin `Secure`, `HttpOnly`, `SameSite=Lax` cookie. It also owns the temporary Google PKCE/state/nonce and one-time handoff cookies. Raw session, CSRF, verification/reset and handoff material is removed from JSON before it reaches browser code. Customer pages are excluded from analytics; email/phone/age/provider IDs/free text never become analytics properties.

`axs_admin` owns v1.14.0 OpenAPI. The copied static contract artifact is `src/lib/api/contract/v1.ts`, checksum `e3ad527748a79698d205cc7b6e88173304f364d87e7a24786c510cc680cc20ab`. `npm run contract:check` verifies the local representation; the client never imports admin source. Customer identity types grant no browser authority beyond the Client BFF.

All browser API calls use same-origin `/api/axs/v1/public/...`. The BFF permits only the exact public routes/methods used by this repository, bounds bodies/request IDs/timeouts, forwards only required content, idempotency and booking-access headers, validates the canonical Client Origin/Referer for state changes, and authenticates private/mutating Admin hops. It rejects Admin, POS, worker, webhook, arbitrary-host, traversal and unsupported-method requests. `AXS_ADMIN_API_ORIGIN`, `AXS_CLIENT_PROXY_SECRET`, and `PUBLIC_APP_ORIGIN` are server-only.

The browser may report bounded safe client failures to same-origin `/api/operational-events`; the client server alone rate-limits/redacts then authenticates to the admin incident endpoint. This does not expose an admin token, create a browser webhook, or confer booking/payment authority.

| Client flow | API boundary |
| --- | --- |
| Browse | config, fields, availability and published CMS data |
| Aggregate checkout | `hold-groups` → `orders` → one order payment attempt |
| Authoritative result | order status with the dedicated access-token header |
| Legacy compatibility | single booking endpoints remain but new public flow uses orders |

`onlinePayment.enabled` is server-authoritative. If false, the client stops before mutations; any attempted public mutation is still rejected by the API before a write. Hosted checkout redirects are navigation only. Browser analytics/session state must never contain customer data, payment IDs, access tokens in analytics payloads, or free text.

The client has no POS authority: its static artifact may contain POS types but it does not call or expose those routes. Customer account UI is implemented; Google/email remain safe unavailable states until the separate Admin-owned provider configuration is installed. Guest history is never backfilled.
