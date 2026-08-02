import type { Metadata } from "next";
import { HomePage } from "@/components/home/home-page";

export const metadata: Metadata = {
  title: "Tempah slot anda - Iskandar Puteri, Johor",
  description: "Bola sepak di ArmourX Sports, Iskandar Puteri. Semak ketersediaan semasa dan tempah dalam talian.",
  alternates: {
    canonical: "/bm",
    languages: { en: "/", "ms-MY": "/bm" },
  },
};

export const dynamic = "force-dynamic";

export default function BahasaMelayuHomePage() {
  return <HomePage locale="bm" />;
}
