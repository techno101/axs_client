# Start Here: ArmourXSports Client

## Git and branch rules (MANDATORY)

Branch names are always `v<number>` (e.g. `v15`); `main` is the trunk; no other branch names exist and any non-`v<N>` branch is deleted (local + remote) on sight. Every branch is created from the latest published `origin/main` and **published immediately** — local-only branches are forbidden. Work in one small fix = one commit (no push); when the task is complete push the branch, then fast-forward `origin/main` and push main. Env files: only `.env` (local) and `.env.production` (production); never create, commit, print, or push any env file.

Checkpoint 1 runs on `v13` from `origin/v12@35453aa`. The owner explicitly rejected the v12 visual direction; retain only its useful bilingual, BFF, test and scrolling foundations. **The Match Cut** candidate is implemented and independently approved with the exact key line **Book your spot**, four reviewed fictional campaign masters, self-hosted Exo 2 and licence-safe flattened Ethnocentric title art. The contact-sheet opening is interruptible and the booking CTA is semantic SSR content from time zero. The provider hero clip, complete master library, final owner production acceptance, deployment and live payment gate remain blocked. See `docs/design/PREPRODUCTION_DECISION.md` for the exact scope boundary.

Checkpoint 2 `v14@f8b7235` was promoted to `origin/main` on 2026-08-03. It pins the additive Admin v1.15.0 contract, gives a signed-in customer an owner-only booking-reschedule request through the existing same-origin BFF, and displays safe payment/receipt references. It does not give the browser a payment-provider key, webhook, Admin origin, account ID, database connection or payment-confirmation authority. Stripe/HitPay selection and credentials remain Admin-only configuration; this Client must not infer which provider is active.

Checkpoint 4 on `v9` consumes only the effective Admin checkout capability and displays an unmistakable sandbox/non-production warning when enabled. The Client remains a public/BFF consumer: it has no database, provider secret, webhook, or authoritative customer-session store. Guest booking remains available and existing guest bookings are not linked.

`axs_client` owns only the Vercel public site, same-origin `/api/axs` boundary, and API consumption. Current `v6` consumes the pinned v1.12.0 contract (`cf7e1aa1d733a66d5556879b3fffaa3e3a25a2d1ebbe253144d85750b6e18f9b`). Browser code never receives or calls the Operations origin: public reads, booking mutations, status and CMS requests use the allowlisted BFF, which authenticates sensitive hops with a server-only credential. It has no database, provider secret, callback, admin-auth, customer-auth implementation, or POS authority.

Read `AGENTS.md`, this file, `MEMORY.md` and `API.md` first. For booking/status work also read `BUSINESS-RULES.md` and `TESTING.md`; for contract work read the admin `API.md` and regenerate/publish from admin before editing the client.

With server `onlinePayment.enabled=false`, the client may show fields, schedule, prices and booking steps but must stop before any mutation and show the API public message. The API independently enforces that boundary.

Robots, sitemap and static WebSite JSON-LD are implemented with the owner-placeholder origin only. The `/account` route is deliberately non-indexed and inactive: guest booking remains available, Google makes no request, and account history cannot be retroactively attached.
