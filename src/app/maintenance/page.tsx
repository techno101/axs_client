import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button-link";
import { ClockIcon } from "@/components/ui/icons";

export const metadata: Metadata = { title: "Maintenance", robots: { index: false } };

export default function MaintenancePage() {
  return (
    <section className="system-view">
      <div className="system-view__grid" aria-hidden="true" />
      <div className="system-view__content">
        <div className="system-view__icon"><ClockIcon /></div>
        <p>Planned maintenance</p>
        <h1>Booking is temporarily unavailable.</h1>
        <span>Booking is temporarily unavailable during maintenance. Existing booking lookup may remain available when the API reports it as healthy.</span>
        <div><ButtonLink href="/" variant="light">Return home</ButtonLink><ButtonLink href="/booking/find" variant="outline">Find booking</ButtonLink></div>
      </div>
    </section>
  );
}
