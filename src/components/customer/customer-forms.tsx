"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { CustomerApiError, customerApi, postCustomer, type CustomerAccount, type CustomerSessionView } from "@/lib/customer-api";
import type { CustomerBooking } from "@/lib/api/types";

type Notice = { tone: "error" | "success" | "info"; text: string } | null;
const serviceMessage = "This account action is unavailable in this environment. You can still book as a guest.";

function messageFor(error: unknown): Notice {
  if (error instanceof CustomerApiError) return { tone: "error", text: error.code === "SERVICE_UNAVAILABLE" ? serviceMessage : error.message };
  return { tone: "error", text: serviceMessage };
}

function AccountShell({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return <section className="customer-page"><div className="shell customer-page__grid"><aside><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>Guest booking remains available whether you sign in or not.</p><Link href="/book" className="customer-text-link">Book as guest</Link></aside><div className="customer-card">{children}</div></div></section>;
}

function NoticeBox({ notice }: { notice: Notice }) { return notice ? <p className={`customer-notice customer-notice--${notice.tone}`} role={notice.tone === "error" ? "alert" : "status"}>{notice.text}</p> : null; }

function profilePayload(form: HTMLFormElement) {
  const values = new FormData(form);
  return { displayName: String(values.get("displayName") ?? ""), phone: String(values.get("phone") ?? ""), age: String(values.get("age") ?? "") };
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
  async function google(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setNotice(null);
    try { const result = await postCustomer<{ authorizationUrl: string }>("google/start", { profile: profilePayload(event.currentTarget) }); window.location.assign(result.authorizationUrl); }
    catch (error) { setNotice(messageFor(error)); } finally { setBusy(false); }
  }
  return <AccountShell eyebrow="Customer account" title="Create your account"><NoticeBox notice={notice}/><form className="customer-form" onSubmit={submit} noValidate><label>Name<input name="displayName" autoComplete="name" required minLength={2} maxLength={120}/></label><label>Email<input name="email" type="email" autoComplete="email" required maxLength={254}/></label><label>Phone<input name="phone" type="tel" autoComplete="tel" required inputMode="tel" placeholder="+60…"/></label><label>Age<input name="age" type="number" min="1" max="120" required inputMode="numeric"/></label><label className="customer-form__wide">Passphrase<input name="password" type="password" autoComplete="new-password" required minLength={12} maxLength={128}/><small>Use 12–128 characters. No forced composition rules.</small></label><button className="customer-submit customer-form__wide" disabled={busy}>{busy ? "Please wait" : "Create account"}</button></form><div className="customer-divider"><span>or</span></div><form onSubmit={google}><button className="customer-secondary" disabled={busy}>Continue with Google</button></form><p className="customer-help">Already have an account? <Link href="/sign-in">Sign in</Link></p></AccountShell>;
}

export function SignInForm() {
  const [notice, setNotice] = useState<Notice>(null); const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setBusy(true); setNotice(null); const values = new FormData(event.currentTarget); try { const result = await postCustomer<{ suspended: boolean; session?: CustomerSessionView }>("login", { email: String(values.get("email") ?? ""), password: String(values.get("password") ?? "") }); if (result.suspended) setNotice({ tone: "error", text: "This account is suspended. Contact ArmourXSports if you need help." }); else window.location.assign(result.session?.account.status === "pending" ? "/verify-email?state=pending" : "/account"); } catch (error) { setNotice(messageFor(error)); } finally { setBusy(false); } }
  async function google() { setBusy(true); setNotice(null); try { const result = await postCustomer<{ authorizationUrl: string }>("google/start"); window.location.assign(result.authorizationUrl); } catch (error) { setNotice(messageFor(error)); } finally { setBusy(false); } }
  return <AccountShell eyebrow="Customer account" title="Welcome back"><NoticeBox notice={notice}/><form className="customer-form" onSubmit={submit} noValidate><label className="customer-form__wide">Email<input name="email" type="email" autoComplete="email" required/></label><label className="customer-form__wide">Passphrase<input name="password" type="password" autoComplete="current-password" required minLength={12} maxLength={128}/></label><button className="customer-submit customer-form__wide" disabled={busy}>{busy ? "Signing in" : "Sign in"}</button></form><p className="customer-help"><Link href="/forgot-password">Forgot your passphrase?</Link></p><div className="customer-divider"><span>or</span></div><button className="customer-secondary" onClick={google} disabled={busy}>Continue with Google</button><p className="customer-help">New here? <Link href="/sign-up">Create an account</Link></p></AccountShell>;
}

