# Client Memory

`axs_client` is an independent Vercel public consumer of the admin-generated pinned v1.5.0 contract. It owns no server authority, database connection, payment secret, webhook, admin UI or POS behavior.

The current booking wizard reads real config/field/availability data, supports a local basket of up to 20 dated slots and uses the v1.5 grouped hold → order → one hosted-payment-attempt flow when payment is enabled. It persists only the order access token under its short-lived session key for result polling. With payment disabled, it makes no hold/order/payment request.

HitPay checkout redirect is not confirmation. The result page reads authoritative order status. Sandbox setup and production payment enablement remain admin/owner gates. Owner-pending contacts/legal/policies/media remain visibly pending rather than invented.
