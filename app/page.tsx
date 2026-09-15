import { CurrentYear } from "@/components/CurrentYear";
import { SiteScripts } from "@/components/SiteScripts";
import { IconSprite } from "@/components/IconSprite";
import { PlanCard } from "@/components/PlanCard";
import { PriceLockup } from "@/components/PriceLockup";
import { ZipCheck } from "@/components/ZipCheck";
import { Faq } from "@/components/Faq";
import {
  SITE,
  DISCLOSURE,
  HERO,
  TRUST_CHIPS,
  FAQS,
  FINE_PRINT,
  STEPS,
  VAS_ITEMS,
  WHY_ITEMS,
  COVERAGE_AREAS,
  COVERAGE_GROUPS,
  SECTION_COPY,
  activeSections,
  plansFor,
  gridPlans,
  heroPlan,
  priceValue,
  priceLabel,
  speedLabel,
  srcSetFor,
} from "@/lib/content";

/* ---------------------------------------------------------------------------
   JSON-LD — generated from lib/content.ts, never hand-typed.

   Organization describes the operator, not the carrier. There is no
   LocalBusiness node: this is a phone ordering line, not a place of business,
   and asserting premises it does not have would be a fabricated claim.
   Offers are emitted only for plans that carry a real price; a plan priced
   "Call for pricing" is omitted, because an Offer without a price is invalid.
   ------------------------------------------------------------------------ */

const sections = activeSections();
const hero = heroPlan();

const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.brandName,
  description: `Independent authorized agent for ${SITE.carrier} internet, TV, wireless and home phone services.`,
  disambiguatingDescription: `Independent authorized agent of ${SITE.carrier}. This site is not operated by ${SITE.carrier} or Block Communications, Inc.`,
  url: SITE.url,
  telephone: SITE.phoneTel,
  email: SITE.email,
  image: SITE.socialImage,
  areaServed: COVERAGE_AREAS.map((name) => ({ "@type": "Place", name })),
};

const WEBSITE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.brandName,
  url: SITE.url,
  publisher: { "@type": "Organization", name: SITE.brandName },
};

const OFFER_JSONLD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: `${SITE.carrier} plans available through an authorized agent`,
  itemListElement: sections.flatMap((section) =>
    plansFor(section.line)
      .filter((plan) => priceValue(plan) !== null)
      .map((plan, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Product",
          name: plan.name,
          description: plan.features.join(" "),
          brand: { "@type": "Brand", name: SITE.carrier },
          offers: {
            "@type": "Offer",
            price: priceValue(plan),
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: priceValue(plan),
              priceCurrency: "USD",
              billingIncrement: 1,
              unitText: "MONTH",
            },
          },
        },
      }))
  ),
};

