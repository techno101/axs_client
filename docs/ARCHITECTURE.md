# Client Architecture

The public site is independently deployable on Vercel. It calls the HTTPS v1 API through a pinned static contract and contains no PostgreSQL, server secrets, payment adapter/webhook, admin authorization, PM2 or VPS configuration.

The booking UI has local presentation state only. Server config decides payment availability, server transactions decide inventory, and server order status decides results. A provider redirect is handed off only after a server-created attempt; the client does not confirm it.