export function VerifyEmailForm() {
  const initialState = typeof window === "undefined" ? "" : new URLSearchParams(window.location.search).get("state") ?? "";
  const [notice, setNotice] = useState<Notice>(initialState === "unavailable" ? { tone: "error", text: "Email verification is unavailable in this environment. Your account remains pending." } : { tone: "info", text: "Check your inbox for a one-time verification link. The link expires after 24 hours." }); const [busy, setBusy] = useState(false);
  const token = typeof window === "undefined" ? "" : new URLSearchParams(window.location.search).get("token") ?? "";
  useEffect(() => { if (!token) return; void (async () => { setBusy(true); try { const result = await postCustomer<{ state: string }>("verification/confirm", { token }); if (result.state === "verified") { setNotice({ tone: "success", text: "Your email is verified. You can now use your account." }); } else if (result.state === "replayed") setNotice({ tone: "error", text: "This verification link has already been used. Sign in to continue." }); else if (result.state === "suspended") setNotice({ tone: "error", text: "This account is suspended." }); else setNotice({ tone: "error", text: "This verification link has expired. Request a new link below." }); } catch (error) { setNotice(messageFor(error)); } finally { setBusy(false); } })(); }, [token]);
  async function resend(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setBusy(true); const values = new FormData(event.currentTarget); try { const result = await postCustomer<{ deliveryAvailable?: boolean }>("verification/resend", { email: String(values.get("email") ?? "") }); setNotice(result.deliveryAvailable === false ? { tone: "error", text: "Email verification is unavailable in this environment." } : { tone: "success", text: "If verification is needed, a new email will be sent. Please wait a minute before trying again." }); } catch (error) { setNotice(messageFor(error)); } finally { setBusy(false); } }
  return <AccountShell eyebrow="Email verification" title="Verify your email"><NoticeBox notice={notice}/><form className="customer-form" onSubmit={resend}><label className="customer-form__wide">Email<input name="email" type="email" autoComplete="email" required/></label><button className="customer-submit customer-form__wide" disabled={busy}>Send a new link</button></form><p className="customer-help"><Link href="/sign-in">Return to sign in</Link></p></AccountShell>;
}

export function ForgotPasswordForm() {
  const [notice, setNotice] = useState<Notice>(null); const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setBusy(true); const values = new FormData(event.currentTarget); try { const result = await postCustomer<{ deliveryAvailable?: boolean }>("password/forgot", { email: String(values.get("email") ?? "") }); setNotice(result.deliveryAvailable === false ? { tone: "error", text: "Password recovery email is unavailable in this environment." } : { tone: "success", text: "If the account is eligible, a reset link will arrive shortly. It expires after 30 minutes." }); } catch (error) { setNotice(messageFor(error)); } finally { setBusy(false); } }
  return <AccountShell eyebrow="Account recovery" title="Reset your passphrase"><NoticeBox notice={notice}/><form className="customer-form" onSubmit={submit}><label className="customer-form__wide">Email<input name="email" type="email" autoComplete="email" required/></label><button className="customer-submit customer-form__wide" disabled={busy}>Send reset link</button></form><p className="customer-help"><Link href="/sign-in">Return to sign in</Link></p></AccountShell>;
}

export function ResetPasswordForm() {
  const [notice, setNotice] = useState<Notice>(null); const [busy, setBusy] = useState(false);
  const token = typeof window === "undefined" ? "" : new URLSearchParams(window.location.search).get("token") ?? "";
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setBusy(true); const values = new FormData(event.currentTarget); try { const result = await postCustomer<{ state: string }>("password/reset", { token, password: String(values.get("password") ?? "") }); setNotice(result.state === "reset" ? { tone: "success", text: "Your passphrase has been reset. Sign in with the new passphrase." } : { tone: "error", text: result.state === "replayed" ? "This reset link has already been used." : "This reset link is expired or unavailable." }); } catch (error) { setNotice(messageFor(error)); } finally { setBusy(false); } }
  return <AccountShell eyebrow="Account recovery" title="Choose a new passphrase"><NoticeBox notice={notice}/><form className="customer-form" onSubmit={submit}><label className="customer-form__wide">New passphrase<input name="password" type="password" autoComplete="new-password" required minLength={12} maxLength={128}/></label><button className="customer-submit customer-form__wide" disabled={busy}>Save passphrase</button></form><p className="customer-help"><Link href="/sign-in">Return to sign in</Link></p></AccountShell>;
}

