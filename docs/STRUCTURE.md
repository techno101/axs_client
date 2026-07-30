# Client Structure

| Path | Purpose |
| --- | --- |
| `src/app/` | Public routes, metadata and error states. |
| `src/components/booking/` | Booking UI and authoritative-result presentation. |
| `src/lib/api/` | HTTP client and pinned API artifact. |
| `docs/` | Client-specific decisions and runbook memory. |
| `tests/` | Contract, UI and browser verification. |

The repository remains independent of `axs_admin` source and future `axs_pos` source.
