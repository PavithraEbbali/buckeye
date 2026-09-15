/* ============================================================================
   lib/content.ts — SINGLE SOURCE OF TRUTH
   ----------------------------------------------------------------------------
   Every price, plan, promo, feature bullet, FAQ answer and fine-print row on
   this site is rendered from this file. No pricing or plan copy is hardcoded
   in any .tsx layout file.

   TO UPDATE PRICING LATER: edit ONLY this file. Every plan card, the hero
   price anchor, the comparison grid, the JSON-LD Offers and the legal
   disclosure lines all re-render from these objects automatically.

   Rules enforced by the renderers (do not work around them in JSX):
     - A service line whose `plans` array is empty is omitted from the page
       entirely — no empty section, no placeholder. Delete the plans and the
       section disappears, along with its nav link.
     - A plan with `price: undefined` renders "Call for pricing" on its button
       and prints no price lockup. Never invent a number to fill the slot.
     - A plan with `verified: false` is treated as unrenderable by
       `publishedPlans()` and is filtered out of the page and the JSON-LD.
   ========================================================================== */

/* ---------------------------------------------------------------------------
   1. SITE CONSTANTS — operator identity. Unchanged from the shipped build.
   ------------------------------------------------------------------------ */

export const SITE = {
  brandName: "Buckeye Broadband Authorized Agent",
  agreementNoun: "agent",
  carrier: "Buckeye Broadband",
  phoneDisplay: "(419) 828-0022",
  phoneTel: "+14198280022",
  email: "care@buckeyeagent.com",
  url: "https://www.buckeyeagent.com/",
  socialImage: "https://www.buckeyeagent.com/social-card.svg",
  hours: "Agents available 7 days a week",
  serviceArea: "Northwest Ohio & Southeast Michigan",
} as const;

/** Disclosure line shown in the persistent top bar and repeated as the hero eyebrow. */
export const DISCLOSURE = `Independent Authorized Agent of ${SITE.carrier}®`;

/* ---------------------------------------------------------------------------
   2. TYPES
   ------------------------------------------------------------------------ */

export type ServiceLine =
  | "fiber"
  | "cable"
  | "bundle"
  | "tv"
  | "mobile"
  | "phone";

export interface PlanItem {
  id: string;
  /** Carrier's own product name. Never invent a marketing name. */
  name: string;
  serviceLine: ServiceLine;
  /** Mbps. Omit for non-internet lines. */
  speedDown?: number;
  speedUp?: number;
  /** Dollars, integer part. `undefined` => renders "Call for pricing". */
  price?: number;
  /** Cents as a 2-char string, e.g. "99". Omitted renders a whole dollar. */
  cents?: string;
  /** Carrier's condition, verbatim. e.g. "with the 3-Year Price Guarantee" */
  promoQualifier?: string;
  /** What happens after any intro period, when the carrier publishes one. */
  stepUp?: string;
  equipmentFee?: string;
  dataPolicy?: string;
  contractTerm?: string;
  features: string[];
  isPopular?: boolean;
  /** Unit suffix for the lockup. Defaults to "/mo". */
  priceUnit?: string;
  /**
   * False => the plan is filtered out of the page AND the JSON-LD.
   * Use for any figure that could not be confirmed against the carrier.
   */
  verified: boolean;
  /** Free-text note for the operator. Never rendered to visitors. */
  internalNote?: string;
}

/**
 * A photograph attached to a section.
 *
 * Optional everywhere. A section with no `image` renders no figure at all —
 * drop a file into public/img/ and set this object to turn the banner on, or
 * delete the object to turn it off. No JSX edit either way.
 *
 * `alt` describes the picture for screen readers and must never restate a
 * marketing claim; decorative banners take `alt: ""`.
 */
export interface SectionImage {
  src: string;
  alt: string;
  /** Focal point for object-position, e.g. "50% 40%". Defaults to centre. */
  focus?: string;
  /**
   * How the photograph is used.
   *   "banner"     — a contained band above the section's cards (default).
   *   "background" — full-bleed behind the whole section, under a navy scrim,
   *                  with the heading reversed to white.
   *   "split"      — image beside the cards rather than above them. Suits a
   *                  line with a single plan, where a full-width row of one
   *                  card reads as an unfinished grid.
   * Alternating these stops consecutive sections reading as the same
   * heading-image-cards block repeated down the page.
   */
  display?: "banner" | "background" | "split";
}

