"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/ui/brand-mark";
import { ArrowUpRightIcon, PinIcon } from "@/components/ui/icons";
import { homeHref, localeFromPath, shellCopy } from "@/lib/site-copy";

export function SiteFooter() {
  const locale = localeFromPath(usePathname());
  const copy = shellCopy[locale];
  const footerGroups = [
    { title: copy.explore, items: [[copy.fields, "/fields"], [copy.book, "/book"], [copy.notes, "/articles"], [copy.about, "/about"]] },
    { title: copy.support, items: [[copy.findBooking, "/booking/find"], [copy.faq, "/faq"], [copy.contact, "/contact"]] },
    { title: copy.policies, items: [[copy.bookingPolicy, "/policies/booking"], [copy.refundPolicy, "/policies/refund"], [copy.privacy, "/privacy"], [copy.terms, "/terms"]] },
  ];

  return (
    <footer className="site-footer">
      <div className="site-footer__glow" aria-hidden="true" />
      <div className="shell site-footer__inner">
        <div className="site-footer__brand">
          <BrandMark footer href={homeHref(locale)} />
          <p>{copy.footerIntro}</p>
          <div className="footer-location"><PinIcon /><span>LOT 165132, Persiaran Medini 3, Sunway City, 79250 Iskandar Puteri, Johor</span></div>
        </div>
        <div className="site-footer__links">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <p>{group.title}</p>
              {group.items.map(([label, href]) => <Link href={href} key={`${href}-${label}`}>{label}<ArrowUpRightIcon /></Link>)}
            </div>
          ))}
        </div>
      </div>
      <div className="shell site-footer__base">
        <span>© 2026 ArmourX Sports SDN BHD</span><span>{copy.currency}</span><span>{copy.location}</span>
        <a className="site-footer__credit" href="https://github.com/AlMahmud22" target="_blank" rel="noreferrer">Web developer / IT</a>
      </div>
    </footer>
  );
}
