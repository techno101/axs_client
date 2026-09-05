import { Suspense } from "react";
import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/customer/customer-forms";

export const metadata: Metadata = { title: "New passphrase", robots: { index: false, follow: false } };
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<section className="customer-shell"><div className="shell"><p className="customer-notice customer-notice--info">Loading…</p></div></section>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
