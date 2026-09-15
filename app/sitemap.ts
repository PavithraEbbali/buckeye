import type { MetadataRoute } from "next";
import { legalPages } from "@/lib/legal/pages";

export const dynamic = "force-static";

const SITE_URL = "https://www.buckeyeagent.com";

/* Fixed build date, never new Date(): a date that moves on every rebuild
   tells crawlers the content changed when it did not. Bump it when the
   page content actually changes. */
const LAST_MODIFIED = "2026-09-15";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, lastModified: LAST_MODIFIED, changeFrequency: "weekly", priority: 1 },
    ...legalPages.map((p) => ({
      url: `${SITE_URL}/legal/${p.slug}/`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
