# Client Architecture

The client remains an independently deployed, database-free, secret-free v1 consumer.

```text
React pages -> httpPublicClient -> admin-owned HTTPS /v1 -> private PostgreSQL/providers
            -> source-controlled renderers for structured CMS data
```

`src/lib/api/http-client.ts` maps generated contract shapes into client-owned display models and consistent customer-safe errors. Booking UI requests live availability, acquires an opaque hold, creates the booking, requests a server-created payment attempt, and navigates to the provider. The result page ignores redirect claims and polls with the opaque access token.

CMS strings are rendered through React text nodes and allowlisted components. The client has no `dangerouslySetInnerHTML`, runtime JSX/JavaScript evaluator, database code, payment SDK/secret, webhook, or admin source import. The mock adapter exists only for isolated tests.
