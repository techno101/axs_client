"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { CustomerApiError, customerApi, postCustomer, type CustomerAccount, type CustomerSessionView } from "@/lib/customer-api";
import { createHttpPublicClient } from "@/lib/api/http-client";
import { formatTimePair12 } from "@/lib/format";
import type { CustomerBooking } from "@/lib/api/types";

type Notice = { tone: "error" | "success" | "info"; text: string } | null;
const serviceMessage = "Service temporarily unavailable. We're really sorry about this — please try again in a moment, or email armourxsports@gmail.com.";

function messageFor(error: unknown): Notice {
  if (error instanceof CustomerApiError) return { tone: "error", text: error.code === "SERVICE_UNAVAILABLE" ? serviceMessage : error.message };
  return { tone: "error", text: serviceMessage };
}

function AccountShell({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section className="customer-page">
      <div className="shell customer-page__grid">
        <aside>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>Guest booking works without an account. Sign up to track your bookings, download receipts, and keep your history in one place.</p>
          <Link href="/book" className="customer-text-link">Book as guest</Link>
        </aside>
        <div className="customer-card">{children}</div>
      </div>
    </section>
  );
}

function DashboardShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="customer-dashboard">
      <div className="shell customer-dashboard__grid">
        <aside className="customer-dashboard__sidebar">
          <p className="eyebrow">Your account</p>
          <AccountNavigation />
        </aside>
        <div className="customer-dashboard__main">
          <h1>{title}</h1>
          <div className="customer-dashboard__content">{children}</div>
        </div>
      </div>
    </section>
  );
}

function NoticeBox({ notice }: { notice: Notice }) { return notice ? <p className={`customer-notice customer-notice--${notice.tone}`} role={notice.tone === "error" ? "alert" : "status"}>{notice.text}</p> : null; }

