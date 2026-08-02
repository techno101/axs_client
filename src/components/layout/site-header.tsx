import Link from "next/link";
import { BrandMark } from "@/components/ui/brand-mark";
import { ButtonLink } from "@/components/ui/button-link";
import { MenuIcon } from "@/components/ui/icons";

const navItems = [
  { href: "/fields", label: "Fields" },
  { href: "/about", label: "About" },
  { href: "/articles", label: "Notes" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner shell">
        <BrandMark />
        <nav className="site-header__nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="site-header__actions">
          <Link className="header-find" href="/sign-in">
            Sign in
          </Link>
          <Link className="header-find" href="/booking/find">
            Find booking
          </Link>
          <ButtonLink href="/book" compact>
            Book a field
          </ButtonLink>
        </div>
        <details className="mobile-menu">
          <summary aria-label="Open navigation">
            <MenuIcon />
            <span>Menu</span>
          </summary>
          <div className="mobile-menu__panel">
            <nav aria-label="Mobile navigation">
              {navItems.map((item, index) => (
                <Link href={item.href} key={item.href}>
                  <span>0{index + 1}</span>
                  {item.label}
                </Link>
              ))}
              <Link href="/booking/find">
                <span>06</span>
                Find booking
              </Link>
              <Link href="/sign-in">
                <span>07</span>
                Sign in
              </Link>
            </nav>
            <ButtonLink href="/book">Book a field</ButtonLink>
          </div>
        </details>
      </div>
    </header>
  );
}
