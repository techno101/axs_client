import Link from "next/link";
import Image from "next/image";

export function BrandMark({ footer = false, href = "/" }: { footer?: boolean; href?: string }) {
  return (
    <Link className={`brand-mark${footer ? " brand-mark--footer" : ""}`} href={href} aria-label="ArmourX Sports home">
      <Image src="/brand/armourxsports-logo.webp" alt="ArmourX Sports" width={720} height={139} priority={!footer} sizes={footer ? "210px" : "180px"} />
    </Link>
  );
}
