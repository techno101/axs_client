"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { animate, createScope, stagger, type TargetsParam } from "animejs";
import { BrandMark } from "@/components/ui/brand-mark";
import { homeHref, localeFromPath, shellCopy } from "@/lib/site-copy";

export function SiteHeader() {
  const pathname = usePathname();
  const locale = localeFromPath(pathname);
  const copy = shellCopy[locale];
  const isBm = locale === "bm";
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const scopeRef = useRef<ReturnType<typeof createScope> | null>(null);
  const lineAnimationRef = useRef<{ restart: () => void } | null>(null);

  const navItems = [
    { href: "/fields", label: copy.fields },
    { href: "/about", label: copy.about },
    { href: "/articles", label: copy.notes },
    { href: "/faq", label: copy.faq },
    { href: "/contact", label: copy.contact },
    { href: "/booking/find", label: copy.findBooking },
  ];

  // Stagger the menu links in when opened (anime.js). Pure decoration on top of CSS visibility.
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const menu = menuRef.current;
    if (!menu || reduced) return;

    scopeRef.current = createScope({ root: menu }).add(() => {
      lineAnimationRef.current = animate(menu.querySelectorAll<HTMLElement>(".menu-line") as TargetsParam, {
        translateY: ["110%", "0%"],
        opacity: [0, 1],
        duration: 620,
        delay: stagger(70),
        ease: "out(4)",
        autoplay: false,
      });
    });

    return () => scopeRef.current?.revert();
  }, []);

  useEffect(() => {
    if (open) {
      document.documentElement.classList.add("menu-locked");
      document.body.style.overflow = "hidden";
      lineAnimationRef.current?.restart();
      menuRef.current?.querySelector<HTMLElement>(".site-menu__close")?.focus();
    } else {
      document.documentElement.classList.remove("menu-locked");
      document.body.style.overflow = "";
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const menu = menuRef.current;
    if (!menu) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const focusables = Array.from(menu.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')).filter((element) => element.offsetParent !== null);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <div className="site-header__inner shell">
        <BrandMark href={homeHref(locale)} />
        <nav className="site-header__nav" aria-label={copy.navLabel}>
          {navItems.map((item) => (
            <Link href={item.href} key={`${item.href}-${item.label}`}>{item.label}</Link>
          ))}
        </nav>
        <div className="site-header__actions">
          <Link className="header-language" href={isBm ? "/" : "/bm"} hrefLang={isBm ? "en" : "ms"} aria-label={copy.switchLanguage}>{isBm ? "EN" : "BM"}</Link>
          <button className="site-header__menu" type="button" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="site-menu">
            <span>Menu</span>
            <i aria-hidden="true" />
            <i aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className={`site-menu${open ? " menu-open" : ""}`} id="site-menu" ref={menuRef} role="dialog" aria-modal="true" aria-label={copy.navLabel} aria-hidden={!open}>
        <button className="site-menu__scrim" type="button" tabIndex={-1} aria-hidden="true" onClick={close} />
        <aside className="site-menu__panel">
          <div className="site-menu__top shell">
            <BrandMark href={homeHref(locale)} />
            <button className="site-menu__close" type="button" onClick={close} aria-label={copy.closeMenu}>
              <span>Close</span>
              <i aria-hidden="true" />
            </button>
          </div>
          <nav className="site-menu__nav shell" aria-label={copy.navLabel}>
            {navItems.map((item, index) => (
              <Link href={item.href} key={`${item.href}-${item.label}`} onClick={close} className="menu-line" style={{ "--menu-i": index } as React.CSSProperties}>
                <span>{item.label}</span>
                <b aria-hidden="true">0{index + 1}</b>
              </Link>
            ))}
          </nav>
          <div className="site-menu__foot shell">
            <Link className="site-header__book" href="/book" onClick={close}>{copy.book}</Link>
            <Link href={isBm ? "/" : "/bm"} hrefLang={isBm ? "en" : "ms"} onClick={close}>{isBm ? "English" : "Bahasa Melayu"}</Link>
          </div>
        </aside>
      </div>
    </header>
  );
}