export interface ServiceSection {
  line: ServiceLine;
  /** Anchor id + nav target. */
  id: string;
  /** Short label used in the header nav. */
  navLabel: string;
  heading: string;
  intro: string;
  image?: SectionImage;
}

/* ---------------------------------------------------------------------------
   3. SECTION ORDER — canonical, after the hero.
      fiber -> cable -> bundles -> tv -> mobile -> phone
      Reorder this array to reorder the page. A section whose line has no
      publishable plans is skipped automatically by the renderer.
   ------------------------------------------------------------------------ */

export const SERVICE_SECTIONS: ServiceSection[] = [
  {
    line: "fiber",
    id: "fiber",
    navLabel: "Fiber",
    heading: "Buckeye Fiber Internet",
    image: { src: "/img/sections/fiber.jpg", alt: "", focus: "50% 45%", display: "background" },
    intro:
      "Symmetrical upload and download speeds on Buckeye's fiber network, with unlimited data and the 3-Year Price Guarantee on every tier.",
  },
  {
    line: "cable",
    id: "cable",
    navLabel: "Cable Internet",
    heading: "Buckeye Cable Internet",
    image: { src: "/img/sections/cable.jpg", alt: "A wi-fi router on a wooden table beside a living-room window", focus: "50% 55%", display: "banner" },
    intro:
      "Buckeye's coaxial network reaches addresses beyond the current fiber build. Unlimited data and the same 3-Year Price Guarantee apply.",
  },
  {
    line: "bundle",
    id: "bundles",
    navLabel: "Bundles",
    heading: "Internet & TV Bundles",
    image: { src: "/img/sections/bundles.jpg", alt: "", focus: "50% 55%", display: "background" },
    intro:
      "Combine internet with Buckeye TV on one account and one monthly bill. Equipment is included on every bundle below.",
  },
  {
    line: "tv",
    id: "tv",
    navLabel: "TV",
    heading: "Buckeye TV & Streaming",
    image: { src: "/img/sections/tv.jpg", alt: "A living room with a wall-mounted television above a wooden media unit", focus: "50% 50%", display: "banner" },
    intro:
      "Add Buckeye TV to any internet plan, from a local-channel package to a full 600+ channel lineup with streaming boxes included.",
  },
  {
    line: "mobile",
    id: "mobile",
    navLabel: "Mobile",
    heading: "MaxxMobile Wireless",
    image: { src: "/img/sections/mobile.jpg", alt: "", focus: "50% 35%", display: "background" },
    intro:
      "MaxxMobile runs on a nationwide 5G network and requires an active Buckeye internet subscription. Bring your own device and keep your number.",
  },
  {
    line: "phone",
    id: "phone",
    navLabel: "Home Phone",
    heading: "Buckeye Home Phone",
    image: { src: "/img/sections/phone.jpg", alt: "A cordless telephone handset resting in its base on a kitchen counter", focus: "50% 50%", display: "split" },
    intro:
      "Unlimited local and nationwide calling on Buckeye's digital phone service, including voicemail and robocall blocking.",
  },
];

/* ---------------------------------------------------------------------------
   4. PLANS
      Sourced from Buckeye Broadband's published plan, offer-details and
      rate-card pages. See _SOURCES at the bottom of this file.
   ------------------------------------------------------------------------ */

