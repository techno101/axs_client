import type { Metadata } from "next";
import { FindBookingForm } from "@/components/booking/find-booking-form";
import { PageHero } from "@/components/layout/page-hero";

export const metadata: Metadata = {
  title: "Find a booking",
  description: "Retrieve a privacy-limited ArmourXSports booking with reference and phone.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function FindBookingPage() {
  return (
    <>
      <PageHero
        compact
        eyebrow="Private lookup"
        title={<>Find your<br />booking.</>}
        intro="Enter the booking reference and matching phone number. The live API rate-limits attempts and returns privacy-limited details only."
      />
      <section className="finder-section">
        <div className="shell">
          <FindBookingForm />
        </div>
      </section>
    </>
  );
}
