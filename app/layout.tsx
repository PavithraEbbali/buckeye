import type { Metadata, Viewport } from "next";
import "./styles.css";

const SITE_URL = "https://www.buckeyeagent.com/";
const SOCIAL_IMAGE = "https://www.buckeyeagent.com/social-card.svg";

export const metadata: Metadata = {
  title:
    "Buckeye Broadband® Fiber, Cable, TV, Mobile & Home Phone Plans — Call (419) 828-0022 | Independent Authorized Agent",
  description:
    "Order Buckeye Broadband fiber and cable internet, TV, MaxxMobile wireless and home phone through an independent authorized agent. Every internet plan carries the 3-Year Price Guarantee, unlimited data and no annual contract. Serving Northwest Ohio and Southeast Michigan.",
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  alternates: { canonical: SITE_URL },
  authors: [{ name: "Buckeye Broadband Authorized Agent" }],
  manifest: "/site.webmanifest",
  icons: { icon: "/favicon.svg", apple: "/favicon.svg" },
  openGraph: {
    type: "website",
    siteName: "Buckeye Broadband Authorized Agent",
    title: "Buckeye Broadband Plans — Fiber, Cable, TV, Mobile & Home Phone",
    description:
      "Buckeye Broadband fiber and cable internet, TV, MaxxMobile wireless and home phone, ordered through an independent authorized agent. 3-Year Price Guarantee on every internet plan.",
    url: SITE_URL,
    locale: "en_US",
    images: [{ url: SOCIAL_IMAGE, width: 1200, height: 630, alt: "Buckeye Broadband Authorized Agent — fiber internet, TV and 5G in Northwest Ohio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Buckeye Broadband Plans — Fiber, Cable, TV, Mobile & Home Phone",
    description: "Buckeye Broadband fiber, cable, TV, mobile and home phone plans via an independent authorized agent.",
    images: [SOCIAL_IMAGE],
  },
  other: {
    "geo.region": "US-OH",
    "geo.placename": "Toledo, Ohio",
    "geo.position": "41.6528;-83.5379",
    ICBM: "41.6528, -83.5379",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#002e6c",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Marks JS as available before first paint — .js .co-words > .co-word
            in styles.css only hides the kinetic headline when this class is
            present, so a no-JS visitor always sees the plain, final text. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800;900&family=Roboto:wght@400;500;700&display=swap" />
      </head>
      <body>{children}</body>
    </html>
  );
}