function AccountNavigation() { return <nav className="customer-account-nav" aria-label="Account navigation"><Link href="/account">Overview</Link><Link href="/account/bookings">Bookings</Link><Link href="/account/profile">Profile</Link><Link href="/account/security">Security</Link></nav>; }
function AccountState({ account, children }: { account: CustomerAccount | null; children: (account: CustomerAccount) => React.ReactNode }) { if (!account) return <p className="customer-notice customer-notice--info" role="status">Loading your account…</p>; if (account.status === "pending") return <><p className="customer-notice customer-notice--info" role="status">Verify your email before using account features.</p><Link className="customer-secondary" href="/verify-email?state=pending">Verify email</Link></>; return <>{children(account)}</>; }

function useAccount() { const [account, setAccount] = useState<CustomerAccount | null>(null); const [notice, setNotice] = useState<Notice>(null); useEffect(() => { void customerApi<CustomerSessionView>("session").then((value) => setAccount(value.account)).catch(() => { setNotice({ tone: "info", text: "Sign in to view your account." }); }); }, []); return { account, setAccount, notice }; }

export function AccountOverview() { const { account, notice } = useAccount(); return <AccountShell eyebrow="Your account" title="Account overview"><AccountNavigation/><NoticeBox notice={notice}/><AccountState account={account}>{(value) => <div className="customer-summary"><p>Signed in as <strong>{value.displayName}</strong>.</p><dl><div><dt>Email</dt><dd>{value.email}</dd></div><div><dt>Status</dt><dd>Verified</dd></div></dl><Link className="customer-submit" href="/book">Book a field</Link></div>}</AccountState></AccountShell>; }

export function AccountBookings() {
  const { account, notice } = useAccount();
  const [bookings, setBookings] = useState<CustomerBooking[]>([]);
  const [local, setLocal] = useState<Notice>(null);
  useEffect(() => { if (account?.status !== "active") return; void customerApi<CustomerBooking[]>("bookings").then(setBookings).catch((error) => setLocal(messageFor(error))); }, [account]);
  async function download(reference: string) {
    try {
      const response = await fetch(`/api/customer/bookings/${encodeURIComponent(reference)}/download`, { credentials: "same-origin", cache: "no-store" });
      if (!response.ok) throw new Error("not found");
      const blob = await response.blob(); const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = `ArmourXSports-booking-${reference}.pdf`; anchor.click(); URL.revokeObjectURL(url);
    } catch { setLocal({ tone: "error", text: "This booking is no longer available in your account history." }); }
  }
  return <AccountShell eyebrow="Your account" title="Booking history"><AccountNavigation/><NoticeBox notice={notice ?? local}/><AccountState account={account}>{() => <div className="customer-security">{bookings.length ? bookings.map((booking) => <article key={booking.reference}><p><strong>{booking.timelineState}</strong><span>Booking: {booking.bookingStatus}</span><span>Payment: {booking.paymentStatus}</span></p><h2>{booking.fieldName}</h2><p>{booking.bookingDate} · {booking.blockLabel} · {booking.startsAt}–{booking.endsAt}</p><p>Reference: <code>{booking.reference}</code></p><button className="customer-secondary" type="button" onClick={() => void download(booking.reference)}>Download booking PDF</button></article>) : <p className="customer-notice customer-notice--info" role="status">No account-owned bookings yet. Guest bookings remain private guest records and do not appear here.</p>}</div>}</AccountState></AccountShell>;
}

