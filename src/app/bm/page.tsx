import type { Metadata } from "next";
import { HomePage } from "@/components/home/home-page";

export const metadata: Metadata = {
  title: "Tempahan padang bola sepak - Iskandar Puteri, Johor",
  description: "Tempah padang bola sepak bersaiz penuh di ArmourX Sports, Sunway City. Dua padang, sesi enam jam dan lampu limpah LED.",
  alternates: {
    canonical: "/bm",
    languages: { en: "/", "ms-MY": "/bm" },
  },
};

export const dynamic = "force-dynamic";

export default function BahasaMelayuHomePage() {
  return <HomePage locale="bm" />;
}