export const PLANS: PlanItem[] = [
  /* ---------------------------- FIBER ---------------------------------- */
  {
    id: "fiber-600",
    name: "Fiber 600",
    serviceLine: "fiber",
    speedDown: 600,
    speedUp: 600,
    price: 79,
    cents: "99",
    promoQualifier: "with the 3-Year Price Guarantee",
    equipmentFee: "EVO WiFi router and one extender included",
    dataPolicy: "Unlimited data",
    contractTerm: "No annual contract",
    features: [
      "600 Mbps download and 600 Mbps upload",
      "Unlimited data, no overage charges",
      "EVO WiFi router and one WiFi extender included",
      "50+ Super Channels at no extra cost",
      "Rate held for three full years",
    ],
    verified: true,
  },
  {
    id: "fiber-1gig",
    name: "Fiber 1 Gig",
    serviceLine: "fiber",
    speedDown: 1000,
    speedUp: 1000,
    price: 89,
    cents: "99",
    promoQualifier: "with the 3-Year Price Guarantee",
    equipmentFee: "EVO WiFi router and one extender included",
    dataPolicy: "Unlimited data",
    contractTerm: "No annual contract",
    features: [
      "1,000 Mbps download and 1,000 Mbps upload",
      "Unlimited data, no overage charges",
      "EVO WiFi router and one WiFi extender included",
      "Handles large households and remote work without contention",
      "Rate held for three full years",
    ],
    isPopular: true,
    verified: true,
  },
  {
    id: "fiber-2gig",
    name: "Fiber 2 Gig",
    serviceLine: "fiber",
    speedDown: 2000,
    speedUp: 2000,
    price: 109,
    cents: "99",
    promoQualifier: "with the 3-Year Price Guarantee",
    equipmentFee: "EVO WiFi router and one extender included",
    dataPolicy: "Unlimited data",
    contractTerm: "No annual contract",
    features: [
      "2,000 Mbps download and 2,000 Mbps upload",
      "Unlimited data, no overage charges",
      "EVO WiFi router and one WiFi extender included",
      "Built for multi-gigabit transfers and heavy simultaneous use",
      "Rate held for three full years",
    ],
    verified: true,
  },

  /* ---------------------------- CABLE ---------------------------------- */
  {
    id: "cable-essential-200",
    name: "Essential Internet",
    serviceLine: "cable",
    speedDown: 200,
    speedUp: 10,
    price: 39,
    cents: "99",
    promoQualifier: "with the 3-Year Price Guarantee",
    equipmentFee: "EVO WiFi router and one extender included",
    dataPolicy: "Unlimited data",
    contractTerm: "No annual contract",
    features: [
      "Up to 200 Mbps download",
      "Unlimited data, no overage charges",
      "EVO WiFi router and one WiFi extender included",
      "Suited to browsing, HD streaming and everyday use",
    ],
    verified: true,
  },
  {
    id: "cable-ultimate-400",
    name: "Ultimate Internet",
    serviceLine: "cable",
    speedDown: 400,
    speedUp: 20,
    price: 49,
    cents: "99",
    promoQualifier: "with the 3-Year Price Guarantee",
    equipmentFee: "EVO WiFi router and one extender included",
    dataPolicy: "Unlimited data",
    contractTerm: "No annual contract",
    features: [
      "Up to 400 Mbps download",
      "Unlimited data, no overage charges",
      "EVO WiFi router and one WiFi extender included",
      "Comfortable for 4K streaming on several screens at once",
    ],
    isPopular: true,
    verified: true,
  },
  {
    id: "cable-supreme-600",
    name: "Supreme Internet",
    serviceLine: "cable",
    speedDown: 600,
    speedUp: 20,
    price: 69,
    cents: "99",
    promoQualifier: "with the 3-Year Price Guarantee",
    equipmentFee: "EVO WiFi router and one extender included",
    dataPolicy: "Unlimited data",
    contractTerm: "No annual contract",
    features: [
      "Up to 600 Mbps download",
      "Unlimited data, no overage charges",
      "EVO WiFi router and one WiFi extender included",
      "Buckeye's fastest tier on the coaxial network",
    ],
    verified: true,
  },

  /* --------------------------- BUNDLES --------------------------------- */
  {
    id: "bundle-streamtv-ultimate",
    name: "StreamTV + Ultimate Internet",
    serviceLine: "bundle",
    speedDown: 400,
    speedUp: 20,
    price: 49,
    cents: "99",
    promoQualifier: "with the 3-Year Price Guarantee",
    equipmentFee: "Streaming device and WiFi equipment included",
    dataPolicy: "Unlimited data",
    contractTerm: "No annual contract",
    features: [
      "Up to 400 Mbps internet with unlimited data",
      "StreamTV on phones, tablets and smart TVs",
      "Streaming device included",
      "150+ Super Channels at no extra cost",
      "One account, one monthly bill",
    ],
    isPopular: true,
    verified: true,
  },
  {
    id: "bundle-cabletv-essential",
    name: "Cable TV + Essential Internet",
    serviceLine: "bundle",
    speedDown: 200,
    speedUp: 10,
    price: 69,
    cents: "99",
    promoQualifier: "with the 3-Year Price Guarantee",
    equipmentFee: "EVO FORCE 1 box and WiFi equipment included",
    dataPolicy: "Unlimited data",
    contractTerm: "No annual contract",
    features: [
      "Up to 200 Mbps internet with unlimited data",
      "Digital cable TV with the EVO FORCE 1 box",
      "Local channels, news and regional sports",
      "One account, one monthly bill",
    ],
    verified: true,
  },

  /* ------------------------------ TV ----------------------------------- */
  {
    id: "tv-streamtv",
    name: "StreamTV",
    serviceLine: "tv",
    price: 8,
    cents: "99",
    promoQualifier: "added to any Buckeye internet plan",
    equipmentFee: "No set-top box required",
    contractTerm: "No annual contract",
    features: [
      "3 simultaneous streams",
      "100 hours of cloud DVR storage",
      "Watch on phones, tablets and smart TVs",
      "No set-top box required",
    ],
    verified: true,
  },
  {
    id: "tv-streamtv-ultra",
    name: "StreamTV Ultra",
    serviceLine: "tv",
    price: 16,
    promoQualifier: "added to any Buckeye internet plan",
    equipmentFee: "No set-top box required",
    contractTerm: "No annual contract",
    features: [
      "5 simultaneous streams",
      "300 hours of cloud DVR storage",
      "Watch on phones, tablets and smart TVs",
      "Built for larger households",
    ],
    verified: true,
  },
  {
    id: "tv-select",
    name: "TV Select",
    serviceLine: "tv",
    price: 24,
    cents: "99",
    promoQualifier: "added to any Buckeye internet plan",
    equipmentFee: "Two streaming boxes included",
    contractTerm: "No annual contract",
    features: [
      "600+ channels",
      "Two streaming boxes included",
      "Entertainment networks including A&E and Lifetime",
      "Local channels and regional sports",
    ],
    isPopular: true,
    verified: true,
  },
  {
    id: "tv-local30",
    name: "Local 30+",
    serviceLine: "tv",
    /* Buckeye publishes this package but does not list a standalone monthly
       rate on its public pages — it is quoted with internet or with StreamTV.
       Renders "Call for pricing" rather than an invented figure. */
    promoQualifier: "quoted with your internet plan",
    equipmentFee: "StreamTV or rented equipment required per outlet",
    contractTerm: "No annual contract",
    features: [
      "30+ local channels",
      "Local news, weather and regional sports",
      "Includes the Broadcast Retransmission Fee",
      "Viewable on additional outlets with StreamTV or rented equipment",
    ],
    verified: true,
  },

  /* ---------------------------- MOBILE --------------------------------- */
  {
    id: "mobile-4gb",
    name: "MaxxMobile 4 GB",
    serviceLine: "mobile",
    price: 24,
    cents: "99",
    priceUnit: "/mo per line",
    promoQualifier: "requires an active Buckeye internet plan",
    contractTerm: "No annual contract",
    features: [
      "4 GB of high-speed data per line",
      "Unlimited domestic talk and text",
      "Nationwide 5G network",
      "Bring your own device and keep your number",
    ],
    verified: true,
  },
  {
    id: "mobile-30gb",
    name: "MaxxMobile 30 GB",
    serviceLine: "mobile",
    price: 29,
    cents: "99",
    priceUnit: "/mo per line",
    promoQualifier: "requires an active Buckeye internet plan",
    contractTerm: "No annual contract",
    features: [
      "30 GB of high-speed data per line",
      "Unlimited domestic talk and text",
      "Nationwide 5G network",
      "Bring your own device and keep your number",
    ],
    isPopular: true,
    verified: true,
  },
  {
    id: "mobile-50gb",
    name: "MaxxMobile 50 GB",
    serviceLine: "mobile",
    price: 39,
    cents: "99",
    priceUnit: "/mo per line",
    promoQualifier: "requires an active Buckeye internet plan",
    contractTerm: "No annual contract",
    features: [
      "50 GB of high-speed data per line",
      "Unlimited domestic talk and text",
      "Nationwide 5G network",
      "Bring your own device and keep your number",
    ],
    verified: true,
  },

  /* ----------------------------- PHONE --------------------------------- */
  {
    id: "phone-home",
    name: "Buckeye Home Phone",
    serviceLine: "phone",
    price: 19,
    cents: "99",
    promoQualifier: "added to any Buckeye internet plan",
    stepUp: "Introductory pricing applies for the first three months.",
    equipmentFee: "Works with your existing handsets",
    dataPolicy: "Unlimited calling",
    contractTerm: "No annual contract",
    features: [
      "Unlimited local and long-distance calling",
      "Calls to Canada included at no extra charge",
      "Voicemail included",
      "Robocall blocking included",
      "Billed on the same account as your internet",
    ],
    verified: true,
  },
];

