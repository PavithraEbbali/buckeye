import Link from "next/link";
import "./legal.css";
import { BRAND, EMAIL, PHONE_DISPLAY, PHONE_HREF, legalPages } from "@/lib/legal/pages";

const mark = (
  <svg viewBox="0 0 48 48" aria-hidden="true">
    <defs>
      <linearGradient id="lz-g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#05a2f6" />
        <stop offset="1" stopColor="#002e6c" />
      </linearGradient>
    </defs>
    <rect width="48" height="48" rx="12" fill="url(#lz-g)" />
    <path d="M13 27a12 12 0 0 1 22 0" fill="none" stroke="#fff" strokeWidth="3.6" strokeLinecap="round" />
    <path d="M18 30.5a6.5 6.5 0 0 1 12 0" fill="none" stroke="#ffc40d" strokeWidth="3.6" strokeLinecap="round" />
    <circle cx="24" cy="34.5" r="2.8" fill="#fff" />
  </svg>
);

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="lz-top">
        <div className="wrap">
          <span><strong>Independent Authorized Agent of Buckeye Broadband®</strong> — not the official Buckeye Broadband site.</span>
          <span>Call: <a href={`tel:${PHONE_HREF}`}>{PHONE_DISPLAY}</a></span>
        </div>
      </div>

      <header className="lz-head">
        <div className="wrap">
          <Link className="lz-brand" href="/">
            {mark}
            <span>buckeye&nbsp;broadband<small>Authorized Agent</small></span>
          </Link>
          <Link className="lz-back" href="/">&larr; Back to home</Link>
        </div>
      </header>

      {children}

      <footer className="lz-foot">
        <div className="wrap">
          <nav className="lz-foot__links" aria-label="Legal pages">
            {legalPages.map((p) => (
              <Link key={p.slug} href={`/legal/${p.slug}/`}>{p.title}</Link>
            ))}
          </nav>
          <div className="lz-foot__disc">
            <strong>Authorized agent disclosure:</strong> This site is operated by an independent, authorized agent of
            Buckeye Broadband and is not Buckeye Broadband, Block Communications, Inc., or any affiliated company.
            Product names and logos are trademarks of their respective owners and are used for descriptive purposes
            only. Pricing, speeds and availability are set by the service provider and may change without notice.
            © 2026 {BRAND}. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
