import type { Metadata } from "next";
import { LegalPage } from "@/components/content/legal-page";

export const metadata: Metadata = { title: "Booking policy", robots: { index: false } };

export default function BookingPolicyPage() {
  return <LegalPage label="Booking policy" title="Booking policy" intro="Choose a date, field and complete session. Review the current total before continuing to payment." confirmedItems={["Morning is 09:00–15:00 at RM600; evening is 15:00–21:00 at RM800.", "Bookings open up to 90 days ahead and close 60 minutes before the session.", "Guest booking is available without an account.", "There is no self-service cancellation. Contact the team with your booking reference for changes.", "Play normally continues in rain. Operations decides any remedy when conditions are too severe at the venue."]} />;
}
