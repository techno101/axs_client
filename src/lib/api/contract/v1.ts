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

export const API_CONTRACT_VERSION = "1.12.0" as const;
export const API_CONTRACT_SHA256 = "cf7e1aa1d733a66d5556879b3fffaa3e3a25a2d1ebbe253144d85750b6e18f9b" as const;
export const API_TIMEZONE = "Asia/Kuala_Lumpur" as const;

export interface ApiMeta { requestId: string; serverTime: string; timezone: "Asia/Kuala_Lumpur"; contractVersion: "1.12.0"; nextPage?: number | null; pageSize?: number; total?: number; }

export interface ApiError { code: "AUTHENTICATION_REQUIRED" | "PERMISSION_DENIED" | "CSRF_INVALID" | "RATE_LIMITED" | "VALIDATION_ERROR" | "NOT_FOUND" | "SLOT_UNAVAILABLE" | "HOLD_EXPIRED" | "IDEMPOTENCY_CONFLICT" | "BOOKING_STATE_INVALID" | "PAYMENT_PENDING" | "PAYMENT_ALREADY_CONFIRMED" | "STALE_WRITE" | "SERVICE_UNAVAILABLE" | "INTERNAL_ERROR" | "POS_UPDATE_REQUIRED"; message: string; fieldErrors?: { [key: string]: string; }; retryAfterSeconds?: number; details?: { [key: string]: unknown; }; }

export interface ErrorEnvelope { data: null; meta: ApiMeta; error: ApiError; }

export interface OperationalEventResponse { data: OperationalEventMutationResult; meta: ApiMeta; error: null; }

export interface OperationalEventListResponse { data: Array<OperationalEvent>; meta: ApiMeta; error: null; }

export interface FacilityFact { label: string; value: string; }

export interface Field { id: string; slug: string; name: string; description: string; surface: string; facilityFacts: Array<FacilityFact>; imageUrl: string; imageAlt: string; features: Array<string>; }

export interface ScheduledSlot { fieldId: string; code: string; label: string; startsAt: string; endsAt: string; amountMinor: number; currency: "MYR"; weekdays: Array<number>; }

export type PublicAvailabilityState = "available" | "held" | "booked" | "blocked" | "closed" | "past";

export interface AvailabilityEntry { fieldId: string; fieldName: string; fieldImageUrl?: string; blockCode: string; label: string; startsAt: string; endsAt: string; amountMinor: number; currency: "MYR"; state: PublicAvailabilityState; publicMessage?: string; }

export interface OnlinePaymentCapability { enabled: boolean; publicMessage?: string; }

export interface PublicConfig { timezone: "Asia/Kuala_Lumpur"; bookingWindowDays: 90; cutoffMinutes: 60; onlineHoldMinutes: 10; currency: "MYR"; slots: Array<ScheduledSlot>; onlinePayment: OnlinePaymentCapability; }

export interface CreateHoldRequest { fieldId: string; blockCode: string; bookingDate: string; }

export interface CreateCounterHoldRequest { fieldId: string; blockCode: string; bookingDate: string; reason: string; }

export interface Hold { token: string; expiresAt: string; fieldId: string; blockCode: string; bookingDate: string; amountMinor: number; currency: "MYR"; state: "active" | "expired" | "consumed" | "released"; }

export interface RequestedOccurrence { fieldId: string; blockCode: string; bookingDate: string; }

export interface HeldOccurrence { fieldId: string; blockCode: string; bookingDate: string; amountMinor: number; currency: "MYR"; }

export interface CreateHoldGroupRequest { occurrences: Array<RequestedOccurrence>; }

export interface HoldGroup { token: string; expiresAt: string; occurrences: Array<HeldOccurrence>; state: "active" | "expired" | "consumed" | "released"; }

export interface CustomerDetails { name: string; phone: string; email: string; teamName?: string; }

export interface CreateBookingRequest { holdToken: string; customer: CustomerDetails; }

export interface CreateOrderRequest { holdToken: string; customer: CustomerDetails; }

