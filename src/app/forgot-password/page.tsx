import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/customer/customer-forms";

export const metadata: Metadata = { title: "Reset passphrase", robots: { index: false, follow: false } };
export default function ForgotPasswordPage() { return <ForgotPasswordForm />; }