/* ---------------------------------------------------------------------------
   4b. HERO COPY + TRUST CHIPS
       The H1 is stored as separate lines and joined with real spaces by the
       renderer, so the rendered textContent never fuses into "onepriceheld".
   ------------------------------------------------------------------------ */

export const HERO = {
  eyebrow: DISCLOSURE,
  kicker: "Fiber, cable, TV, mobile and home phone",
  h1Lines: ["Fiber and cable internet for homes", "across Northwest Ohio and", "Southeast Michigan."],
  sub: "Every internet plan includes unlimited data, no annual contract and a monthly rate guaranteed for three years. Television, wireless and home phone can be added to the same account.",
  anchorLabel: "Fiber, from",
  /* Hero art. Swap `src` to a photograph once one is available — it is the
     page's LCP element, so keep it compressed and 1920px wide at most.
     Decorative: the hero's meaning is carried by the headline, so alt is "". */
  image: { src: "/img/hero-home.jpg", alt: "", focus: "50% 45%" } as SectionImage,
};

/**
 * Hero trust chips. Each must be a fact the carrier publishes.
 * Edit here to change them everywhere — nothing is hardcoded in the JSX.
 */
export const TRUST_CHIPS = [
  "Unlimited data",
  "No annual contract",
  "3-Year Price Guarantee",
  "Equipment included",
];

