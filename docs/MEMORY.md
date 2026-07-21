# Client Memory

Against the guarded local API, native-Chrome route and axe smoke checks passed for the core public routes, desktop/mobile reflow, zoom, keyboard/mobile navigation and disabled-payment pre-mutation boundary. This is local-only evidence; provider callbacks, email/OAuth and deployment remain external gates.

`axs_client` is an independent Vercel public consumer of the admin-generated pinned v1.10.0 contract (`a4d207f885b4b6250d8a8c2b83ff2badc2a50baf91d4cf2618022fe5f7f3a6ff`). It owns no server authority, database connection, payment secret, webhook, admin UI or POS behavior.

The current booking wizard reads real config/field/availability data, supports a local basket of up to 20 dated slots and uses the v1.5 grouped hold → order → one hosted-payment-attempt flow when payment is enabled. It persists only the order access token under its short-lived session key for result polling. With payment disabled, it makes no hold/order/payment request.

HitPay checkout redirect is not confirmation. The result page reads authoritative order status. Sandbox setup and production payment enablement remain admin/owner gates. Owner-pending contacts/legal/policies/media remain visibly pending rather than invented.

SEO has static metadata, robots, sitemap and WebSite JSON-LD against the placeholder origin. Analytics excludes customer/result paths. `/account` is a non-indexed inactive boundary: email/password accounts need admin-owned account/session/email work; Google OAuth and Resend remain disabled without owner configuration, and guest history is never backfilled.
