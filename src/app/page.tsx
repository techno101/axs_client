import type { Metadata } from "next";
import { HomePage } from "@/components/home/home-page";

export const metadata: Metadata = {
  title: "Football field booking - Iskandar Puteri, Johor",
  description: "Book a full-size football field at ArmourX Sports, Sunway City. Two fields, six-hour sessions and LED floodlights.",
  alternates: {
    canonical: "/",
    languages: { en: "/", "ms-MY": "/bm" },
  },
};

export const dynamic = "force-dynamic";

export default function EnglishHomePage() {
  return <HomePage locale="en" />;
}
