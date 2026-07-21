# Client API Contract View

`axs_admin` owns v1.10.0 OpenAPI. The copied static contract artifact is `src/lib/api/contract/v1.ts`, currently checksum `bc84b03bb50f1c83048c955794539e26167943dc9045ddb815d4c4425411f667`. `npm run contract:check` verifies the local representation; admin `contract:drift` verifies this exact pin alongside POS. The client never imports admin source.

The browser may report bounded safe client failures to same-origin `/api/operational-events`; the client server alone rate-limits/redacts then authenticates to the admin incident endpoint. This does not expose an admin token, create a browser webhook, or confer booking/payment authority.

| Client flow | API boundary |
| --- | --- |
| Browse | config, fields, availability and published CMS data |
| Aggregate checkout | `hold-groups` → `orders` → one order payment attempt |
| Authoritative result | order status with the dedicated access-token header |
| Legacy compatibility | single booking endpoints remain but new public flow uses orders |

`onlinePayment.enabled` is server-authoritative. If false, the client stops before mutations; any attempted public mutation is still rejected by the API before a write. Hosted checkout redirects are navigation only. Browser analytics/session state must never contain customer data, payment IDs, access tokens in analytics payloads, or free text.

The client has no POS authority: its v1.10 static artifact may contain POS types but it does not call or expose those routes. Customer accounts and Google OAuth are disabled UI boundaries until the admin-owned account/email/OAuth implementation is approved; guest history is never backfilled.
