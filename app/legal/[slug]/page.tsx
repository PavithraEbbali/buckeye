import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BRAND, EMAIL, PHONE_DISPLAY, PHONE_HREF, SITE, UPDATED, getLegalPage, legalPages } from "@/lib/legal/pages";

export function generateStaticParams() {
  return legalPages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = getLegalPage(slug);
  if (!page) return {};
  const url = `${SITE}/legal/${page.slug}/`;
  return {
    title: `${page.title} | ${BRAND}`,
    description: page.desc,
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
    alternates: { canonical: url },
  };
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getLegalPage(slug);
  if (!page) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.title,
    url: `${SITE}/legal/${page.slug}/`,
    publisher: { "@type": "Organization", name: BRAND },
    dateModified: "2026-07-07",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: page.title, item: `${SITE}/legal/${page.slug}/` },
      ],
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="lz-hero">
        <div className="wrap lz-reveal">
          <div className="lz-eyebrow">{page.eyebrow}</div>
          <h1>{page.h1}</h1>
          <div className="lz-updated">Last updated: {UPDATED}</div>
        </div>
      </section>

      <main className="lz-body">
        <div className="wrap">
          {page.toc.length > 0 && (
            <nav className="lz-toc" aria-label="On this page">
              <h2>On this page</h2>
              <ul>
                {page.toc.map(([id, label]) => (
                  <li key={id}><a href={`#${id}`}>{label}</a></li>
                ))}
              </ul>
            </nav>
          )}
          <div dangerouslySetInnerHTML={{ __html: page.body }} />
          <div className="lz-note">
            <strong>Questions about this policy?</strong> Contact {BRAND} at{" "}
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a> or call <a href={`tel:${PHONE_HREF}`}>{PHONE_DISPLAY}</a>.
          </div>
        </div>
      </main>
    </>
  );
}
