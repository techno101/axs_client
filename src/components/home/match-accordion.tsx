"use client";

import { useEffect, useRef, useState } from "react";
import { animate, createScope } from "animejs";

type MatchAccordionProps = {
  items: Array<{ question: string; answer: string }>;
};

export function MatchAccordion({ items }: MatchAccordionProps) {
  const [openIndex, setOpenIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = rootRef.current;
    if (!root || reduced) return;

    const scope = createScope({ root }).add(() => {
      root.querySelectorAll<HTMLElement>("[data-accordion-panel]").forEach((panel) => {
        const target = openIndex === -1 || panel.closest("details") === root.querySelectorAll("details")[openIndex] ? panel.scrollHeight : 0;
        animate(panel, { height: target, duration: 420, ease: "out(3)" });
      });
    });

    return () => scope.revert();
  }, [openIndex, items]);

  return (
    <div className="match-faq__list" ref={rootRef}>
      {items.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <details key={faq.question} open={isOpen}>
            <summary onClick={(event) => { event.preventDefault(); setOpenIndex(isOpen ? -1 : index); }}>
              {faq.question}<span aria-hidden="true" />
            </summary>
            <div data-accordion-panel style={{ height: isOpen ? undefined : 0, overflow: "hidden" }}>
              <p>{faq.answer}</p>
            </div>
          </details>
        );
      })}
    </div>
  );
}
