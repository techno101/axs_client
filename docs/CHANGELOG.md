# Client Changelog

## Functional-repair pass - 2026-08-14

- Voucher apply fixed: the proxy now allowlists `POST /v1/public/vouchers/validate` (previously returned 404, so "Apply" always failed on `/book`).
- Builder site-config overrides fixed: `safeQuery` now accepts the `app` query parameter for `GET /v1/public/site-config` (previously 422, so the homepage never loaded Builder content).
- Homepage FAQ section now renders the fetched FAQs (fallback only when the API is unreachable).
- Takeover menu: closes on Escape and traps focus while open (`aria-modal` now behaves correctly).
- `/book` degrades to local field/session defaults when the booking API is down instead of throwing the error page.
- Customer reschedule form now loads real fields/blocks from the public API with fallback options.
- `age` is sent as a number per contract (was a string).
- Removed the unused `getPaymentResult` client method (replaced test coverage with the equivalent `getBookingStatus` access-token assertion).
- Validation: lint/typecheck/contract, 34 tests, route smoke (all PASS, incl. `site-config?app=client` 200), axe a11y, motion smoke, build + browser-bundle scan all pass.

## Booking rework: top nav, 91-day date rail, per-field sessions, cursor - 2026-08-14

- Centered desktop navigation in a frosted-glass header (legible over any surface); mobile keeps the takeover menu.
- Booking page: compact intro replaces the large hero; hero copy no longer repeats "Two full-size pitches in Iskandar Puteri".
- Scrollable 91-day date rail with arrows and availability dots; calendar month navigation stays in sync; UTC-safe date handling fixes the Malaysia timezone day-shift.
- Field 1 and Field 2 render side-by-side, each with its own session tiles at the same times; fallback content includes both fields.
- Custom cursor replaced with a glassy grey ring + grass dot, gated to fine-pointer desktop, never hiding the native cursor and never blocking clicks (pointer-events: none, below menu/consent layers).
- Full gate passes: lint/typecheck/contract, 34 tests, route smoke (rail + fields assertions), axe a11y, motion smoke, visual captures, build.

## Environment file consolidation - 2026-08-12

- Renamed the local env file `.env.local` → `.env` (Next.js loads `.env` automatically in dev); `.env.example` is the tracked template. Production values remain in the Vercel dashboard.

## Consent-aware visitor tracking + image-failure reporting (contract v1.18.0) - 2026-08-12

- Cookie notice in the layout; visitor sessions start only after Accept (hashed on the server, 30-day cookie, heartbeat every 60s).
- Global image-failure reporter sends broken-image events (page, URL, browser) to the existing operational-events pipeline.
- Contract repinned to v1.18.0; contract test updated (version + checksum).

## Builder config consumption (contract v1.17.0) - 2026-08-12

- Homepage reads `GET /v1/public/site-config?app=client`: hero assets (photo grid or looping video), hero copy overrides, gallery assets + visibility — with committed defaults as fallback when unconfigured or unreachable.
- Client contract types added (`SiteConfig`, `SiteConfigSection`, `SiteConfigAsset`); contract:check passes.

## Phase A: hero fix, quick-book strip, 30-photo gallery, availability dots (v1.16.0) - 2026-08-12

- Fixed the hero text bug: removed the legacy intro timeline + hero parallax from `marketing-motion.tsx` — hero copy (title, intro, CTA, chips, quick-book) is always visible; section fades kept.
- Hero quick-book: 5-day strip with availability dots (green = open, yellow = filling, red = full, grey = past) deep-linking to `/book?date=…`; booking page validates and preselects the `date` query param.
- Gallery rebuilt with ALL 30 owner photos (webp, cropped) in `public/images/matchday/{hero,gallery,sessions,pitches,team}/`; scattered tilted instant-cam frames, 3–5 per view, shadows, hover zoom, section raised.
- Contract v1.16.0: `GET /v1/public/availability/summary?from=&to=` → `[{date, available, total}]`; dots on the booking calendar popover, date chips and hero strip.
- Client lint/typecheck/contract:check, 34 tests and production build pass.

## Component-system booking flow, real loader, clean hero + gallery, AM/PM - 2026-08-11