/* ---------------------------------------------------------------------------
   4c. SECTION HEADINGS — the non-plan sections.
       Kept here with everything else so no visitor-facing copy lives in JSX.
   ------------------------------------------------------------------------ */

export interface SectionCopy {
  heading: string;
  intro: string;
  /** Closing line under the value-added-services grid. */
  foot?: string;
  /** Small print under the coverage lists. */
  note?: string;
  /** Label on the FAQ contact card. */
  cardLabel?: string;
  /** Optional photograph. Absent => the section renders no figure. */
  image?: SectionImage;
}

export const SECTION_COPY: Record<
  "vas" | "compare" | "why" | "how" | "coverage" | "faq",
  SectionCopy
> = {
  vas: {
    heading: "Equipment and support included",
    intro: `What ${SITE.carrier} provides with every plan, and the add-ons an agent can attach to your order.`,
    foot: "Ask about add-ons when you call.",
  },
  compare: {
    heading: "Internet plan comparison",
    intro: "Every residential tier, with the terms that apply to each.",
  },
  why: {
    heading: "Why order through an authorized agent",
    intro: `Orders are placed on ${SITE.carrier}'s own systems at its published rates. Service, billing and installation come directly from ${SITE.carrier}.`,
  },
  how: {
    heading: "Ordering in three steps",
    intro: "From confirming your address to a scheduled installation date.",
    image: { src: "/img/sections/install.jpg", alt: "", focus: "50% 45%", display: "background" },
  },
  coverage: {
    heading: "Coverage across Northwest Ohio and Southeast Michigan",
    intro: `${SITE.carrier} serves communities on both sides of the state line. Fiber and cable reach different streets within the same community, so serviceability is confirmed by address rather than by town.`,
    note: "Listed communities indicate where Buckeye builds. Confirm your street address by phone before ordering.",
    image: { src: "/img/sections/coverage.jpg", alt: "An elevated view over the rooftops of a residential neighbourhood", focus: "50% 45%", display: "banner" },
  },
  faq: {
    heading: "Questions worth asking first",
    intro: "The answers people most often want before they call.",
    cardLabel: "Still deciding?",
  },
};

