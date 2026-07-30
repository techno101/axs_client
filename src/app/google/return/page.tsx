import type { Metadata } from "next";
import { GoogleReturn } from "@/components/customer/customer-forms";

export const metadata: Metadata = { title: "Google sign-in", robots: { index: false, follow: false } };
export default function GoogleReturnPage() { return <GoogleReturn />; }
