import type { Metadata } from "next";
import { SecurityForm } from "@/components/customer/customer-forms";

export const metadata: Metadata = { title: "Account security", robots: { index: false, follow: false } };
export default function AccountSecurityPage() { return <SecurityForm />; }
