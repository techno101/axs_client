"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/ui/brand-mark";
import { ButtonLink } from "@/components/ui/button-link";
import { MenuIcon } from "@/components/ui/icons";
import { homeHref, localeFromPath, shellCopy } from "@/lib/site-copy";

export function SiteHeader() {
  const pathname = usePathname();
  const locale = localeFromPath(pathname);
  const copy = shellCopy[locale];
  const isBm = locale === "bm";
  const navItems = [
    { href: isBm ? "/bm#fields" : "/fields", label: copy.fields },
    { href: isBm ? "/bm#venue" : "/about", label: copy.about },
    { href: isBm ? "/bm#faq" : "/articles", label: copy.notes },
    { href: isBm ? "/bm#faq" : "/faq", label: copy.faq },
    { href: isBm ? "/bm#venue" : "/contact", label: copy.contact },
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
          <Link className="header-find" href="/sign-in">{copy.signIn}</Link>
          <Link className="header-find" href="/booking/find">{copy.findBooking}</Link>
          <ButtonLink href="/book" compact>{copy.book}</ButtonLink>
        </div>
        <details className="mobile-menu" suppressHydrationWarning>
          <summary aria-label={copy.menu}><MenuIcon /><span>{copy.menu}</span></summary>
          <div className="mobile-menu__panel">
            <nav aria-label={copy.navLabel}>
              {navItems.map((item) => <Link href={item.href} key={`${item.href}-${item.label}`}>{item.label}</Link>)}
              <Link href="/booking/find">{copy.findBooking}</Link>
              <Link href="/sign-in">{copy.signIn}</Link>
              <Link href={isBm ? "/" : "/bm"} hrefLang={isBm ? "en" : "ms"}>{isBm ? "English" : "Bahasa Melayu"}</Link>
            </nav>
            <ButtonLink href="/book">{copy.book}</ButtonLink>
          </div>
        </details>
      </div>
    </header>
  );
}
