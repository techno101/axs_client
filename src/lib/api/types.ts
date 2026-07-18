import type { Booking, CreateBookingRequest, CreateHoldRequest, CreatePaymentAttemptRequest, CustomerDetails, FacilityFact, Hold, OnlinePaymentCapability, PaymentAttempt, PublicAvailabilityState, PublicBookingStatus } from "@/lib/api/contract/v1";

// UI-specific view models adapt the pinned admin-owned v1 contract artifact
// without moving booking authority into the public repository.
export type AvailabilityStatus = PublicAvailabilityState;

export type PaymentState = "pending" | "confirmed" | "failed" | "expired";

export type Field = {
  id: "FIELD_01" | "FIELD_02";
  slug: "field-one" | "field-two";
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
  id: "MORNING" | "EVENING";
  label: string;
  startsAt: string;
  endsAt: string;
  amountMinor: 60000 | 80000;
  currency: "MYR";
};

export type PublicConfigView = {
  blocks: BookingBlock[];
  onlinePayment: OnlinePaymentCapability;
};

export type AvailabilitySlot = {
  fieldId: Field["id"];
  blockId: BookingBlock["id"];
  status: AvailabilityStatus;
  publicMessage?: string;
};

export type PaymentResult = {
  reference: string;
  state: PaymentState;
  fieldName: string;
  blockLabel: string;
  bookingDate: string;
  amountMinor: number;
  currency: "MYR";
  lastCheckedAt: string;
};

export type Article = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  publishedLabel: string;
  image: string;
  imageAlt: string;
  body: Array<{ heading: string; paragraphs: string[] }>;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export interface PublicClient {
  getFields(): Promise<Field[]>;
  getField(slug: string): Promise<Field | null>;
  getConfig(): Promise<PublicConfigView>;
  getBlocks(): Promise<BookingBlock[]>;
  getAvailability(date: string): Promise<AvailabilitySlot[]>;
  createHold(input: CreateHoldRequest, idempotencyKey: string): Promise<Hold>;
  createBooking(input: CreateBookingRequest, idempotencyKey: string): Promise<Booking>;
  createPaymentAttempt(reference: string, input: CreatePaymentAttemptRequest, idempotencyKey: string): Promise<PaymentAttempt>;
  getBookingStatus(reference: string, accessToken: string): Promise<PublicBookingStatus>;
  findBooking(reference: string, phone: string): Promise<PublicBookingStatus>;
  getPaymentResult(reference: string): Promise<PaymentResult>;
  getArticles(): Promise<Article[]>;
  getArticle(slug: string): Promise<Article | null>;
  getFaqs(): Promise<FaqItem[]>;
}

export type { CustomerDetails, Hold, Booking, PaymentAttempt, PublicBookingStatus };
