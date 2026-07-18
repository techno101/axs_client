# Client API Contract View

The admin repository owns OpenAPI v1.3.0. This repository consumes the copied artifact at `src/lib/api/contract/v1.ts`; `npm run contract:check` validates its local version/checksum. The artifact never imports admin source.

| Client action | API boundary |
| --- | --- |
| Current public data | config, fields, availability, CMS pages/articles/FAQs |
| Public mutation | hold, booking, payment attempt with idempotency |
| Authoritative result | booking status with dedicated access-token header |
| Transitional lookup | reference plus phone; scheduled for removal in Phase 9 |

Config includes `onlinePayment: { enabled, publicMessage? }`. When disabled, the client must stop before a hold/booking/payment request and display the public message. The API independently enforces this before any inventory write. The payment method literal is `online_provider`; a redirect never confirms payment.

Only `NEXT_PUBLIC_API_ORIGIN` and other truly public values belong here. Browser session storage may hold a short-lived booking/document handle only; no customer data, payment identifier, reference, token or free text belongs in analytics.
