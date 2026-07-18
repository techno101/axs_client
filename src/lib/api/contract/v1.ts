/*
 * PINNED CONTRACT ARTIFACT — copied from the admin-owned OpenAPI generator.
 * This is a static consumer representation, not an import from axs_admin.
 * Update only with: axs_admin npm run contract:publish-client -- <this file>
 */

/*
 * GENERATED FILE — do not edit manually.
 * Source: openapi/openapi.v1.json
 * Run: npm run contract:generate
 */

export const API_CONTRACT_VERSION = "1.3.0" as const;
export const API_CONTRACT_SHA256 = "eea87bb559dc98820c206fcf10c3fc8ebe57c155e5f3c31d371d8e6937885242" as const;
export const API_TIMEZONE = "Asia/Kuala_Lumpur" as const;

export interface ApiMeta { requestId: string; serverTime: string; timezone: "Asia/Kuala_Lumpur"; contractVersion: "1.3.0"; nextPage?: number | null; pageSize?: number; total?: number; }

export interface ApiError { code: "AUTHENTICATION_REQUIRED" | "PERMISSION_DENIED" | "CSRF_INVALID" | "RATE_LIMITED" | "VALIDATION_ERROR" | "NOT_FOUND" | "SLOT_UNAVAILABLE" | "HOLD_EXPIRED" | "IDEMPOTENCY_CONFLICT" | "BOOKING_STATE_INVALID" | "PAYMENT_PENDING" | "PAYMENT_ALREADY_CONFIRMED" | "STALE_WRITE" | "SERVICE_UNAVAILABLE" | "INTERNAL_ERROR"; message: string; fieldErrors?: { [key: string]: string; }; retryAfterSeconds?: number; }

export interface ErrorEnvelope { data: null; meta: ApiMeta; error: ApiError; }

export interface FacilityFact { label: string; value: string; }

export interface Field { id: "FIELD_01" | "FIELD_02"; slug: string; name: string; description: string; surface: string; facilityFacts: Array<FacilityFact>; imageUrl: string; imageAlt: string; features: Array<string>; }

export interface BookingBlock { code: "MORNING" | "EVENING"; label: string; startsAt: string; endsAt: string; amountMinor: 60000 | 80000; currency: "MYR"; }

export type PublicAvailabilityState = "available" | "held" | "booked" | "blocked" | "closed" | "past";

export interface AvailabilityEntry { fieldId: "FIELD_01" | "FIELD_02"; blockCode: "MORNING" | "EVENING"; state: PublicAvailabilityState; publicMessage?: string; }

export interface OnlinePaymentCapability { enabled: boolean; publicMessage?: string; }

export interface PublicConfig { timezone: "Asia/Kuala_Lumpur"; bookingWindowDays: 90; cutoffMinutes: 60; onlineHoldMinutes: 10; currency: "MYR"; blocks: Array<BookingBlock>; onlinePayment: OnlinePaymentCapability; }

export interface CreateHoldRequest { fieldId: "FIELD_01" | "FIELD_02"; blockCode: "MORNING" | "EVENING"; bookingDate: string; }

export interface Hold { token: string; expiresAt: string; fieldId: string; blockCode: string; bookingDate: string; amountMinor: number; currency: "MYR"; state: "active" | "expired" | "consumed" | "released"; }

export interface CustomerDetails { name: string; phone: string; email: string; teamName?: string; }

export interface CreateBookingRequest { holdToken: string; customer: CustomerDetails; }

export type BookingStatus = "payment_pending" | "confirmed" | "cancelled" | "expired" | "payment_failed" | "refund_pending" | "refunded";

export type PaymentStatus = "created" | "pending" | "paid" | "failed" | "expired" | "reversed" | "refund_pending" | "refunded";

export interface Booking { id: string; reference: string; fieldId: string; blockCode: string; bookingDate: string; amountMinor: number; currency: "MYR"; status: BookingStatus; paymentStatus: PaymentStatus; accessToken?: string; }

export interface CreatePaymentAttemptRequest { method: "online_provider"; returnPath?: string; }

export interface PaymentAttempt { id: string; bookingReference: string; state: PaymentStatus; redirectUrl?: string; }

export interface PublicBookingStatus { reference: string; fieldId: string; blockCode: string; bookingDate: string; amountMinor: number; currency: "MYR"; bookingStatus: BookingStatus; paymentStatus: PaymentStatus; }

export interface FindBookingRequest { reference: string; phone: string; }

export interface ContentBlock { type: "heading" | "paragraph" | "callout" | "list"; text: string; }

export interface Page { slug: string; title: string; blocks: Array<ContentBlock>; }

export interface ArticleSummary { slug: string; title: string; excerpt: string; publishedAt: string; }

export interface Article { slug: string; title: string; excerpt: string; publishedAt: string; blocks: Array<ContentBlock>; }

export interface Faq { id: string; question: string; answer: string; }

export type AdminRole = "owner" | "manager" | "counter_staff" | "content_editor" | "viewer";

export type AdminPermission = "bookings.read" | "bookings.write" | "bookings.cancel" | "counter.write" | "payments.read" | "payments.write" | "attendance.write" | "customers.read" | "cms.write" | "users.manage" | "roles.manage" | "audit.read" | "settings.manage" | "integrations.manage";

export interface AdminProfile { id: string; email: string; role: AdminRole; permissions: Array<AdminPermission>; }

