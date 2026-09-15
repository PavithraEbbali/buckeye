// Generates the 8 footer legal pages from a shared, brand-matched template.
// Content is original, written for an authorized-reseller landing site.
import { writeFileSync } from "node:fs";

const BRAND = "Buckeye Broadband Authorized Agent";
const PHONE_DISPLAY = "(419) 828-0022";
const PHONE_HREF = "+14198280022";
const EMAIL = "care@buckeyeagent.com";
const SITE = "https://www.buckeyeagent.com";
const UPDATED = "July 7, 2026";

const NAV = [
  ["privacy", "Privacy &amp; Data Protection"],
  ["disclaimer", "Disclaimer"],
  ["cookies", "Cookies Policy"],
  ["tcpa", "TCPA Policy"],
  ["trademarks", "Trademarks"],
  ["marketing", "Marketing Policy"],
  ["service-fulfillment", "Service Fulfillment"],
  ["pci-dss", "PCI DSS"],
];

const mark = `<svg viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#05a2f6"/><stop offset="1" stop-color="#002e6c"/></linearGradient></defs><rect width="48" height="48" rx="12" fill="url(#g)"/><path d="M13 27a12 12 0 0 1 22 0" fill="none" stroke="#fff" stroke-width="3.6" stroke-linecap="round"/><path d="M18 30.5a6.5 6.5 0 0 1 12 0" fill="none" stroke="#ffc40d" stroke-width="3.6" stroke-linecap="round"/><circle cx="24" cy="34.5" r="2.8" fill="#fff"/></svg>`;

const footLinks = NAV.map(([slug, label]) => `<a href="${slug}.html">${label}</a>`).join("\n        ");

function page({ slug, title, desc, eyebrow, h1, toc, body }) {
  const tocHtml = toc
    ? `<nav class="lz-toc" aria-label="On this page"><h2>On this page</h2><ul>${toc
        .map((t) => `<li><a href="#${t[0]}">${t[1]}</a></li>`)
        .join("")}</ul></nav>`
    : "";
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} | ${BRAND}</title>
<meta name="description" content="${desc}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#002e6c">
<link rel="canonical" href="${SITE}/legal/${slug}.html">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800;900&family=Roboto:wght@400;500;700&display=swap">
<link rel="stylesheet" href="../assets/legal.css">
<link rel="icon" href="../assets/favicon.svg" type="image/svg+xml">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"WebPage","name":"${title}","url":"${SITE}/legal/${slug}.html","publisher":{"@type":"Organization","name":"${BRAND}"},"dateModified":"2026-07-07","breadcrumb":{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"${SITE}/"},{"@type":"ListItem","position":2,"name":"${title}","item":"${SITE}/legal/${slug}.html"}]}}
</script>
</head>
<body>
<div class="lz-top"><div class="wrap"><span>Authorized independent reseller of Buckeye Broadband&reg; — not the official Buckeye Broadband site.</span><span>Call: <a href="tel:${PHONE_HREF}">${PHONE_DISPLAY}</a></span></div></div>

<header class="lz-head"><div class="wrap">
  <a class="lz-brand" href="../index.html">${mark}<span>buckeye&nbsp;broadband<small>Authorized Agent</small></span></a>
  <a class="lz-back" href="../index.html">&larr; Back to home</a>
</div></header>

<section class="lz-hero"><div class="wrap lz-reveal">
  <div class="lz-eyebrow">${eyebrow}</div>
  <h1>${h1}</h1>
  <div class="lz-updated">Last updated: ${UPDATED}</div>
</div></section>

<main class="lz-body"><div class="wrap">
  ${tocHtml}
  ${body}
  <div class="lz-note"><strong>Questions about this policy?</strong> Contact ${BRAND} at <a href="mailto:${EMAIL}">${EMAIL}</a> or call <a href="tel:${PHONE_HREF}">${PHONE_DISPLAY}</a>.</div>
</div></main>

