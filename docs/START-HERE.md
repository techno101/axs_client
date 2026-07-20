# Start Here: ArmourXSports Client

`axs_client` owns only the Vercel public site and API consumption. Current `v2` consumes the pinned v1.10.0 contract: public data and CMS are read from the API; the booking wizard accumulates a 1-20 occurrence basket, then creates one grouped hold/order/payment attempt only when server config enables online payment. It has no database, provider secret, callback or booking authority.

Read `AGENTS.md`, this file, `MEMORY.md` and `API.md` first. For booking/status work also read `BUSINESS-RULES.md` and `TESTING.md`; for contract work read the admin `API.md` and regenerate/publish from admin before editing the client.

With server `onlinePayment.enabled=false`, the client may show fields, schedule, prices and booking steps but must stop before any mutation and show the API public message. The API independently enforces that boundary.

Robots, sitemap and static WebSite JSON-LD are implemented with the owner-placeholder origin only. The `/account` route is deliberately non-indexed and inactive: guest booking remains available, Google makes no request, and account history cannot be retroactively attached.
