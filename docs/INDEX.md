# Client docs — quick-find index

Route from a task to the file(s) to read/edit. Full surface list: root `project/docs/CANONICAL-SURFACES.md`.

| Feature / task | Files | Notes |
| --- | --- | --- |
| Home hero (shots, chips, quick-book) | `src/components/home/home-experience.tsx` | Shots from `public/images/matchday/hero/` |
| Home copy (EN/BM) | `src/lib/site-copy.ts` | All home strings, per locale |
| Home motion/reveals/loader | `src/components/motion/` (`marketing-motion.tsx`, `boot-loader.tsx`) | Hero copy must NOT be gated here |
| Matchday gallery | `home-experience.tsx` `galleryShots` + `public/images/matchday/gallery/` | Scattered tilted frames |
| Booking wizard | `src/components/booking/booking-wizard.tsx` | Two-phase flow, calendar, dots |
| Calendar component | `src/components/ui/calendar.tsx` | Month grid, availability dots prop |
| UI kit (button/input/select/tabs/popover) | `src/components/ui/` | Tailwind v4 + Radix |
| Slot cards + status dots | `src/components/booking/slot-card.tsx`, `src/components/ui/status-pill.tsx` | Dot+text, no capsules |
| Availability client API | `src/lib/api/http-client.ts` (`getAvailability`, `getAvailabilitySummary`) | Summary = per-date `{date, available, total}` |
| Contract types | `src/lib/api/contract/v1.ts` + `src/lib/api/types.ts` | Mirror admin OpenAPI |
| Time formatting | `src/lib/format.ts` (`formatTime12`, `formatTimePair12`) | 12-hour Malaysia display |
| Booking result / finder / account | `src/components/booking/`, `src/components/customer/customer-forms.tsx` | 12-hour times |
| Fields pages | `src/app/fields/`, `src/lib/content.ts` | Field imagery |
| Booking page date param | `src/app/book/page.tsx` | Honors `?date=` |

## Validation

`npm run typecheck`, `npm run lint`, `npm run contract:check`, `npm test` (34), `npm run build`. Clear `.next` if the build hits a webpack hash crash.