/** Official Google four-color "G" mark for the OAuth buttons. */
function GoogleGlyph() {
  return (
    <svg viewBox="0 0 48 48" width="18" height="18" aria-hidden="true" focusable="false" className="google-glyph">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

function GoogleButton({ label, onClick, disabled }: { label: string; onClick: () => void; disabled?: boolean }) {
  return <button className="customer-secondary customer-secondary--google" type="button" onClick={onClick} disabled={disabled}><GoogleGlyph />{label}</button>;
}

function profilePayload(form: HTMLFormElement) {
  const values = new FormData(form);
  return { displayName: String(values.get("displayName") ?? ""), phone: String(values.get("phone") ?? ""), age: Number(values.get("age")) };
}

export function SignUpForm() {
  const [notice, setNotice] = useState<Notice>(null);
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setNotice(null);
    const form = event.currentTarget; const values = new FormData(form);
    try { const result = await postCustomer<{ deliveryAvailable?: boolean }>("register", { ...profilePayload(form), email: String(values.get("email") ?? ""), password: String(values.get("password") ?? "") }); window.location.assign(result.deliveryAvailable === false ? "/verify-email?state=unavailable" : "/verify-email?state=pending"); }
    catch (error) { setNotice(messageFor(error)); } finally { setBusy(false); }
  }
  async function google() {
    setBusy(true); setNotice(null);
    try { const result = await postCustomer<{ authorizationUrl: string }>("google/start"); window.location.assign(result.authorizationUrl); }
    catch (error) { setNotice(messageFor(error)); } finally { setBusy(false); }
  }
  return <AccountShell eyebrow="Customer account" title="Create your account"><NoticeBox notice={notice}/><form className="customer-form" onSubmit={submit} noValidate><label>Name<input name="displayName" autoComplete="name" required minLength={2} maxLength={120}/></label><label>Email<input name="email" type="email" autoComplete="email" required maxLength={254}/></label><label>Phone<input name="phone" type="tel" autoComplete="tel" required inputMode="tel" placeholder="+60…"/></label><label>Age<input name="age" type="number" min="1" max="120" required inputMode="numeric"/></label><label className="customer-form__wide">Passphrase<input name="password" type="password" autoComplete="new-password" required minLength={12} maxLength={128}/><small>Use 12–128 characters. No forced composition rules.</small></label><button className="customer-submit customer-form__wide" disabled={busy}>{busy ? "Please wait" : "Create account"}</button></form><div className="customer-divider"><span>or</span></div><GoogleButton label="Continue with Google" onClick={google} disabled={busy} /><p className="customer-help">Already have an account? <Link href="/sign-in">Sign in</Link></p></AccountShell>;
}

export function SignInForm() {
  const [notice, setNotice] = useState<Notice>(null); const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setBusy(true); setNotice(null); const values = new FormData(event.currentTarget); try { const result = await postCustomer<{ suspended: boolean; session?: CustomerSessionView }>("login", { email: String(values.get("email") ?? ""), password: String(values.get("password") ?? "") }); if (result.suspended) setNotice({ tone: "error", text: "This account is suspended. Contact ArmourXSports if you need help." }); else window.location.assign("/account"); } catch (error) { setNotice(messageFor(error)); } finally { setBusy(false); } }
  async function google() { setBusy(true); setNotice(null); try { const result = await postCustomer<{ authorizationUrl: string }>("google/start"); window.location.assign(result.authorizationUrl); } catch (error) { setNotice(messageFor(error)); } finally { setBusy(false); } }
  return <AccountShell eyebrow="Customer account" title="Welcome back"><NoticeBox notice={notice}/><form className="customer-form" onSubmit={submit} noValidate><label className="customer-form__wide">Email<input name="email" type="email" autoComplete="email" required/></label><label className="customer-form__wide">Passphrase<input name="password" type="password" autoComplete="current-password" required minLength={12} maxLength={128}/></label><button className="customer-submit customer-form__wide" disabled={busy}>{busy ? "Signing in" : "Sign in"}</button></form><p className="customer-help"><Link href="/forgot-password">Forgot your passphrase?</Link></p><div className="customer-divider"><span>or</span></div><GoogleButton label="Continue with Google" onClick={google} disabled={busy} /><p className="customer-help">New here? <Link href="/sign-up">Create an account</Link></p></AccountShell>;
}

export function VerifyEmailForm() {
  const initialState = typeof window === "undefined" ? "" : new URLSearchParams(window.location.search).get("state") ?? "";
  const [notice, setNotice] = useState<Notice>(initialState === "unavailable" ? { tone: "error", text: "Email verification is unavailable right now. Your account is not active yet." } : { tone: "info", text: "Check your inbox for a one-time verification link. The link expires after 24 hours." }); const [busy, setBusy] = useState(false);
  const token = typeof window === "undefined" ? "" : new URLSearchParams(window.location.search).get("token") ?? "";
  useEffect(() => { if (!token) return; void (async () => { setBusy(true); try { const result = await postCustomer<{ state: string }>("verification/confirm", { token }); if (result.state === "verified") { setNotice({ tone: "success", text: "Your email is verified. You can now use your account." }); } else if (result.state === "replayed") setNotice({ tone: "error", text: "This verification link has already been used. Sign in to continue." }); else if (result.state === "suspended") setNotice({ tone: "error", text: "This account is suspended." }); else setNotice({ tone: "error", text: "This verification link has expired. Request a new link below." }); } catch (error) { setNotice(messageFor(error)); } finally { setBusy(false); } })(); }, [token]);
  async function resend(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setBusy(true); const values = new FormData(event.currentTarget); try { const result = await postCustomer<{ deliveryAvailable?: boolean }>("verification/resend", { email: String(values.get("email") ?? "") }); setNotice(result.deliveryAvailable === false ? { tone: "error", text: "Email verification is unavailable right now." } : { tone: "success", text: "If verification is needed, a new email will be sent. Please wait a minute before trying again." }); } catch (error) { setNotice(messageFor(error)); } finally { setBusy(false); } }
  return <AccountShell eyebrow="Email verification" title="Verify your email"><NoticeBox notice={notice}/><form className="customer-form" onSubmit={resend}><label className="customer-form__wide">Email<input name="email" type="email" autoComplete="email" required/></label><button className="customer-submit customer-form__wide" disabled={busy}>Send a new link</button></form><p className="customer-help"><Link href="/sign-in">Return to sign in</Link></p></AccountShell>;
}

