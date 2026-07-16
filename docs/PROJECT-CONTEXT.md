# Client Project Context

## Product and audience

ArmourXSports is a mobile-first Malaysian football-field booking service. Public visitors inspect the venue, view real availability, reserve one complete field block, pay online, and retrieve a privacy-limited booking. Guest booking is enabled; customer accounts are not required.

The client scope includes the public home, fields, booking, booking result/find, about, contact, FAQ, articles, policy, maintenance, and error routes. It renders approved CMS content blocks safely and displays public operational states. It explicitly excludes counter booking, cash/manual DuitNow confirmation, attendance, receipts, staff roles, database access, API/webhook handling, and ERP functionality.

## Journeys and success

- **Online booking:** select a valid Malaysia-time date and available field-block; obtain an API hold; submit customer details; redirect to Billplz; poll authoritative API state on return.
- **Payment return:** show pending until the verified backend state becomes confirmed, failed, or expired; query parameters are never payment proof.
- **Find booking:** submit reference plus matching phone; receive only privacy-limited information through a rate-limited API.
- **Content:** browse structured public pages supplied by the API; unknown blocks fail safely.

Success means customers can complete an accessible, responsive booking flow without double-booking, while all price, availability, payment, and content authority remains with the admin/API platform.

## Brand, priorities, and dependencies

Use athletic, clean, trustworthy navy/green/white design; avoid casino, esports, and generic SaaS styling. Public dates/times use `Asia/Kuala_Lumpur`; currency is MYR. P0 is booking correctness and accessibility; marketing polish is secondary.

The client depends on the admin-owned versioned API for fields, blocks, availability, holds, bookings, status, and content. Final venue facts, legal copy, media, contacts, and brand assets remain pending client confirmation. Study interaction references and reuse code only after commercial-license, security, and token-conformance review.
