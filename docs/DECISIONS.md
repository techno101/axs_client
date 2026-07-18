# Client Decisions

| Decision | Result |
| --- | --- |
| Deployment | Independent Vercel project. |
| Booking authority | API only; browser is never inventory/payment authority. |
| Payment presentation | Capability-gated; disabled state stops before public mutation. |
| Content | Real API/CMS data where present; owner-pending facts remain visibly pending. |
| Accounts | Guest booking stays available; Phase 9 adds optional accounts that begin fresh. |
| Privacy | Session handle only; analytics excludes identifiers and free text. |
