# Client Business Rules

This is the canonical public-facing behavior document. Admin operational behavior is canonical in `axs_admin/docs/BUSINESS-RULES.md`.

## Confirmed launch rules

| Item | Rule |
| --- | --- |
| Inventory | Field 1 (`FIELD_01`) and Field 2 (`FIELD_02`); four field-blocks maximum per day |
| Morning | 09:00–15:00, RM600 / `60000` sen |
| Evening | 15:00–21:00, RM800 / `80000` sen |
| Booking | Complete blocks only; no hourly selection; guest booking enabled |
| Window | Up to 90 days ahead; closes 60 minutes before block start |
| Online hold | 10 minutes; server expiry is authoritative |
| Customer data | Name and phone required; email required online; team name optional; notes only if API enables them |

Public availability values are `available`, `held`, `booked`, `blocked`, `closed`, and derived `past`. A counter or online hold appears as `held`; stale data never becomes available optimistically. The public browser refreshes visible availability every 15 seconds and always requests a final hold.

## Booking and payment behavior

Prices arrive from the API; the browser displays MYR but never calculates authority. Payment result presentation is `pending`, `confirmed`, `failed`, or `expired`, derived from backend booking/payment records. Payment retry creates a new attempt through the API and must not duplicate a booking. A valid webhook may confirm payment after the browser closes.

The result and find-booking routes are non-indexable. Booking retrieval requires a reference plus matching phone and returns limited data. Do not put PII, payment identifiers, or access tokens in analytics or durable URLs.

Cancellation, rescheduling, refunds, public-safe blocked reasons, and final policy copy are **Pending client confirmation**. Display approved policy content rather than inventing rules. All dates/times use `Asia/Kuala_Lumpur`; monetary authority uses integer sen.
