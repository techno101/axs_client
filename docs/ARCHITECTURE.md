# Client Architecture

Next.js public routes/components call `createHttpPublicClient` using the pinned contract and `NEXT_PUBLIC_API_ORIGIN`. The API has all booking/payment authority. Browser UI handles data rendering, input validation, accessible states and navigation only.

No database driver, admin component, provider credential, webhook or direct `axs_admin` import is permitted. Contract changes begin in admin OpenAPI, then regenerate/publish the artifact before client changes.
