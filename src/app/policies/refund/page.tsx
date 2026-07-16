import type { Metadata } from "next";
import { LegalPage } from "@/components/content/legal-page";

export const metadata: Metadata = { title: "Refund policy", robots: { index: false } };

export default function RefundPolicyPage() {
  return <LegalPage label="Refund policy" title="Refund policy" intro="Refund eligibility, timeframes, methods, exceptions and the responsible support channel are pending owner confirmation." />;
}
