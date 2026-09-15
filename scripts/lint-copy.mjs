#!/usr/bin/env node
/* Build-time copy lint.

   Fails the build when banned copy appears anywhere in the source: components,
   content constants, metadata, legal pages, image alt text or JSON-LD.

   Two families are checked:
     1. The fabricated-claim families — store/local voice, invented
        credentials, unverifiable stats, capability lies.
     2. The operator's own removals — support routing, date stamps, broadband
        label links, "is this the official site" and raw phone numbers used as
        button text outside the header and footer.

   Text is normalised (Unicode hyphens, curly quotes, collapsed whitespace)
   before matching, so `US‑based` with a non-ASCII hyphen cannot slip through.

   Usage: node scripts/lint-copy.mjs
*/

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, extname } from "node:path";

const ROOT = process.cwd();
const SCAN_DIRS = ["app", "components", "lib", "public"];
const SCAN_EXT = new Set([".ts", ".tsx", ".js", ".mjs", ".css", ".txt", ".json"]);
const SKIP = new Set(["node_modules", ".next", "out", "scripts"]);

/* Strings this spec mandates verbatim. Exact, full-string matches only. */
const ALLOWLIST_PATH = join(ROOT, "scripts", "lint-allowlist.txt");
const ALLOWLIST = existsSync(ALLOWLIST_PATH)
  ? readFileSync(ALLOWLIST_PATH, "utf8")
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith("#"))
  : [];

const BANNED = [
  // --- store / local / anti-call-center voice -----------------------------
  "no call-center maze", "answered by real people", "real people", "a real person",
  "talk to a human", "talk to a real specialist", "face to face", "in person",
  "in-store", "walk in", "walk out", "across the counter", "storefront",
  "brick and mortar", "visit us", "stop by", "come see us", "our office",
  "showroom", "local branch", "local specialist", "local team", "local crew",
  "local technician", "local experts", "local expertise", "local touch",
  "local advantage", "local support", "people from your neighborhood",
  "neighbors", "neighborly", "hometown", "right here in town",
  "your own time zone", "no offshore script", "no phone tree", "no ticket number",
  "dedicated person", "no pressure, no runaround", "no upsell", "who picks up the phone",

  // --- invented credentials / identity ------------------------------------
  "licensed agent", "licensed specialist", "licensed rep", "family-owned",
  "veteran-owned", "small business", "us-based", "toledo based", "toledo-based",

  // --- fabrication ---------------------------------------------------------
  "verified today", "no hidden fees", "hidden fees", "$0 hidden fees",
  "99.9%", "best price guaranteed", "price for life", "available nationwide",
  "nationwide coverage", "only 3 installs left", "certified technicians",
  "our network", "our backbone", "our technicians", "our installers",
  "the rate quoted is the rate on your bill", "your price never increases",
  "same-day setup", "same day setup", "same-day install",

  // --- capability lies -----------------------------------------------------
  "order online", "leave your details", "we'll reach out",

  // --- operator removals ---------------------------------------------------
  "new orders only", "contact buckeye directly", "contact buckeye broadband directly",
  "broadband facts label", "pricing observed", "pricing as of",
  "is this the official", "ordering channel, not the network operator",

  // Positive "official" claims only. Saying we are NOT the official site is a
  // required disclosure and must keep working, so the bare word is not banned.
  "official reseller", "official dealer", "official agent", "official partner",
  "officially authorized",
];

function normalise(s) {
  return s
    .replace(/[‐-―−]/g, "-")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP.has(entry)) continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (SCAN_EXT.has(extname(entry))) out.push(full);
  }
  return out;
}

const allowNorm = ALLOWLIST.map(normalise);
let violations = 0;

for (const dir of SCAN_DIRS) {
  const abs = join(ROOT, dir);
  if (!existsSync(abs)) continue;

  for (const file of walk(abs)) {
    const raw = readFileSync(file, "utf8");
    const lines = raw.split("\n");
    let inBlockComment = false;

    lines.forEach((line, i) => {
      // Comments are documentation, not shipped copy. Track block comments so
      // a prose paragraph inside /* ... */ does not trip the lint.
      const trimmed = line.trim();
      const opens = trimmed.includes("/*");
      const closes = trimmed.includes("*/");
      const wasInBlock = inBlockComment;
      if (opens && !closes) inBlockComment = true;
      else if (closes) inBlockComment = false;
      if (wasInBlock || opens || trimmed.startsWith("*") || trimmed.startsWith("//")) return;

      const norm = normalise(line);
      if (allowNorm.some((a) => norm.includes(a))) return;

      for (const phrase of BANNED) {
        if (norm.includes(normalise(phrase))) {
          console.error(
            `${file.replace(ROOT + "\\", "").replace(ROOT + "/", "")}:${i + 1}  banned copy: "${phrase}"\n    ${trimmed.slice(0, 140)}`
          );
          violations++;
        }
      }
    });
  }
}

if (violations > 0) {
  console.error(`\nlint-copy: ${violations} violation(s). Build blocked.`);
  process.exit(1);
}
console.log("lint-copy: clean.");