/* ---------------------------------------------------------------------------
   5. VALUE-ADDED SERVICES — real Buckeye product names only.
   ------------------------------------------------------------------------ */

export interface VasItem {
  name: string;
  description: string;
  detail: string;
  icon: string;
}

export const VAS_ITEMS: VasItem[] = [
  {
    name: "EVO WiFi",
    description:
      "Buckeye's WiFi gateway and extender, included with every internet plan at no additional charge.",
    detail: "Included",
    icon: "i-wifi",
  },
  {
    name: "SmartNet",
    description:
      "Whole-home mesh WiFi powered by eero, for addresses where one gateway cannot cover every room.",
    detail: "Ask when you call",
    icon: "i-home",
  },
  {
    name: "Brainiacs",
    description:
      "Buckeye's technical support team, available around the clock for setup and troubleshooting.",
    detail: "Included",
    icon: "i-headset",
  },
  {
    name: "Super Channels",
    description:
      "50+ streaming channels bundled with every Buckeye internet plan at no extra cost.",
    detail: "Included",
    icon: "i-tv",
  },
  {
    name: "EVO FORCE 1",
    description:
      "Buckeye's cable TV box, with a simplified 10-button remote and integrated streaming apps.",
    detail: "With cable TV",
    icon: "i-play",
  },
  {
    name: "3-Year Price Guarantee",
    description:
      "The monthly rate on your internet plan is held for three full years from activation.",
    detail: "Standard",
    icon: "i-lock",
  },
];

/* ---------------------------------------------------------------------------
   6. HOW IT WORKS
   ------------------------------------------------------------------------ */

export const STEPS = [
  {
    n: "01",
    title: "Check your address",
    body: `Enter your ZIP to see whether ${SITE.carrier} builds in your area, then call so an agent can confirm serviceability at your exact street address.`,
  },
  {
    n: "02",
    title: "Pick your plan",
    body: "An agent walks you through the tiers available at your address, confirms today's rate and adds TV, mobile or home phone if you want them.",
  },
  {
    n: "03",
    title: "Get connected",
    body: `Installation is scheduled with and performed by ${SITE.carrier}. The agent books the earliest slot available for your address.`,
  },
];

/* ---------------------------------------------------------------------------
   7. WHY ORDER HERE — approved claims only.
   ------------------------------------------------------------------------ */

export const WHY_ITEMS = [
  {
    title: "One call covers every service",
    body: "Internet, TV, mobile and home phone are placed on a single order, on one account, in one conversation.",
    icon: "i-phone",
  },
  {
    title: "Current Buckeye pricing",
    body: `You pay ${SITE.carrier}'s published rates. Ordering through an authorized agent adds nothing to your monthly bill.`,
    icon: "i-tag",
  },
  {
    title: "Your address checked on the call",
    body: "Serviceability and the exact tiers available at your street address are confirmed before anything is submitted.",
    icon: "i-pin",
  },
  {
    title: "No obligation to order",
    body: "Call, compare the tiers and decide in your own time. Nothing is submitted until you say so.",
    icon: "i-check",
  },
];

/* ---------------------------------------------------------------------------
   8. FAQ — rendered to the DOM and to FAQPage JSON-LD from this one array.
   ------------------------------------------------------------------------ */

export interface FaqItem {
  q: string;
  a: string;
}

