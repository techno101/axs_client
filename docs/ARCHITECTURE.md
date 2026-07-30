# Client Architecture

Customer identity is a same-origin BFF extension: browser -> `/api/customer` -> Admin `/v1/customer`. The BFF can read/write Client-origin cookies and is the only Client code that forwards the opaque session to Admin. It is not a proxy for Admin/POS/webhook paths and does not expose Admin origin, proxy secret, Google secret, Resend key or a database value.

The public site is independently deployable on Vercel. Browser code calls the pinned HTTPS v1 API only through the allowlisted same-origin `/api/axs` BFF. Vercel holds the server-only Admin origin and Client-proxy credential, but the repository contains no PostgreSQL, provider credential, payment adapter/webhook, admin authorization, PM2 or VPS configuration.

The booking UI has local presentation state only. Server config decides payment availability, server transactions decide inventory, and server order status decides results. A provider redirect is handed off only after a server-created attempt; the client does not confirm it. The v1.10 control-panel and POS access additions remain server/POS-only and do not widen the public-client trust boundary.
