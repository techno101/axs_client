import type { Metadata } from "next";
import { ProfileForm } from "@/components/customer/customer-forms";

export const metadata: Metadata = { title: "Account profile", robots: { index: false, follow: false } };
export default function AccountProfilePage() { return <ProfileForm />; }
