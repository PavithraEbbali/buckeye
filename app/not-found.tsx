import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found | Buckeye Broadband Authorized Agent",
  robots: { index: false, follow: true },
};

/* Selectors are scoped under .nf-page so this page's deliberately minimal,
   self-contained look can't be shifted by the global styles.css/hero.css
   that the root layout now applies to every route (the original 404.html
   was a fully standalone document with no other stylesheet in play). */
export default function NotFound() {
  return (
    <div className="nf-page">
      <style dangerouslySetInnerHTML={{ __html: `
        .nf-page { min-height: 100vh; display: grid; place-items: center; text-align: center; padding: 24px;
          font-family: Figtree, system-ui, sans-serif; color: #fff;
          background: linear-gradient(135deg,#01173a,#013a86 55%,#05a2f6); }
        .nf-page .nf-b { max-width: 520px; }
        .nf-page h1 { font-size: clamp(5rem,20vw,9rem); font-weight: 900; letter-spacing: -.05em; line-height: 1;
          background: linear-gradient(120deg,#7fd0ff,#ffc40d); -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent; margin: 0; }
        .nf-page h2 { font-size: clamp(1.4rem,4vw,2rem); margin: .4rem 0 .8rem; font-weight: 800; }
        .nf-page p { color: #bcd3ee; margin: 0 0 1.8rem; font-weight: 500; }
        .nf-page a { display: inline-flex; align-items: center; gap: .5rem; background: #fff; color: #002e6c;
          font-weight: 800; padding: .9rem 1.7rem; border-radius: 999px; text-decoration: none;
          transition: transform .3s cubic-bezier(.22,1,.36,1), box-shadow .3s; }
        .nf-page a:hover { transform: translateY(-3px); box-shadow: 0 14px 30px -10px rgba(0,0,0,.5); }
      ` }} />
      <div className="nf-b">
        <h1>404</h1>
        <h2>That page wandered off the network</h2>
        <p>The page you&apos;re looking for isn&apos;t here — but your next-day fiber install still can be. Let&apos;s get you back on track.</p>
        <a href="/">&larr; Back to Buckeye Broadband Authorized Agent home</a>
      </div>
    </div>
  );
}
