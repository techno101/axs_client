# Deployment

## v12 promotion gate - 2026-08-02

`v12` is a locally validated release candidate, not an accepted production release. Production promotion is blocked while `https://www.armourxsports.com/api/axs/v1/public/config` reports online payment disabled and a controlled selected-provider sandbox checkout has not produced a verified webhook confirmation. The currently deployed `/bm` route returns 404, confirming that v12 is not live.

Before `v12:main`, require: exact public sandbox webhook and Client return URLs registered with the selected provider; Admin `ONLINE_PAYMENT_ENABLED=true` in the sandbox deployment; selected sandbox credentials; a matching fingerprint-bound Admin checkout toggle; a visible sandbox indicator; one controlled booking/payment/callback confirmation; and live checks for `/`, `/bm`, `/book`, metadata and reduced motion. Never use a redirect as payment evidence. If `origin/main` advances after the release branch is prepared, stop rather than force-pushing.

Checkpoint 2 customer deployment is NOT PERFORMED. Vercel requires only the existing server-only Admin origin, Client proxy credential and canonical public origin. Customer Google/Resend credentials remain Admin/VPS-only. Do not configure them, deploy them, or claim sender/OAuth readiness until the separate owner acceptance checkpoint.

`axs_client` deploys independently through Vercel. It never owns VPS scripts, PM2, database migrations or provider webhook configuration. Vercel must hold server-only `AXS_ADMIN_API_ORIGIN`, `AXS_CLIENT_PROXY_SECRET`, `PUBLIC_APP_ORIGIN`, and the existing optional `OBSERVABILITY_INGEST_TOKEN`; none may use `NEXT_PUBLIC_`.

Use separate Preview and Production values, keep the Admin origin HTTPS when hosted, and install the matching proxy secret in Admin before enabling sensitive Client requests. No Vercel deployment or environment change was made in Checkpoint 1.
