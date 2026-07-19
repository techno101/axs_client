# Deployment

`axs_client` deploys independently through Vercel. It never owns VPS scripts, PM2, database migrations or provider webhook configuration. Only truly public Vercel values belong in the project settings.

No Vercel deployment or environment change was made. The API origin and any later analytics setting require an approved privacy review; no analytics event may include personal information, payment information, access tokens or free text.