- Added a proper UI kit (Tailwind v4, Radix popover/select/tabs/label/slot, class-variance-authority, clsx, tailwind-merge, lucide-react) with `src/components/ui/*` (button, input, label, popover, custom month calendar, select, tabs).
- Booking wizard rebuilt: two underline-tab phases; date chips + calendar popover (Monday-first, past disabled, 90-day window); field photo cards with session tiles; sticky basket bar; details screen with add-on selects and voucher; no capsule shapes anywhere (dot+text status).
- All public times now display Malaysia 12-hour AM/PM ("9 AM – 3 PM"): wizard tiles/basket/details, booking result, booking finder, account bookings, fields pages, home chips and session cards.
- Copy simplified to customer-plain language; the unavailable-payment case shows one short friendly line and the technical "No session has been reserved" notes are gone.
- Homepage hero: no background photo, no glitch match-cut reveal — four small venue shots arranged on the left (subtle tilt + hover), text/CTA/chips on the right.
- Matchday gallery: 6 → 16 frames with tilted, elevated cards, hover zoom and caption reveal.
- BootLoader is a real loader: percentage is the true loaded/total of eagerly-loaded images + fonts; it waits proportionally to real network speed (30s cap) and hides the instant everything is loaded (no fake 2.4s).

## Simpler two-phase booking flow + field photos + hero assets - 2026-08-10

- Rebuilt the booking wizard as a two-phase flow: **Pick sessions** (date strip + field photo cards + session tiles with time/price/availability; tap to add to a persistent sticky basket bar) and **Your details** (contact, add-ons, voucher, itemized totals on one screen). The five-step date→field→session→details→review wizard and the side summary panel were removed; the payment flow is unchanged.
- Field cards in the wizard now render `field.image` (admin-provided or local fallback), so the booking flow finally shows the venue.
- Committed the corrected venue webp set: the homepage hero is now the bright 3840px match photo (previously a dark archive frame was committed) and `venue-overview.webp` is the intended aerial (the two were swapped in the earlier commit).
- Wizard component tests updated to the new flow (session-tile add → Continue → details) and all pass.

## Orders management phase (admin-side, contract fields now live) - 2026-08-10

- The admin-owned order status endpoint now returns `addonLines`, `addonTotalMinor` and `voucher` — fields already present in this repository's v1 contract types from the add-ons/vouchers phase. No client code change was required; typecheck and contract check pass unchanged.

## Add-ons and vouchers in the booking wizard - 2026-08-10

- `GET /v1/public/config` `addons` are now surfaced: the Review step shows per-session add-on quantity pickers with live pricing.
- Added a voucher code field that validates through the admin-owned `POST /v1/public/vouchers/validate` endpoint (rate-limited) before payment and rejects invalid codes without a round-trip to payment.
- Review totals are itemized (sessions, add-ons, voucher discount, estimated total) and `createOrder` now sends `addons` and `voucherCode`; the client contract types mirror the admin OpenAPI additions (`AddonSelection`, `OrderAddonLine`, `OrderVoucher`, `VoucherValidation`, config `addons`).
- Server-side re-validation at order creation remains authoritative; wizard estimates are indicative only.

## Pure white redesign (video removed, day/night images) - 2026-08-09

- Flipped the home page and shared shell to a **pure white minimal matchday system**: warm paper `#f6f7f9`, ink text, one accessible green accent (`#3f7d1c` on white, `#a6e06a` on photo/dark chips). Blue removed from all accents; soft-gray section rhythm so it is not blinding.
- **Removed all video backgrounds** (hero/sessions/final) — they caused a pulsing "shaking" feel and heavy network weight. Replaced with static bright imagery: hero uses the 3840px match photo; morning session card uses `session-day.webp` (bright day match); evening session card uses `session-night.webp` (dusk-toned team moment); final CTA uses the action shot. Deleted the `public/video/` assets and the `VideoBackground` component.
- Regenerated all venue WebPs brighter (+5% brightness, +4% contrast) from their original 4K-6K sources.
- Rebuilt the loader→hero handoff: attribute-driven completion (`data-boot-done` + `boot:done` event), loader fully unmounts before the hero animates, body scroll locked during boot, no overlapping fades, no hydration mismatches.
- Scoped the header per page (`body:has(.match-home)`): white text over dark inner-page heroes, ink elsewhere — axe-safe without blend modes.
- Fixed Axe contrast issues introduced by the flip (green labels, count-up chips, cue, final label) — all 11 routes pass.
- Passed lint, typecheck, contract/security checks, 34 tests, production build, bundle scan, route smoke, Axe, motion smoke (normal + reduced), visual captures and the 27-step real-browser walkthrough with 0 console errors. No BFF, booking, payment, provider, Admin or deployment authority changed.