export function ProfileForm() { const { account, setAccount, notice } = useAccount(); const [local, setLocal] = useState<Notice>(null); const [busy, setBusy] = useState(false); async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setBusy(true); try { await customerApi("profile/update", { method: "PATCH", body: JSON.stringify(profilePayload(event.currentTarget)) }); setLocal({ tone: "success", text: "Your profile is updated. Sign in again to continue." }); window.setTimeout(() => window.location.assign("/sign-in"), 900); } catch (error) { setLocal(messageFor(error)); } finally { setBusy(false); } }
  useEffect(() => { if (account) setAccount(account); }, [account, setAccount]);
  return <AccountShell eyebrow="Your account" title="Profile"><AccountNavigation/><NoticeBox notice={notice ?? local}/><AccountState account={account}>{(value) => <form className="customer-form" onSubmit={submit}><label className="customer-form__wide">Email<input value={value.email} readOnly aria-readonly="true"/></label><label>Name<input name="displayName" defaultValue={value.displayName} required/></label><label>Phone<input name="phone" defaultValue={value.phone} required/></label><label>Age<input name="age" type="number" min="1" max="120" defaultValue={value.age} required/></label><button className="customer-submit customer-form__wide" disabled={busy}>Save profile</button></form>}</AccountState></AccountShell>; }

export function SecurityForm() { const { account, notice } = useAccount(); const [local, setLocal] = useState<Notice>(null); const [busy, setBusy] = useState(false); async function setPassword(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setBusy(true); try { await postCustomer("password/set", { password: String(new FormData(event.currentTarget).get("password") ?? "") }); setLocal({ tone: "success", text: "Password set. Sign in again to continue." }); } catch (error) { setLocal(messageFor(error)); } finally { setBusy(false); } } async function linkGoogle() { setBusy(true); try { const result = await postCustomer<{ authorizationUrl: string }>("google/link/start"); window.location.assign(result.authorizationUrl); } catch (error) { setLocal(messageFor(error)); } finally { setBusy(false); } } async function unlinkGoogle() { setBusy(true); try { await customerApi("google/unlink", { method: "DELETE" }); setLocal({ tone: "success", text: "Google is unlinked. Sign in again to continue." }); } catch (error) { setLocal(messageFor(error)); } finally { setBusy(false); } }
  return <AccountShell eyebrow="Your account" title="Security"><AccountNavigation/><NoticeBox notice={notice ?? local}/><AccountState account={account}>{(value) => <div className="customer-security"><p><strong>Google</strong><span>{value.googleLinked ? "Connected" : "Not connected"}</span></p>{value.googleLinked ? <button className="customer-secondary" onClick={unlinkGoogle} disabled={busy || !value.passwordSet}>Unlink Google</button> : <button className="customer-secondary" onClick={linkGoogle} disabled={busy}>Link Google</button>}{!value.passwordSet ? <form className="customer-form" onSubmit={setPassword}><label className="customer-form__wide">Set a passphrase<input name="password" type="password" autoComplete="new-password" required minLength={12} maxLength={128}/></label><button className="customer-submit customer-form__wide" disabled={busy}>Set passphrase</button></form> : <p className="customer-help">A passphrase is set for this account.</p>}</div>}</AccountState></AccountShell>; }

export function GoogleReturn() {
  const [notice, setNotice] = useState<Notice>({ tone: "info", text: "Completing your Google sign-in…" });
  useEffect(() => {
    const status = new URLSearchParams(window.location.search).get("status");
    if (status !== "complete") {
      const text = status === "link_required" ? "Sign in to the existing account before linking Google." : status === "profile_required" ? "Create an account first and include the requested profile details." : status === "expired" || status === "replayed" ? "This Google sign-in attempt is no longer valid. Try again." : "Google sign-in could not be completed.";
      const timer = window.setTimeout(() => setNotice({ tone: "error", text }), 0);
      return () => window.clearTimeout(timer);
    }
    void postCustomer<{ state: string; session?: CustomerSessionView }>("google/exchange")
      .then((result) => {
        if (result.state === "authenticated") window.location.assign(result.session?.account.status === "pending" ? "/verify-email?state=pending" : "/account");
        else setNotice({ tone: "error", text: result.state === "suspended" ? "This account is suspended." : "This Google sign-in link is expired or has already been used." });
      })
      .catch((error) => setNotice(messageFor(error)));
  }, []);
  return <AccountShell eyebrow="Google sign-in" title="Completing sign-in"><NoticeBox notice={notice}/><Link className="customer-secondary" href="/sign-in">Return to sign in</Link></AccountShell>;
}
