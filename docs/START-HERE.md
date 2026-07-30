# Start Here: ArmourXSports Client

Checkpoint 2 on `v7` adds same-origin customer-account routes and responsive account pages. The Client remains a public/BFF consumer: it has no database, provider secret or authoritative customer session store. Guest booking remains available and existing guest bookings are not linked.

`axs_client` owns only the Vercel public site, same-origin `/api/axs` boundary, and API consumption. Current `v6` consumes the pinned v1.12.0 contract (`cf7e1aa1d733a66d5556879b3fffaa3e3a25a2d1ebbe253144d85750b6e18f9b`). Browser code never receives or calls the Operations origin: public reads, booking mutations, status and CMS requests use the allowlisted BFF, which authenticates sensitive hops with a server-only credential. It has no database, provider secret, callback, admin-auth, customer-auth implementation, or POS authority.

Read `AGENTS.md`, this file, `MEMORY.md` and `API.md` first. For booking/status work also read `BUSINESS-RULES.md` and `TESTING.md`; for contract work read the admin `API.md` and regenerate/publish from admin before editing the client.

With server `onlinePayment.enabled=false`, the client may show fields, schedule, prices and booking steps but must stop before any mutation and show the API public message. The API independently enforces that boundary.

Robots, sitemap and static WebSite JSON-LD are implemented with the owner-placeholder origin only. The `/account` route is deliberately non-indexed and inactive: guest booking remains available, Google makes no request, and account history cannot be retroactively attached.