<footer class="lz-foot"><div class="wrap">
  <nav class="lz-foot__links" aria-label="Legal pages">
        ${footLinks}
  </nav>
  <div class="lz-foot__disc"><strong>Authorized agent disclosure:</strong> This site is operated by an independent, authorized agent of Buckeye Broadband and is not Buckeye Broadband, Block Communications, Inc., or any affiliated company. Product names and logos are trademarks of their respective owners and are used for descriptive purposes only. Pricing, speeds and availability are set by the service provider and may change without notice. &copy; 2026 ${BRAND}. All rights reserved.</div>
</div></footer>
</body>
</html>`;
}

const P = "<p>", _P = "</p>";

const pages = [
  {
    slug: "privacy",
    title: "Privacy &amp; Data Protection",
    desc: "How this authorized agent collects, uses, shares and protects your personal information as an authorized agent of Buckeye Broadband.",
    eyebrow: "Your data, respected",
    h1: "Privacy &amp; Data Protection",
    toc: [["intro","Who we are"],["collect","What we collect"],["use","How we use it"],["share","When we share"],["rights","Your rights"],["security","How we protect it"],["retention","Retention"],["children","Children"],["contact","Contact"]],
    body: `
<p id="intro">${BRAND} ("we," "us," "our") is an independent, authorized agent that helps residents shop for and order Buckeye Broadband internet, TV, home phone and mobile services. This policy explains what personal information we handle when you visit this site or contact us, and the choices you have. We wrote it to be readable — not to bury you in fine print.</p>

<h2 id="collect">Information we collect</h2>
<p>We only collect what we need to help you check availability and place an order:</p>
<ul>
  <li><strong>Details you give us</strong> — your name, phone number, email and service address when you call, email or submit a request so we can check serviceability and set up an order.</li>
  <li><strong>Automatic technical data</strong> — basic device, browser and general-location information gathered through cookies and similar tools to keep the site secure and understand how it's used.</li>
  <li><strong>Communication records</strong> — notes from calls, texts or emails so we can follow up accurately and improve support.</li>
</ul>
<p>We do <strong>not</strong> ask you to enter payment card numbers, bank details or government IDs on this website. Payment and identity verification are handled by the service provider through their own secure systems.</p>

<h2 id="use">How we use your information</h2>
<ul>
  <li>To confirm whether service is available at your address and present matching plans.</li>
  <li>To process and coordinate your order with the service provider.</li>
  <li>To respond to questions and provide customer support.</li>
  <li>To send information you ask for, and — only where permitted — relevant offers you can opt out of at any time.</li>
  <li>To keep the site working, secure and free of fraud, and to meet legal obligations.</li>
</ul>

<h2 id="share">When we share information</h2>
<p>We do not sell your personal information. We share it only in these situations:</p>
<ul>
  <li><strong>With the service provider</strong> (Buckeye Broadband and its operating companies) to fulfill an order you request.</li>
  <li><strong>With trusted vendors</strong> who help us run the site, communications and analytics under confidentiality obligations.</li>
  <li><strong>When required by law</strong> or to protect the rights, safety and property of you, us or others.</li>
</ul>

<h2 id="rights">Your privacy rights</h2>
<p>Depending on where you live, you may have the right to access, correct, delete or receive a copy of your personal information, and to opt out of certain uses. Residents of states with comprehensive privacy laws — and other applicable jurisdictions — can exercise these rights at no cost. To make a request, email <a href="mailto:${EMAIL}">${EMAIL}</a>. We will verify your request and respond within the timeframe required by law. You may also authorize an agent to act on your behalf.</p>
<div class="lz-note">You can unsubscribe from marketing emails using the link in any message, and you can opt out of calls and texts as described in our <a href="tcpa.html">TCPA Policy</a>.</div>

<h2 id="security">How we protect your data</h2>
<p>We use administrative, technical and physical safeguards — including encryption in transit, access controls and vendor vetting — to protect the information we hold. No method of transmission is perfectly secure, but we work to keep your data safe and to limit who can access it to those who need it.</p>

<h2 id="retention">How long we keep it</h2>
<p>We keep personal information only as long as needed for the purposes above, to comply with legal and tax obligations, and to resolve disputes. When it is no longer needed, we delete or de-identify it.</p>

<h2 id="children">Children's privacy</h2>
<p>This site is intended for adults arranging residential service. We do not knowingly collect personal information from children under 13. If you believe a child provided us information, contact us and we will remove it.</p>

