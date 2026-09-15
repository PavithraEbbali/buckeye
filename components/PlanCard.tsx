import type { PlanItem } from "@/lib/content";
import { SITE, ctaLabel, speedLabel } from "@/lib/content";
import { PriceLockup } from "@/components/PriceLockup";

/* One plan card. Everything it prints comes from the PlanItem object —
   name, speeds, price, features and the CTA label. The button text is
   "Call to order" when the plan has a price and "Call for pricing" when it
   does not; that choice lives in ctaLabel(), never in this file. */

export function PlanCard({ plan }: { plan: PlanItem }) {
  const speed = plan.speedDown ? speedLabel(plan) : null;

  return (
    <article className={`pc${plan.isPopular ? " pc--pop" : ""}`} data-reveal>
      {plan.isPopular ? <span className="pc__flag">Most chosen</span> : null}

      <header className="pc__head">
        <h3 className="pc__name">{plan.name}</h3>
        {speed ? <p className="pc__speed">{speed}</p> : null}
      </header>

      <PriceLockup plan={plan} />

      <ul className="pc__list">
        {plan.features.map((f) => (
          <li key={f}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <use href="#i-check" />
            </svg>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <a className="pc__cta" href={`tel:${SITE.phoneTel}`} data-call-cta>
        {ctaLabel(plan)}
      </a>

      <p className="pc__fine">
        {[plan.dataPolicy, plan.contractTerm, plan.equipmentFee].filter(Boolean).join(" · ")}
      </p>
    </article>
  );
}
