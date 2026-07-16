import { AlertIcon, CheckIcon } from "@/components/ui/icons";

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
          <span>Last reviewed</span>
          <strong>Pending owner approval</strong>
          <span>Status</span>
          <strong>Draft placeholder</strong>
        </aside>
        <article>
          <p className="eyebrow"><span aria-hidden="true" />Customer policy</p>
          <h1>{title}</h1>
          <p className="legal-page__intro">{intro}</p>
          <div className="policy-warning">
            <AlertIcon />
            <div>
              <strong>This is not final legal or operational policy.</strong>
              <p>ArmourXSports will publish owner-approved copy before production launch. No cancellation, rescheduling or refund entitlement is invented in this UI phase.</p>
            </div>
          </div>
          {confirmedItems.length ? (
            <section>
              <h2>Confirmed launch facts</h2>
              <ul>
                {confirmedItems.map((item) => <li key={item}><CheckIcon />{item}</li>)}
              </ul>
            </section>
          ) : null}
          <section>
            <h2>What happens next</h2>
            <p>The policy owner must approve the effective date, contact channel, full terms and any customer remedies. The final content will be supplied through the controlled public-content path.</p>
          </section>
        </article>
      </div>
    </section>
  );
}