export type BookingStatus = "payment_pending" | "confirmed" | "cancelled" | "expired" | "payment_failed" | "refund_pending" | "refunded";

export type PaymentStatus = "created" | "pending" | "paid" | "failed" | "expired" | "reversed" | "refund_pending" | "refunded";

export interface Booking { id: string; reference: string; fieldId: string; blockCode: string; bookingDate: string; amountMinor: number; currency: "MYR"; status: BookingStatus; paymentStatus: PaymentStatus; accessToken?: string; }

export interface CreatePaymentAttemptRequest { method: "online_provider"; returnPath?: string; }

export interface PaymentAttempt { id: string; bookingReference: string; state: PaymentStatus; redirectUrl?: string; }

export interface OrderOccurrence { id: string; fieldId: string; blockCode: string; bookingDate: string; fieldName: string; label: string; startsAt: string; endsAt: string; amountMinor: number; currency: "MYR"; status: BookingStatus; }

export interface Order { id: string; reference: string; totalAmountMinor: number; currency: "MYR"; status: BookingStatus; paymentStatus: PaymentStatus; occurrences: Array<OrderOccurrence>; accessToken?: string; }

export interface PublicOrderStatus { reference: string; totalAmountMinor: number; currency: "MYR"; status: BookingStatus; paymentStatus: PaymentStatus; occurrences: Array<OrderOccurrence>; }

export interface OrderPaymentAttempt { id: string; bookingReference?: string; orderReference: string; state: PaymentStatus; redirectUrl?: string; }

export interface PublicBookingStatus { reference: string; fieldId: string; blockCode: string; bookingDate: string; amountMinor: number; currency: "MYR"; bookingStatus: BookingStatus; paymentStatus: PaymentStatus; }

export interface FindBookingRequest { reference: string; phone: string; }

export interface ContentBlock { type: "heading" | "paragraph" | "callout" | "list"; text: string; }

export interface Page { slug: string; title: string; blocks: Array<ContentBlock>; }

export interface ArticleSummary { slug: string; title: string; excerpt: string; publishedAt: string; }

export interface Article { slug: string; title: string; excerpt: string; publishedAt: string; blocks: Array<ContentBlock>; }

export interface Faq { id: string; question: string; answer: string; }

export type AdminRole = "superadmin" | "admin" | "operations" | "editor_developer";

export type AdminPermission = "bookings.read" | "bookings.write" | "bookings.cancel" | "counter.write" | "payments.read" | "payments.write" | "attendance.write" | "customers.read" | "cms.write" | "users.manage" | "roles.manage" | "audit.read" | "settings.manage" | "integrations.manage" | "fields.manage" | "schedules.manage" | "catalog.manage" | "applications.read" | "logs.read" | "logs.manage" | "pos.manage";

export interface AdminProfile { id: string; username: string; displayName: string; role: AdminRole; permissions: Array<AdminPermission>; }

export interface AdminLoginRequest { username: string; password: string; }

export interface StaffAccessRequest { id: string; email: string; displayName: string; status: "pending" | "approved" | "rejected"; requestedAt: string; reviewedAt: string | null; role: "admin" | "operations" | "editor_developer" | null; }

export interface StaffAccessDecisionRequest { decision: "approve" | "reject"; role?: "admin" | "operations" | "editor_developer"; }

export interface AdminSession { actor: AdminProfile; expiresAt: string; }

export interface CsrfToken { token: string; }

export interface CounterCustomerDetails { name: string; phone: string; email?: string; teamName?: string; }

export interface ProofMetadata { objectKey: string; contentType: string; sha256: string; }

export interface CreateCounterBookingRequest { fieldId: string; blockCode: string; bookingDate: string; customer: CounterCustomerDetails; paymentMethod: "cash" | "manual_duitnow"; amountReceivedMinor?: number; manualReference?: string; proof?: ProofMetadata; verificationNote?: string; }

export interface ReasonRequest { reason: string; }

