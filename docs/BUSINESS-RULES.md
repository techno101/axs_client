# Public Booking Rules

## v12 customer-language rules

- Customer copy uses field, session, booking and payment language; it does not expose API, backend, inventory, owner-confirmation or developer-state terminology.
- English is the root experience and Bahasa Melayu starts at `/bm`. Locale choice is explicit; names, references, addresses and authoritative business values are not mistranslated.
- When online payment is disabled, visitors may review dates, fields, sessions and authoritative prices, but no hold/order/payment mutation is made and the UI states that no session has been reserved.
- Marketing motion cannot gate content or booking. Booking/account/authentication, touch and reduced-motion modes use native scrolling.
- Public imagery is approved real photography. No generated venue image may imply facilities or conditions that were not photographed and approved.

## Checkpoint 3 ownership, lookup and references

- Guest email is optional; name and normalized phone remain required. An active verified account safely pre-fills its profile, but the browser never selects an account ID.
- Only a new authenticated booking is account-owned. Existing and later guest bookings remain guest records forever, even when contact details match an account.
- New references use `AXS-XXXX-XXXX-XXXX-XXXX`; legacy AXS references remain accepted. Successful result pages show each reference with Copy and Download. A guest who omitted email sees a prominent save/download warning; an email-present booking states that its references were sent without exposing delivery details.
- Guest finder uses reference only and exposes masked data. Account history contains only directly owned bookings; it never falls back to guest lookup for an authenticated visitor. Booking and payment state remain separate.

## Optional customer accounts

Guest booking remains the default public flow. Email/password and Google registrations start as pending and cannot access account-only behavior until the same one-time email verification link is consumed. Google does not bypass verification. Existing guest bookings and customer contacts are never claimed/backfilled. Provider absence is presented as unavailable, not as a completed email/OAuth flow.

- Public display content, field facts, schedule, price and availability come from the API; the browser never calculates authority.
- The browser calls only same-origin `/api/axs`; the Client server alone knows the Operations origin and proxy credential.
- The basket holds 1-20 unique dated field-slot occurrences. The public client sends one grouped request; it must not simulate partial success.
- If online payment is disabled, the visitor can browse and review but cannot create a hold, order or payment attempt.
- Online guest booking requires name, mobile number and email. Counter customers may remain email-optional because their records are created by the authorized counter workflow, not this public site.
- Redirect/query parameters never prove payment. Result states come from the order-status endpoint with its dedicated access token.
- Current customer information is shown only in the active flow. The browser stores only a short-lived order access handle; no customer data/free text enters browser analytics.
- Contact, address, policy, legal and final-media claims remain marked pending until owner-approved CMS content exists.
