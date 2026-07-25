# Start Here: ArmourXSports Client

`axs_client` owns only the Vercel public site and API consumption. Current `v5` consumes the pinned v1.12.0 contract (`cf7e1aa1d733a66d5556879b3fffaa3e3a25a2d1ebbe253144d85750b6e18f9b`). Public data and CMS are read from the API; the booking wizard creates grouped holds/orders only when server config enables online payment. It has no database, provider secret, callback, admin-auth, customer-auth implementation, or POS authority. The v1.12 update changes only its generated contract pin.

Read `AGENTS.md`, this file, `MEMORY.md` and `API.md` first. For booking/status work also read `BUSINESS-RULES.md` and `TESTING.md`; for contract work read the admin `API.md` and regenerate/publish from admin before editing the client.

With server `onlinePayment.enabled=false`, the client may show fields, schedule, prices and booking steps but must stop before any mutation and show the API public message. The API independently enforces that boundary.

Robots, sitemap and static WebSite JSON-LD are implemented with the owner-placeholder origin only. The `/account` route is deliberately non-indexed and inactive: guest booking remains available, Google makes no request, and account history cannot be retroactively attached.
