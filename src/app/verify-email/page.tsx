import { Suspense } from "react";
import type { Metadata } from "next";
import { VerifyEmailForm } from "@/components/customer/customer-forms";

export const metadata: Metadata = { title: "Verify email", robots: { index: false, follow: false } };
export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<section className="customer-shell"><div className="shell"><p className="customer-notice customer-notice--info">Loading…</p></div></section>}>
      <VerifyEmailForm />
    </Suspense>
  );
}