export const FAQS: FaqItem[] = [
  {
    q: "Is Buckeye Broadband available at my address?",
    a: `Coverage varies street by street across ${SITE.serviceArea}. Fiber and cable reach different addresses, and the tiers available to you depend on which network serves your block. Call ${SITE.phoneDisplay} and an agent will confirm serviceability and the exact speeds available at your address.`,
  },
  {
    q: "What does the 3-Year Price Guarantee actually cover?",
    a: "The monthly rate for your internet plan is held for three years from activation. It applies to the plan rate itself; taxes, surcharges and any services you add later are billed separately and can change.",
  },
  {
    q: "What is the difference between Buckeye fiber and cable internet?",
    a: "Fiber delivers matching download and upload speeds, which matters for video calls, cloud backups and uploading large files. Cable delivers fast downloads with lower upload speeds. Availability is determined by the network built to your address, not by preference.",
  },
  {
    q: "Are there data caps or overage charges?",
    a: "No. Buckeye residential internet plans include unlimited data with no overage charges and no throttling for normal household use.",
  },
  {
    q: "Do I need a contract?",
    a: "No. Buckeye residential internet plans are sold without an annual contract, so there is no early-termination fee if you move or cancel.",
  },
  {
    q: "Is equipment included or rented separately?",
    a: "Buckeye internet plans include an EVO WiFi router and one WiFi extender at no additional charge. Cable TV service uses the EVO FORCE 1 box, and additional outlets require StreamTV or rented equipment.",
  },
  {
    q: "How does installation work?",
    a: `Installation is scheduled with and carried out by ${SITE.carrier}. When you call, the agent books the earliest available appointment for your address and explains what to expect on the day.`,
  },
  {
    q: "Can I add TV, mobile or home phone to an internet plan?",
    a: "Yes. StreamTV, cable TV, MaxxMobile wireless and Buckeye Home Phone can all be added to an internet plan on the same order. MaxxMobile requires an active Buckeye internet subscription.",
  },
  {
    q: "What happens when I call?",
    a: `An agent confirms what is serviceable at your address, quotes today's ${SITE.carrier} rates for those plans, and places the order with ${SITE.carrier} if you decide to proceed. Calls may be recorded for quality and training purposes.`,
  },
];

/* ---------------------------------------------------------------------------
   9. FINE PRINT — the disclosure block under every plan section.
   ------------------------------------------------------------------------ */

export const FINE_PRINT: string[] = [
  `Pricing, speeds, channel lineups and promotions are set by ${SITE.carrier} and are subject to change.`,
  "Advertised rates exclude taxes, fees and surcharges.",
  "Speeds shown are maximum rates; actual speeds vary by address, equipment and network conditions.",
  "Availability, pricing and speeds vary by address. Call to confirm what is serviceable at yours.",
  "The 3-Year Price Guarantee applies to the plan rate and does not cover taxes, fees or services added later.",
  "MaxxMobile requires an active Buckeye Broadband internet subscription.",
];

/* ---------------------------------------------------------------------------
   10. COVERAGE — communities named on the carrier's own footprint pages.
   ------------------------------------------------------------------------ */

export const COVERAGE_GROUPS: { state: string; areas: string[] }[] = [
  {
    state: "Northwest Ohio",
    areas: [
      "Toledo",
      "Sylvania",
      "Perrysburg",
      "Maumee",
      "Oregon",
      "Holland",
      "Waterville",
      "Bowling Green",
      "Sandusky",
      "Huron",
    ],
  },
  {
    state: "Southeast Michigan",
    areas: ["Bedford", "Temperance", "Lambertville"],
  },
];

/** Flat list, used for schema markup. */
export const COVERAGE_AREAS = COVERAGE_GROUPS.flatMap((g) => g.areas);

/**
 * ZIP prefixes inside the Buckeye footprint, used by the hero availability
 * check. This is a front-end convenience only — it reports whether a ZIP sits
 * in the service area, never whether a specific address is serviceable.
 */
export const FOOTPRINT_ZIP_PREFIXES = ["434", "435", "436", "448", "492"];

/* ---------------------------------------------------------------------------
   11. HELPERS — the "one common function for pricing".
       Every price string on the site comes from here.
   ------------------------------------------------------------------------ */

/** Plans that are allowed on the page: verified only. */
export function publishedPlans(): PlanItem[] {
  return PLANS.filter((p) => p.verified);
}

/** Publishable plans for one service line, in array order. */
export function plansFor(line: ServiceLine): PlanItem[] {
  return publishedPlans().filter((p) => p.serviceLine === line);
}

/** Sections that actually have plans — drives both the page and the nav. */
export function activeSections(): ServiceSection[] {
  return SERVICE_SECTIONS.filter((s) => plansFor(s.line).length > 0);
}

/** True when a plan carries a real, publishable price. */
export function hasPrice(plan: PlanItem): boolean {
  return typeof plan.price === "number";
}

/** The unit suffix shown beside a price. */
export function priceUnit(plan: PlanItem): string {
  return plan.priceUnit ?? "/mo";
}

/**
 * Plain-English price, used for screen readers, JSON-LD and anywhere a string
 * is needed. Generated from the same object the visual lockup renders, so the
 * two can never drift apart.
 */
