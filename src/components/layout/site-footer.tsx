import Link from "next/link";
import { BrandMark } from "@/components/ui/brand-mark";
import { ArrowUpRightIcon, PinIcon } from "@/components/ui/icons";

const footerGroups = [
  {
    title: "Explore",
    items: [
      ["Fields", "/fields"],
      ["Book now", "/book"],
      ["Field notes", "/articles"],
      ["About", "/about"],
    ],
  },
  {
    title: "Support",
    items: [
      ["Find booking", "/booking/find"],
      ["FAQ", "/faq"],
      ["Contact", "/contact"],
      ["Maintenance", "/maintenance"],
    ],
  },
  {
    title: "Policies",
    items: [
      ["Booking policy", "/policies/booking"],
      ["Refund policy", "/policies/refund"],
      ["Privacy", "/privacy"],
      ["Terms", "/terms"],
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__glow" aria-hidden="true" />
      <div className="shell site-footer__inner">
        <div className="site-footer__brand">
          <BrandMark footer />
          <p>Take your 2 hours. Complete pitch blocks. Live availability. No phone calls. No chaos.</p>
          <div className="footer-location">
            <PinIcon />
            <span>Sunway City · Kuala Lumpur</span>
          </div>
        </div>
        <div className="site-footer__links">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <p>{group.title}</p>
              {group.items.map(([label, href]) => (
                <Link href={href} key={href}>
                  {label}
                  <ArrowUpRightIcon />
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="shell site-footer__base">
        <span>© 2026 ArmourXSports</span>
        <span>Asia/Kuala_Lumpur · MYR</span>
        <span>Live booking · No overlaps · Just football</span>
      </div>
    </footer>
  );
}