export function ForgotPasswordForm() {
  const [notice, setNotice] = useState<Notice>(null); const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setBusy(true); const values = new FormData(event.currentTarget); try { const result = await postCustomer<{ deliveryAvailable?: boolean }>("password/forgot", { email: String(values.get("email") ?? "") }); setNotice(result.deliveryAvailable === false ? { tone: "error", text: "Password recovery email is unavailable right now." } : { tone: "success", text: "If the account is eligible, a reset link will arrive shortly. It expires after 30 minutes." }); } catch (error) { setNotice(messageFor(error)); } finally { setBusy(false); } }
  return <AccountShell eyebrow="Account recovery" title="Reset your passphrase"><NoticeBox notice={notice}/><form className="customer-form" onSubmit={submit}><label className="customer-form__wide">Email<input name="email" type="email" autoComplete="email" required/></label><button className="customer-submit customer-form__wide" disabled={busy}>Send reset link</button></form><p className="customer-help"><Link href="/sign-in">Return to sign in</Link></p></AccountShell>;
}

export function ResetPasswordForm() {
  const [notice, setNotice] = useState<Notice>(null); const [busy, setBusy] = useState(false);
  const token = typeof window === "undefined" ? "" : new URLSearchParams(window.location.search).get("token") ?? "";
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setBusy(true); const values = new FormData(event.currentTarget); try { const result = await postCustomer<{ state: string }>("password/reset", { token, password: String(values.get("password") ?? "") }); setNotice(result.state === "reset" ? { tone: "success", text: "Your passphrase has been reset. Sign in with the new passphrase." } : { tone: "error", text: result.state === "replayed" ? "This reset link has already been used." : "This reset link is expired or unavailable." }); } catch (error) { setNotice(messageFor(error)); } finally { setBusy(false); } }
  return <AccountShell eyebrow="Account recovery" title="Choose a new passphrase"><NoticeBox notice={notice}/><form className="customer-form" onSubmit={submit}><label className="customer-form__wide">New passphrase<input name="password" type="password" autoComplete="new-password" required minLength={12} maxLength={128}/></label><button className="customer-submit customer-form__wide" disabled={busy}>Save passphrase</button></form><p className="customer-help"><Link href="/sign-in">Return to sign in</Link></p></AccountShell>;
}

function AccountNavigation() { return <nav className="customer-dashboard__nav" aria-label="Account navigation"><Link href="/account">Overview</Link><Link href="/account/bookings">Bookings</Link><Link href="/account/profile">Profile</Link><Link href="/account/security">Security</Link></nav>; }
function AccountState({ account, children }: { account: CustomerAccount | null; children: (account: CustomerAccount) => React.ReactNode }) {
  if (!account) return <p className="customer-notice customer-notice--info" role="status">Loading your account…</p>;
  if (account.status === "suspended") return <p className="customer-notice customer-notice--error" role="alert">This account is suspended. Contact ArmourXSports if you need help.</p>;
  return (
    <>
      {account.status === "pending" || !account.verifiedAt ? (
        <div className="customer-notice customer-notice--info" role="status" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
          <span>Email verification is pending. You can use your account freely, or verify now.</span>
          <Link className="customer-text-link" href="/verify-email?state=pending" style={{ textDecoration: "underline" }}>Verify email</Link>
        </div>
      ) : null}
      {children(account)}
    </>
  );
}

