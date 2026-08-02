# Client Decisions

| v13 Checkpoint 1 pre-production decision | Result |
| --- | --- |
| v12 visual status | `REJECTED` by the owner. Retain only its useful bilingual, BFF, test and scrolling foundations; never promote it as the accepted design. |
| Replacement signature | **The Match Cut**: an editorial contact-sheet opening transforms into the one semantic navigation/hero and continues through eight connected chapters. |
| Gate | `APPROVED FOR STATIC-POSTER IMPLEMENTATION`. Independent revision 3 and the owner authorize the four-master candidate; provider video, full master batch and final production acceptance remain blocked. |
| Typography | Supplied Exo 2 is the live semantic family. The supplied Ethnocentric desktop licence forbids web embedding, so Ethnocentric is limited to flattened short display artwork with equivalent Exo 2 semantic text and failure fallbacks. |
| Media | `M01/M03` v2, `M08` v3 and `M13` v3 are independently `APPROVED`: the Match Cut invariant, venue continuity, anatomy, football physics, blank branding, distinct fictional faces and community-team composition pass. Hero motion remains blocked. |
| Venue truth | Coordinate/access-road research supports Jalan Medini Selatan 7 as the pin-side road and Persiaran Medini 3 as the broader published address. The existing customer-facing LOT/Persiaran line remains unchanged pending the release gate. |
| Scope | Homepage code is implemented and locally validated on `v13`; it uses `M01/M03/M08/M13` only and has no claimed video. `main` promotion, deployment, payment gate, POS and Checkpoint 2 are outside this checkpoint. |

| Historical v12 foundation decision, visually superseded | Result |
| --- | --- |
| Brand thesis | “The field is yours,” expressed through a Dusk-to-floodlights palette, twin-field geometry and one continuous pitch line rather than a generic dark/neon sports kit. |
| Bilingual foundation | English remains at root URLs; Bahasa Melayu begins at `/bm`. Locale selection is explicit, persistent in navigation and never inferred through an automatic browser-language redirect. |
| Content ownership | Homepage and shared-shell strings live in typed locale dictionaries. Full route and legal parity remains Checkpoint 3 work and must not be claimed early. |
| Photography | Use approved real venue/player photography only. Responsive WebP derivatives are committed; generated imagery is excluded. |
| Motion boundary | GSAP/Lenis are marketing-only on fine-pointer devices without reduced motion. Booking, account, authentication, touch and reduced-motion experiences use native scroll and visible static content. |
| Visual signature | The continuous pitch line is the sole recurring motion motif. No custom cursor, WebGL, confetti, autoplay video or blocking loader. |
| Fixture independence | Client route/accessibility/visual tests use a deterministic contract-shaped local fixture and do not require a sibling Admin checkout. |
| Release gate | A version branch may hold the validated candidate, but `main`/production promotion requires a controlled sandbox payment, verified webhook confirmation and post-deploy live checks. |
| Customer reschedule | The Client sends field/date/session/reason only through the owner-only BFF; Admin derives the account and decides time, price, closure and occupancy eligibility transactionally. |

| Decision | Result |
| --- | --- |
| Booking ownership | Client never sends an account ID. It forwards an opaque Customer cookie to its same-origin BFF so Admin derives active-session ownership. |
| Guest privacy | Finder is reference-only and consumes a booking-bound short-lived grant for the redacted PDF; no email/phone lookup or direct Admin route exists. |
| Account history | Customer history and full PDF are owner-only Client BFF routes. Guest and different-account records never fall back to the public finder while authenticated. |
| Result recovery | Every returned booking reference gets Copy/Download actions; guests with no email receive an explicit save-before-leaving warning. |

| Decision | Result |
| --- | --- |
| Customer session | The Client BFF sets/clears the Client-origin opaque session and CSRF cookies; JavaScript never reads the session token. |
| Customer providers | Google return and email states are safe disabled/unavailable states without Admin provider credentials; the Client never holds those credentials. |
| Account privacy | Account/auth/recovery/Google routes are noindex and analytics-excluded. Email, phone, age, tokens and free text are not analytics values. |

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