const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSONLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSONLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(OFFER_JSONLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSONLD) }} />

      <IconSprite />

      {/* ============ Top disclosure bar ============ */}
      <div className="co-topbar">
        <div className="co-container">
          <span>
            <strong>{DISCLOSURE}</strong> — not the official {SITE.carrier} site.
          </span>
          <span>
            Order &amp; support:{" "}
            <a href={`tel:${SITE.phoneTel}`} data-call-cta>
              {SITE.phoneDisplay}
            </a>
          </span>
        </div>
      </div>

      {/* ============ Header ============ */}
      <header className="co-header" data-header>
        <div className="co-container">
          <nav className="co-nav" aria-label="Primary">
            <a className="co-brand" href="#top" aria-label={`${SITE.brandName} — home`}>
              <svg className="co-brand__mark" viewBox="0 0 48 48" aria-hidden="true">
                <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#05a2f6"/><stop offset="1" stopColor="#002e6c"/></linearGradient></defs>
                <rect x="2" y="2" width="44" height="44" rx="13" fill="url(#bg)"/>
                <path d="M14 27a11 11 0 0 1 20 0" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round"/>
                <path d="M18.5 30.5a6 6 0 0 1 11 0" fill="none" stroke="#ffc40d" strokeWidth="3.4" strokeLinecap="round"/>
                <circle cx="24" cy="34" r="2.6" fill="#fff"/>
              </svg>
              <span className="co-brand__word">buckeye broadband<small>Authorized Agent</small></span>
            </a>
            {/* Nav is generated from the sections that actually have plans, so a
                service line removed from content.ts loses its link automatically. */}
            <div className="co-menu" data-menu>
              {sections.map((s) => (
                <a key={s.id} href={`#${s.id}`}>{s.navLabel}</a>
              ))}
              <a href="#faq">FAQ</a>
            </div>
            <div className="co-nav__cta">
              <a className="co-btn co-btn--red" href={`tel:${SITE.phoneTel}`} data-call-cta>
                <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><use href="#i-phone"/></svg>
                {SITE.phoneDisplay}
              </a>
              <button className="co-burger" data-burger aria-label="Open menu" aria-expanded="false">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main id="top">

        {/* ============ Hero ============ */}
        <section className="hx" aria-labelledby="hx-h">
          {/* Background art, bled off the right edge and scrimmed on the left so
              the copy column keeps full contrast at every width. Decorative:
              the hero's meaning is carried entirely by the text. */}
          <div className="hx__shot" aria-hidden={HERO.image.alt === "" ? true : undefined}>
            <img
              src={HERO.image.src}
              srcSet={srcSetFor(HERO.image.src)}
              sizes="(max-width: 1000px) 100vw, 64vw"
              alt={HERO.image.alt}
              style={HERO.image.focus ? { objectPosition: HERO.image.focus } : undefined}
              width={1920}
              height={1280}
              fetchPriority="high"
              decoding="async"
            />
          </div>
          <div className="co-container hx__grid">
            <div className="hx__copy">
              <p className="hx__eyebrow">{HERO.eyebrow}</p>
              <p className="hx__kicker">{HERO.kicker}</p>
              {/* Lines joined with real spaces so textContent reads as a sentence. */}
              <h1 className="hx__h" id="hx-h">
                {HERO.h1Lines.map((line, i) => (
                  <span className="hx__line" key={line}>
                    {line}
                    {i < HERO.h1Lines.length - 1 ? " " : ""}
                  </span>
                ))}
              </h1>
              <p className="hx__sub">{HERO.sub}</p>

              <ZipCheck />

              <ul className="hx__chips">
                {TRUST_CHIPS.map((c) => (
                  <li key={c}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><use href="#i-check"/></svg>
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            {hero ? (
              <aside className="hx__anchor" aria-label="Featured plan">
                <p className="hx__anchorLabel">{HERO.anchorLabel}</p>
                <p className="hx__anchorName">{hero.name}</p>
                <p className="hx__anchorSpeed">{speedLabel(hero)}</p>
                <PriceLockup plan={hero} size="lg" />
                <a className="hx__anchorCta" href={`tel:${SITE.phoneTel}`} data-call-cta>Call to order</a>
              </aside>
            ) : null}
          </div>
        </section>

        {/* ============ Service lines: fiber → cable → bundles → tv → mobile → phone ============
            Rendered from SERVICE_SECTIONS. A line with no publishable plans in
            content.ts is skipped entirely — no empty section is ever printed. */}
        {sections.map((section, idx) => {
          const plans = plansFor(section.line);
          const isBg = section.image?.display === "background";
          const isSplit = section.image?.display === "split";
          // The alternating tint is only for text-only / banner sections; a
          // photographic backdrop supplies its own contrast.
          const alt = !isBg && idx % 2 === 1 ? " pl-sec--alt" : "";
          return (
            <section
              className={`co-section pl-sec${isBg ? " sec--bg" : ""}${isSplit ? " pl-sec--split" : ""}${alt}`}
              id={section.id}
              key={section.id}
              aria-labelledby={`${section.id}-h`}
            >
              {isBg && section.image ? (
                <div className="sec-bg" aria-hidden="true">
                  <img
                    src={section.image.src}
                    srcSet={srcSetFor(section.image.src)}
                    sizes="100vw"
                    alt=""
                    style={section.image.focus ? { objectPosition: section.image.focus } : undefined}
                    width={1920}
                    height={818}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ) : null}

              <div className="co-container">
                <header className="sec-head" data-reveal>
                  <h2 className="co-h2" id={`${section.id}-h`}>{section.heading}</h2>
                  <p className="sec-head__intro">{section.intro}</p>
                </header>

                {/* Renders only when content.ts gives this section an image.
                    Lazy-loaded: none of these are above the fold. */}
                {section.image && !isBg && !isSplit ? (
                  <figure className="sec-figure" data-reveal>
                    <img
                      src={section.image.src}
                      srcSet={srcSetFor(section.image.src)}
                      sizes="(max-width: 1200px) 100vw, 1108px"
                      alt={section.image.alt}
                      style={section.image.focus ? { objectPosition: section.image.focus } : undefined}
                      width={1920}
                      height={720}
                      loading="lazy"
                      decoding="async"
                    />
                  </figure>
                ) : null}

                {isSplit && section.image ? (
                  /* Image beside the card rather than above it. */
                  <div className="pl-split">
                    <figure className="pl-split__fig" data-reveal>
                      <img
                        src={section.image.src}
                        srcSet={srcSetFor(section.image.src)}
                        sizes="(max-width: 900px) 100vw, 644px"
                        alt={section.image.alt}
                        style={section.image.focus ? { objectPosition: section.image.focus } : undefined}
                        width={1920}
                        height={818}
                        loading="lazy"
                        decoding="async"
                      />
                    </figure>
                    <div className="pl-split__cards">
                      {plans.map((plan) => (
                        <PlanCard plan={plan} key={plan.id} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className={`pl-grid pl-grid--${Math.min(plans.length, 4)}`}>
                    {plans.map((plan) => (
                      <PlanCard plan={plan} key={plan.id} />
                    ))}
                  </div>
                )}
              </div>
            </section>
          );
        })}

        {/* ============ Value-added services ============ */}
        <section className="co-section vas-sec" id="addons" aria-labelledby="vas-h">
          <div className="co-container">
            <header className="sec-head" data-reveal>
              <h2 className="co-h2" id="vas-h">{SECTION_COPY.vas.heading}</h2>
              <p className="sec-head__intro">{SECTION_COPY.vas.intro}</p>
            </header>

            <div className="vas-grid">
              {VAS_ITEMS.map((v) => (
                <article className="vas" key={v.name} data-reveal>
                  <svg className="vas__ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <use href={`#${v.icon}`} />
                  </svg>
                  <h3 className="vas__name">{v.name}</h3>
                  <p className="vas__body">{v.description}</p>
                  <span className="vas__tag">{v.detail}</span>
                </article>
              ))}
            </div>

            <p className="vas__foot">
              {SECTION_COPY.vas.foot}{" "}
              <a href={`tel:${SITE.phoneTel}`} data-call-cta>Call to order</a>
            </p>
          </div>
        </section>

        {/* ============ Comparison grid ============ */}
        <section className="co-section grid-sec" id="compare" aria-labelledby="grid-h">
          <div className="co-container">
            <header className="sec-head" data-reveal>
              <h2 className="co-h2" id="grid-h">{SECTION_COPY.compare.heading}</h2>
              <p className="sec-head__intro">{SECTION_COPY.compare.intro}</p>
            </header>

            <div className="grid-wrap">
              <table className="ftable">
                <caption className="sr-only">
                  Comparison of {SITE.carrier} fiber and cable internet plans
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Plan</th>
                    <th scope="col">Speed</th>
                    <th scope="col">Monthly</th>
                    <th scope="col">Data</th>
                    <th scope="col">Equipment</th>
                    <th scope="col">Contract</th>
                  </tr>
                </thead>
                <tbody>
                  {gridPlans().map((p) => (
                    <tr key={p.id}>
                      <th scope="row">{p.name}</th>
                      <td>{speedLabel(p)}</td>
                      <td className="ftable__price">{priceLabel(p)}</td>
                      <td>{p.dataPolicy ?? "—"}</td>
                      <td>{p.equipmentFee ?? "—"}</td>
                      <td>{p.contractTerm ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="fine">
              {FINE_PRINT.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>

            <p className="grid-sec__cta">
              <a href={`tel:${SITE.phoneTel}`} data-call-cta>Call to order</a>
            </p>
          </div>
        </section>

        {/* ============ Why order here ============ */}
        <section className="co-section why-sec" id="why" aria-labelledby="why-h">
          <div className="co-container">
            <header className="sec-head" data-reveal>
              <h2 className="co-h2" id="why-h">{SECTION_COPY.why.heading}</h2>
              <p className="sec-head__intro">{SECTION_COPY.why.intro}</p>
            </header>

            <div className="why-grid">
              {WHY_ITEMS.map((w) => (
                <article className="why" key={w.title} data-reveal>
                  <svg className="why__ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <use href={`#${w.icon}`} />
                  </svg>
                  <h3 className="why__name">{w.title}</h3>
                  <p className="why__body">{w.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============ How it works ============ */}
        <section
          className={`co-section hw-sec${SECTION_COPY.how.image?.display === "background" ? " sec--bg" : ""}`}
          id="how"
          aria-labelledby="hw-h"
        >
          {SECTION_COPY.how.image?.display === "background" ? (
            <div className="sec-bg" aria-hidden="true">
              <img src={SECTION_COPY.how.image.src}
                   srcSet={srcSetFor(SECTION_COPY.how.image.src)} sizes="100vw" alt=""
                   style={SECTION_COPY.how.image.focus ? { objectPosition: SECTION_COPY.how.image.focus } : undefined}
                   width={1920} height={818} loading="lazy" decoding="async" />
            </div>
          ) : null}
          <div className="co-container">
            <header className="sec-head" data-reveal>
              <h2 className="co-h2" id="hw-h">{SECTION_COPY.how.heading}</h2>
              <p className="sec-head__intro">{SECTION_COPY.how.intro}</p>
            </header>

            {SECTION_COPY.how.image && SECTION_COPY.how.image.display !== "background" ? (
              <figure className="sec-figure" data-reveal>
                <img src={SECTION_COPY.how.image.src} alt={SECTION_COPY.how.image.alt}
                     style={SECTION_COPY.how.image.focus ? { objectPosition: SECTION_COPY.how.image.focus } : undefined}
                     width={1920} height={720} loading="lazy" decoding="async" />
              </figure>
            ) : null}

            <ol className="hw-grid">
              {STEPS.map((s) => (
                <li className="hw" key={s.n} data-reveal>
                  <span className="hw__n">{s.n}</span>
                  <h3 className="hw__name">{s.title}</h3>
                  <p className="hw__body">{s.body}</p>
                </li>
              ))}
            </ol>

            <div className="hw__cta">
              <a className="co-btn co-btn--red co-btn--lg" href={`tel:${SITE.phoneTel}`} data-call-cta>
                <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><use href="#i-phone"/></svg>
                Call to order
              </a>
            </div>
          </div>
        </section>

        {/* ============ Coverage ============ */}
        <section className="co-section cov-sec" id="coverage" aria-labelledby="cov-h">
          <div className="co-container">
            <header className="sec-head" data-reveal>
              <h2 className="co-h2" id="cov-h">{SECTION_COPY.coverage.heading}</h2>
              <p className="sec-head__intro">{SECTION_COPY.coverage.intro}</p>
            </header>

            {SECTION_COPY.coverage.image ? (
              <figure className="sec-figure" data-reveal>
                <img src={SECTION_COPY.coverage.image.src}
                     srcSet={srcSetFor(SECTION_COPY.coverage.image.src)}
                     sizes="(max-width: 1200px) 100vw, 1108px"
                     alt={SECTION_COPY.coverage.image.alt}
                     style={SECTION_COPY.coverage.image.focus ? { objectPosition: SECTION_COPY.coverage.image.focus } : undefined}
                     width={1920} height={720} loading="lazy" decoding="async" />
              </figure>
            ) : null}

            <div className="cov-grid">
              {COVERAGE_GROUPS.map((group) => (
                <div className="cov-col" key={group.state} data-reveal>
                  <h3 className="cov-col__h">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><use href="#i-pin"/></svg>
                    {group.state}
                  </h3>
                  <ul className="cov-list">
                    {group.areas.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <p className="cov-note">{SECTION_COPY.coverage.note}</p>
          </div>
        </section>

        {/* ============ FAQ — final content section ============ */}
        <section className="co-section qa-sec" id="faq" aria-labelledby="qa-h">
          <div className="co-container qa__grid">
            <div className="qa__aside">
              <h2 className="co-h2" id="qa-h" data-reveal>{SECTION_COPY.faq.heading}</h2>
              <p className="qa__lead">{SECTION_COPY.faq.intro}</p>
              <div className="qa__card">
                <p className="qa__cardLabel">{SECTION_COPY.faq.cardLabel}</p>
                <a className="qa__cardNum" href={`tel:${SITE.phoneTel}`} data-call-cta>
                  Call to order
                </a>
                <p className="qa__cardSub">{SITE.hours}</p>
              </div>
            </div>
            <Faq />
          </div>
        </section>

      </main>

      <footer className="co-footer">
        <div className="co-container">
          <div className="co-footer__top">
            <div className="co-footer__brand">
              <a className="co-brand" href="#top">
                <svg className="co-brand__mark" viewBox="0 0 48 48" aria-hidden="true">
                  <rect x="2" y="2" width="44" height="44" rx="13" fill="#05a2f6"/>
                  <path d="M14 27a11 11 0 0 1 20 0" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round"/>
                  <path d="M18.5 30.5a6 6 0 0 1 11 0" fill="none" stroke="#ffc40d" strokeWidth="3.4" strokeLinecap="round"/>
                  <circle cx="24" cy="34" r="2.6" fill="#fff"/></svg>
                <span className="co-brand__word">buckeye broadband<small>Authorized Agent</small></span>
              </a>
              <p>Your local, independent way to shop and order Buckeye Broadband fiber internet, HD TV, home phone and 5G mobile across Northwest Ohio and Southeast Michigan.</p>
              <div className="co-footer__social" style={{'marginTop': '1rem'}}>
                <a href="tel:+14198280022" aria-label="Call us" data-call-cta><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><use href="#i-phone"/></svg></a>
                <a href="mailto:care@buckeyeagent.com" aria-label="Email us"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16v16H4z"/><path d="m4 6 8 6 8-6"/></svg></a>
                <a href="#coverage" aria-label="Coverage area"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><use href="#i-pin"/></svg></a>
              </div>
            </div>
            <div>
              <h4>Services</h4>
              <ul>
                <li><a href="#fiber">Internet</a></li>
                <li><a href="#tv">TV & Perks</a></li>
                <li><a href="#mobile">Mobile 5G</a></li>
                <li><a href="#coverage">Coverage</a></li>
                <li><a href="#faq">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4>Legal & Policies</h4>
              <ul>
                <li><a href="/legal/privacy/">Privacy & Data Protection</a></li>
                <li><a href="/legal/disclaimer/">Disclaimer</a></li>
                <li><a href="/legal/cookies/">Cookies Policy</a></li>
                <li><a href="/legal/tcpa/">TCPA Policy</a></li>
                <li><a href="/legal/trademarks/">Trademarks</a></li>
                <li><a href="/legal/marketing/">Marketing Policy</a></li>
                <li><a href="/legal/service-fulfillment/">Service Fulfillment</a></li>
                <li><a href="/legal/pci-dss/">PCI DSS</a></li>
              </ul>
            </div>
          </div>

          <div className="co-footer__disc">
            <strong>Authorized agent disclosure:</strong> This site is operated by an independent, authorized agent of Buckeye Broadband and is not Buckeye Broadband, Block Communications, Inc., or any affiliated company. “Buckeye Broadband,” “MaxxMobile,” “SmartNet,” “Brainiacs” and related marks are trademarks of their respective owners and are used here for descriptive purposes only. Plans, pricing, speeds, promotions and availability are set by the service provider and may change without notice; all offers are subject to serviceability at your address and the provider's terms. Advertised prices exclude applicable taxes, surcharges and fees.
          </div>

          <div className="co-footer__bottom">
            <span>© <CurrentYear /> Buckeye Broadband Authorized Agent. All rights reserved.</span>
            <nav className="co-footer__legal" aria-label="Legal">
              <a href="/legal/privacy/">Privacy</a>
              <a href="/legal/cookies/">Cookies</a>
              <a href="/legal/tcpa/">TCPA</a>
              <a href="/legal/trademarks/">Trademarks</a>
              <a href="/legal/marketing/">Marketing</a>
              <a href="/legal/service-fulfillment/">Service Fulfillment</a>
              <a href="/legal/pci-dss/">PCI DSS</a>
              <a href="/legal/disclaimer/">Disclaimer</a>
            </nav>
          </div>
        </div>
      </footer>

      {/* ============ Sticky mobile call bar ============ */}
      <a className="co-callbar" href={`tel:${SITE.phoneTel}`} data-call-cta>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><use href="#i-phone"/></svg>
        Call to order
      </a>

      <a className="co-totop" data-totop href="#top" aria-label="Back to top">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><use href="#i-chevron"/></svg>
      </a>

      <SiteScripts />
    </>
  );
}