## Home redesign: the matchday experience - 2026-08-08

- Rebuilt the home page as one continuous cinematic scroll (no labelled sections): build-up boot loader, fixed match clock (0'→90' scroll progress), kick-off hero with live per-character anime.js title reveal over a 3840px hero photo, continuous hero-to-aerial flow, full-screen takeover menu with clip-path wipe and staggered giant links.
- Added in-image count-up markers over the aerial (2 pitches · 6hr sessions · 90d window), full-bleed day/night session panels (RM600/RM800, hover zoom + arrow), a pinned horizontal matchday gallery with captions, team clip-reveal with staggered audiences, animated green map-pin pulse, anime.js height-animated FAQ accordion, and a final CTA with background media + scale-on-scroll type.
- Locked the palette to off-black `#0B0E13` + white + one green accent `#53A423`; blue removed from cursor, labels, buttons, gallery and focus states. Cursor upgraded to a white difference-blend ring with green dot.
- Installed `animejs` 4.5.0 and used it for the loader, title reveal, counters and accordion alongside GSAP ScrollTrigger pinning/scrub and Lenis.
- Motion is now gated by `prefers-reduced-motion` only (not pointer type), so desktop users always see the choreography.
- Regenerated full-bleed images at up to 3840px from the owner's 4K–6K sources (hero, action, community, notes); gallery cards and aerials now at max source resolution.
- Passed lint, typecheck, contract/security checks, 34 tests, production build, bundle scan, route smoke, Axe on 12 routes, motion smoke and visual captures. No BFF, booking, payment, provider, Admin or deployment authority changed.

## Full experience pass: navigation, copy, colour and motion - 2026-08-07

- Navigation now uses real pages: Pitches, About, Field notes, FAQ, Contact and Find booking in the header and footer (desktop + mobile), replacing home-page anchor links.
- Renamed "The ground" to "Two pitches. One venue." with the owner's both-fields aerial leading a new full-bleed section on Home; "Pitches" is the nav label (BM: "Padang").
- Added a six-photo matchday gallery strip to Home (flying kick, duel, shield, dribble, evade, close challenge), pinned and horizontally scrubbed on desktop, snap-scrolling on mobile.
- About gained an aerial visual plus the office photo; Contact gained a venue photo and plain factual copy; field detail pages show real facility facts instead of "Coming soon" placeholders.
- Rewrote cliché/dev copy in a concrete factual tone (EN + BM): "Real people. Real answers.", "No drama", "No story to sell", "Backend state decides", "Ideas beyond the touchline" and the 24-hour reply promise are gone.
- Applied the true brand palette sampled from the owner's logo: blue `#2353a6`, green `#53a423` (deep `#2e6b22` for text), red `#8d1c44` accent.
- Added a fine-pointer-only custom cursor (dot + trailing ring, grows on interactive elements) and magnetic primary CTAs; both are reduced-motion and touch safe.
- Extended the home motion system: hero parallax, aerial section scrub, pinned horizontal gallery (desktop), staggered hero copy entrance; motion remains marketing-only on fine pointers without reduced motion.
- Organized the owner's 50+ source images under `assets/images/{aerial,action,team,field,venue,office,portraits,brand}/` with a README inventory; deleted the three rejected night/AI renders from `project/assets/field/`.
- Passed lint, typecheck, contract/security checks, 34 tests, production build, bundle scan, route smoke, Axe on 12 routes, motion smoke and full visual captures. No BFF, booking, payment, provider, Admin or deployment authority changed.

## Archive-first photography re-derive and design cleanup - 2026-08-06

