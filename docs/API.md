# Client API Contract View

`axs_admin` owns v1.12.0 OpenAPI. The copied static contract artifact is `src/lib/api/contract/v1.ts`, checksum `cf7e1aa1d733a66d5556879b3fffaa3e3a25a2d1ebbe253144d85750b6e18f9b`. `npm run contract:check` verifies the local representation; admin `contract:drift` verifies this exact pin alongside POS. The client never imports admin source. Security, exports, protected purge, notification delivery, POS hardware/version, and update-policy surfaces grant the public client no new authority.

All browser API calls use same-origin `/api/axs/v1/public/...`. The BFF permits only the exact public routes/methods used by this repository, bounds bodies/request IDs/timeouts, forwards only required content, idempotency and booking-access headers, validates the canonical Client Origin/Referer for state changes, and authenticates private/mutating Admin hops. It rejects Admin, POS, worker, webhook, arbitrary-host, traversal and unsupported-method requests. `AXS_ADMIN_API_ORIGIN`, `AXS_CLIENT_PROXY_SECRET`, and `PUBLIC_APP_ORIGIN` are server-only.

The browser may report bounded safe client failures to same-origin `/api/operational-events`; the client server alone rate-limits/redacts then authenticates to the admin incident endpoint. This does not expose an admin token, create a browser webhook, or confer booking/payment authority.

| Client flow | API boundary |
| --- | --- |
| Browse | config, fields, availability and published CMS data |
| Aggregate checkout | `hold-groups` → `orders` → one order payment attempt |
| Authoritative result | order status with the dedicated access-token header |
| Legacy compatibility | single booking endpoints remain but new public flow uses orders |

`onlinePayment.enabled` is server-authoritative. If false, the client stops before mutations; any attempted public mutation is still rejected by the API before a write. Hosted checkout redirects are navigation only. Browser analytics/session state must never contain customer data, payment IDs, access tokens in analytics payloads, or free text.

The client has no POS authority: its v1.10 static artifact may contain POS types but it does not call or expose those routes. Customer accounts and Google OAuth are disabled UI boundaries until the admin-owned account/email/OAuth implementation is approved; guest history is never backfilled.
