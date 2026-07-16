import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://armourxsports.example"),
  title: {
    default: "ArmourXSports | Own the pitch",
    template: "%s | ArmourXSports",
  },
  description:
    "Book complete morning or evening football field blocks with ArmourXSports.",
  openGraph: {
    title: "ArmourXSports",
    description: "Two fields. Two complete blocks. Your match day.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main-content" tabIndex={-1}>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
