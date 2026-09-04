# Client Decisions

| Unified Google Auth & Non-Blocking Verification - 2026-09-04 | Result |
| --- | --- |
| Google button uniformity | Both `/sign-in` and `/sign-up` present identical "Continue with Google" buttons. Existing accounts (whether registered via password or Google) sign in seamlessly. |
| Account auto-linking | Users who registered with password first can log in using Google; existing password remains valid for either login method. |
| Non-blocking verification | Unverified (`pending`) accounts are treated as active for customer dashboard, booking history, checkout attachment, and receipt download. Verification is an optional formality surfaced via a clean notice with a single-click verification request. |
| Verification Expiry TTL | Email verification links expire after 10 minutes (strictly aligned across admin and client). |
| Token Hygiene & Sanitization | `?token=...` is stripped immediately from the browser URL upon mounting via `window.history.replaceState` to prevent token leakage in history/referrers. |
| Zero-Form Verification | Clicking the verification link immediately authenticates the customer and auto-redirects to `/account` without prompting for email or displaying a redundant resend form. |
| Cross-Tab Synchronization | Waiting tabs listen via `BroadcastChannel`, `localStorage`, and periodic session probing to auto-redirect to `/account` when verification succeeds in another tab. |
| Profile Avatar & Verify Account Button | `AccountOverview` presents a customer avatar with initials; unverified status renders an inline badge and a 1-click "Verify account" button beside the avatar with a 60s cooldown. |
| Guest Session Probe | `/api/customer/session` returns 200 `{ data: { account: null } }` when unauthenticated to prevent red 401s in console. |

| Availability dots - 2026-08-12 | Result |
| --- | --- |
| Dot rule | Green = all slots free, yellow = some free, red = none free, grey = past. Fed by the additive `availability/summary` endpoint (v1.16.0); a date with zero configured slots counts as red. |
| Image organization | Matchday photos live in per-section folders under `public/images/matchday/{hero,gallery,sessions,pitches,team}/`; the same photo may repeat across sections. |
| Hero text | Never gated behind motion timelines or boot events — always visible by default; fades only apply to below-hero sections. |

| Component system - 2026-08-11 | Result |
| --- | --- |
| UI primitives | Adopted Tailwind v4 + Radix primitives + CVA/lucide (`src/components/ui/*`) for the booking experience; existing page CSS stays untouched (no preflight conflicts). |
| Status treatment | No capsule/pill shapes anywhere in the booking flow — status is a plain dot + word. |
| Calendar | A custom month calendar (Monday-first, disabled past days, 90-day window, prev/next months) opens beside the date chips in a popover; no external date dependency. |
| Time format | Every human-facing time in the app displays Malaysia 12-hour AM/PM; stored/API values remain "HH:MM" strings so contract and parsing (POS night detection) are unchanged. |
| Loader honesty | BootLoader percentage equals real loaded/total of eager images + fonts; no artificial duration, capped at 30s for dead networks. |
| Hero | No background photo and no multi-frame reveal — four small venue shots on the left with tilt/hover, copy on the right. |
| Gallery | 16 tilted/elevated frames with hover zoom + caption reveal in a snap-scroll track. |

| Booking flow simplification - 2026-08-10 | Result |
| --- | --- |
| Flow shape | Two phases — "Pick sessions" (date strip + field photo cards with per-field session tiles) and "Your details" (contact + add-ons + voucher + totals). Mirrors Playfinder/Goals-style facility booking: browse everything at once, tap to add, continue. |
| Session selection | Tapping an available tile adds/removes it from the basket immediately (no per-step "Add to booking" navigation); a sticky bottom bar keeps count, total and Continue always visible. |
| Field imagery | Field cards render `field.image` (admin-provided via the proxy or local venue fallback), matching the fields pages. |
| Review merge | The separate Review step is gone — totals update live on the details screen and the server re-validates at order creation. |

| Add-ons and vouchers - 2026-08-10 | Result |
| --- | --- |
| Add-on selection payload | The client sends `{ catalogItemId, fieldId, blockCode, bookingDate, quantity }` per selected session, matching the public occurrence contract; the server re-checks availability against the held bookings. |
| Voucher UX | The voucher is validated with the admin endpoint on the Review step; an invalid code is rejected before payment. The applied voucher and totals shown are estimates — the server recomputes them at order creation. |
| Totals presentation | Sessions, add-ons, voucher discount and estimated total are itemized so the discount is explicit rather than hidden inside the total. |

