# Client API Contract View

`axs_admin` owns v1.10.0 OpenAPI. The copied static contract artifact is `src/lib/api/contract/v1.ts`, currently checksum `a4d207f885b4b6250d8a8c2b83ff2badc2a50baf91d4cf2618022fe5f7f3a6ff`. `npm run contract:check` verifies the local representation; admin `contract:drift` verifies this exact pin alongside POS. The client never imports admin source.

| Client flow | API boundary |
| --- | --- |
| Browse | config, fields, availability and published CMS data |
| Aggregate checkout | `hold-groups` → `orders` → one order payment attempt |
| Authoritative result | order status with the dedicated access-token header |
| Legacy compatibility | single booking endpoints remain but new public flow uses orders |

`onlinePayment.enabled` is server-authoritative. If false, the client stops before mutations; any attempted public mutation is still rejected by the API before a write. Hosted checkout redirects are navigation only. Browser analytics/session state must never contain customer data, payment IDs, access tokens in analytics payloads, or free text.

The client has no POS authority: its v1.10 static artifact may contain POS types but it does not call or expose those routes. Customer accounts and Google OAuth are disabled UI boundaries until the admin-owned account/email/OAuth implementation is approved; guest history is never backfilled.
