import type { Metadata } from "next";
import { LegalPage } from "@/components/content/legal-page";

export const metadata: Metadata = { title: "Refund policy", robots: { index: false } };

export default function RefundPolicyPage() {
  return <LegalPage label="Refund policy" title="Cancellation and refund requests" intro="ArmourX Sports reviews cancellation, rescheduling and refund requests manually. The website does not promise an automatic refund." confirmedItems={["Email armourxsports@gmail.com with your booking reference and request.", "Submitting a request does not cancel the booking or guarantee a refund.", "Weather remedies are decided by Operations at the venue when conditions are too severe.", "If a refund is approved, the team will confirm the method and expected processing steps directly."]} />;
}
