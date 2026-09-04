"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

function getInitials(name: string): string {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function VerifyEmailForm() {
  const [notice, setNotice] = useState<Notice>({
    tone: "info",
    text: "Check your inbox for a one-time verification link. The link expires after 10 minutes. Once verified, this page will automatically redirect you.",
  });
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [resendBusy, setResendBusy] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = window.setInterval(() => {
      setResendCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [resendCooldown]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const rawToken = params.get("token");
    const stateParam = params.get("state");

    // Immediately sanitize URL to strip raw token from browser history and address bar
    if (rawToken) {
      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete("token");
      window.history.replaceState({}, "", cleanUrl.pathname + (cleanUrl.search ? cleanUrl.search : ""));

      void (async () => {
        setVerifying(true);
        setNotice({ tone: "info", text: "Verifying your email address, please wait…" });
        try {
          const result = await postCustomer<{ state: string; session?: CustomerSessionView }>("verification/confirm", { token: rawToken });
          if (result.state === "verified") {
            setVerified(true);
            setNotice({ tone: "success", text: "Your email has been verified! Redirecting to your account…" });
            try {
              const channel = new BroadcastChannel("axs_customer_auth");
              channel.postMessage({ type: "EMAIL_VERIFIED" });
              channel.close();
            } catch {}
            try {
              localStorage.setItem("axs_customer_verified_at", Date.now().toString());
            } catch {}
            window.setTimeout(() => {
              window.location.assign("/account");
            }, 600);
          } else if (result.state === "replayed") {
            setNotice({ tone: "info", text: "This verification link has already been used. If your account is verified, sign in to continue." });
          } else if (result.state === "suspended") {
            setNotice({ tone: "error", text: "This account is suspended. Contact ArmourXSports if you need help." });
          } else {
            setNotice({ tone: "error", text: "This verification link has expired. Verification links expire after 10 minutes. Request a new link below or sign in to verify from your account." });
          }
        } catch (error) {
          setNotice(messageFor(error));
        } finally {
          setVerifying(false);
        }
      })();
      return;
    }

    let initialTimer: number | null = null;
    // No token in URL: user is waiting for verification (e.g. from sign-up)
    if (stateParam === "unavailable") {
      initialTimer = window.setTimeout(() => {
        setNotice({ tone: "error", text: "Email verification is unavailable right now. Your account is not active yet." });
      }, 0);
    }

    // Cross-tab synchronization: broadcast channel
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel("axs_customer_auth");
      bc.onmessage = (event) => {
        if (event.data?.type === "EMAIL_VERIFIED") {
          setVerified(true);
          setNotice({ tone: "success", text: "Email verified! Redirecting to your account…" });
          window.location.assign("/account");
        }
      };
    } catch {}

    // Cross-tab synchronization: localStorage storage event
    const onStorage = (event: StorageEvent) => {
      if (event.key === "axs_customer_verified_at") {
        setVerified(true);
        setNotice({ tone: "success", text: "Email verified! Redirecting to your account…" });
        window.location.assign("/account");
      }
    };
    window.addEventListener("storage", onStorage);

    // Periodic probe: every 3 seconds, probe session to detect external verification
    const pollTimer = window.setInterval(async () => {
      try {
        const session = await customerApi<CustomerSessionView>("session");
        if (session?.account?.status === "active" || session?.account?.verifiedAt) {
          setVerified(true);
          setNotice({ tone: "success", text: "Email verified! Redirecting to your account…" });
          window.location.assign("/account");
        }
      } catch {}
    }, 3000);

    return () => {
      if (initialTimer) window.clearTimeout(initialTimer);
      if (bc) bc.close();
      window.removeEventListener("storage", onStorage);
      window.clearInterval(pollTimer);
    };
  }, []);

  async function resend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (resendBusy || resendCooldown > 0) return;
    setResendBusy(true);
    const values = new FormData(event.currentTarget);
    try {
      const result = await postCustomer<{ deliveryAvailable?: boolean }>("verification/resend", {
        email: String(values.get("email") ?? ""),
      });
      if (result.deliveryAvailable === false) {
        setNotice({ tone: "error", text: "Email verification is unavailable right now." });
      } else {
        setNotice({ tone: "success", text: "If verification is needed, a new email has been sent. The link expires after 10 minutes." });
        setResendCooldown(60);
      }
    } catch (error) {
      setNotice(messageFor(error));
    } finally {
      setResendBusy(false);
    }
  }

  return (
    <AccountShell eyebrow="Email verification" title="Verify your email">
      <NoticeBox notice={notice} />
      {verifying ? (
        <div className="customer-verifying-card">
          <div className="customer-spinner" aria-hidden="true" />
          <p style={{ margin: 0, fontWeight: 600, color: "var(--ink)" }}>Verifying your email address…</p>
        </div>
      ) : verified ? (
        <div className="customer-verifying-card">
          <div className="customer-status-badge customer-status-badge--verified" style={{ fontSize: 13, padding: "6px 14px" }}>
            ✓ Verified
          </div>
          <p style={{ margin: 0, fontWeight: 600, color: "var(--ink)" }}>Redirecting to your account dashboard…</p>
        </div>
      ) : (
        <>
          <form className="customer-form" onSubmit={resend} noValidate>
            <label className="customer-form__wide">
              Didn&apos;t receive the link or it expired? Enter your email to resend:
              <input name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
            </label>
            <button className="customer-submit customer-form__wide" disabled={resendBusy || resendCooldown > 0}>
              {resendBusy ? "Sending link…" : resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Send new verification link"}
            </button>
          </form>
          <p className="customer-help">
            <Link href="/account">Go to account overview</Link> · <Link href="/sign-in">Return to sign in</Link>
          </p>
        </>
      )}
    </AccountShell>
  );
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

function useCurrentPath(): string {
  try {
    const path = usePathname();
    return path || "/account";
  } catch {
    return "/account";
  }
}


function OverviewIcon({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="M9 3v2.5M15 3v2.5M9 21v-2.5M15 21v-2.5" />
    </svg>
  );
}

function BookingsIcon({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="3" y="4" width="18" height="17" rx="2.5" />
      <line x1="3" y1="9.5" x2="21" y2="9.5" />
      <line x1="8" y1="2" x2="8" y2="5" />
      <line x1="16" y1="2" x2="16" y2="5" />
      <path d="M8 14.5l2.5 2.5 5.5 -5" />
    </svg>
  );
}

function ProfileIcon({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M5.5 20.5a6.5 6.5 0 0 1 13 0" />
    </svg>
  );
}

function SecurityIcon({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <rect x="9.5" y="11" width="5" height="4" rx="1" />
      <path d="M10.5 11V9.5a1.5 1.5 0 0 1 3 0V11" />
    </svg>
  );
}

function LogOutIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function PlusCircleIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}

function AlertTriangleIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function AthleticPitchGraphic() {
  return (
    <svg width="240" height="135" viewBox="0 0 240 135" fill="none" aria-hidden="true" className="customer-pitch-graphic">
      <rect width="240" height="135" rx="12" fill="url(#turfGradient)" />
      <rect x="14" y="12" width="212" height="111" rx="3" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      <line x1="120" y1="12" x2="120" y2="123" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      <circle cx="120" cy="67.5" r="20" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      <circle cx="120" cy="67.5" r="2" fill="rgba(255,255,255,0.6)" />
      <rect x="14" y="36" width="32" height="63" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
      <rect x="194" y="36" width="32" height="63" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
      <circle cx="22" cy="18" r="1.5" fill="#7fc241" />
      <circle cx="218" cy="18" r="1.5" fill="#7fc241" />
      <circle cx="22" cy="117" r="1.5" fill="#7fc241" />
      <circle cx="218" cy="117" r="1.5" fill="#7fc241" />
      <defs>
        <linearGradient id="turfGradient" x1="0" y1="0" x2="240" y2="135" gradientUnits="userSpaceOnUse">
          <stop stopColor="#101c13" />
          <stop offset="0.5" stopColor="#162b1d" />
          <stop offset="1" stopColor="#0d1810" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function ConfirmModal({
  isOpen,
  title,
  description,
  confirmLabel,
  confirmTone = "danger",
  busy,
  onConfirm,
  onCancel,
}: {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  confirmTone?: "danger" | "warning";
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!isOpen) return null;
  return (
    <div className="customer-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="customer-modal-card">
        <div className="customer-modal-header">
          <div className={`customer-modal-icon customer-modal-icon--${confirmTone}`}>
            <AlertTriangleIcon />
          </div>
          <div className="customer-modal-text">
            <h3 id="modal-title" className="customer-modal-title">{title}</h3>
            <p className="customer-modal-desc">{description}</p>
          </div>
        </div>
        <div className="customer-modal-actions">
          <button type="button" className="customer-secondary customer-btn-action" disabled={busy} onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className={`customer-submit customer-btn-action ${confirmTone === "danger" ? "customer-submit--danger" : "customer-submit--warning"}`}
            disabled={busy}
            onClick={onConfirm}
          >
            {busy ? "Processing…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function AccountNavigation({ account }: { account?: CustomerAccount | null }) {
  const currentPath = useCurrentPath();
  const [signingOut, setSigningOut] = useState(false);

  const signOut = async () => {
    setSigningOut(true);
    try { await postCustomer("logout", {}); } catch { /* cookies are cleared regardless */ }
    window.location.assign("/");
  };

  const navItems = [
    { href: "/account", label: "Overview", Icon: OverviewIcon, exact: true },
    { href: "/account/bookings", label: "Bookings", Icon: BookingsIcon },
    { href: "/account/profile", label: "Profile", Icon: ProfileIcon },
    { href: "/account/security", label: "Security", Icon: SecurityIcon },
  ];

  return (
    <nav className="customer-dashboard__nav" aria-label="Account navigation">
      {account && currentPath !== "/account" ? (
        <div className="customer-nav-user-preview">
          <div className="customer-avatar customer-avatar--sm" aria-hidden="true">
            {getInitials(account.displayName)}
          </div>
          <div className="customer-nav-user-meta">
            <span className="customer-nav-user-name">{account.displayName}</span>
            <span className="customer-nav-user-email">{account.email}</span>
          </div>
        </div>
      ) : null}

      <div className="customer-nav-links">
        {navItems.map((item) => {
          const isActive = item.exact ? currentPath === item.href : currentPath.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`customer-nav-item ${isActive ? "customer-nav-item--active" : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="customer-nav-item__icon"><item.Icon /></span>
              <span className="customer-nav-item__label">{item.label}</span>
              {isActive ? <span className="customer-nav-item__pill" aria-hidden="true" /> : null}
            </Link>
          );
        })}
      </div>

      <div className="customer-nav-footer">
        <Link href="/book" className="customer-nav-cta">
          <PlusCircleIcon />
          <span>Book a pitch</span>
        </Link>
        <button
          type="button"
          className="customer-nav-signout"
          disabled={signingOut}
          onClick={() => void signOut()}
        >
          <LogOutIcon />
          <span>{signingOut ? "Signing out…" : "Sign out"}</span>
        </button>
      </div>
    </nav>
  );
}

function DashboardShell({
  title,
  subtitle,
  children,
  account,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  account?: CustomerAccount | null;
}) {
  return (
    <section className="customer-dashboard">
      <div className="shell customer-dashboard__grid">
        <aside className="customer-dashboard__sidebar">
          <div className="customer-dashboard__sidebar-card">
            <p className="eyebrow customer-sidebar-eyebrow">Player Portal</p>
            <AccountNavigation account={account} />
          </div>
        </aside>
        <div className="customer-dashboard__main">
          <header className="customer-dashboard__header">
            <h1>{title}</h1>
            {subtitle ? <p className="customer-dashboard__subtitle">{subtitle}</p> : null}
          </header>
          <div className="customer-dashboard__content">{children}</div>
        </div>
      </div>
    </section>
  );
}

function AccountState({ account, children }: { account: CustomerAccount | null; children: (account: CustomerAccount) => React.ReactNode }) {
  if (!account) return <p className="customer-notice customer-notice--info" role="status">Loading your account…</p>;
  if (account.status === "suspended") return <p className="customer-notice customer-notice--error" role="alert">This account is suspended. Contact ArmourXSports if you need help.</p>;
  return (
    <>
      {account.status === "pending" || !account.verifiedAt ? (
        <div className="customer-notice customer-notice--info" role="status" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
          <span>Email verification is pending (links expire after 10 minutes). You can use your account freely, or click &quot;Verify account&quot; below to receive a link.</span>
          <Link className="customer-text-link" href="/verify-email?state=pending" style={{ textDecoration: "underline", marginTop: 0 }}>Verification details</Link>
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
  const [resendNotice, setResendNotice] = useState<Notice>(null);
  const [resendBusy, setResendBusy] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = window.setInterval(() => {
      setResendCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [resendCooldown]);

  const resendVerification = async (email: string) => {
    if (resendBusy || resendCooldown > 0) return;
    setResendBusy(true);
    setResendNotice(null);
    try {
      const result = await postCustomer<{ deliveryAvailable?: boolean }>("verification/resend", { email });
      if (result.deliveryAvailable === false) {
        setResendNotice({ tone: "error", text: "Email verification is unavailable right now." });
      } else {
        setResendNotice({ tone: "success", text: `Verification link sent to ${email}! The link expires after 10 minutes.` });
        setResendCooldown(60);
      }
    } catch (error) {
      setResendNotice(messageFor(error));
    } finally {
      setResendBusy(false);
    }
  };

  const signOut = async () => {
    setSigningOut(true);
    try { await postCustomer("logout", {}); } catch { /* cookies are cleared regardless */ }
    window.location.assign("/");
  };

  return (
    <DashboardShell title="Account overview" subtitle="Welcome to your player dashboard. Manage matches, tickets, and preferences." account={account}>
      <NoticeBox notice={notice} />
      <AccountState account={account}>
        {(value) => {
          const isVerified = value.status === "active" || Boolean(value.verifiedAt);
          return (
            <div className="customer-overview-stack">
              <div className="customer-summary customer-summary--card">
                <div className="customer-profile-header">
                  <div className="customer-avatar" aria-hidden="true">
                    {getInitials(value.displayName)}
                  </div>
                  <div className="customer-profile-info">
                    <div className="customer-profile-row">
                      <h2 className="customer-profile-name">{value.displayName}</h2>
                      {isVerified ? (
                        <span className="customer-status-badge customer-status-badge--verified">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                            <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          Verified
                        </span>
                      ) : (
                        <div className="customer-verify-inline">
                          <span className="customer-status-badge customer-status-badge--unverified">Unverified</span>
                          <button
                            type="button"
                            className="customer-verify-btn"
                            disabled={resendBusy || resendCooldown > 0}
                            onClick={() => void resendVerification(value.email)}
                          >
                            {resendBusy ? "Sending…" : resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Verify account"}
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="customer-profile-email">{value.email}</p>
                  </div>
                </div>

                <NoticeBox notice={resendNotice} />

                {/* Matchday Quick Hub Cards */}
                <div className="customer-metrics-grid">
                  <div className="customer-metric-card">
                    <div className="customer-metric-icon">
                      <BookingsIcon />
                    </div>
                    <div className="customer-metric-meta">
                      <span className="customer-metric-title">Match Bookings</span>
                      <span className="customer-metric-value">Active Hub</span>
                    </div>
                    <Link href="/account/bookings" className="customer-metric-action">
                      View history →
                    </Link>
                  </div>

                  <div className="customer-metric-card">
                    <div className="customer-metric-icon customer-metric-icon--accent">
                      <OverviewIcon />
                    </div>
                    <div className="customer-metric-meta">
                      <span className="customer-metric-title">Next Session</span>
                      <span className="customer-metric-value">Reserve Slot</span>
                    </div>
                    <Link href="/book" className="customer-metric-action">
                      Book pitch →
                    </Link>
                  </div>

                  <div className="customer-metric-card">
                    <div className="customer-metric-icon">
                      <SecurityIcon />
                    </div>
                    <div className="customer-metric-meta">
                      <span className="customer-metric-title">Home Arena</span>
                      <span className="customer-metric-value">ArmourX</span>
                    </div>
                    <Link href="/contact" className="customer-metric-action">
                      Venue info →
                    </Link>
                  </div>
                </div>

                {/* Account Details Table */}
                <dl className="customer-overview-dl">
                  <div>
                    <dt>Email</dt>
                    <dd>{value.email}</dd>
                  </div>
                  <div>
                    <dt>Phone</dt>
                    <dd>{value.phone || "Not set"}</dd>
                  </div>
                  <div>
                    <dt>Account status</dt>
                    <dd>{isVerified ? "Active · Verified" : "Pending verification"}</dd>
                  </div>
                  <div>
                    <dt>Verification</dt>
                    <dd>{isVerified ? "Verified" : "Unverified (link expires in 10m)"}</dd>
                  </div>
                </dl>

                <div className="customer-action-bar">
                  <Link className="customer-submit customer-btn-action" href="/book">
                    Book your spot
                  </Link>
                  <Link className="customer-secondary customer-btn-action" href="/account/profile">
                    Edit profile
                  </Link>
                  <button className="customer-secondary customer-btn-action customer-btn-action--signout" type="button" disabled={signingOut} onClick={() => void signOut()}>
                    <LogOutIcon />
                    <span>{signingOut ? "Signing out…" : "Sign out"}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        }}
      </AccountState>
    </DashboardShell>
  );
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
  const [activeFilter, setActiveFilter] = useState<"all" | "upcoming" | "past">("all");

  const refreshBookings = useCallback(async () => {
    try {
      const data = await customerApi<CustomerBooking[]>("bookings");
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) { setLocal(messageFor(error)); }
  }, []);

  useEffect(() => {
    if (!account || account.status === "suspended") return;
    let current = true;
    void customerApi<CustomerBooking[]>("bookings")
      .then((nextBookings) => { if (current) setBookings(Array.isArray(nextBookings) ? nextBookings : []); })
      .catch((error: unknown) => { if (current) setLocal(messageFor(error)); });
    return () => { current = false; };
  }, [account]);

  async function download(reference: string) {
    try {
      const response = await fetch(`/api/customer/bookings/${encodeURIComponent(reference)}/download`, { credentials: "same-origin", cache: "no-store" });
      if (!response.ok) throw new Error("not found");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `ArmourXSports-booking-${reference}.pdf`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch {
      setLocal({ tone: "error", text: "This booking is no longer available in your account history." });
    }
  }

  const list = Array.isArray(bookings) ? bookings : [];
  const filteredBookings = list.filter((b) => {
    if (activeFilter === "upcoming") return b.timelineState !== "past";
    if (activeFilter === "past") return b.timelineState === "past";
    return true;
  });

  return (
    <DashboardShell title="Booking history" subtitle="Your matchday schedule, confirmed reservations, and receipts." account={account}>
      <NoticeBox notice={notice ?? local} />
      <AccountState account={account}>
        {() => (
          <div className="customer-bookings-view">
            {list.length > 0 ? (
              <div className="customer-filter-tabs" role="tablist" aria-label="Booking filters">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeFilter === "all"}
                  className={`customer-filter-tab ${activeFilter === "all" ? "customer-filter-tab--active" : ""}`}
                  onClick={() => setActiveFilter("all")}
                >
                  All bookings ({list.length})
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeFilter === "upcoming"}
                  className={`customer-filter-tab ${activeFilter === "upcoming" ? "customer-filter-tab--active" : ""}`}
                  onClick={() => setActiveFilter("upcoming")}
                >
                  Upcoming
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeFilter === "past"}
                  className={`customer-filter-tab ${activeFilter === "past" ? "customer-filter-tab--active" : ""}`}
                  onClick={() => setActiveFilter("past")}
                >
                  Past
                </button>
              </div>
            ) : null}

            {filteredBookings.length > 0 ? (
              <div className="customer-bookings-list">
                {filteredBookings.map((booking) => (
                  <article className="customer-booking customer-booking--card" key={booking.reference}>
                    <div className="customer-booking__header">
                      <p className="customer-booking__status">
                        <strong>{booking.timelineState}</strong>
                        <span>{booking.bookingStatus}</span>
                      </p>
                      <h2 className="customer-booking__title">{booking.fieldName}</h2>
                      <p className="customer-booking__time">
                        {booking.bookingDate} · {booking.blockLabel} · {formatTimePair12(booking.startsAt, booking.endsAt)}
                      </p>
                    </div>
                    <div className="customer-booking__details">
                      <p>Ref: <code>{booking.reference}</code></p>
                      {booking.receiptReference ? <p>Receipt: <code>{booking.receiptReference}</code></p> : null}
                    </div>
                    <div className="customer-booking__actions">
                      <button className="customer-secondary customer-secondary--small customer-btn-action" type="button" onClick={() => void download(booking.reference)}>
                        Download PDF
                      </button>
                      <RescheduleBooking booking={booking} onSaved={refreshBookings} />
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="customer-empty-state customer-summary--card">
                <AthleticPitchGraphic />
                <h3 className="customer-empty-title">No account-owned bookings yet</h3>
                <p className="customer-empty-desc">
                  Guest bookings remain private guest records and do not appear here. Reserve an evening session or weekend slot under the floodlights to build your match history.
                </p>
                <div className="customer-empty-actions">
                  <Link href="/book" className="customer-submit customer-btn-action">
                    Book a pitch
                  </Link>
                  <Link href="/booking/find" className="customer-secondary customer-btn-action">
                    Find guest booking
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </AccountState>
    </DashboardShell>
  );
}

export function ProfileForm() {
  const { account, setAccount, notice } = useAccount();
  const [local, setLocal] = useState<Notice>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    try {
      await customerApi("profile/update", {
        method: "PATCH",
        body: JSON.stringify(profilePayload(event.currentTarget)),
      });
      setLocal({ tone: "success", text: "Your profile is updated. Sign in again to continue." });
      window.setTimeout(() => window.location.assign("/sign-in"), 900);
    } catch (error) {
      setLocal(messageFor(error));
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (account) setAccount(account);
  }, [account, setAccount]);

  return (
    <DashboardShell title="Profile" subtitle="Manage your player details and contact information." account={account}>
      <NoticeBox notice={notice ?? local} />
      <AccountState account={account}>
        {(value) => (
          <form className="customer-form customer-form--card" onSubmit={submit}>
            <label className="customer-form__wide">
              <span>Email</span>
              <input value={value.email} readOnly aria-readonly="true" className="customer-input--readonly" />
              <small>Email address is fixed to your identity. Contact support if you need an email transfer.</small>
            </label>
            <label>
              <span>Name</span>
              <input name="displayName" defaultValue={value.displayName} required minLength={2} maxLength={120} />
            </label>
            <label>
              <span>Phone</span>
              <input name="phone" defaultValue={value.phone} required placeholder="+60…" />
            </label>
            <label className="customer-form__wide">
              <span>Age</span>
              <input name="age" type="number" min="1" max="120" defaultValue={value.age} required />
              <small>Required for tournament tiering and venue player safety (1 to 120).</small>
            </label>
            <div className="customer-form__actions customer-form__wide">
              <button className="customer-submit customer-btn-action" disabled={busy}>
                {busy ? "Saving changes…" : "Save profile"}
              </button>
            </div>
          </form>
        )}
      </AccountState>
    </DashboardShell>
  );
}

export function SecurityForm() {
  const { account, notice } = useAccount();
  const [local, setLocal] = useState<Notice>(null);
  const [busy, setBusy] = useState(false);
  const [modalMode, setModalMode] = useState<"none" | "deactivate" | "delete">("none");

  async function setPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    try {
      await postCustomer("password/set", { password: String(new FormData(event.currentTarget).get("password") ?? "") });
      setLocal({ tone: "success", text: "Password set. Sign in again to continue." });
    } catch (error) {
      setLocal(messageFor(error));
    } finally {
      setBusy(false);
    }
  }

  async function linkGoogle() {
    setBusy(true);
    try {
      const result = await postCustomer<{ authorizationUrl: string }>("google/link/start");
      window.location.assign(result.authorizationUrl);
    } catch (error) {
      setLocal(messageFor(error));
    } finally {
      setBusy(false);
    }
  }

  async function unlinkGoogle() {
    setBusy(true);
    try {
      await customerApi("google/unlink", { method: "DELETE" });
      setLocal({ tone: "success", text: "Google is unlinked. Sign in again to continue." });
    } catch (error) {
      setLocal(messageFor(error));
    } finally {
      setBusy(false);
    }
  }

  async function handleDeactivate() {
    setBusy(true);
    try {
      await postCustomer("account/deactivate", {});
      setModalMode("none");
      setLocal({ tone: "success", text: "Your account has been deactivated. Redirecting to home…" });
      window.setTimeout(() => window.location.assign("/"), 1200);
    } catch (error) {
      setLocal(messageFor(error));
      setModalMode("none");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    setBusy(true);
    try {
      await postCustomer("account/delete", {});
      setModalMode("none");
      setLocal({ tone: "success", text: "Your account has been deleted. Redirecting to home…" });
      window.setTimeout(() => window.location.assign("/"), 1200);
    } catch (error) {
      setLocal(messageFor(error));
      setModalMode("none");
    } finally {
      setBusy(false);
    }
  }

  return (
    <DashboardShell title="Security" subtitle="Manage sign-in credentials, connected services, and account lifecycle." account={account}>
      <NoticeBox notice={notice ?? local} />
      <AccountState account={account}>
        {(value) => (
          <div className="customer-security-stack">
            {/* Connected Providers */}
            <div className="customer-security customer-security--card">
              <div className="customer-security-card-header">
                <div>
                  <h3 className="customer-security-card-title">Connected Accounts</h3>
                  <p className="customer-security-card-desc">Sign in quickly without needing a separate passphrase.</p>
                </div>
              </div>
              <div className="customer-security-provider-row">
                <div className="customer-security-provider-info">
                  <div className="customer-security-provider-badge">
                    <GoogleGlyph />
                  </div>
                  <div>
                    <strong>Google</strong>
                    <span className="customer-security-provider-status">
                      {value.googleLinked ? "Connected with OAuth" : "Not connected"}
                    </span>
                  </div>
                </div>
                <div>
                  {value.googleLinked ? (
                    <button
                      type="button"
                      className="customer-secondary customer-btn-action"
                      disabled={busy || !value.passwordSet}
                      onClick={() => void unlinkGoogle()}
                    >
                      Unlink Google
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="customer-secondary customer-secondary--google customer-btn-action"
                      disabled={busy}
                      onClick={() => void linkGoogle()}
                    >
                      <GoogleGlyph />
                      <span>Link Google</span>
                    </button>
                  )}
                </div>
              </div>
              {!value.passwordSet && value.googleLinked ? (
                <p className="customer-help customer-help--inline">
                  Set a passphrase below before you can unlink your Google account.
                </p>
              ) : null}
            </div>

            {/* Passphrase Card */}
            <div className="customer-security customer-security--card">
              <div className="customer-security-card-header">
                <div>
                  <h3 className="customer-security-card-title">Passphrase</h3>
                  <p className="customer-security-card-desc">Use a secure passphrase (12 to 128 characters) for email login.</p>
                </div>
              </div>
              {!value.passwordSet ? (
                <form className="customer-form" onSubmit={setPassword}>
                  <label className="customer-form__wide">
                    <span>Set a passphrase</span>
                    <input name="password" type="password" autoComplete="new-password" required minLength={12} maxLength={128} />
                    <small>12 to 128 characters. No arbitrary character complexity rules.</small>
                  </label>
                  <div className="customer-form__actions customer-form__wide">
                    <button className="customer-submit customer-btn-action" disabled={busy}>
                      {busy ? "Saving…" : "Set passphrase"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="customer-passphrase-active">
                  <span className="customer-status-badge customer-status-badge--verified">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Passphrase active
                  </span>
                  <p className="customer-help" style={{ margin: 0 }}>
                    A passphrase is set for this account. To change your passphrase, sign out and use the &quot;Forgot your passphrase?&quot; recovery flow.
                  </p>
                </div>
              )}
            </div>

            {/* Danger Zone */}
            <div className="customer-security customer-security--card customer-danger-zone">
              <div className="customer-security-card-header">
                <div className="customer-danger-icon" aria-hidden="true">
                  <AlertTriangleIcon />
                </div>
                <div>
                  <h3 className="customer-security-card-title customer-danger-title">Danger Zone</h3>
                  <p className="customer-security-card-desc">Irreversible and account-pausing actions.</p>
                </div>
              </div>

              <div className="customer-danger-items">
                {/* Deactivate */}
                <div className="customer-danger-item">
                  <div className="customer-danger-meta">
                    <strong>Deactivate account</strong>
                    <span>Temporarily pause your account. All current sessions will be terminated. You can reactivate anytime by logging back in.</span>
                  </div>
                  <button
                    type="button"
                    className="customer-secondary customer-danger-btn customer-btn-action"
                    disabled={busy}
                    onClick={() => setModalMode("deactivate")}
                  >
                    Deactivate account
                  </button>
                </div>

                {/* Delete */}
                <div className="customer-danger-item">
                  <div className="customer-danger-meta">
                    <strong>Delete account</strong>
                    <span>Permanently delete your personal profile, revoke active sessions, and wipe login credentials per PDPA compliance. Booking records remain anonymized.</span>
                  </div>
                  <button
                    type="button"
                    className="customer-submit customer-submit--danger customer-btn-action"
                    disabled={busy}
                    onClick={() => setModalMode("delete")}
                  >
                    Delete account
                  </button>
                </div>
              </div>
            </div>

            {/* Deactivation Modal */}
            <ConfirmModal
              isOpen={modalMode === "deactivate"}
              title="Deactivate your account?"
              description="You will be immediately signed out from all devices. Your profile and bookings will remain saved, and you can reactivate by signing back in."
              confirmLabel="Yes, deactivate account"
              confirmTone="warning"
              busy={busy}
              onConfirm={() => void handleDeactivate()}
              onCancel={() => setModalMode("none")}
            />

            {/* Deletion Modal */}
            <ConfirmModal
              isOpen={modalMode === "delete"}
              title="Permanently delete account?"
              description="This action cannot be undone. All your personal profile data, phone number, and authentication credentials will be scrubbed immediately. Are you absolutely sure?"
              confirmLabel="Permanently delete my account"
              confirmTone="danger"
              busy={busy}
              onConfirm={() => void handleDelete()}
              onCancel={() => setModalMode("none")}
            />
          </div>
        )}
      </AccountState>
    </DashboardShell>
  );
}


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
