import type { Metadata } from "next";
import { LegalPage } from "@/components/content/legal-page";

export const metadata: Metadata = { title: "Terms", robots: { index: false } };

export default function TermsPage() {
  return <LegalPage label="Terms" title="Terms of use" intro="The binding website and booking terms, governing law, liability language and effective date require owner and legal approval." confirmedItems={["Public booking is for complete field blocks only.", "Authoritative prices and availability come from the backend.", "A browser payment redirect never confirms payment."]} />;
}
