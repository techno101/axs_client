import type { Metadata } from "next";
import { LegalPage } from "@/components/content/legal-page";

export const metadata: Metadata = { title: "Booking policy", robots: { index: false } };

export default function BookingPolicyPage() {
  return <LegalPage label="Booking policy" title="Booking policy" intro="Cancellation, rescheduling, customer corrections, blocked reasons and final venue-use rules are pending owner confirmation." confirmedItems={["Two fields are available at launch.", "Morning is 09:00–15:00 at RM600.", "Evening is 15:00–21:00 at RM800.", "The booking window is up to 90 days and closes 60 minutes before the block."]} />;
}