export interface PosDeviceMetadata { computerName?: string; osVersion?: string; architecture?: string; ipAddresses: Array<string>; macAddresses: Array<string>; }

export interface PosPairRequest { code: string; name: string; deviceMetadata: PosDeviceMetadata; }

export interface PosDevice { id: string; name: string; status: "pending" | "approved" | "paused" | "revoked"; platform: "windows"; pairedAt: string; approvedAt?: string | null; lastSeenAt?: string | null; deviceDetails: PosDeviceMetadata; appVersion?: string | null; hardwareSummary?: PosHardwareSummary; }

export interface PosPairingCode { code: string; expiresAt: string; }

export interface PosDeviceStatusUpdateRequest { status: "approved" | "paused" | "revoked"; }

export interface PosDeviceStatus { deviceId: string; name: string; status: "pending" | "approved" | "paused" | "revoked"; canLogin: boolean; serverTime: string; appVersion: string | null; updatePolicy: PosUpdatePolicy; }

export interface SafeTechnicalDetails { errorName?: string; safeMessage?: string; causeCode?: string; operation?: string; retryable?: boolean; retryAfterSeconds?: number; state?: string; attempt?: number; provider?: string; environment?: string; }

export interface OperationalEventReportRequest { severity?: "debug" | "info" | "warning" | "error" | "critical" | "security"; category: string; errorCode: string; summary: string; technicalDetails?: SafeTechnicalDetails; routeOrScreen?: string; httpMethod?: string; httpStatus?: number; correlationId?: string; traceId?: string; releaseVersion?: string; bookingReference?: string; paymentReference?: string; }

export interface OperationalEvent { id: string; sourceApplication: string; environment: "development" | "test" | "production"; severity: string; category: string; errorCode: string; summary: string; technicalDetails?: SafeTechnicalDetails; routeOrScreen?: string; httpMethod?: string; httpStatus?: number; correlationId?: string; traceId?: string; releaseVersion?: string; posDeviceId?: string; bookingReference?: string; paymentReference?: string; firstSeenAt: string; lastSeenAt: string; occurrenceCount: number; resolutionState: "unresolved" | "acknowledged" | "resolved"; resolutionNotes?: string; }

export interface OperationalEventMutationResult { id: string; aggregated?: boolean; state?: "acknowledged" | "resolved"; }

export interface OperationalEventActionRequest { notes?: string; }

export interface PosPairResult { device: PosDevice; deviceSecret: string; }

export interface PosStaff { id: string; username: string; displayName: string; role: "cashier" | "accounts"; }

export interface PosLoginRequest { username: string; pin: string; openingFloatMinor?: number; }

export interface PosStaffSession { id: string; token: string; expiresAt: string; }

export interface PosCounterSession { id: string; localDate: string; }

export interface PosCatalogItem { id: string; code: string; name: string; description: string; amountMinor: number; currency: "MYR"; kind: "service" | "product"; }

export interface PosCatalog { deviceId: string; items: Array<PosCatalogItem>; }

export interface PosAvailability { deviceId: string; bookingDate: string; slots: Array<AvailabilityEntry>; }

export interface PosCartLineRequest { catalogItemId: string; quantity: number; }

export interface PosSaleLine { catalogItemId: string; code: string; name: string; quantity: number; unitAmountMinor: number; lineTotalMinor: number; }

export interface PosSaleRequest { lines: Array<PosCartLineRequest>; customer?: CounterCustomerDetails; paymentMethod: "cash" | "manual_duitnow" | "manual_bank_transfer"; amountReceivedMinor?: number; manualReference?: string; evidenceNote?: string; }

export interface PosSale { id: string; receiptReference: string; counterSessionId: string; paymentMethod: "cash" | "manual_duitnow" | "manual_bank_transfer"; amountMinor: number; changeMinor?: number; lines: Array<PosSaleLine>; }

export interface PosReceiptEmailRequest { email: string; }

export interface PosReceiptEmailQueued { status: "queued"; recipient: string; notificationId: string; saleId: string; receiptReference: string; }

