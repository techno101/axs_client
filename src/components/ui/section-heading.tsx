import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow: string;
  title: ReactNode;
  intro?: string;
  tone?: "dark" | "light";
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  intro,
  tone = "dark",
  align = "left",
}: SectionHeadingProps) {
  return (
    <div className={`section-heading section-heading--${tone} section-heading--${align}`}>
      <p className="eyebrow">
        <span aria-hidden="true" />
        {eyebrow}
      </p>
      <h2>{title}</h2>
      {intro ? <p className="section-heading__intro">{intro}</p> : null}
    </div>
  );
}
