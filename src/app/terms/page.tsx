import type { Metadata } from "next";
import { LegalPage } from "@/components/content/legal-page";

export const metadata: Metadata = { title: "Terms", robots: { index: false } };

export default function TermsPage() {
  return <LegalPage label="Terms" title="Terms of use" intro="These terms explain the essential conditions for using the ArmourX Sports website and online booking service." confirmedItems={["Bookings cover one complete field session, not an hourly or per-player charge.", "The current field, date, session and price are shown before payment.", "A field is confirmed only after payment is verified and a booking reference is issued.", "Customers must use the venue safely and follow reasonable directions from venue staff."]} />;
}