function useAccount() { const [account, setAccount] = useState<CustomerAccount | null>(null); const [notice, setNotice] = useState<Notice>(null); useEffect(() => { void customerApi<CustomerSessionView>("session").then((value) => setAccount(value.account)).catch(() => { setNotice({ tone: "info", text: "Sign in to view your account." }); }); }, []); return { account, setAccount, notice }; }

export function AccountOverview() {
  const { account, notice } = useAccount();
  const [signingOut, setSigningOut] = useState(false);
  const signOut = async () => { setSigningOut(true); try { await postCustomer("logout", {}); } catch { /* cookies are cleared regardless */ } window.location.assign("/"); };
  return <DashboardShell title="Account overview"><NoticeBox notice={notice}/><AccountState account={account}>{(value) => <div className="customer-summary"><p>Signed in as <strong>{value.displayName}</strong>.</p><dl><div><dt>Email</dt><dd>{value.email}</dd></div><div><dt>Status</dt><dd>{value.status === "active" || value.verifiedAt ? "Verified" : "Unverified"}</dd></div></dl><Link className="customer-submit" href="/book">Book your spot</Link><button className="customer-secondary" type="button" disabled={signingOut} onClick={() => void signOut()}>{signingOut ? "Signing out…" : "Sign out"}</button></div>}</AccountState></DashboardShell>;
}

function rescheduleMessage(error: unknown): Notice {
  if (!(error instanceof CustomerApiError)) return messageFor(error);
  const reasonCode = typeof error.details?.reasonCode === "string" ? error.details.reasonCode : "";
  if (reasonCode === "payment_not_paid") return { tone: "error", text: "This booking can be moved after its payment is confirmed." };
  if (reasonCode === "booking_not_confirmed") return { tone: "error", text: "Only confirmed bookings can be moved from your account." };
  if (reasonCode === "deadline_passed") return { tone: "error", text: "The 48-hour rescheduling window for this booking has passed." };
  if (reasonCode === "price_mismatch") return { tone: "error", text: "Choose a destination with the same booking price." };
  if (reasonCode === "same_slot") return { tone: "error", text: "Choose a different field, session, or date." };
  if (reasonCode === "slot_unavailable") return { tone: "error", text: "That destination is no longer available. Choose another slot." };
  return messageFor(error);
}

