import Link from "next/link";

export function BrandMark({ footer = false }: { footer?: boolean }) {
  return (
    <Link className={`brand-mark${footer ? " brand-mark--footer" : ""}`} href="/" aria-label="ArmourXSports home">
      <svg className="brand-mark__shield" viewBox="0 0 42 48" aria-hidden="true">
        <path d="M21 2 38 8v13c0 11-6.6 19.2-17 25C10.6 40.2 4 32 4 21V8L21 2Z" />
        <path d="m12.5 29 8.5-17 8.5 17M16 23h10" />
      </svg>
      <span className="brand-mark__type">
        <span>ARMOUR</span>
        <strong>XSPORTS</strong>
      </span>
    </Link>
  );
}
