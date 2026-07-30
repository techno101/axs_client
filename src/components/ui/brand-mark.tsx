import Link from "next/link";

export function BrandMark({ footer = false }: { footer?: boolean }) {
  return (
    <Link className={`brand-mark${footer ? " brand-mark--footer" : ""}`} href="/" aria-label="ArmourXSports home">
      <img src="/brand/armourxsports-logo.png" alt="ArmourXSports" />
    </Link>
  );
}