- Re-derived the complete `public/images/venue/` set from the owner's `RANDOM FIELD IMAGES FOR ARMOURX SPORTS` archive at higher quality; every derivative is metadata-stripped WebP.
- Replaced the single repeated hero frame in the Match Cut opening with three distinct archive stills (`opening-a/b/c.webp`), upgraded the team chapter to the referee/handshake still, and made the actual `armourx field.jpg` the venue overview. The owner office photo now leads the About visual.
- Removed the remaining night/AI imagery from the public site: `night-player`, `night-stadium`, `aerial-pitch`, `hero-aerial`, `textured-pitch`, `demo/*` and the AI match-cut masters were physically deleted from `public/images/`; the E2E fixture now serves venue images for Field 1/Field 2.
- Consolidated `globals.css` from four stacked design systems into the single v15 editorial matchday system: deleted the retired v12 "dusk" layer and the dead v12 home block (5063 → 3689 lines), preserving live `.venue-map` and `.accordion-list` rules.
- Lightened the heavy navy scrims on the home hero and inner page heroes so real photography leads; softened the contact-sheet overlay and field-listing vignettes.
- Fixed two real Axe contrast failures: the FAQ intro text (light mist on the light FAQ surface) and the shared `--grass` accent token (now `#2c6e31`, 6.2:1 on white).
- Passed lint, typecheck, contract/security checks, 34 tests, production build, bundle scan, route smoke, Axe on 12 routes and full visual captures. No BFF, booking, payment, provider, Admin or deployment authority changed.

## Archive-first public visual reset - 2026-08-03

- Replaced every static public marketing fallback on Home, About, Fields, Book and Field notes with owner-supplied ArmourX archive photography. The Home Match Cut retains only its intentional contact-sheet-to-hero continuity; the other roles use distinct images.
- Removed all public code references to the rejected `night-player`, synthetic stadium/aerial fallbacks and ImageGen campaign masters. The supplied flattened Ethnocentric title artwork remains as non-AI font artwork with its existing semantic fallback.
- Rebalanced public marketing surfaces around white, ink, soft blue and soft green tonal layers. Brand blue and green now act as controlled accents rather than large flat fields of colour; decorative pitch-grid treatment is removed.
- The archive derivatives strip source metadata and are WebP only. This change does not modify booking rules, BFF/API contracts, payment authority, provider setup, Admin, deployment or customer data.

## v14 Checkpoint 2 candidate - 2026-08-03

- Repinned the Client contract consumer to Admin v1.15.0 and its checked checksum. The Client keeps payment-provider selection, keys, callbacks and confirmation authority entirely server-side in Admin.
- Added the exact owner-only `POST /api/customer/bookings/{reference}/reschedule` BFF route and account interface. It forwards only the opaque customer cookie and CSRF proof; no browser input can select a customer account.
- Added safe receipt/payment reference display and explicit customer-facing eligibility/rejection states. This candidate does not assert that an online provider is configured, payment is enabled or a booking has been rescheduled in a live environment.
- Promoted `v14@f8b7235` to `origin/main` on 2026-08-03; Vercel deployment and live payment/provider acceptance remain unperformed.

## v13 Checkpoint 1 static-poster implementation - 2026-08-02

- Replaced the rejected v12 homepage with the bilingual **Match Cut** candidate: an editorial contact sheet settles into the real SSR navigation, hero and **Book your spot** action instead of a loading screen.
- Rewrote public homepage copy and chapter order around the ground, match action, booking, team, location, FAQ and a direct final action. The two adjacent pitches are mentioned once; prices, made-up facility claims and field-number marketing are removed from the homepage.
- Added self-hosted supplied Exo 2 weights. Flattened supplied Ethnocentric title artwork is used only as image artwork, with an Exo semantic fallback if it fails; the desktop font is never web-embedded.
- Used the four approved fictional campaign roles once each (`M01/M03` are the documented same-player Match Cut continuity exception; M08 v3 and `M13` are distinct). The manifest now records the default no-repeated-face rule. The independent implemented-home review is `APPROVED` after it verified the M08 correction and static touch/reduced state.
- Added scoped GSAP opening/reveal/action choreography: scroll, touch, pointer, keyboard, navigation, media failure and reduced motion settle safely; Lenis remains fine-pointer marketing only and native scroll remains on touch/reduced/task routes.
- Preserved booking/BFF/payment authority, existing owner-local files and all Checkpoint 2 work. The provider clip and full master batch remain blocked/deferred; no `main` promotion, deployment or payment change is claimed.
- Pushed the reviewed candidate commit `424bbb8bf8c4546e2b591fc6e929ddb690a9e503` to `origin/v13`; `origin/main` remains at the accepted v11 baseline.
- Passed lint, typecheck, contract/security checks, 33 tests, production build, bundle scan, Axe on 11 routes, normal/reduced-motion smoke, keyboard interruption and media-title fallback tests. The direct fixture visual route remains environment-blocked by the active owner dev server and production loopback boundary.

