import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRightIcon, ArrowUpRightIcon } from "@/components/ui/icons";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "lime" | "light" | "outline" | "dark";
  compact?: boolean;
  external?: boolean;
};

export function ButtonLink({
  href,
  children,
  variant = "lime",
  compact = false,
  external = false,
}: ButtonLinkProps) {
  const className = `button-link button-link--${variant}${compact ? " button-link--compact" : ""}`;
  const content = (
    <>
      <span>{children}</span>
      <span className="button-link__icon">
        {external ? <ArrowUpRightIcon /> : <ArrowRightIcon />}
      </span>
    </>
  );

  if (external) {
    return (
      <a className={className} href={href} target="_blank" rel="noreferrer">
        {content}
      </a>
    );
  }

  return (
    <Link className={className} href={href}>
      {content}
    </Link>
  );
}
