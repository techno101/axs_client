import type { Metadata } from "next";
import { headers } from "next/headers";
import localFont from "next/font/local";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PrivacySafeAnalytics } from "@/components/analytics/privacy-safe-analytics";
import "./globals.css";

const clashDisplay = localFont({
  src: [
    { path: "../fonts/clash-display-500.woff2", weight: "500" },
    { path: "../fonts/clash-display-600.woff2", weight: "600" },
    { path: "../fonts/clash-display-700.woff2", weight: "700" },
  ],
  variable: "--font-display",
  display: "swap",
});

const generalSans = localFont({
  src: [
    { path: "../fonts/general-sans-400.woff2", weight: "400" },
    { path: "../fonts/general-sans-500.woff2", weight: "500" },
    { path: "../fonts/general-sans-600.woff2", weight: "600" },
  ],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.armourxsports.com"),
  title: {
    default: "ArmourX Sports — Football field booking, Iskandar Puteri",
    template: "%s — ArmourX Sports",
  },
  description:
    "Book a full-size football field at ArmourX Sports, Sunway City. RM 600 morning, RM 800 evening. Two fields. Floodlit. Parking and facilities included.",
  icons: {
    icon: "/brand/armourxsports-logo.png",
    apple: "/brand/armourxsports-logo.png",
  },
  openGraph: {
    title: "ArmourX Sports — Book a football field in Iskandar Puteri",
    description: "Two full-size fields. RM 600 morning. RM 800 evening. Book online in seconds.",
    type: "website",
    locale: "en_MY",
    alternateLocale: ["ms_MY"],
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
    <html lang={documentLanguage} className={`${clashDisplay.variable} ${generalSans.variable}`}>
      <body>
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        <a className="skip-link" href="#main-content">
          {documentLanguage === "ms-MY" ? "Langkau ke kandungan utama" : "Skip to main content"}
        </a>
        <SiteHeader />
        <main id="main-content" tabIndex={-1}>{children}</main>
        <SiteFooter />
        {process.env.VERCEL === "1" ? <PrivacySafeAnalytics /> : null}
      </body>
    </html>
  );
}
