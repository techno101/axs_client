"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { customerApi, postCustomer } from "@/lib/customer-api";

export type CustomerSessionState = "loading" | "guest" | "member";

/** Shared session probe for the shell. Guests and failed probes both render as signed-out. */
export function useCustomerSession(): { state: CustomerSessionState; signOut: () => Promise<void> } {
  const [state, setState] = useState<CustomerSessionState>("loading");

  useEffect(() => {
    let active = true;
    void customerApi<{ account?: { status?: string } | null }>("session", { method: "GET" })
      .then((session) => { if (active) setState(session?.account ? "member" : "guest"); })
      .catch(() => { if (active) setState("guest"); });
    return () => { active = false; };
  }, []);

  const signOut = useCallback(async () => {
    try { await postCustomer("/logout", {}); } catch { /* local state is cleared regardless */ }
    window.location.assign("/");
  }, []);

  return { state, signOut };
}

type AuthMenuLabels = { signIn: string; createAccount: string; myAccount: string; signOut: string };

/** Session-aware header actions: sign-in/create-account for guests, account/sign-out for members. */
export function AuthMenu({ state, onSignOut, labels, busy }: { state: CustomerSessionState; onSignOut: () => void; labels: AuthMenuLabels; busy?: boolean }) {
  if (state === "loading") return <span className="auth-menu auth-menu--loading" aria-hidden="true" />;
  if (state === "guest") {
    return (
      <span className="auth-menu auth-menu--guest">
        <Link className="auth-menu__signin" href="/sign-in">{labels.signIn}</Link>
        <Link className="auth-menu__signup" href="/sign-up">{labels.createAccount}</Link>
      </span>
    );
  }
  return (
    <span className="auth-menu auth-menu--member">
      <Link className="auth-menu__account" href="/account">{labels.myAccount}</Link>
      <button className="auth-menu__signout" type="button" disabled={busy} onClick={onSignOut}>{busy ? "…" : labels.signOut}</button>
    </span>
  );
}
