import { FAQS } from "@/lib/content";

/* Native details/summary accordion: open/close works without JavaScript and
   every answer is present in the DOM on first paint, so crawlers and answer
   engines read the full text. The same FAQS array feeds the FAQPage JSON-LD
   in app/page.tsx, so the markup and the schema cannot drift apart. */

export function Faq() {
  return (
    <div className="qa__list">
      {FAQS.map((item, i) => (
        <details className="qa__item" key={item.q} name="buckeye-faq" open={i === 0}>
          <summary className="qa__q">
            <span className="qa__n">{String(i + 1).padStart(2, "0")}</span>
            <span className="qa__qt">{item.q}</span>
            <svg className="qa__ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <use href="#i-plus" />
            </svg>
          </summary>
          <div className="qa__a">
            <p>{item.a}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
