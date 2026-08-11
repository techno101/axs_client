import type { ApiError, Article as ContractArticle, ArticleResponse, ArticleListResponse, AvailabilityDaySummary, Booking, BookingResponse, CreateBookingRequest, CreateHoldGroupRequest, CreateHoldRequest, CreateOrderRequest, CreatePaymentAttemptRequest, FaqListResponse, Hold, HoldGroup, HoldGroupResponse, HoldResponse, Order, OrderPaymentAttempt, OrderPaymentAttemptResponse, OrderResponse, PaymentAttempt, PaymentAttemptResponse, PublicAvailabilityResponse, PublicAvailabilitySummaryResponse, PublicBookingStatus, PublicBookingStatusResponse, PublicConfigResponse, PublicFieldsResponse, PublicOrderStatus, PublicOrderStatusResponse, SiteConfigResponse, VoucherValidation, VoucherValidationRequest, VoucherValidationResponse } from "@/lib/api/contract/v1";
import type { Article, AvailabilitySlot, BookingBlock, FaqItem, Field, GuestBookingLookup, PaymentResult, PublicClient, PublicConfigView, SiteConfigView } from "@/lib/api/types";
import { articles as localArticles, fields as localFields, images } from "@/lib/content";

type ErrorEnvelope = { data: null; error: ApiError };

export class PublicApiError extends Error {
  constructor(readonly status: number, readonly code: ApiError["code"], message: string, readonly fieldErrors?: Record<string, string>) { super(message); }
}

async function responseData<T>(response: Response): Promise<T> {
  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const error = payload && typeof payload === "object" && "error" in payload ? (payload as ErrorEnvelope).error : null;
    throw new PublicApiError(response.status, error?.code ?? "SERVICE_UNAVAILABLE", error?.message ?? "The booking service is temporarily unavailable.", error?.fieldErrors);
  }
  if (!payload || typeof payload !== "object" || !("data" in payload)) throw new PublicApiError(502, "SERVICE_UNAVAILABLE", "The booking service returned an invalid response.");
  return (payload as { data: T }).data;
}

function request(base: string, path: string, init?: RequestInit) { return fetch(`${base}${path}`, { ...init, headers: { Accept: "application/json", ...init?.headers }, cache: "no-store" }); }

function localImage(value: string | null | undefined, fallback: string) {
  return value?.startsWith("/") ? value : fallback;
}

function fieldView(field: PublicFieldsResponse["data"][number]): Field {
  const local = localFields.find((item) => item.id === field.id);
  return local ? { ...local, id: field.id, slug: field.slug, name: field.name, shortName: field.name, description: field.description, surface: field.surface, facilityFacts: field.facilityFacts, image: localImage(field.imageUrl, local.image), imageAlt: field.imageAlt || local.imageAlt, features: field.features } : { id: field.id, slug: field.slug, name: field.name, shortName: field.name, description: field.description, surface: field.surface, facilityFacts: field.facilityFacts, image: localImage(field.imageUrl, images.venueOverview), imageAlt: field.imageAlt || "ArmourX Sports football field", features: field.features };
}

function blockView(block: PublicConfigResponse["data"]["slots"][number]): BookingBlock { return { fieldId: block.fieldId, id: block.code, label: block.label, startsAt: block.startsAt, endsAt: block.endsAt, amountMinor: block.amountMinor, currency: block.currency, weekdays: block.weekdays }; }

function articleView(article: ContractArticle): Article {
  const local = localArticles.find((item) => item.slug === article.slug);
  const body: Article["body"] = [];
  for (const block of article.blocks) { if (block.type === "heading") body.push({ heading: block.text, paragraphs: [] }); else { if (!body.length) body.push({ heading: "Article", paragraphs: [] }); body.at(-1)!.paragraphs.push(block.text); } }
  return { slug: article.slug, category: "Field notes", title: article.title, excerpt: article.excerpt, readTime: `${Math.max(1, Math.ceil(article.blocks.reduce((total, block) => total + block.text.split(/\s+/).length, 0) / 200))} min read`, publishedLabel: new Date(article.publishedAt).toLocaleDateString("en-MY"), image: local?.image ?? images.articleChecklist, imageAlt: local?.imageAlt ?? "Football field", body };
}