<h2 id="contact">Contact us</h2>
<p>Questions, requests or complaints about privacy can be sent to <a href="mailto:${EMAIL}">${EMAIL}</a> or ${PHONE_DISPLAY}. If you are not satisfied with our response, you may have the right to contact your local data-protection or consumer-protection authority.</p>`,
  },
  {
    slug: "disclaimer",
    title: "Disclaimer",
    desc: "Buckeye Broadband Authorized Agent is an independent authorized agent of Buckeye Broadband. Read our disclaimer on independence, accuracy, pricing and third-party services.",
    eyebrow: "Setting expectations",
    h1: "Disclaimer",
    toc: [["independence","Independence"],["accuracy","Accuracy of information"],["pricing","Pricing &amp; availability"],["thirdparty","Third-party services"],["liability","Limitation of liability"]],
    body: `
<div class="lz-note warn"><strong>Important:</strong> ${BRAND} is an independent, authorized reseller. This is <strong>not</strong> the official Buckeye Broadband website, and we are not Buckeye Broadband, Block Communications, Inc., or any affiliated entity.</div>

<h2 id="independence">Independence</h2>
<p>${BRAND} operates as an authorized third-party reseller that helps customers compare plans and place orders for services provided by Buckeye Broadband. The underlying network, service delivery, installation, billing and account management are provided by Buckeye Broadband and its operating companies under their own terms and conditions. References to Buckeye Broadband and its product names are for identification and descriptive purposes only — see our <a href="trademarks.html">Trademarks</a> page.</p>

<h2 id="accuracy">Accuracy of information</h2>
<p>We work hard to keep plan details, speeds, features and pricing on this site current and accurate, but information may change and errors can occur. Nothing here is a binding offer. The controlling terms for any service are those presented and agreed to at the time you place your order with the service provider.</p>

<h2 id="pricing">Pricing &amp; availability</h2>
<p>Advertised prices are for new residential customers, may exclude applicable taxes, surcharges and fees, and are subject to change. Speeds shown are maximum "up to" figures and can vary with your equipment, wiring and network conditions. All plans and promotions are subject to serviceability at your specific address, which we confirm before an order is finalized.</p>

<h2 id="thirdparty">Third-party services &amp; links</h2>
<p>This site may reference or link to third-party websites and services. We do not control and are not responsible for their content, policies or practices. Your use of any third-party service is governed by that party's own terms.</p>

<h2 id="liability">Limitation of liability</h2>
<p>This website and its content are provided "as is" without warranties of any kind, express or implied. To the fullest extent permitted by law, ${BRAND} is not liable for any indirect, incidental or consequential damages arising from your use of this site or reliance on its content. Your relationship for the actual telecommunications service is with the service provider under their agreement with you.</p>`,
  },
  {
    slug: "cookies",
    title: "Cookies Policy",
    desc: "How Buckeye Broadband Authorized Agent uses cookies and similar technologies, the categories we use, and how you can control them.",
    eyebrow: "Small files, clear choices",
    h1: "Cookies Policy",
    toc: [["what","What cookies are"],["types","Types we use"],["manage","Managing cookies"],["dnt","Do Not Track"]],
    body: `
<p id="what">Cookies are small text files a website stores on your device to make it work properly, remember preferences and understand how it's used. This page explains how ${BRAND} uses cookies and similar technologies, and how you stay in control.</p>

<h2 id="types">Categories of cookies we use</h2>
<table class="lz-tbl">
  <thead><tr><th>Category</th><th>What it does</th><th>Can you disable it?</th></tr></thead>
  <tbody>
    <tr><td><strong>Strictly necessary</strong></td><td>Core functions like security, load balancing and remembering your cookie choices.</td><td>Always on — the site can't work without these.</td></tr>
    <tr><td><strong>Performance &amp; analytics</strong></td><td>Anonymous, aggregated stats on page visits and navigation so we can improve the site.</td><td>Yes.</td></tr>
    <tr><td><strong>Functional</strong></td><td>Remembers preferences such as your region or previously entered details.</td><td>Yes.</td></tr>
    <tr><td><strong>Marketing</strong></td><td>Helps measure ad campaigns and, where permitted, show more relevant offers.</td><td>Yes.</td></tr>
  </tbody>
