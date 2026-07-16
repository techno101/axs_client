import Link from "next/link";
import { BrandMark } from "@/components/ui/brand-mark";
import { ArrowUpRightIcon, PinIcon } from "@/components/ui/icons";

const footerGroups = [
  {
    title: "Explore",
    items: [
      ["Fields", "/fields"],
      ["Booking", "/book"],
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
          <p>Built for the full match day. Two fields, two complete blocks, one clear booking path.</p>
          <div className="footer-location">
            <PinIcon />
            <span>Venue address pending owner confirmation</span>
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
        <span>Live booking · verified payments</span>
      </div>
    </footer>
  );
}
