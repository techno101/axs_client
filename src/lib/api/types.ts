import type { AddonSelection, Booking, CreateBookingRequest, CreateHoldGroupRequest, CreateHoldRequest, CreateOrderRequest, CreatePaymentAttemptRequest, CustomerDetails, FacilityFact, Hold, HoldGroup, OnlinePaymentCapability, Order, OrderPaymentAttempt, PaymentAttempt, PublicAvailabilityState, PublicBookingStatus, PublicOrderStatus, VoucherValidation, VoucherValidationRequest } from "@/lib/api/contract/v1";

export type AvailabilityStatus = PublicAvailabilityState;
export type PaymentState = "pending" | "confirmed" | "failed" | "expired";

export type Field = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  description: string;
  surface: string;
  facilityFacts: FacilityFact[];
  image: string;
  imageAlt: string;
  features: string[];
};

export type BookingBlock = {
  fieldId: string;
  id: string;
  label: string;
  startsAt: string;
  endsAt: string;
  amountMinor: number;
  currency: "MYR";
  weekdays: number[];
};

export type PublicConfigView = { slots: BookingBlock[]; addons: PublicAddon[]; onlinePayment: OnlinePaymentCapability; };

export type PublicAddon = {
  id: string;
  code: string;
  name: string;
  description: string;
  amountMinor: number;
  currency: "MYR";
  kind: "service" | "product";
};

export type AvailabilitySlot = {
  fieldId: string;
  blockId: string;
  label?: string;
  startsAt?: string;
  endsAt?: string;
  amountMinor?: number;
  currency?: "MYR";
  status: AvailabilityStatus;
  publicMessage?: string;
};

export type AvailabilityDaySummary = {
  date: string;
  available: number;
  total: number;
};

export type AvailabilityDot = "full" | "partial" | "none" | "past";

export type SiteConfigAsset = { id: string; imageUrl: string; caption: string; mask: Record<string, unknown>; position: number };
export type SiteConfigSection = { id: string; section: string; title: string; enabled: boolean; position: number; config: Record<string, unknown>; assets: SiteConfigAsset[] };
export type SiteConfigView = { app: string; sections: SiteConfigSection[] };

/** Green = all slots free, yellow = some free, red = none free, grey = past. */
export function availabilityDotLevel(date: string, summary: AvailabilityDaySummary | undefined, businessDate: string): AvailabilityDot {
  if (date < businessDate) return "past";
  if (!summary || summary.total === 0 || summary.available === 0) return "none";
  if (summary.available === summary.total) return "full";
  return "partial";
}

export type PaymentResult = { reference: string; state: PaymentState; fieldName: string; blockLabel: string; bookingDate: string; amountMinor: number; currency: "MYR"; lastCheckedAt: string; bookingReferences?: string[]; guestEmailOmitted?: boolean; };
export type GuestBookingLookup = {
  booking: { reference: string; fieldName: string; blockLabel: string; bookingDate: string; startsAt: string; endsAt: string; amountMinor: number; currency: "MYR"; bookingStatus: string; paymentStatus: string; paymentMethod: string; receiptReference: string | null; customerName: string; customerPhone: string; };
  lookupGrant: string;
};
export type CustomerBooking = {
  reference: string; fieldName: string; blockLabel: string; bookingDate: string; startsAt: string; endsAt: string; amountMinor: number; currency: "MYR"; bookingStatus: string; paymentStatus: string; paymentMethod: string; receiptReference: string | null; timelineState: "upcoming" | "past" | "cancelled";
  contact: { name: string; phone: string; email?: string | null };
  reschedule: { eligible: boolean; deadline: string | null; reasonCode: "eligible" | "booking_not_confirmed" | "payment_not_paid" | "deadline_passed" };
};
export type Article = { slug: string; category: string; title: string; excerpt: string; readTime: string; publishedLabel: string; image: string; imageAlt: string; body: Array<{ heading: string; paragraphs: string[] }>; };
export type FaqItem = { question: string; answer: string; };

export interface PublicClient {
  getFields(): Promise<Field[]>;
  getField(slug: string): Promise<Field | null>;
  getConfig(): Promise<PublicConfigView>;
  getBlocks(): Promise<BookingBlock[]>;
  getAvailability(date: string): Promise<AvailabilitySlot[]>;
  getAvailabilitySummary(from: string, to: string): Promise<AvailabilityDaySummary[]>;
  getSiteConfig(app?: string): Promise<SiteConfigView>;
  validateVoucher(input: VoucherValidationRequest): Promise<VoucherValidation | null>;
  createHold(input: CreateHoldRequest, idempotencyKey: string): Promise<Hold>;
  createHoldGroup(input: CreateHoldGroupRequest, idempotencyKey: string): Promise<HoldGroup>;
  createBooking(input: CreateBookingRequest, idempotencyKey: string): Promise<Booking>;
  createOrder(input: CreateOrderRequest, idempotencyKey: string): Promise<Order>;
  createPaymentAttempt(reference: string, input: CreatePaymentAttemptRequest, idempotencyKey: string): Promise<PaymentAttempt>;
  createOrderPaymentAttempt(reference: string, input: CreatePaymentAttemptRequest, idempotencyKey: string): Promise<OrderPaymentAttempt>;
  getBookingStatus(reference: string, accessToken: string): Promise<PublicBookingStatus>;
  getOrderStatus(reference: string, accessToken: string): Promise<PublicOrderStatus>;
  findBooking(reference: string): Promise<GuestBookingLookup>;
  downloadGuestBooking(reference: string, lookupGrant: string): Promise<Blob>;
  getPaymentResult(reference: string): Promise<PaymentResult>;
  getArticles(): Promise<Article[]>;
  getArticle(slug: string): Promise<Article | null>;
  getFaqs(): Promise<FaqItem[]>;
}

export type { CustomerDetails, Hold, HoldGroup, Booking, Order, PaymentAttempt, OrderPaymentAttempt, PublicBookingStatus, PublicOrderStatus, AddonSelection, VoucherValidation, VoucherValidationRequest };