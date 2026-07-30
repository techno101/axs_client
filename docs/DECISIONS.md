# Client Decisions

| Decision | Result |
| --- | --- |
| Boundary | Vercel public client only; no database/provider/admin authority. |
| API integration | Browser and Client Components use only same-origin `/api/axs`; the BFF is an explicit route/method allowlist, never an open proxy. |
| Proxy trust | Server-only Admin origin and shared proxy credential; state changes require the canonical Client Origin/Referer and Admin receives only pseudonymous bounded client context. |
| Contract | Consume the admin-generated pinned v1.10 artifact; never a shared package. |
| Checkout | New flow uses grouped holds/orders, one aggregate payment attempt and authority-status polling. |
| Payment | Disabled server capability stops the browser before mutation; redirect is never confirmation. |
| Content | Pending owner content stays visible as pending, not fabricated. |
| Accounts | Guest is default. The non-indexed account route is inactive until the admin implements owner-approved first-party account/session/email controls; Google remains an explicit disabled boundary and guest history is never backfilled. |
| SEO | Static metadata, sitemap, robots and WebSite JSON-LD use the placeholder public origin until an owner-approved public origin is configured. |
