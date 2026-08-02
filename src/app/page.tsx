import type { Metadata } from "next";
import { HomePage } from "@/components/home/home-page";

export const metadata: Metadata = {
  title: "Book your spot - Iskandar Puteri, Johor",
  description: "Football at ArmourX Sports in Iskandar Puteri. Check current availability and book online.",
  alternates: {
    canonical: "/",
    languages: { en: "/", "ms-MY": "/bm" },
  },
};

export const dynamic = "force-dynamic";

export default function EnglishHomePage() {
  return <HomePage locale="en" />;
}
