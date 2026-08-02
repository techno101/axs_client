import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button-link";
import { ClockIcon } from "@/components/ui/icons";

export const metadata: Metadata = { title: "Under maintenance", robots: { index: false } };

export default function MaintenancePage() {
  return (
    <section className="system-view">
      <div className="system-view__grid" aria-hidden="true" />
      <div className="system-view__content">
        <div className="system-view__icon"><ClockIcon /></div>
        <p>Pitch inspection in progress</p>
        <h1>We&apos;re updating the field.</h1>
        <span>Good things take time. We&apos;ll be back shortly with a better experience. Existing bookings are safe.</span>
        <div><ButtonLink href="/" variant="light">Return home</ButtonLink><ButtonLink href="/booking/find" variant="outline">Find booking</ButtonLink></div>
      </div>
    </section>
  );
}
