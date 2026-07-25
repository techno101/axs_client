# Client Memory

On 2026-07-25, the client copied the admin-owned API v1.12.0 pin (`cf7e1aa1d733a66d5556879b3fffaa3e3a25a2d1ebbe253144d85750b6e18f9b`). No public UI or customer authentication was added; admin security, exports/purge, delivery, and POS updater/hardware types do not grant client authority.

On 2026-07-24, the client copied the admin-owned API v1.11.0 pin (`181432b9a86d4fe2ba5d55f75c3779737f93b84726b4de9007f250a367b55a43`). No public UI or business behavior changed, and the client still has no database, provider, Google employee-access, or POS authority.

Against the guarded local API, native-Chrome route and axe smoke checks passed for the core public routes, desktop/mobile reflow, zoom, keyboard/mobile navigation and disabled-payment pre-mutation boundary. This is local-only evidence; provider callbacks, email/OAuth and deployment remain external gates.

`axs_client` is an independent Vercel public consumer of the admin-generated pinned v1.12.0 contract (`cf7e1aa1d733a66d5556879b3fffaa3e3a25a2d1ebbe253144d85750b6e18f9b`). It owns no server authority, database connection, payment secret, webhook, admin UI or POS behavior. Its same-origin operational-report server route holds a server-only source token, rate-limits and recursively redacts bounded safe browser failure reports before forwarding them to admin; no browser bundle receives the token.

The current booking wizard reads real config/field/availability data, supports a local basket of up to 20 dated slots and uses the v1.5 grouped hold → order → one hosted-payment-attempt flow when payment is enabled. It persists only the order access token under its short-lived session key for result polling. With payment disabled, it makes no hold/order/payment request.

HitPay checkout redirect is not confirmation. The result page reads authoritative order status. Sandbox setup and production payment enablement remain admin/owner gates. Owner-pending contacts/legal/policies/media remain visibly pending rather than invented.

SEO has static metadata, robots, sitemap and WebSite JSON-LD against the placeholder origin. Analytics excludes customer/result paths. `/account` is a non-indexed inactive boundary: email/password accounts need admin-owned account/session/email work; Google OAuth and Resend remain disabled without owner configuration, and guest history is never backfilled.
