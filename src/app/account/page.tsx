import type { Metadata } from "next";
import { AccountOverview } from "@/components/customer/customer-forms";

export const metadata: Metadata = { title: "Your account", robots: { index: false, follow: false } };
export default function AccountPage() { return <AccountOverview />; }