export interface AdminLoginRequest { email: string; password: string; }

export interface AdminSession { actor: AdminProfile; expiresAt: string; }

export interface CsrfToken { token: string; }

export interface CounterCustomerDetails { name: string; phone: string; email?: string; teamName?: string; }

export interface ProofMetadata { objectKey: string; contentType: string; sha256: string; }

export interface CreateCounterBookingRequest { fieldId: "FIELD_01" | "FIELD_02"; blockCode: "MORNING" | "EVENING"; bookingDate: string; customer: CounterCustomerDetails; paymentMethod: "cash" | "manual_duitnow"; amountReceivedMinor?: number; manualReference?: string; proof?: ProofMetadata; verificationNote?: string; }

export interface ReasonRequest { reason: string; }

export interface RescheduleBookingRequest { fieldId: "FIELD_01" | "FIELD_02"; blockCode: "MORNING" | "EVENING"; bookingDate: string; reason: string; }

export interface CustomerCorrectionRequest { customer: CounterCustomerDetails; reason: string; }

export interface AttendanceRequest { status: "checked_in" | "no_show" | "check_in_reversed"; reason?: string; }

export interface ReceiptPrintRequest { reason?: string; }

export interface UpdateFieldPresentationRequest { name: string; description: string; surface: string; facilityFacts: Array<FacilityFact>; features: Array<string>; imageUrl: string; imageAlt: string; version: number; }

export interface CreateAvailabilityBlockRequest { fieldId: "FIELD_01" | "FIELD_02"; blockCode: "MORNING" | "EVENING"; bookingDate: string; reason: string; }

export interface SaveAdminUserRequest { email: string; displayName: string; role: AdminRole; active: boolean; password?: string; version?: number; }

export interface UpdateRolePermissionsRequest { permissions: Array<AdminPermission>; version: number; }

export interface UpdatePublicBookingSettingsRequest { message: string; version: number; }

export type PublicationStatus = "draft" | "published" | "archived";

export interface SavePageRequest { slug: string; title: string; blocks: Array<ContentBlock>; status: PublicationStatus; version?: number; }

export interface SaveArticleRequest { slug: string; title: string; excerpt: string; blocks: Array<ContentBlock>; status: PublicationStatus; version?: number; }

export interface SaveFaqRequest { question: string; answer: string; category: string; sortOrder: number; status: PublicationStatus; version?: number; }

export interface RegisterMediaRequest { objectKey: string; publicUrl: string; contentType: "image/jpeg" | "image/png" | "image/webp" | "image/avif"; byteSize: number; sha256: string; altText: string; }

export interface AdminBooking { id: string; reference: string; fieldId: string; blockCode: string; bookingDate: string; amountMinor: number; currency: string; status: BookingStatus; paymentStatus: PaymentStatus; attendanceStatus: "not_checked_in" | "checked_in" | "no_show" | "check_in_reversed"; }

export interface CounterSlot { fieldId: string; blockCode: string; bookingDate: string; state: "available" | "held_online" | "held_counter" | "confirmed" | "blocked"; booking?: AdminBooking; }

export interface AdminDashboard { businessDate: string; bookingCount: number; attentionCount: number; }

export interface Health { status: "ok"; service: string; contractVersion: "1.3.0"; }

export interface Readiness { status: "ready" | "not_ready"; database: "connected" | "not_configured" | "unavailable"; authoritative: boolean; }

export interface PublicConfigResponse { data: PublicConfig; meta: ApiMeta; error: null; }

export interface PublicFieldsResponse { data: Array<Field>; meta: ApiMeta; error: null; }

export interface PublicFieldResponse { data: Field; meta: ApiMeta; error: null; }

export interface PublicAvailabilityResponse { data: Array<AvailabilityEntry>; meta: ApiMeta; error: null; }

export interface HoldResponse { data: Hold; meta: ApiMeta; error: null; }

export interface BookingResponse { data: Booking; meta: ApiMeta; error: null; }

export interface PaymentAttemptResponse { data: PaymentAttempt; meta: ApiMeta; error: null; }

export interface PublicBookingStatusResponse { data: PublicBookingStatus; meta: ApiMeta; error: null; }

export interface LookupBookingResponse { data: PublicBookingStatus; meta: ApiMeta; error: null; }

export interface PageResponse { data: Page; meta: ApiMeta; error: null; }

export interface ArticleListResponse { data: Array<ArticleSummary>; meta: ApiMeta; error: null; }

export interface ArticleResponse { data: Article; meta: ApiMeta; error: null; }

export interface FaqListResponse { data: Array<Faq>; meta: ApiMeta; error: null; }

export interface AdminSessionResponse { data: AdminSession; meta: ApiMeta; error: null; }

export interface CsrfResponse { data: CsrfToken; meta: ApiMeta; error: null; }

export interface AdminDashboardResponse { data: AdminDashboard; meta: ApiMeta; error: null; }

export interface CounterResponse { data: Array<CounterSlot>; meta: ApiMeta; error: null; }

export interface AdminBookingListResponse { data: Array<AdminBooking>; meta: ApiMeta; error: null; }

export interface OperationData { operationId?: string; }

export interface OperationResponse { data: OperationData; meta: ApiMeta; error: null; }

export interface HealthResponse { data: Health; meta: ApiMeta; error: null; }

export interface ReadyResponse { data: Readiness; meta: ApiMeta; error: null; }