## v13 Checkpoint 1 pre-production pack - 2026-08-02

- Recorded the owner correction that `v12@35453aa` is technically useful but visually `REJECTED`; created local `v13` from `origin/v12` only after proving no existing local/remote `v13`.
- Added The Match Cut venue/design/motion bibles, desktop/mobile wireframes, bilingual eight-chapter storyboard, reference study, 28-file provenance inventory and 16-still asset-role plan under `docs/design/`.
- Rebuilt the customer story around the exact key line **Book your spot**, removed every rejected v12 campaign concept, and corrected the BM booking instruction to `pilih slot yang tersedia`.
- Inspected the supplied font packages. Exo 2 is the live semantic family; the supplied Ethnocentric desktop licence permits flattened static display artwork but forbids embedded webfont delivery. Added a v2 typography/palette proof covering English/BM, mobile wrapping and 200% zoom.
- Regenerated the four low-resolution anchors through three review rounds. The independent verifier records revision 3 as `APPROVED`: the opening-to-hero invariant, venue continuity, football physics, anatomy, blank branding and natural community-team grouping pass.
- Captured and inspected desktop/mobile evidence for four reference sites without copying their assets or layouts.
- Recorded remaining blockers truthfully: final owner approval and an authorized provider motion test. No high-resolution batch was generated.
- No homepage component code, BFF/API/payment behavior, dependency, Admin/POS state, remote branch, deployment or production route was changed.

## v12 bilingual brand foundation release candidate - 2026-08-02

- Rebuilt the homepage and shared shell around “The field is yours” and “Dusk to floodlights,” using approved venue photography, twin-field geometry and one continuous pitch-line signature.
- Added typed English/Bahasa Melayu homepage and shell dictionaries, explicit `/bm`, locale switching, SSR document language, canonical/hreflang metadata and localized sitemap coverage without browser-language redirects.
- Added GSAP, `@gsap/react` and Lenis for desktop marketing routes only, with cleanup, reduced-motion and touch fallbacks, and native scrolling for booking/account/authentication.
- Added optimized WebP venue/logo derivatives, same-origin media validation, deterministic standalone Client fixtures, motion/performance checks and broader route/metadata/responsive validation.
- Removed customer-facing internal terminology and the booking state gallery; corrected error-document nesting, lint/test warnings, contact-form false success, and disabled-payment copy.
- Local verification passes. Production promotion remains blocked because public checkout is disabled and no controlled sandbox callback/payment confirmation has been evidenced; no `main` push or Vercel deployment is claimed.

## Checkpoint 3 booking ownership, history, lookup and download - 2026-07-30

- Added account-safe contact prefill, optional guest email, reference-only finder, masked grant download and owner-only booking-history/download UI.
- Added result-page references with Copy/Download actions and an explicit no-email save/download warning, including narrow-screen layout support.
- Repinned the additive v1.14 Admin contract to `7c65bf9c056968b9d9bc343469ea80e5bc761e14a4a133752651a9a086489ae5`; no deployment, provider, Admin authority or POS behavior changed.

## Checkpoint 2 customer identity and verification - 2026-07-30

- Added same-origin Customer BFF handlers, Client-origin secure cookie management, Google callback/handoff boundary and strict customer-route allowlist.
- Added responsive sign-up/sign-in/verify/recovery/reset/Google-return/account/profile/security routes with guest navigation retained.
- Repinned the static Admin OpenAPI consumer artifact to v1.14.0. No deployment, live OAuth, Resend delivery, payment or POS work was performed.

