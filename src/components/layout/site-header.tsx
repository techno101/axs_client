"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/ui/brand-mark";
import { MenuIcon } from "@/components/ui/icons";
import { homeHref, localeFromPath, shellCopy } from "@/lib/site-copy";

export function SiteHeader() {
  const pathname = usePathname();
  const locale = localeFromPath(pathname);
  const copy = shellCopy[locale];
  const isBm = locale === "bm";
  const navItems = [
    { href: isBm ? "/bm#ground" : "/#ground", label: copy.fields },
    { href: isBm ? "/bm#venue" : "/#venue", label: copy.about },
    { href: isBm ? "/bm#faq" : "/#faq", label: copy.faq },
    { href: "/contact", label: copy.contact },
  ];

  return (
    <header className="site-header">
      <div className="site-header__inner shell">
        <BrandMark href={homeHref(locale)} />
        <nav className="site-header__nav" aria-label={copy.navLabel}>
          {navItems.map((item) => <Link href={item.href} key={`${item.href}-${item.label}`}>{item.label}</Link>)}
        </nav>
        <div className="site-header__actions">
          <Link className="header-language" href={isBm ? "/" : "/bm"} hrefLang={isBm ? "en" : "ms"} aria-label={copy.switchLanguage}>{isBm ? "EN" : "BM"}</Link>
          <Link className="site-header__book" href="/book">{copy.book}</Link>
        </div>
        <details className="mobile-menu" suppressHydrationWarning>
          <summary aria-label={copy.menu}><MenuIcon /><span>{copy.menu}</span></summary>
          <div className="mobile-menu__panel">
            <nav aria-label={copy.navLabel}>
              {navItems.map((item) => <Link href={item.href} key={`${item.href}-${item.label}`}>{item.label}</Link>)}
              <Link href={isBm ? "/" : "/bm"} hrefLang={isBm ? "en" : "ms"}>{isBm ? "English" : "Bahasa Melayu"}</Link>
            </nav>
            <Link className="site-header__book" href="/book">{copy.book}</Link>
          </div>
        </details>
      </div>
    </header>
  );
}