export interface PosVoidSaleRequest { reason: string; }

export interface PosRefundSaleRequest { amountMinor: number; paymentMethod: "cash" | "manual_duitnow" | "manual_bank_transfer"; manualReference?: string; evidenceNote?: string; reason: string; }

export interface PosSaleCorrection { id: string; receiptReference: string; status: "voided" | "partially_refunded" | "refunded"; refundId?: string; remainingAmountMinor?: number; }

export interface PosCounterHoldRequest { fieldId: string; blockCode: string; bookingDate: string; reason: string; }

export interface PosReleaseHoldRequest { reason: string; }

export interface PosTenderCorrectionRequest { paymentMethod: "cash" | "manual_duitnow" | "manual_bank_transfer"; manualReference?: string; evidenceNote?: string; reason: string; }

export interface PosTenderCorrection { id: string; receiptReference: string; revisionNumber: number; paymentMethod: "cash" | "manual_duitnow" | "manual_bank_transfer"; }

export interface PosCashMovementRequest { movementType: "cash_in" | "cash_out"; amountMinor: number; reason: string; }

export interface PosCashMovement { id: string; movementType: "cash_in" | "cash_out"; amountMinor: number; }

export interface PosLockResult { locked: true; }

export interface PosClockOutResult { clockedOut: true; }

export interface PosCloseRequest { countedCashMinor: number; reason?: string; }

export interface PosOversightUnlockRequest { pin: string; }

export interface PosOversightUnlock { token: string; expiresAt: string; }

export interface PosToday { localDate: string; session: { id?: string; status?: "open" | "closed"; openingFloatMinor?: number; saleCount?: number; salesTotalMinor?: number; } | { id?: string; status?: "open" | "closed"; openingFloatMinor?: number; saleCount?: number; salesTotalMinor?: number; }; }

export interface PosHistory { localDate: string; sessions: Array<{ id?: string; localDate?: string; status?: "open" | "closed"; openingFloatMinor?: number; saleCount?: number; salesTotalMinor?: number; expectedCashMinor?: number | null; countedCashMinor?: number | null; varianceMinor?: number | null; }>; }

export interface PosCloseReport { id: string; reportId: string; localDate: string; openingFloatMinor: number; expectedCashMinor: number; countedCashMinor: number; varianceMinor: number; eodSummary: { [key: string]: string; }; shiftSummary: { [key: string]: string; }; }

export interface ConfigurationBundleExport { filename: string; bundleBase64: string; manifestChecksum: string; summary: { [key: string]: number; }; }

export interface ConfigurationBundleImportRequest { bundleBase64: string; mode: "dry_run" | "apply"; }

export interface ConfigurationBundleImport { mode: "dry_run" | "apply"; manifestChecksum: string; summary: { [key: string]: number; }; applied: boolean; }

export interface RescheduleBookingRequest { fieldId: string; blockCode: string; bookingDate: string; reason: string; }

export interface CustomerCorrectionRequest { customer: CounterCustomerDetails; reason: string; }

export interface AttendanceRequest { status: "checked_in" | "no_show" | "check_in_reversed"; reason?: string; }

export interface ReceiptPrintRequest { reason?: string; }

export interface UpdateFieldPresentationRequest { name: string; description: string; surface: string; facilityFacts: Array<FacilityFact>; features: Array<string>; imageUrl?: string; imageAssetId?: string; imageAlt: string; version: number; }

export interface CreateFieldRequest { slug: string; name: string; description: string; surface: string; facilityFacts: Array<FacilityFact>; features: Array<string>; imageUrl?: string; imageAssetId?: string; imageAlt: string; }

export interface ArchiveRequest { reason: string; version: number; }

export interface SaveScheduleTemplateRequest { fieldId: string; code: string; label: string; weekdays: Array<number>; startsAt: string; endsAt: string; amountMinor: number; active: boolean; version?: number; }