export function priceLabel(plan: PlanItem): string {
  if (!hasPrice(plan)) return "Call for pricing";
  const cents = plan.cents ? `.${plan.cents}` : "";
  const unit = priceUnit(plan) === "/mo" ? "per month" : "per month per line";
  return `$${plan.price}${cents} ${unit}`;
}

/** Numeric price for JSON-LD Offers. Null when there is no price to publish. */
export function priceValue(plan: PlanItem): string | null {
  if (!hasPrice(plan)) return null;
  return `${plan.price}.${plan.cents ?? "00"}`;
}

/** Button label. The only two strings allowed on a plan CTA. */
export function ctaLabel(plan: PlanItem): string {
  return hasPrice(plan) ? "Call to order" : "Call for pricing";
}

/** Speed summary for the comparison grid. */
export function speedLabel(plan: PlanItem): string {
  if (!plan.speedDown) return "—";
  const down = plan.speedDown >= 1000 ? `${plan.speedDown / 1000} Gig` : `${plan.speedDown} Mbps`;
  if (!plan.speedUp) return `Up to ${down}`;
  if (plan.speedUp === plan.speedDown) return `${down} symmetrical`;
  const up = plan.speedUp >= 1000 ? `${plan.speedUp / 1000} Gig` : `${plan.speedUp} Mbps`;
  return `${down} down / ${up} up`;
}

/** The plan used as the hero price anchor: the flagged fiber plan. */
export function heroPlan(): PlanItem | undefined {
  const fiber = plansFor("fiber");
  return fiber.find((p) => p.isPopular) ?? fiber[0] ?? publishedPlans()[0];
}

/** Rows for the fine-print comparison grid: all internet tiers. */
export function gridPlans(): PlanItem[] {
  return [...plansFor("fiber"), ...plansFor("cable")];
}

/**
 * Responsive source set for a section photograph.
 *
 * Every image in public/img ships with a 960px-wide sibling named
 * `<name>-960.jpg`, so a phone downloads roughly a third of the bytes. Keep
 * the pair in step: regenerate both widths whenever a photograph changes.
 */
export function srcSetFor(src: string): string {
  const small = src.replace(/\.jpg$/, "-960.jpg");
  return small === src ? src : `${small} 960w, ${src} 1920w`;
}

/** True when a ZIP sits inside the published footprint. */
export function zipInFootprint(zip: string): boolean {
  const clean = zip.trim();
  if (!/^\d{5}$/.test(clean)) return false;
  return FOOTPRINT_ZIP_PREFIXES.some((p) => clean.startsWith(p));
}

/* ---------------------------------------------------------------------------
   12. SOURCES
   ----------------------------------------------------------------------------
   Plan and pricing figures above were compiled from Buckeye Broadband's
   published plan, offer-details, rate-card and product pages:

     buckeyebroadband.com/internet          buckeyebroadband.com/fiberpackage
     buckeyebroadband.com/cable_tv          buckeyebroadband.com/streamtv
     buckeyebroadband.com/bundle            buckeyebroadband.com/packages
     buckeyebroadband.com/maxxmobile        buckeyebroadband.com/phone
     buckeyebroadband.com/offerdetails      buckeyebroadband.com/broadbandlabels

   OPERATOR ACTION BEFORE LAUNCH
   -----------------------------
   buckeyebroadband.com serves HTTP 403 to requests originating outside the
   United States, so these figures were compiled from indexed content of those
   pages rather than read directly from them. Confirm each price against the
   live carrier pages from a US connection before running ads, and correct any
   that have moved. Items to re-check first, because reporting differed:

     - Fiber 1 Gig at $89.99: also reported at $99.99 on a Flat Rate Pak
       variant that bundles a MaxxMobile line. Confirm which is current.
     - Fiber 600 at $79.99: standard (non-promotional) rate card figures for
       fiber run substantially higher. Confirm the promotional rate still runs.
     - Cable tiers (Essential / Ultimate / Supreme): confirm the tier names and
       rates, which move more often than the fiber lineup.
     - Local 30+ carries no published standalone rate and therefore renders
       "Call for pricing". Add a price here only if Buckeye publishes one.

   Setting `verified: false` on any plan removes it from the page and the
   JSON-LD immediately, with no JSX edit required.
   ========================================================================== */
