# Public Booking Rules

- Public display content, field facts, schedule, price and availability come from the API; the browser never calculates authority.
- The browser calls only same-origin `/api/axs`; the Client server alone knows the Operations origin and proxy credential.
- The basket holds 1-20 unique dated field-slot occurrences. The public client sends one grouped request; it must not simulate partial success.
- If online payment is disabled, the visitor can browse and review but cannot create a hold, order or payment attempt.
- Online guest booking requires name, mobile number and email. Counter customers may remain email-optional because their records are created by the authorized counter workflow, not this public site.
- Redirect/query parameters never prove payment. Result states come from the order-status endpoint with its dedicated access token.
- Current customer information is shown only in the active flow. The browser stores only a short-lived order access handle; no customer data/free text enters browser analytics.
- Contact, address, policy, legal and final-media claims remain marked pending until owner-approved CMS content exists.
