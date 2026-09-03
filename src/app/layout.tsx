import type { Metadata } from "next";
import { headers } from "next/headers";
import localFont from "next/font/local";
import { PrivacySafeAnalytics } from "@/components/analytics/privacy-safe-analytics";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { BootLoader } from "@/components/motion/boot-loader";
import { VisitorTracker } from "@/components/analytics/visitor-tracker";

import "./globals.css";

const exo2 = localFont({
  src: [
    { path: "../fonts/exo-2-regular.otf", weight: "400" },
    { path: "../fonts/exo-2-semibold.otf", weight: "600" },
    { path: "../fonts/exo-2-extrabold.otf", weight: "800" },
    { path: "../fonts/exo-2-black.otf", weight: "900" },
  ],
  variable: "--font-exo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.armourxsports.com"),
  title: {
    default: "ArmourX Sports | Book your spot in Iskandar Puteri",
    template: "%s | ArmourX Sports",
  },
  description: "Football at ArmourX Sports in Iskandar Puteri, Johor. Check current availability and book online.",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/brand/favicon.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/brand/apple-touch-icon.png",
  },
  openGraph: {
    title: "ArmourX Sports | Book your spot in Iskandar Puteri",
    description: "Check current football availability and book online.",
    type: "website",
    locale: "en_MY",
    alternateLocale: ["ms_MY"],
    url: "https://www.armourxsports.com",
    siteName: "ArmourX Sports",
    images: [{ url: "/brand/og-image.png", width: 1200, height: 630, alt: "ArmourX Sports" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ArmourX Sports | Book your spot in Iskandar Puteri",
    description: "Check current football availability and book online.",
    images: ["/brand/og-image.png"],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "ArmourX Sports SDN BHD",
  url: "https://www.armourxsports.com/",
  address: {
    "@type": "PostalAddress",
    streetAddress: "LOT 165132, Persiaran Medini 3, Sunway City",
    addressLocality: "Iskandar Puteri",
    addressRegion: "Johor",
    postalCode: "79250",
    addressCountry: "MY",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 1.3940655,
    longitude: 103.6340126,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestHeaders = await headers();
  const documentLanguage = requestHeaders.get("x-axs-document-language") === "ms-MY" ? "ms-MY" : "en-MY";

  return (
    <html lang={documentLanguage} className={exo2.variable}>
      <body>
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        <a className="skip-link" href="#main-content">
          {documentLanguage === "ms-MY" ? "Langkau ke kandungan utama" : "Skip to main content"}
        </a>
        <BootLoader />

        <SiteHeader />
        <main id="main-content" tabIndex={-1}>{children}</main>
        <SiteFooter />
        {process.env.VERCEL === "1" ? <PrivacySafeAnalytics /> : null}
      <VisitorTracker /></body>
    </html>
  );
}
