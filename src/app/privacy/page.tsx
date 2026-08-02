import type { Metadata } from "next";
import { LegalPage } from "@/components/content/legal-page";

export const metadata: Metadata = { title: "Privacy notice", robots: { index: false } };

export default function PrivacyPage() {
  return <LegalPage label="Privacy" title="Privacy notice" intro="ArmourX Sports uses the information you provide to manage bookings, customer accounts, receipts and support requests." confirmedItems={["Guest bookings use your name and phone; email is optional.", "Payment is handled by HitPay. ArmourX Sports does not store your full card details.", "Customer, booking-result and account routes are excluded from site analytics.", "Ask to access or correct your information by emailing armourxsports@gmail.com."]} />;
}
