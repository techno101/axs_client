# Client Architecture

## v12 presentation and locale layer

The public presentation layer is authored around the “Dusk to floodlights” system. `src/lib/site-copy.ts` is the typed source for English/Bahasa Melayu homepage and shared-shell content. `/` is English and `/bm` is Bahasa Melayu; `src/proxy.ts` supplies the request language used for the server-rendered `<html lang>` value. Navigation changes locale explicitly and preserves route intent where localized routes exist. Locale routing adds no API authority.

`MarketingMotion` is mounted only for marketing content. It enables Lenis and scoped GSAP timelines on fine-pointer devices when reduced motion is not requested, and destroys all contexts on cleanup. Booking, account and authentication surfaces never receive smooth scrolling. Touch and reduced-motion visitors receive native scrolling and the same content without hidden animation-dependent states.

Real approved images are shipped as bounded responsive WebP derivatives through Next Image. Public field media accepts only relative same-origin paths; the BFF continues rewriting Admin-owned media to safe relative routes. Visual tests use the standalone contract-shaped fixture in `scripts/fixture-admin.mjs`, preserving repository independence.

Customer identity is a same-origin BFF extension: browser -> `/api/customer` -> Admin `/v1/customer`. The BFF can read/write Client-origin cookies and is the only Client code that forwards the opaque session to Admin. It is not a proxy for Admin/POS/webhook paths and does not expose Admin origin, proxy secret, Google secret, Resend key or a database value.

The public site is independently deployable via a Coolify container build (using default buildpacks/Nixpacks). Browser code calls the pinned HTTPS v1 API only through the allowlisted same-origin `/api/axs` BFF. Coolify holds the server-only Admin origin and Client-proxy credential, but the repository contains no PostgreSQL, provider credential, payment adapter/webhook, admin authorization, PM2, VPS configuration, or Dockerfile.

The booking UI has local presentation state only. Server config decides payment availability, server transactions decide inventory, and server order status decides results. A provider redirect is handed off only after a server-created attempt; the client does not confirm it. The v1.10 control-panel and POS access additions remain server/POS-only and do not widen the public-client trust boundary.