function RescheduleBooking({ booking, onSaved }: { booking: CustomerBooking; onSaved: () => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [options, setOptions] = useState<{ fieldId: string; fieldName: string; blockCode: string; label: string }[]>([]);
  useEffect(() => {
    if (!open) return;
    let active = true;
    void (async () => {
      try {
        const client = createHttpPublicClient();
        const [fields, config] = await Promise.all([client.getFields(), client.getConfig()]);
        const fieldNames = new Map(fields.map((field) => [field.id, field.name]));
        if (active) {
          setOptions(config.slots.map((slot) => ({ fieldId: slot.fieldId, fieldName: fieldNames.get(slot.fieldId) ?? slot.fieldId, blockCode: slot.id, label: slot.label })));
        }
      } catch { /* keep the fallback options */ }
    })();
    return () => { active = false; };
  }, [open]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setNotice(null);
    const values = new FormData(event.currentTarget);
    try {
      await customerApi(`bookings/${encodeURIComponent(booking.reference)}/reschedule`, {
        method: "POST",
        body: JSON.stringify({ fieldId: String(values.get("fieldId") ?? ""), blockCode: String(values.get("blockCode") ?? ""), bookingDate: String(values.get("bookingDate") ?? ""), reason: String(values.get("reason") ?? "") }),
      });
      await onSaved();
      setOpen(false);
      setNotice({ tone: "success", text: "Your booking has been moved. The receipt now reflects the confirmed slot." });
    } catch (error) { setNotice(rescheduleMessage(error)); } finally { setBusy(false); }
  }
  if (!booking.reschedule.eligible) return <p className="customer-booking__policy">This booking cannot be moved. {booking.reschedule.reasonCode === "deadline_passed" ? "The 48-hour window has passed." : booking.reschedule.reasonCode === "payment_not_paid" ? "Payment is still pending." : "It must be confirmed before it can be changed."}</p>;
  return <div className="customer-reschedule"><p><strong>Need a different slot?</strong><span>Availability and price are confirmed before any change is saved.</span></p>{notice ? <NoticeBox notice={notice}/> : null}{open ? <form className="customer-form customer-reschedule__form" onSubmit={submit}><label>Field<select name="fieldId" defaultValue={options.length ? options[0].fieldId : "FIELD_01"}>{(options.length ? Array.from(new Map(options.map((option) => [option.fieldId, option])).values()) : [{ fieldId: "FIELD_01", fieldName: "Field 1" }, { fieldId: "FIELD_02", fieldName: "Field 2" }]).map((field) => <option value={field.fieldId} key={field.fieldId}>{field.fieldName}</option>)}</select></label><label>Session<select name="blockCode" defaultValue={options.length ? options[0].blockCode : "MORNING"}>{(options.length ? options : [{ fieldId: "FIELD_01", fieldName: "Field 1", blockCode: "MORNING", label: "Morning session" }, { fieldId: "FIELD_01", fieldName: "Field 1", blockCode: "EVENING", label: "Evening session" }, { fieldId: "FIELD_02", fieldName: "Field 2", blockCode: "MORNING", label: "Morning session" }, { fieldId: "FIELD_02", fieldName: "Field 2", blockCode: "EVENING", label: "Evening session" }]).map((block) => <option value={block.blockCode} key={`${block.fieldId}-${block.blockCode}`}>{block.label}</option>)}</select></label><label className="customer-form__wide">New date<input name="bookingDate" type="date" required /></label><label className="customer-form__wide">Reason<textarea name="reason" minLength={3} maxLength={500} required rows={3} placeholder="Tell us why this booking needs to move." /></label><div className="customer-reschedule__actions customer-form__wide"><button className="customer-submit" disabled={busy}>{busy ? "Saving change" : "Confirm new slot"}</button><button className="customer-secondary" type="button" disabled={busy} onClick={() => setOpen(false)}>Cancel</button></div></form> : <button className="customer-secondary" type="button" onClick={() => setOpen(true)}>Reschedule booking</button>}</div>;
}

export function AccountBookings() {
  const { account, notice } = useAccount();
  const [bookings, setBookings] = useState<CustomerBooking[]>([]);
  const [local, setLocal] = useState<Notice>(null);
  const refreshBookings = useCallback(async () => { try { setBookings(await customerApi<CustomerBooking[]>("bookings")); } catch (error) { setLocal(messageFor(error)); } }, []);
  useEffect(() => {
    if (!account || account.status === "suspended") return;
    let current = true;
    void customerApi<CustomerBooking[]>("bookings")
      .then((nextBookings) => { if (current) setBookings(nextBookings); })
      .catch((error: unknown) => { if (current) setLocal(messageFor(error)); });
    return () => { current = false; };
  }, [account]);
  async function download(reference: string) {
    try {
      const response = await fetch(`/api/customer/bookings/${encodeURIComponent(reference)}/download`, { credentials: "same-origin", cache: "no-store" });
      if (!response.ok) throw new Error("not found");
      const blob = await response.blob(); const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = `ArmourXSports-booking-${reference}.pdf`; anchor.click(); URL.revokeObjectURL(url);
    } catch { setLocal({ tone: "error", text: "This booking is no longer available in your account history." }); }
  }
  return <DashboardShell title="Booking history"><NoticeBox notice={notice ?? local}/><AccountState account={account}>{() => <div className="customer-security">{bookings.length ? bookings.map((booking) => <article className="customer-booking customer-booking--card" key={booking.reference}><div className="customer-booking__header"><p className="customer-booking__status"><strong>{booking.timelineState}</strong><span>{booking.bookingStatus}</span></p><h2 className="customer-booking__title">{booking.fieldName}</h2><p className="customer-booking__time">{booking.bookingDate} · {booking.blockLabel} · {formatTimePair12(booking.startsAt, booking.endsAt)}</p></div><div className="customer-booking__details"><p>Ref: <code>{booking.reference}</code></p>{booking.receiptReference ? <p>Receipt: <code>{booking.receiptReference}</code></p> : null}</div><div className="customer-booking__actions"><button className="customer-secondary customer-secondary--small" type="button" onClick={() => void download(booking.reference)}>Download PDF</button><RescheduleBooking booking={booking} onSaved={refreshBookings}/></div></article>) : <p className="customer-notice customer-notice--info" role="status">No account-owned bookings yet. Guest bookings remain private guest records and do not appear here.</p>}</div>}</AccountState></DashboardShell>;
}

export function ProfileForm() { const { account, setAccount, notice } = useAccount(); const [local, setLocal] = useState<Notice>(null); const [busy, setBusy] = useState(false); async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setBusy(true); try { await customerApi("profile/update", { method: "PATCH", body: JSON.stringify(profilePayload(event.currentTarget)) }); setLocal({ tone: "success", text: "Your profile is updated. Sign in again to continue." }); window.setTimeout(() => window.location.assign("/sign-in"), 900); } catch (error) { setLocal(messageFor(error)); } finally { setBusy(false); } }
  useEffect(() => { if (account) setAccount(account); }, [account, setAccount]);
  return <DashboardShell title="Profile"><NoticeBox notice={notice ?? local}/><AccountState account={account}>{(value) => <form className="customer-form customer-form--card" onSubmit={submit}><label className="customer-form__wide">Email<input value={value.email} readOnly aria-readonly="true"/></label><label>Name<input name="displayName" defaultValue={value.displayName} required/></label><label>Phone<input name="phone" defaultValue={value.phone} required/></label><label>Age<input name="age" type="number" min="1" max="120" defaultValue={value.age} required/></label><button className="customer-submit customer-form__wide" disabled={busy}>Save profile</button></form>}</AccountState></DashboardShell>; }