export interface CreateAvailabilityBlockRequest { fieldId: string; blockCode: string; bookingDate: string; mode?: "closed" | "open"; label?: string; startsAt?: string; endsAt?: string; amountMinor?: number; reason: string; }

export interface SaveScheduleOverrideRequest { fieldId: string; blockCode: string; bookingDate: string; mode: "closed" | "open"; label?: string; startsAt?: string; endsAt?: string; amountMinor?: number; reason: string; version: number; }

export interface SaveCatalogItemRequest { kind: "service" | "product"; name: string; description: string; amountMinor: number; active: boolean; onlineCheckoutEnabled: boolean; counterEnabled: boolean; sortOrder: number; version?: number; }

export interface SaveAdminUserRequest { username: string; displayName: string; role: AdminRole; active: boolean; password?: string; version?: number; }

export interface PosOperator { id: string; username: string; displayName: string; role: "cashier" | "accounts"; active: boolean; version: number; }

export interface SavePosOperatorRequest { username: string; displayName: string; role: "cashier" | "accounts"; pin?: string; active: boolean; version?: number; }

export interface PosOversightPinRequest { pin: string; }

export interface PosOversightPinStatus { configured: boolean; version: number; }

export interface UpdateRolePermissionsRequest { permissions: Array<AdminPermission>; version: number; }

export interface UpdatePublicBookingSettingsRequest { message: string; version: number; }

export interface UpdateCounterManualPaymentRequest { duitNowLabel: string; duitNowInstructions: string; bankTransferLabel: string; bankTransferInstructions: string; version: number; }

export type PublicationStatus = "draft" | "published" | "archived";

export interface SavePageRequest { slug: string; title: string; blocks: Array<ContentBlock>; status: PublicationStatus; version?: number; }

export interface SaveArticleRequest { slug: string; title: string; excerpt: string; blocks: Array<ContentBlock>; status: PublicationStatus; version?: number; }

export interface SaveFaqRequest { question: string; answer: string; category: string; sortOrder: number; status: PublicationStatus; version?: number; }

export interface RegisterMediaRequest { objectKey: string; publicUrl: string; contentType: "image/jpeg" | "image/png" | "image/webp" | "image/avif"; byteSize: number; sha256: string; altText: string; }

export interface MediaAsset { id: string; objectKey?: string; publicUrl: string; contentType: "image/jpeg" | "image/png" | "image/webp" | "image/avif"; byteSize: number; sha256: string; altText: string; status: "approved"; }

export interface AdminBooking { id: string; reference: string; fieldId: string; blockCode: string; bookingDate: string; amountMinor: number; currency: string; status: BookingStatus; paymentStatus: PaymentStatus; attendanceStatus: "not_checked_in" | "checked_in" | "no_show" | "check_in_reversed"; }

export interface CounterSlot { fieldId: string; blockCode: string; bookingDate: string; state: "available" | "held_online" | "held_counter" | "confirmed" | "blocked"; booking?: AdminBooking; }

export interface AdminDashboard { businessDate: string; bookingCount: number; attentionCount: number; }

export interface Health { status: "ok"; service: string; contractVersion: "1.12.0"; }

export interface Readiness { status: "ready" | "not_ready"; database: "connected" | "not_configured" | "unavailable"; authoritative: boolean; }

export interface PublicConfigResponse { data: PublicConfig; meta: ApiMeta; error: null; }

export interface PublicFieldsResponse { data: Array<Field>; meta: ApiMeta; error: null; }

export interface PublicFieldResponse { data: Field; meta: ApiMeta; error: null; }

export interface PublicAvailabilityResponse { data: Array<AvailabilityEntry>; meta: ApiMeta; error: null; }

export interface HoldResponse { data: Hold; meta: ApiMeta; error: null; }

export interface HoldGroupResponse { data: HoldGroup; meta: ApiMeta; error: null; }

export interface BookingResponse { data: Booking; meta: ApiMeta; error: null; }

export interface OrderResponse { data: Order; meta: ApiMeta; error: null; }

export interface PaymentAttemptResponse { data: PaymentAttempt; meta: ApiMeta; error: null; }

