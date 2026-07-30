import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/customer/customer-forms";

export const metadata: Metadata = { title: "New passphrase", robots: { index: false, follow: false } };
export default function ResetPasswordPage() { return <ResetPasswordForm />; }
