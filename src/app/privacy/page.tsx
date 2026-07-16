import type { Metadata } from "next";
import { LegalPage } from "@/components/content/legal-page";

export const metadata: Metadata = { title: "Privacy", robots: { index: false } };

export default function PrivacyPage() {
  return <LegalPage label="Privacy" title="Privacy notice" intro="The final legal notice, data-controller identity, retention details and customer rights still require legal approval." confirmedItems={["Find-booking requires a reference plus matching phone.", "PII and payment identifiers must not enter analytics or durable URLs.", "Booking details are sent only to the ArmourXSports API for the requested operation."]} />;
}
