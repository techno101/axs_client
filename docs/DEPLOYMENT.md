# Deployment

`axs_client` deploys independently through Vercel. It never owns VPS scripts, PM2, database migrations or provider webhook configuration. Vercel must hold server-only `AXS_ADMIN_API_ORIGIN`, `AXS_CLIENT_PROXY_SECRET`, `PUBLIC_APP_ORIGIN`, and the existing optional `OBSERVABILITY_INGEST_TOKEN`; none may use `NEXT_PUBLIC_`.

Use separate Preview and Production values, keep the Admin origin HTTPS when hosted, and install the matching proxy secret in Admin before enabling sensitive Client requests. No Vercel deployment or environment change was made in Checkpoint 1.
