import type { Metadata } from "next";
import { AccountBookings } from "@/components/customer/customer-forms";

export const metadata: Metadata = { title: "Your bookings", robots: { index: false, follow: false } };
export default function AccountBookingsPage() { return <AccountBookings />; }
