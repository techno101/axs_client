import { Suspense } from "react";
import type { Metadata } from "next";
import { GoogleReturn } from "@/components/customer/customer-forms";

export const metadata: Metadata = { title: "Google sign-in", robots: { index: false, follow: false } };
export default function GoogleReturnPage() {
  return (
    <Suspense fallback={<section className="customer-shell"><div className="shell"><p className="customer-notice customer-notice--info">Completing your Google sign-in…</p></div></section>}>
      <GoogleReturn />
    </Suspense>
  );
}
