import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button-link";

export const metadata: Metadata = {
  title: "Account availability",
  robots: { index: false, follow: false },
};

/**
 * This is an intentionally inactive UI boundary, not a client-side auth
 * simulation. Public accounts need admin-owned server routes, password
 * controls and an owner-approved email-delivery configuration first.
 */
export default function AccountPage() {
  return (
    <section className="system-view">
      <div className="shell system-view__content">
        <p>Optional customer accounts</p>
        <h1>Guest booking stays the default.</h1>
        <span>Email-and-password accounts are not enabled in this environment. If Operations enables them later, they will begin with new account activity only; existing guest bookings will not be attached or backfilled.</span>
        <div className="system-view__actions"><ButtonLink href="/booking/find" variant="light">Find a booking</ButtonLink><ButtonLink href="/book" variant="outline">Book as guest</ButtonLink></div>
        <p className="muted">Google sign-in is deliberately unavailable until an owner configures and approves OAuth. No Google request is made from this page.</p>
      </div>
    </section>
  );
}
