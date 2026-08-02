import { CheckIcon } from "@/components/ui/icons";

type LegalPageProps = {
  label: string;
  title: string;
  intro: string;
  confirmedItems?: string[];
};

export function LegalPage({ label, title, intro, confirmedItems = [] }: LegalPageProps) {
  return (
    <section className="legal-page">
      <div className="shell legal-page__grid">
        <aside>
          <p>{label}</p>
          <span>Last updated</span>
          <strong>2 August 2026</strong>
          <span>Questions</span>
          <strong><a href="mailto:armourxsports@gmail.com">armourxsports@gmail.com</a></strong>
        </aside>
        <article>
          <p className="eyebrow"><span aria-hidden="true" />Customer policy</p>
          <h1>{title}</h1>
          <p className="legal-page__intro">{intro}</p>
          {confirmedItems.length ? (
            <section>
              <h2>Key points</h2>
              <ul>
                {confirmedItems.map((item) => <li key={item}><CheckIcon />{item}</li>)}
              </ul>
            </section>
          ) : null}
          <section>
            <h2>Need help?</h2>
            <p>Contact ArmourX Sports at armourxsports@gmail.com and include your booking reference when your question concerns an existing booking.</p>
          </section>
        </article>
      </div>
    </section>
  );
}
