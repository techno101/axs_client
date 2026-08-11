import http from "node:http";

const port = Number(process.env.E2E_FIXTURE_ADMIN_PORT ?? 3000);
const meta = { requestId: "client-ui-fixture", serverTime: "2026-08-02T08:00:00.000Z", timezone: "Asia/Kuala_Lumpur" };

const fields = [
  { id: "FIELD_01", slug: "field-one", name: "Field 1", description: "A full-size football pitch at the ArmourX Sports venue in Sunway City.", surface: "Football pitch", facilityFacts: [{ label: "Size", value: "Full-size" }, { label: "Lighting", value: "Floodlit" }, { label: "Sessions", value: "Morning & evening" }], imageUrl: "/images/venue/field-one.webp", imageAlt: "A match in full flow on Field 1 at ArmourX Sports", features: ["Full-size pitch", "Floodlit", "Morning session", "Evening session"] },
  { id: "FIELD_02", slug: "field-two", name: "Field 2", description: "A full-size football pitch at the ArmourX Sports venue in Sunway City.", surface: "Football pitch", facilityFacts: [{ label: "Size", value: "Full-size" }, { label: "Lighting", value: "Floodlit" }, { label: "Sessions", value: "Morning & evening" }], imageUrl: "/images/venue/field-two.webp", imageAlt: "Players passing the ball on Field 2 at ArmourX Sports", features: ["Full-size pitch", "Floodlit", "Morning session", "Evening session"] },
];

const slots = fields.flatMap((field) => [
  { fieldId: field.id, code: "MORNING", label: "Morning session", startsAt: "09:00", endsAt: "15:00", amountMinor: 60000, currency: "MYR", weekdays: [0, 1, 2, 3, 4, 5, 6] },
  { fieldId: field.id, code: "EVENING", label: "Evening session", startsAt: "15:00", endsAt: "21:00", amountMinor: 80000, currency: "MYR", weekdays: [0, 1, 2, 3, 4, 5, 6] },
]);

const faqs = [
  { question: "Do I book by the hour?", answer: "No. Each booking is one complete six-hour morning or evening session." },
  { question: "Can I book without an account?", answer: "Yes. Guest booking is available, while an account keeps your history and receipts together." },
  { question: "When is my field confirmed?", answer: "Your booking is confirmed after payment is verified. The result page shows the current status." },
  { question: "Can I book both fields?", answer: "Yes. Add each available field session to your booking before checkout." },
];

const articles = [
  { slug: "morning-or-evening-block", title: "Morning or evening: choose your session", excerpt: "Compare the two six-hour sessions.", publishedAt: "2026-07-10T00:00:00.000Z", blocks: [{ type: "heading", text: "Choose the light" }, { type: "paragraph", text: "Morning runs from 09:00 to 15:00. Evening runs from 15:00 to 21:00 under the floodlights." }] },
];

function envelope(data, status = 200) {
  return { status, body: { data, meta, error: null } };
}

function error(code, message, status) {
  return { status, body: { data: null, meta, error: { code, message } } };
}

function route(method, url) {
  const path = url.pathname;
  if (method === "GET" && path === "/api/ready") return envelope({ status: "ready", fixture: true });
  if (method === "GET" && path === "/v1/public/fields") return envelope(fields);
  if (method === "GET" && path.startsWith("/v1/public/fields/")) {
    const slug = decodeURIComponent(path.slice("/v1/public/fields/".length));
    return fields.find((field) => field.slug === slug) ? envelope(fields.find((field) => field.slug === slug)) : error("NOT_FOUND", "Field not found.", 404);
  }
  if (method === "GET" && path === "/v1/public/config") return envelope({ timezone: "Asia/Kuala_Lumpur", bookingWindowDays: 90, cutoffMinutes: 60, onlineHoldMinutes: 10, currency: "MYR", slots, onlinePayment: { enabled: false, publicMessage: "Online booking will open again soon." } });
  if (method === "GET" && path === "/v1/public/availability") return envelope(slots.map((slot) => ({ fieldId: slot.fieldId, blockCode: slot.code, label: slot.label, startsAt: slot.startsAt, endsAt: slot.endsAt, amountMinor: slot.amountMinor, currency: slot.currency, state: "available" })));
  if (method === "GET" && path === "/v1/public/availability/summary") {
    const params = url.searchParams;
    const from = params.get("from") ?? "2030-01-01";
    const to = params.get("to") ?? "2030-01-31";
    const days = [];
    const cursor = new Date(`${from}T00:00:00.000Z`);
    const end = new Date(`${to}T00:00:00.000Z`);
    while (cursor <= end) {
      const date = cursor.toISOString().slice(0, 10);
      days.push({ date, available: slots.length, total: slots.length });
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
    return envelope(days);
  }
  if (method === "GET" && path === "/v1/public/site-config") return envelope({ app: "client", sections: [] });
  if (method === "GET" && path === "/v1/public/faqs") return envelope(faqs);
  if (method === "GET" && path === "/v1/public/articles") return envelope(articles.map((article) => ({ slug: article.slug, title: article.title, excerpt: article.excerpt, publishedAt: article.publishedAt })));
  if (method === "GET" && path.startsWith("/v1/public/articles/")) {
    const slug = decodeURIComponent(path.slice("/v1/public/articles/".length));
    const article = articles.find((item) => item.slug === slug);
    return article ? envelope(article) : error("NOT_FOUND", "Article not found.", 404);
  }
  if (method === "GET" && path === "/v1/customer/session") return error("UNAUTHORIZED", "Sign in required.", 401);
  return error("NOT_FOUND", "Fixture route not found.", 404);
}

const server = http.createServer((request, response) => {
  const result = route(request.method ?? "GET", new URL(request.url ?? "/", `http://127.0.0.1:${port}`));
  response.writeHead(result.status, { "Content-Type": "application/json", "Cache-Control": "no-store" });
  response.end(JSON.stringify(result.body));
});

server.listen(port, "127.0.0.1", () => process.stdout.write(`Fixture Admin listening on http://127.0.0.1:${port}\n`));
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => server.close(() => process.exit(0)));
