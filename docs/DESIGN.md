# Client Design System

## Phase 1 implementation

The implemented visual language is a premium night-field editorial system rather than a generic SaaS template: deep navy atmospheres, controlled acid-lime actions, accessible green labels, floodlight/glow layers, net and pitch-line geometry, compressed display typography, warm reading surfaces, full-bleed photography, and disciplined circular details. The home, fields, booking, content, policy, maintenance, error, loading, empty, and 404 experiences share one system.

Core tokens in `src/app/globals.css`:

| Role | Value/use |
| --- | --- |
| Deep ink | `#04101c` for night surfaces and footer |
| Ink | `#081727` for controls and high-emphasis text |
| Lime | `#c8f135` for primary actions and dark-surface highlights |
| Accessible green | `#167342` for small labels and available meaning on light surfaces |
| Paper/cream | `#faf9f4` / `#f2f1ea` for reading and booking surfaces |
| Error/warning/success | `#c53a3a` / `#b86d13` / `#147848`, always paired with text |
| Layout | 1280px shell; 32/24/16px responsive gutters; 10/18/28px radius scale |
| Typography | Local `Aptos`/`Segoe UI` body stack and `Arial Narrow`/`Roboto Condensed` display fallback; no runtime font request |

Buttons use a pill body plus circular directional control, slot cards expose time/price/state without card-dashboard conventions, and field/article cards rely on editorial image/copy relationships. Motion is limited to short hover feedback, hero scale, image drift, and menu/control transitions; `prefers-reduced-motion` collapses them to effectively zero duration.

## Route and state patterns

- Home: cinematic hero and availability dock, product statement, asymmetric field editorial, block pricing, facilities, gallery, map placeholder, FAQ, and image CTA.
- Fields: large alternating field compositions, facts/features, and fixed-block comparison.
- Booking: five visible steps, horizontally scrollable mobile dates, field controls, slot cards, customer fields, review, persistent desktop summary, and public-state guide.
- Result/lookup: pending, confirmed, failed, expired, empty and fictional result states with explicit API-authority language.
- Content/policy: structured article cards/details and a shared non-final-policy pattern that never invents operational or legal terms.
- System feedback: route skeleton, maintenance, stable error preview, runtime reset boundary, and custom 404.

Availability is represented as `available`, `held`, `booked`, `blocked`, `closed`, and `past`; payment presentation is `pending`, `confirmed`, `failed`, and `expired`. Every state uses readable text in addition to color, and unavailable slot buttons are disabled.

## Accessibility and responsive behavior

- One `h1` per route, semantic header/nav/main/footer, skip link, visible labels, native details/summary accordions and mobile menu, and native buttons/links/forms.
- Global three-pixel focus-visible ring, 44px minimum interactive targets, form focus rings, and no action that depends on motion.
- Result and lookup routes are noindex. Customer details never enter fixture URLs or persistent storage.
- Axe WCAG A/AA checks pass on home, booking, confirmed result, lookup, contact, and 404. Small-text green was corrected to `#167342` from visual testing.
- Overflow checks pass at 360, 390, 768, 1024, and 1440px. The 390px booking panel and closed mobile-menu overflow defects were corrected during screenshot QA.

## Temporary image manifest

All four files are temporary local demo copies from pages identified by Unsplash as free under the Unsplash License. They contain no club marks used as brand assets. Replace every file with approved, rights-cleared ArmourXSports venue photography before launch; preserve the intent and alt text where the final image still communicates the same scene.

| Local file and uses | Source page | Current alt text | Temporary status and intended replacement |
| --- | --- | --- | --- |
| `public/images/demo/night-stadium.jpg`; home/field/hero/gallery | `https://unsplash.com/photos/a-stadium-lit-up-at-night-with-the-lights-on-4VQCwM9ziGI` — Jason Leung | “Floodlit stadium viewed from above at night” / contextual variants | Temporary; replace with ArmourXSports exterior or hero field under actual floodlights |
| `public/images/demo/aerial-pitch.jpg`; field two, fields hero, gallery | `https://unsplash.com/photos/aerial-view-of-soccer-field-during-daytime-xd73tlRkp8o` — Maksym Diachenko | “Aerial view of a green football pitch inside a stadium” | Temporary; replace with a rights-cleared aerial of the real two-field venue |
| `public/images/demo/night-player.jpg`; booking/pricing/article | `https://unsplash.com/photos/a-person-holding-a-baseball-glove-goASCCG9qz0` — Chris Andrawes; page metadata identifies football/night/grass/soccer | “Football player on a lit pitch at night” | Temporary; replace with an approved ArmourXSports match/training image and verified participant release |
| `public/images/demo/textured-pitch.jpg`; CTA/article | `https://unsplash.com/photos/aerial-view-of-green-field-g1x5RZqaNBw` — Didier Bn | “Football pitch viewed from above” | Temporary; replace with the real field texture/aerial composition |

The files are delivered locally and unoptimized only for deterministic Phase 1 preview. Final assets require responsive crops, production compression, verified dimensions, source/rights records, and removal of the Phase 1 unoptimized setting.

## Visual evidence

Ignored local evidence is generated by `npm run visual:capture`:

- `output/playwright/home-desktop-1440.png`
- `output/playwright/home-mobile-390.png`
- `output/playwright/booking-desktop-1440.png`
- `output/playwright/booking-mobile-390.png`
- `output/playwright/fields-tablet-1024.png`

Final venue facts, address, contact channels, legal/policy copy, brand assets, and photography remain pending owner approval.
