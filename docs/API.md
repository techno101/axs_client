# Client API Contract View

`axs_admin` owns v1.5.0 OpenAPI. The copied static contract artifact is `src/lib/api/contract/v1.ts`, currently checksum `cc3a935491c2480844fba4815d4f13835c95c95d005f3e078266ff97332bda97`. `npm run contract:check` verifies the local representation; the client never imports admin source.

| Client flow | API boundary |
| --- | --- |
| Browse | config, fields, availability and published CMS data |
| Aggregate checkout | `hold-groups` → `orders` → one order payment attempt |
| Authoritative result | order status with the dedicated access-token header |
| Legacy compatibility | single booking endpoints remain but new public flow uses orders |

`onlinePayment.enabled` is server-authoritative. If false, the client stops before mutations; any attempted public mutation is still rejected by the API before a write. Hosted checkout redirects are navigation only. Browser analytics/session state must never contain customer data, payment IDs, access tokens in analytics payloads, or free text.