</table>

<h2 id="manage">Managing your cookies</h2>
<p>You can accept or decline non-essential cookies through any consent banner we present, and you can change your choice at any time. You can also manage or delete cookies directly in your browser settings:</p>
<ul>
  <li>Adjust settings in Chrome, Safari, Edge or Firefox to block or delete cookies.</li>
  <li>Use your browser's private/incognito mode to limit stored data.</li>
  <li>Opt out of certain analytics and advertising cookies via industry tools such as the Digital Advertising Alliance and Network Advertising Initiative opt-out pages.</li>
</ul>
<div class="lz-note">Blocking some cookies may affect how parts of the site function, but you'll still be able to browse and contact us.</div>

<h2 id="dnt">Do Not Track</h2>
<p>Some browsers offer a "Do Not Track" signal. Because there is no common industry standard for how to respond, we handle these signals in line with applicable law and our commitment to minimizing non-essential tracking.</p>`,
  },
  {
    slug: "tcpa",
    title: "TCPA Policy",
    desc: "Buckeye Broadband Authorized Agent's Telephone Consumer Protection Act policy: your consent to calls and texts, how we contact you, and how to opt out.",
    eyebrow: "Calls &amp; texts, by consent",
    h1: "TCPA Policy",
    toc: [["consent","Your consent"],["notrequired","Consent isn't required to buy"],["how","How we contact you"],["optout","How to opt out"],["records","Records &amp; hours"]],
    body: `
<p>This policy explains how ${BRAND} complies with the Telephone Consumer Protection Act (TCPA) and related rules when we call or text you. Your consent and your right to opt out are central to how we operate.</p>

<h2 id="consent">Your consent to be contacted</h2>
<p>When you provide your phone number and ask us to contact you — for example by calling us, submitting a request, or clicking to call — you agree that ${BRAND} and the service provider may contact you at that number about your inquiry and related services. This may include calls and text messages, and may use automated or prerecorded technology where you have given the required consent. Message and data rates may apply.</p>

<div class="lz-note warn" id="notrequired"><strong>You are never required to agree to marketing calls or texts as a condition of purchasing anything.</strong> You can ask us to reach you by email only, and you can withdraw consent at any time.</div>

<h2 id="how">How and why we contact you</h2>
<ul>
  <li>To confirm availability at your address and follow up on a request you started.</li>
  <li>To schedule installation or answer support questions.</li>
  <li>To share relevant offers — only where you've consented, and always with an easy way to stop.</li>
</ul>

<h2 id="optout">How to opt out</h2>
<ul>
  <li><strong>Texts:</strong> reply <strong>STOP</strong> to any message to end texts; reply <strong>HELP</strong> for help.</li>
  <li><strong>Calls:</strong> tell any representative you wish to be placed on our internal do-not-call list, or email <a href="mailto:${EMAIL}">${EMAIL}</a>.</li>
  <li><strong>Email:</strong> use the unsubscribe link in any marketing email.</li>
</ul>
<p>We honor opt-out requests promptly and maintain an internal do-not-call list. We also respect the National Do Not Call Registry for telemarketing.</p>

