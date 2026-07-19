# Client Decisions

| Decision | Result |
| --- | --- |
| Boundary | Vercel public client only; no database/provider/admin authority. |
| Contract | Consume the admin-generated pinned v1.5 artifact; never a shared package. |
| Checkout | New flow uses grouped holds/orders, one aggregate payment attempt and authority-status polling. |
| Payment | Disabled server capability stops the browser before mutation; redirect is never confirmation. |
| Content | Pending owner content stays visible as pending, not fabricated. |