| Pure white redesign - 2026-08-09 | Result |
| --- | --- |
| Palette | Warm paper `#f6f7f9` base + ink `#0d1117` text + ONE green accent (`#3f7d1c` for small text on white, `#a6e06a` on photo/dark chips). Blue fully removed. Soft-gray section rhythm (gallery/team/FAQ) so the page is not blinding. |
| Video | Removed after review — the Ken Burns loops caused a pulsing "shaking" feel and network weight. Replaced with static bright imagery: `session-day.webp` (day match) and `session-night.webp` (dusk team moment) for the session cards; hero and final use existing bright stills. `public/video/` and `VideoBackground` deleted. |
| Loader handoff | Attribute-driven boot completion; loader unmounts before hero copy animates; scroll locked during boot; no hydration mismatch. |
| Header | Page-scoped (`body:has(.match-home)`): white over dark inner-page heroes, ink elsewhere. No blend-mode (axe-safe). |
| Contrast | Green accent `#3f7d1c` (5.05:1 on white) for small labels; chips solid dark `#1b1e22` with white/`#a6e06a` text. Axe passes on all 11 routes. |

| Home matchday redesign - 2026-08-08 | Result |
| --- | --- |
| Structure | The home page is one continuous scroll experience, not labelled sections. Beats mutate into each other (hero → aerial → sessions → gallery → team → map → FAQ → final) with pinned, horizontal and scrub choreography. |
| Palette | Off-black `#0B0E13` + white + one green accent `#53A423`. Blue is fully removed. Dark theme locked on the home page; inner pages keep their light surfaces. |
| Motion stack | anime.js 4.5 for loader, title reveal, counters, accordion; GSAP ScrollTrigger for pins/scrub/parallax; Lenis smooth scroll. Gated by `prefers-reduced-motion` only. |
| Navigation | Single floating control opens a full-screen takeover menu (clip-path wipe, staggered giant links) on all routes. |
| Loader | Build-up boot: wordmark char stagger + pitch-line draw + kick-off marker, reduced-motion hidden via CSS. |
| Match clock | Fixed 0'→90' scroll progress device with green ring, home page only. |
| Booking page | UI-style update only (dark palette + micro-interactions); structure and flows untouched. |

| Full experience pass - 2026-08-07 | Result |
| --- | --- |
| Navigation | Header/footer/mobile navigation uses real routes (Pitches, About, Field notes, FAQ, Contact, Find booking); home-page anchors are removed from the menu. |
| Language | "The ground" is retired. Public copy uses "pitches"/"venue" (BM: "padang"). All marketing copy is concrete and factual in the tone of leading booking platforms; no slogan or developer wording remains. |
| Palette | The palette is derived from the actual owner logo colours: blue `#2353a6`, green `#53a423` (text-safe deep `#2e6b22`), red `#8d1c44` accent, ink `#101827`, chalk `#f7f9fc`. |
| Interactivity | Fine-pointer-only custom cursor (dot + trailing ring) and magnetic primary CTAs; hero parallax, aerial scrub, pinned desktop gallery and staggered copy reveals. All gated by `(pointer: fine)` and `prefers-reduced-motion`. |
| Imagery | Home leads with the owner's both-fields aerial; a six-photo matchday gallery uses previously unused archive stills; About/Contact gained venue photography. Full source library is catalogued in `assets/images/` with a README. |
| Rejected media | The three night/AI field renders were physically deleted from `project/assets/field/` on 2026-08-07. |

| Archive-first visual cleanup - 2026-08-06 | Result |
| --- | --- |
| Photography source | The owner's local ArmourX archive remains the only photographic source. The venue set was re-derived at higher quality; the opening contact sheet uses three distinct archive stills; the actual field photo leads the venue overview and the office photo leads the About visual. |
| Rejected media removal | With explicit owner authority, all night/stadium/aerial/match-cut AI files were physically removed from `public/images/` and from the E2E fixture. Only the archive-derived venue set and the flattened Ethnocentric title artwork remain. |
| Design system | The stacked v12/v13/v14/v15 CSS layers were consolidated into the single v15 editorial matchday system. Heavy navy scrims were lightened so real photography carries the page; brand blue/green remain controlled accents. |
| Accessibility | The FAQ intro text and the `--grass` accent token were corrected to meet 4.5:1 contrast on light surfaces; Axe passes on all 12 public routes. |

| Archive-first public visual decision - 2026-08-03 | Result |
| --- | --- |
| Public imagery | The owner directly selected the local ArmourX archive as the only photographic source for public marketing routes. New derivatives are metadata-stripped WebP crops/conversions only; no AI image is used. |
| Rejected media | `night-player`, synthetic stadium/aerial fallback media and the generated Match Cut campaign masters are removed from public source references. Flattened Ethnocentric title artwork remains permitted because it is supplied-font artwork, not generated photography. |
| Palette | Preserve Armour blue/green as identity accents. Use white, ink, pale blue and pale green tonal surfaces for the bright glossy balance requested by the owner; no generic bright-green-on-blue section fills. |
| Venue location | The canonical map target is ArmourX Sports SDN. BHD. at `1.3940655,103.6340126`. This confirms the existing pin but does not settle the separate customer legal/postal address wording. |

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