## Checkpoint 1 same-origin integration - 2026-07-30

- Replaced browser Operations-origin calls and rendered origin props with the allowlisted same-origin `/api/axs` BFF.
- Added server-only Admin origin, Client origin and proxy-secret validation; bounded bodies, timeouts, request IDs, stable errors, exact state-change origin checks, narrow header forwarding and Admin-media URL rewriting.
- Added proxy/security tests and a post-build browser-bundle scan. No deployment, customer authentication, payment enablement or provider change occurred.

## Official branding - 2026-07-28

- Replaced the recreated shield/type treatment with the exact supplied transparent ArmourXSports wordmark in the responsive header, footer and metadata.
- Kept the existing public booking contract and business behavior unchanged.

## v1.12 contract pin - 2026-07-25

- Repinned the admin-generated v1.12.0 contract at `cf7e1aa1d733a66d5556879b3fffaa3e3a25a2d1ebbe253144d85750b6e18f9b`.
- No public UI, customer authentication, booking logic, database, provider, or POS authority changed.
- Updated Next.js to 16.2.11, pinned patched Sharp 0.35.3, and retained deterministic npm peer resolution; the production-dependency audit reports zero vulnerabilities.

## v1.11 contract pin - 2026-07-24

- Repinned the admin-generated v1.11.0 contract at `181432b9a86d4fe2ba5d55f75c3779737f93b84726b4de9007f250a367b55a43`.
- Public client behavior and authority are unchanged; POS enrollment, staff Google access, sale email requests, and media administration remain admin/POS concerns.

## v1.10 safe operational report proxy - 2026-07-21

- Repinned the admin contract at `bc84b03bb50f1c83048c955794539e26167943dc9045ddb815d4c4425411f667`.
- Added a bounded same-origin server route for safe client error/payment-state reports. It rate-limits, allowlists/redacts details and uses a server-only source token to call admin; the public browser never receives that token.

## v1.10 lifecycle contract pin - 2026-07-21

- Repinned the unchanged-version admin contract at checksum `a4d207f885b4b6250d8a8c2b83ff2badc2a50baf91d4cf2618022fe5f7f3a6ff`, including POS lifecycle/admin device-management types. Public client behavior did not change and it still has no POS authority.

## v1.10 pin and local API smoke - 2026-07-20

- Pinned the v1.10.0 admin-generated artifact (`2e87ee580902c0253b79b3901e8c60a2b9bb312672ad4bab7c2f7a8035b569cd`) without importing admin source.
- Confirmed public guest booking still requires email while public customer accounts, Google and email delivery remain inactive boundaries.
- With the local API origin configured only in ignored `.env.local`, route/reflow/keyboard/mobile smoke and axe checks passed; lint, typecheck, security scan, 17 tests and production build passed. No deployment or payment enablement occurred.

## Local browser verification - 2026-07-19

- Passed local API-backed native-Chrome route, responsive, keyboard/mobile, disabled-payment and axe smoke checks without enabling online payment.

## v1.9 contract and public-readiness boundary - 2026-07-19

- Pinned the v1.9.0 admin-generated artifact (`ebb59cb379d90e637dc0e95eb821838792a9ddf4eb60a252e97d6bfeb7b228ed`) without importing admin source.
- Added static `robots.txt`, sitemap and safe static WebSite structured data; protected lookup/result/account/maintenance/legal routes stay non-indexed.
- Added an inactive optional-account boundary that keeps guest booking default, prevents guest-history backfill and makes no Google OAuth request until owner-approved admin implementation exists.

No Vercel deployment, production payment enablement, account activation, Resend delivery, Google OAuth setup or real environment read occurred.

## Contract pin refresh - 2026-07-19

- Pinned the then-current admin-owned v1.8.0 artifact. Public client behavior was unchanged; POS-only availability and correction additions remained outside this repository.

## v1.5 order consumer â€” 2026-07-19

- Pinned the admin-owned v1.5.0 contract.
- Moved the public booking wizard to grouped hold/order/payment-attempt flow with a maximum 20-slot basket.
- Updated result polling to authoritative order status and retained disabled-payment pre-mutation behavior.

No Vercel deployment, production payment enablement or real environment read occurred.