<h2 id="records">Records &amp; calling hours</h2>
<p>We keep records of consent and opt-out requests. Telemarketing calls, if any, are placed only within the hours permitted by federal and state law. If you believe you received a message in error, contact us at <a href="mailto:${EMAIL}">${EMAIL}</a> and we'll make it right.</p>`,
  },
  {
    slug: "trademarks",
    title: "Trademarks",
    desc: "Trademark attribution and nominative fair use statement for Buckeye Broadband Authorized Agent, an authorized agent of Buckeye Broadband.",
    eyebrow: "Marks &amp; attribution",
    h1: "Trademarks",
    toc: [["ownership","Ownership"],["use","How we use these marks"],["nostatement","No endorsement implied"]],
    body: `
<h2 id="ownership">Trademark ownership</h2>
<p>"Buckeye Broadband," "MaxxMobile," "SmartNet," "Brainiacs," "BCSN" and related names, logos and slogans are trademarks or registered trademarks of Buckeye Broadband, Block Communications, Inc., and/or their respective owners. All other product and company names referenced on this site are the property of their respective owners.</p>

<h2 id="use">How we use these marks</h2>
<p>${BRAND} is an authorized reseller and references these trademarks only to accurately identify and describe the services we help customers order. This is known as <strong>nominative fair use</strong>: naming a product to describe it, without implying ownership of the brand. We do not claim any ownership of, or exclusive rights to, these marks.</p>

<div class="lz-note"><strong>Our own brand:</strong> "${BRAND}" and our logo are marks of ${BRAND}. Please don't use them without permission.</div>

<h2 id="nostatement">No endorsement implied</h2>
<p>Use of a third-party trademark on this site does not imply that the trademark owner endorses, sponsors or is affiliated with ${BRAND} beyond an authorized reseller relationship. If you own a trademark referenced here and have a concern about how it is used, please contact us at <a href="mailto:${EMAIL}">${EMAIL}</a> and we will respond promptly.</p>`,
  },
  {
    slug: "marketing",
    title: "Marketing Policy",
    desc: "How Buckeye Broadband Authorized Agent advertises: honest claims, clear reseller disclosure, no spam, and compliance with advertising standards.",
    eyebrow: "Advertising with integrity",
    h1: "Marketing Policy",
    toc: [["principles","Our principles"],["claims","Honest claims"],["disclosure","Clear disclosure"],["channels","Channels &amp; consent"],["standards","Platform standards"]],
    body: `
<p>${BRAND} believes advertising should be clear, honest and easy to verify. This policy describes how we market our reseller services and the standards we hold ourselves to.</p>

<h2 id="principles">Our marketing principles</h2>
<ul>
  <li><strong>Truthful:</strong> we don't exaggerate speeds, prices or savings.</li>
  <li><strong>Transparent:</strong> we clearly identify who we are — an authorized reseller, not the provider.</li>
  <li><strong>Respectful:</strong> we contact people only with appropriate consent and honor opt-outs.</li>
</ul>

<h2 id="claims">Honest claims &amp; pricing</h2>
<p>Prices, speeds and promotions in our ads reflect current provider offers to the best of our knowledge and include material conditions such as "up to" speeds, new-customer eligibility and the exclusion of taxes and fees. Where a claim has limits, we disclose them. Final terms are always those you agree to at the time of order.</p>

<h2 id="disclosure">Clear reseller disclosure</h2>
<p>Every page of this site and our advertising identifies ${BRAND} as an independent, authorized reseller of Buckeye Broadband and states that this is not the official Buckeye Broadband website. We never imply we are the provider or that the provider endorses us beyond our reseller relationship.</p>

<h2 id="channels">Channels &amp; consent</h2>
<p>We may advertise through search engines, social media, email and phone. Email and phone outreach follow our <a href="privacy.html">Privacy</a> and <a href="tcpa.html">TCPA</a> policies, including consent requirements and simple ways to opt out. We do not send unsolicited bulk email (spam) or use deceptive subject lines.</p>

<h2 id="standards">Advertising-platform standards</h2>
<p>Our advertising is designed to comply with the policies of the platforms we use — including search and social advertising standards — as well as applicable law and FTC guidance on truthful advertising and clear disclosures. If you see an ad from us that seems inaccurate or misleading, tell us at <a href="mailto:${EMAIL}">${EMAIL}</a> and we'll review it.</p>`,
  },
  {
    slug: "service-fulfillment",
    title: "Service Fulfillment",
    desc: "How Buckeye Broadband Authorized Agent fulfills orders as an authorized reseller: ordering, installation, timelines, changes and cancellations.",
    eyebrow: "From order to online",
    h1: "Service Fulfillment Policy",
    toc: [["role","Our role"],["order","Placing an order"],["install","Installation"],["billing","Billing"],["changes","Changes &amp; cancellation"],["support","Getting support"]],
    body: `
<h2 id="role">Our role in fulfillment</h2>
<p>${BRAND} helps you choose a plan, confirm availability and submit your order. The actual service — provisioning, installation, equipment, billing and ongoing support — is delivered by Buckeye Broadband and its operating companies under the agreement you enter with them.</p>

<h2 id="order">Placing an order</h2>
<ol>
  <li><strong>Address check:</strong> we verify which plans are serviceable at your location.</li>
  <li><strong>Plan selection:</strong> you choose a speed and any add-ons; we review pricing, the 3-year price guarantee terms and what's included.</li>
  <li><strong>Order submission:</strong> your order and any required agreements are completed with the service provider, who confirms the details.</li>
</ol>

<h2 id="install">Installation &amp; activation</h2>
<p>Free next-day professional installation is available in most serviceable areas; exact timing depends on scheduling and local conditions. A technician will typically set up your connection and equipment and confirm your Wi-Fi is working before leaving. Self-install options may be offered where available.</p>

<h2 id="billing">Billing &amp; payments</h2>
<p>Billing is handled directly by the service provider through their secure systems. ${BRAND} does not process or store your payment card details on this website — see our <a href="pci-dss.html">PCI DSS</a> page. Your first bill and monthly charges, including any applicable taxes and fees, are governed by the provider's terms.</p>

<h2 id="changes">Changes, delays &amp; cancellation</h2>
<ul>
  <li><strong>Changes:</strong> you can request plan changes before installation by contacting us or the provider.</li>
  <li><strong>Delays:</strong> if serviceability or scheduling issues arise, we'll let you know promptly and offer alternatives.</li>
  <li><strong>Cancellation &amp; right to cancel:</strong> any cooling-off or cancellation rights are governed by the service provider's agreement and applicable law. Contact us and we'll help you take the right steps.</li>
</ul>

<h2 id="support">Getting support after you order</h2>
<p>For technical support and account changes after activation, the provider's 24/7 team is your primary resource. You're also always welcome to reach ${BRAND} at <a href="mailto:${EMAIL}">${EMAIL}</a> or ${PHONE_DISPLAY} and we'll help point you in the right direction.</p>`,
  },
  {
    slug: "pci-dss",
    title: "PCI DSS",
    desc: "Buckeye Broadband Authorized Agent's approach to payment-card security and PCI DSS: we don't collect or store card data on this site.",
    eyebrow: "Payment security",
    h1: "PCI DSS &amp; Payment Security",
    toc: [["summary","Summary"],["nocard","We don't take card data here"],["provider","Provider-handled payments"],["standards","Security standards"],["report","Reporting a concern"]],
    body: `
<div class="lz-note" id="summary"><strong>In short:</strong> this website does not collect, process or store your credit-card or bank details. Payments are handled by the service provider through PCI-DSS-compliant systems.</div>

<h2 id="nocard">No card data on this site</h2>
<p>${BRAND} is a reseller that helps you shop and place orders. We intentionally do <strong>not</strong> ask for payment card numbers, CVV codes, bank-account numbers or similar sensitive payment data on this website or over unsecured channels. If anyone claiming to be ${BRAND} asks you to send card details by email or text, do not respond and please report it to us.</p>

<h2 id="provider">How payments are handled</h2>
<p>When it's time to pay, the service provider (Buckeye Broadband) collects and processes your payment through their own secure, PCI-DSS-compliant payment environment. The Payment Card Industry Data Security Standard (PCI DSS) is the security framework that card brands require for organizations that handle cardholder data, covering encryption, access control, monitoring and regular testing.</p>

<h2 id="standards">Our security practices</h2>
<ul>
  <li>We serve this site over encrypted HTTPS connections.</li>
  <li>We limit the personal data we collect to what's needed to help you order (see <a href="privacy.html">Privacy</a>).</li>
  <li>We use reputable vendors and apply access controls to the information we do hold.</li>
  <li>We never store cardholder data, so there is no card data to breach on our side.</li>
</ul>

<h2 id="report">Reporting a security concern</h2>
<p>If you spot anything that looks like a security or phishing issue involving ${BRAND}, email <a href="mailto:${EMAIL}">${EMAIL}</a> right away. We take reports seriously and will investigate promptly.</p>`,
  },
];

for (const p of pages) {
  writeFileSync(new URL(`./legal/${p.slug}.html`, import.meta.url), page(p));
  console.log("wrote legal/" + p.slug + ".html");
}
console.log("done — " + pages.length + " pages");
