# Buckeye Broadband — Authorized Agent

Phone-lead landing site for an independent authorized agent of Buckeye Broadband,
covering Northwest Ohio and Southeast Michigan.

Next.js 16 (App Router) + TypeScript, built as a **static export**. No backend,
no database, no API routes — every page is pre-rendered HTML.

## Running locally

```bash
npm install
npm run dev
```

Serves on <http://localhost:3210>.

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server on port 3210 |
| `npm run build` | Copy lint, then `next build` → static export in `out/` |
| `npm run lint` | ESLint |
| `npm run lint:copy` | Banned-copy lint on its own |

`npm start` will **not** work: `output: "export"` has no server to start. To
preview a production build, serve the `out/` directory as static files.

## Editing plans and pricing

**Everything the visitor reads lives in [`lib/content.ts`](lib/content.ts).**
No price, plan name, feature bullet, FAQ answer or section heading is hardcoded
in any `.tsx` file. Change that one file and the plan cards, hero price anchor,
comparison table, JSON-LD offers, header nav and fine print all follow.

Behaviour that falls out of the data, with no layout edit required:

- A service line whose plans are all removed **disappears entirely** — section,
  header nav link and JSON-LD together.
- A plan with `verified: false` is filtered out of the page and the schema. Use
  it for any figure that could not be confirmed against the carrier.
- A plan with no `price` renders `Call for pricing` instead of a price lockup,
  and its JSON-LD `Offer` is omitted (an Offer without a price is invalid).
- `SERVICE_SECTIONS` order is the page order: fiber → cable → bundles → TV →
  mobile → home phone.

### Section photography

Each section takes an optional `image` with a `display` mode:

| Mode | Layout |
| --- | --- |
| `banner` | Contained band above the cards |
| `background` | Full-bleed behind the section, navy scrim, white heading |
| `split` | Image beside the cards — for a line with a single plan |

Modes alternate down the page so consecutive sections do not read as the same
block repeated. Remove an `image` and the section renders text-only.

Every photograph ships in two widths: `name.jpg` (1920px) and `name-960.jpg`.
`srcSetFor()` builds the `srcset`, so phones fetch roughly a third of the bytes.
**Regenerate both widths together** whenever a photograph changes.

## Copy lint

`scripts/lint-copy.mjs` runs before every build and **fails the build** on
banned copy — fabricated local/storefront claims, invented credentials,
unsourced statistics, and capability claims the site cannot deliver. Strings
this project mandates verbatim live in `scripts/lint-allowlist.txt`, exact-match
only.

## Deployment

Vercel, from the `main` branch. The framework preset is Next.js;
`vercel.json` pins the build command, the `out/` output directory and adds
security and cache headers (`next.config` `headers()` is dropped on static
export, so they have to live here).

## Before running ads

`buckeyebroadband.com` returns HTTP 403 to requests from outside the United
States, so the plan figures in `lib/content.ts` were compiled from indexed
copies of the carrier's own pages rather than read directly from them.
**Confirm every price against the live carrier pages from a US connection
before spending on ads.** The items that need checking first are listed at the
bottom of `lib/content.ts`.