export interface OrderPaymentAttemptResponse { data: OrderPaymentAttempt; meta: ApiMeta; error: null; }

export interface PublicBookingStatusResponse { data: PublicBookingStatus; meta: ApiMeta; error: null; }

export interface PublicOrderStatusResponse { data: PublicOrderStatus; meta: ApiMeta; error: null; }

export interface LookupBookingResponse { data: PublicBookingStatus; meta: ApiMeta; error: null; }

export interface PageResponse { data: Page; meta: ApiMeta; error: null; }

export interface ArticleListResponse { data: Array<ArticleSummary>; meta: ApiMeta; error: null; }

export interface ArticleResponse { data: Article; meta: ApiMeta; error: null; }

export interface FaqListResponse { data: Array<Faq>; meta: ApiMeta; error: null; }

export interface PosPairResponse { data: PosPairResult; meta: ApiMeta; error: null; }

export interface PosPairingCodeResponse { data: PosPairingCode; meta: ApiMeta; error: null; }

export interface PosDeviceResponse { data: PosDevice; meta: ApiMeta; error: null; }

export interface PosDeviceListResponse { data: Array<PosDevice>; meta: ApiMeta; error: null; }

export interface PosDeviceStatusResponse { data: PosDeviceStatus; meta: ApiMeta; error: null; }

export interface PosCatalogResponse { data: PosCatalog; meta: ApiMeta; error: null; }

export interface PosAvailabilityResponse { data: PosAvailability; meta: ApiMeta; error: null; }

export interface PosLoginResult { staff: PosStaff; counterSession: PosCounterSession; posSession: PosStaffSession; }

export interface PosLoginResponse { data: PosLoginResult; meta: ApiMeta; error: null; }

export interface PosTenderCorrectionResponse { data: PosTenderCorrection; meta: ApiMeta; error: null; }

export interface PosCashMovementResponse { data: PosCashMovement; meta: ApiMeta; error: null; }

export interface PosLockResponse { data: PosLockResult; meta: ApiMeta; error: null; }

export interface PosClockOutResponse { data: PosClockOutResult; meta: ApiMeta; error: null; }

export interface PosTodayResponse { data: PosToday; meta: ApiMeta; error: null; }

export interface PosOversightUnlockResponse { data: PosOversightUnlock; meta: ApiMeta; error: null; }

export interface PosHistoryResponse { data: PosHistory; meta: ApiMeta; error: null; }

export interface PosOperatorResponse { data: PosOperator; meta: ApiMeta; error: null; }

export interface PosOperatorListResponse { data: Array<PosOperator>; meta: ApiMeta; error: null; }

export interface PosOversightPinStatusResponse { data: PosOversightPinStatus; meta: ApiMeta; error: null; }

export interface ConfigurationBundleExportResponse { data: ConfigurationBundleExport; meta: ApiMeta; error: null; }

export interface ConfigurationBundleImportResponse { data: ConfigurationBundleImport; meta: ApiMeta; error: null; }

export interface PosSaleResponse { data: PosSale; meta: ApiMeta; error: null; }

export interface PosReceiptEmailResponse { data: PosReceiptEmailQueued; meta: ApiMeta; error: null; }

export interface StaffAccessRequestListResponse { data: Array<StaffAccessRequest>; meta: ApiMeta; error: null; }

export interface MediaAssetResponse { data: MediaAsset; meta: ApiMeta; error: null; }

export interface PosSaleCorrectionResponse { data: PosSaleCorrection; meta: ApiMeta; error: null; }

export interface PosCloseResponse { data: PosCloseReport; meta: ApiMeta; error: null; }

export interface AdminSessionResponse { data: AdminSession; meta: ApiMeta; error: null; }

export interface CsrfResponse { data: CsrfToken; meta: ApiMeta; error: null; }

export interface AdminDashboardResponse { data: AdminDashboard; meta: ApiMeta; error: null; }