export function SecurityForm() { const { account, notice } = useAccount(); const [local, setLocal] = useState<Notice>(null); const [busy, setBusy] = useState(false); async function setPassword(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setBusy(true); try { await postCustomer("password/set", { password: String(new FormData(event.currentTarget).get("password") ?? "") }); setLocal({ tone: "success", text: "Password set. Sign in again to continue." }); } catch (error) { setLocal(messageFor(error)); } finally { setBusy(false); } } async function linkGoogle() { setBusy(true); try { const result = await postCustomer<{ authorizationUrl: string }>("google/link/start"); window.location.assign(result.authorizationUrl); } catch (error) { setLocal(messageFor(error)); } finally { setBusy(false); } } async function unlinkGoogle() { setBusy(true); try { await customerApi("google/unlink", { method: "DELETE" }); setLocal({ tone: "success", text: "Google is unlinked. Sign in again to continue." }); } catch (error) { setLocal(messageFor(error)); } finally { setBusy(false); } }
  return <DashboardShell title="Security"><NoticeBox notice={notice ?? local}/><AccountState account={account}>{(value) => <div className="customer-security customer-security--card"><p><strong>Google</strong><span>{value.googleLinked ? "Connected" : "Not connected"}</span></p>{value.googleLinked ? <GoogleButton label="Unlink Google" onClick={unlinkGoogle} disabled={busy || !value.passwordSet} /> : <GoogleButton label="Link Google" onClick={linkGoogle} disabled={busy} />}{!value.passwordSet ? <form className="customer-form" onSubmit={setPassword}><label className="customer-form__wide">Set a passphrase<input name="password" type="password" autoComplete="new-password" required minLength={12} maxLength={128}/></label><button className="customer-submit customer-form__wide" disabled={busy}>Set passphrase</button></form> : <p className="customer-help">A passphrase is set for this account.</p>}</div>}</AccountState></DashboardShell>; }

