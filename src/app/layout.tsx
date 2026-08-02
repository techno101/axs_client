import type { Metadata } from "next";
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
    default: "ArmourXSports — Take your 2 hours.",
    template: "%s — ArmourXSports",
  },
  description:
    "Complete pitch blocks. Live availability. No chaos. Just football. Book your field and take the 2 hours you deserve.",
  icons: {
    icon: "/brand/armourxsports-logo.png",
    apple: "/brand/armourxsports-logo.png",
  },
  openGraph: {
    title: "ArmourXSports — Take your 2 hours.",
    description: "Book a complete pitch block. No overlaps. No phone calls. Just football.",
    type: "website",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "ArmourXSports",
  url: "https://www.armourxsports.com/",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://www.armourxsports.com/fields",
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${clashDisplay.variable} ${generalSans.variable}`}>
      <body>
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main-content" tabIndex={-1}>{children}</main>
        <SiteFooter />
        {process.env.VERCEL === "1" ? <PrivacySafeAnalytics /> : null}
      </body>
    </html>
  );
}