export interface CounterResponse { data: Array<CounterSlot>; meta: ApiMeta; error: null; }

export interface AdminBookingListResponse { data: Array<AdminBooking>; meta: ApiMeta; error: null; }

export interface OperationData { operationId?: string; [key: string]: unknown; }

export interface OperationResponse { data: OperationData; meta: ApiMeta; error: null; }

export interface HealthResponse { data: Health; meta: ApiMeta; error: null; }

export interface ReadyResponse { data: Readiness; meta: ApiMeta; error: null; }

export interface PosUpdatePolicy { latestVersion: string; minimumSupportedVersion: string; mode: "optional" | "recommended" | "mandatory"; enforcedAt: string | null; releaseNotes: string; enabled: boolean; updateRequired: boolean; }

export interface PosHardwareCapability { kind: "receipt_printer" | "cash_drawer" | "customer_display"; state: "ready" | "not_configured" | "manual_required" | "unavailable"; profile?: "windows_driver" | "escpos" | "manual" | "serial_text" | "none"; name?: string; }

export interface PosHardwareSummary { receiptPrinter?: PosHardwareCapability; cashDrawer?: PosHardwareCapability; customerDisplay?: PosHardwareCapability; }

export interface NotificationDeliveryState { notificationId: string; state: "queued" | "processing" | "sent" | "failed"; attemptCount: number; nextAttemptAt?: string | null; providerMessageId?: string | null; sentAt?: string | null; failedAt?: string | null; failureCode?: string | null; }

export interface SecurityEvent { id: string; event_type: string; severity: "info" | "warning" | "critical"; ip_address?: string | null; identifier?: string | null; occurred_at: string; [key: string]: unknown; }

export interface AdminIpBlock { id: string; ip_address: string; state: "temporary" | "permanent" | "released" | "expired"; failure_count: number; blocked_until?: string | null; created_at: string; [key: string]: unknown; }

export interface IpBlockDecisionRequest { action: "release" | "make_permanent"; reason: string; }

export interface DataExportRequest { categories: Array<"bookings" | "sales" | "payments" | "receipts" | "notifications" | "staff_access" | "audit_logs" | "security_logs" | "system_logs">; from?: string; to?: string; purpose: string; }

export interface DataExport { id: string; sha256: string; byte_size: number; created_at: string; [key: string]: unknown; }

export interface LogPurgeRequest { categories: Array<"audit_logs" | "security_logs" | "system_logs">; reason: string; confirmation: "PURGE ELIGIBLE LOGS"; }

export interface LogPurgeLedgerEntry { id: string; cutoff_at: string; categories: Array<string>; row_counts: { [key: string]: number; }; export_sha256: string; created_at: string; [key: string]: unknown; }

export interface SecurityEventListResponse { data: Array<SecurityEvent>; meta: ApiMeta; error: null; }

export interface AdminIpBlockListResponse { data: Array<AdminIpBlock>; meta: ApiMeta; error: null; }

export interface DataExportResponse { data: DataExport; meta: ApiMeta; error: null; }

export interface DataExportListResponse { data: Array<DataExport>; meta: ApiMeta; error: null; }

export interface LogPurgeResponse { data: LogPurgeLedgerEntry; meta: ApiMeta; error: null; }

export interface LogPurgeListResponse { data: Array<LogPurgeLedgerEntry>; meta: ApiMeta; error: null; }

export interface PosUpdatePolicyAdmin { latestVersion: string; minimumSupportedVersion: string; mode: "optional" | "recommended" | "mandatory"; enforcedAt: string | null; releaseNotes: string; enabled: boolean; updateRequired?: boolean; version: number; updatedAt: string; }

export interface PosUpdatePolicySaveRequest { latestVersion: string; minimumSupportedVersion: string; mode: "optional" | "recommended" | "mandatory"; enforcedAt?: string | null; releaseNotes: string; enabled: boolean; version: number; }

export interface PosUpdatePolicyAdminResponse { data: PosUpdatePolicyAdmin; meta: ApiMeta; error: null; }