async function withTimeout<T>(promise: Promise<T>, ms = 12_000): Promise<T> {
  return await Promise.race([promise, new Promise<never>((_, reject) => window.setTimeout(() => reject(new Error("This is taking longer than expected. Please try again.")), ms))]);
}

function GoogleErrorActions({ text }: { text: string }) {
  return <><NoticeBox notice={{ tone: "error", text }} /><div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}><Link className="customer-secondary" href="/sign-in">Try again</Link><Link className="customer-secondary" href="/book">Continue as guest</Link></div></>;
}

function GoogleProfileForm({ email, name }: { email: string; name: string }) {
  const [notice, setNotice] = useState<Notice>(null);
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setNotice(null);
    const values = new FormData(event.currentTarget);
    try {
      const result = await withTimeout(postCustomer<{ state: string; session?: CustomerSessionView }>("google/complete-profile", { displayName: String(values.get("displayName") ?? ""), phone: String(values.get("phone") ?? ""), age: Number(values.get("age") ?? 0) }));
      if (result.state === "authenticated" && result.session) window.location.assign("/account");
      else setNotice({ tone: "error", text: result.state === "suspended" ? "This account is suspended." : "We could not finish setting up your account. Please try again." });
    } catch (error) { setNotice(messageFor(error)); } finally { setBusy(false); }
  }
  return <form className="customer-form" onSubmit={submit} noValidate><NoticeBox notice={notice}/><p style={{ margin: "0 0 12px", fontSize: 14 }}>Almost there! Confirm a few details to finish creating your account{email ? <> for <strong>{email}</strong></> : null}.</p><label>Name<input name="displayName" defaultValue={name} autoComplete="name" required minLength={2} maxLength={120}/></label><label>Mobile<input name="phone" type="tel" autoComplete="tel" required inputMode="tel" placeholder="+60…"/></label><label>Age<input name="age" type="number" min="1" max="120" required inputMode="numeric"/></label><button className="customer-submit" disabled={busy}>{busy ? "Creating your account" : "Finish and sign in"}</button></form>;
}

export function GoogleReturn() {
  const [notice, setNotice] = useState<Notice>({ tone: "info", text: "Completing your Google sign-in…" });
  const [params] = useState(() => typeof window === "undefined" ? new URLSearchParams() : new URLSearchParams(window.location.search));
  const status = params.get("status");
  useEffect(() => {
    if (status !== "complete") {
      const text = status === "link_required" ? "This email already has an ArmourXSports account. Sign in with your passphrase first, then link Google from Account → Security."
        : status === "expired" || status === "replayed" ? "This Google sign-in attempt is no longer valid. Please try again."
        : "We could not complete Google sign-in. Please try again — if it keeps failing, sign up with your email instead.";
      const timer = window.setTimeout(() => setNotice({ tone: "error", text }), 0);
      return () => window.clearTimeout(timer);
    }
    void withTimeout(postCustomer<{ state: string; session?: CustomerSessionView }>("google/exchange"))
      .then((result) => {
        if (result.state === "authenticated" && result.session) window.location.assign("/account");
        else setNotice({ tone: "error", text: result.state === "suspended" ? "This account is suspended." : "This Google sign-in link is expired or has already been used. Please try again." });
      })
      .catch((error) => setNotice(messageFor(error)));
  }, [status]);
  if (status === "profile_required") {
    return <AccountShell eyebrow="Google sign-in" title="Finish setting up"><GoogleProfileForm email={params.get("email") ?? ""} name={params.get("name") ?? ""} /><p className="customer-help">Already have an account? <Link href="/sign-in">Sign in</Link></p></AccountShell>;
  }
  return <AccountShell eyebrow="Google sign-in" title="Completing sign-in">{status === "complete" ? <NoticeBox notice={notice}/> : <GoogleErrorActions text={notice?.tone === "error" ? notice.text : "We could not complete Google sign-in. Please try again."} />}</AccountShell>;
}