export function createHttpPublicClient(base = "/api/axs"): PublicClient {
  return {
    async getFields() { return (await responseData<PublicFieldsResponse["data"]>(await request(base, "/v1/public/fields"))).map(fieldView); },
    async getField(slug) { const response = await request(base, `/v1/public/fields/${encodeURIComponent(slug)}`); if (response.status === 404) return null; return fieldView(await responseData<PublicFieldsResponse["data"][number]>(response)); },
    async getConfig(): Promise<PublicConfigView> { const config = await responseData<PublicConfigResponse["data"]>(await request(base, "/v1/public/config")); return { slots: config.slots.map(blockView), addons: config.addons, onlinePayment: config.onlinePayment }; },
    async getBlocks() { return (await this.getConfig()).slots; },
    async validateVoucher(input: VoucherValidationRequest): Promise<VoucherValidation | null> { const response = await request(base, "/v1/public/vouchers/validate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) }); if (response.status === 422) return null; return responseData<VoucherValidationResponse["data"]>(response); },
    async getAvailability(date) { return (await responseData<PublicAvailabilityResponse["data"]>(await request(base, `/v1/public/availability?date=${encodeURIComponent(date)}`))).map((entry): AvailabilitySlot => ({ fieldId: entry.fieldId, blockId: entry.blockCode, label: entry.label, startsAt: entry.startsAt, endsAt: entry.endsAt, amountMinor: entry.amountMinor, currency: entry.currency, status: entry.state, ...(entry.publicMessage ? { publicMessage: entry.publicMessage } : {}) })); },
    async getAvailabilitySummary(from, to): Promise<AvailabilityDaySummary[]> { return responseData<PublicAvailabilitySummaryResponse["data"]>(await request(base, `/v1/public/availability/summary?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`)); },
    async getSiteConfig(app = "client"): Promise<SiteConfigView> { return responseData<SiteConfigResponse["data"]>(await request(base, `/v1/public/site-config?app=${encodeURIComponent(app)}`)); },
    async createHold(input: CreateHoldRequest, key: string): Promise<Hold> { return responseData<HoldResponse["data"]>(await request(base, "/v1/public/holds", { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": key }, body: JSON.stringify(input) })); },
    async createHoldGroup(input: CreateHoldGroupRequest, key: string): Promise<HoldGroup> { return responseData<HoldGroupResponse["data"]>(await request(base, "/v1/public/hold-groups", { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": key }, body: JSON.stringify(input) })); },
    async createBooking(input: CreateBookingRequest, key: string): Promise<Booking> { return responseData<BookingResponse["data"]>(await request(base, "/v1/public/bookings", { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": key }, body: JSON.stringify(input) })); },
    async createOrder(input: CreateOrderRequest, key: string): Promise<Order> { return responseData<OrderResponse["data"]>(await request(base, "/v1/public/orders", { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": key }, body: JSON.stringify(input) })); },
    async createPaymentAttempt(reference: string, input: CreatePaymentAttemptRequest, key: string): Promise<PaymentAttempt> { return responseData<PaymentAttemptResponse["data"]>(await request(base, `/v1/public/bookings/${encodeURIComponent(reference)}/payment-attempts`, { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": key }, body: JSON.stringify(input) })); },
    async createOrderPaymentAttempt(reference: string, input: CreatePaymentAttemptRequest, key: string): Promise<OrderPaymentAttempt> { return responseData<OrderPaymentAttemptResponse["data"]>(await request(base, `/v1/public/orders/${encodeURIComponent(reference)}/payment-attempts`, { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": key }, body: JSON.stringify(input) })); },
    async getBookingStatus(reference: string, accessToken: string): Promise<PublicBookingStatus> { return responseData<PublicBookingStatusResponse["data"]>(await request(base, `/v1/public/bookings/${encodeURIComponent(reference)}/status`, { headers: { "X-Booking-Access-Token": accessToken } })); },
    async getOrderStatus(reference: string, accessToken: string): Promise<PublicOrderStatus> { return responseData<PublicOrderStatusResponse["data"]>(await request(base, `/v1/public/orders/${encodeURIComponent(reference)}/status`, { headers: { "X-Booking-Access-Token": accessToken } })); },
    async findBooking(reference: string): Promise<GuestBookingLookup> { return responseData<GuestBookingLookup>(await request(base, "/v1/public/bookings/find", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reference }) })); },
    async downloadGuestBooking(reference: string, lookupGrant: string): Promise<Blob> {
      const response = await request(base, `/v1/public/bookings/${encodeURIComponent(reference)}/download`, { headers: { "X-Booking-Lookup-Grant": lookupGrant } });
      if (!response.ok) await responseData<never>(response);
      return response.blob();
    },
    async getPaymentResult(reference) {
      if (typeof window === "undefined") throw new Error("Payment status requires the browser-held access token.");
      const token = window.sessionStorage.getItem(`axs:booking:${reference}`);
      if (!token) throw new PublicApiError(404, "NOT_FOUND", "This browser no longer has access to the booking status.");
      const status = await this.getBookingStatus(reference, token);
      const state: PaymentResult["state"] = status.bookingStatus === "confirmed" && status.paymentStatus === "paid" ? "confirmed" : status.bookingStatus === "expired" || status.paymentStatus === "expired" ? "expired" : status.bookingStatus === "payment_failed" || status.paymentStatus === "failed" ? "failed" : "pending";
      return { reference, state, fieldName: status.fieldId, blockLabel: status.blockCode, bookingDate: status.bookingDate, amountMinor: status.amountMinor, currency: "MYR", lastCheckedAt: new Date().toLocaleTimeString("en-MY") };
    },
    async getArticles() { const summaries = await responseData<ArticleListResponse["data"]>(await request(base, "/v1/public/articles")); const articles = await Promise.all(summaries.map(async (summary) => this.getArticle(summary.slug))); return articles.filter((article): article is Article => article !== null); },
    async getArticle(slug) { const response = await request(base, `/v1/public/articles/${encodeURIComponent(slug)}`); return response.status === 404 ? null : articleView(await responseData<ArticleResponse["data"]>(response)); },
    async getFaqs(): Promise<FaqItem[]> { return (await responseData<FaqListResponse["data"]>(await request(base, "/v1/public/faqs"))).map((faq) => ({ question: faq.question, answer: faq.answer })); },
  };
}

export const publicClient = { get current() { return createHttpPublicClient(); } };
