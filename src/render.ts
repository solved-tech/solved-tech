import { servicePages } from "./content";
import type {
  CaseStudy,
  ContactConfig,
  FaqEntry,
  PrivacyContent,
  ProductId,
  ServicePage,
  SiteContent,
  VorbioProduct,
} from "./content";

export const escapeHtml = (value: string): string =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character] ?? character,
  );

export const publicAssetUrl = (path: string, baseUrl: string): string => {
  const base = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return `${base}${path.replace(/^\/+/, "")}`;
};

const whatsappIcon = `
  <svg class="contact-action__icon contact-action__icon--whatsapp" aria-hidden="true" focusable="false" viewBox="0 0 24 24">
    <path d="M20 11.6a8 8 0 0 1-11.8 7.1L4 20l1.3-4A8 8 0 1 1 20 11.6Z" />
    <path d="M8.2 7.8c.3-.7.6-.7 1-.7h.3l1 2.3c.1.3.1.5-.1.8l-.8 1c.8 1.6 1.9 2.7 3.5 3.5l1-.8c.2-.2.5-.2.8-.1l2.2 1c.3.1.4.3.4.6 0 1.1-.6 2-1.6 2.4-1 .4-2.6.2-4.7-.9-1.7-.9-3.1-2.2-4.1-3.8-1.3-2-1.5-3.7-1.1-4.7.4-.7 1-1.3 2.2-.6Z" />
  </svg>`;

const emailIcon = `
  <svg class="contact-action__icon contact-action__icon--email" aria-hidden="true" focusable="false" viewBox="0 0 24 24">
    <rect x="3" y="5" width="18" height="14" rx="1.5" />
    <path d="m4 7 8 6 8-6" />
  </svg>`;

const HERO_QUOTE_SUBJECT = "Free 15-minute website call";
const QUOTE_SUBJECT = "Website quote";

const mailtoWithSubject = (email: string, subject: string): string =>
  `mailto:${email}?subject=${encodeURIComponent(subject)}`;

const renderContactActions = (
  config: ContactConfig,
  className: string,
): string => {
  const isHero = className === "hero__actions";
  const placement = isHero ? "hero" : "contact";
  const quoteSubject = isHero ? HERO_QUOTE_SUBJECT : QUOTE_SUBJECT;
  const quoteLabel = isHero ? "Book a free 15-min call" : "Get a free quote";

  return `
  <div class="${className}">
    <a class="contact-action contact-action--quote" href="${escapeHtml(mailtoWithSubject(config.email, quoteSubject))}" data-analytics="contact_click" data-channel="email" data-placement="${placement}">${quoteLabel}</a>
    <a class="contact-action contact-action--call" href="tel:${escapeHtml(config.phone)}" data-analytics="contact_click" data-channel="call" data-placement="${placement}">Call us</a>
    <a class="contact-action contact-action--whatsapp" href="https://wa.me/${escapeHtml(config.whatsapp)}" target="_blank" rel="noreferrer" data-analytics="contact_click" data-channel="whatsapp" data-placement="${placement}">${whatsappIcon}<span>WhatsApp us</span></a>
  </div>`;
};

const heroProcessStages = [
  { id: "understand", title: "Listen", detail: "What you need" },
  { id: "shape", title: "Agree", detail: "Pages and a quote" },
  { id: "build", title: "Build", detail: "The website" },
  { id: "maintain", title: "Hand over", detail: "Ready to use" },
] as const;

const renderHeroProcess = (): string => `
      <div class="hero__visual" data-reveal>
        <div class="hero-process">
          <div class="hero-process__interface" aria-hidden="true">
            <div class="hero-process__topbar">
              <span><i class="hero-process__live hero-process__animated"></i>A simple website</span>
              <span>How it happens</span>
            </div>
            <div class="hero-process__input">
              <span>What you tell us</span>
              <strong>What your business does, and how customers should reach you.</strong>
            </div>
            <div class="hero-process__pipeline">
              <span class="hero-process__rail"></span>
              <span class="hero-process__signal hero-process__animated"></span>
              <ol class="hero-process__stages">
${heroProcessStages
  .map(
    ({ id, title, detail }, index) => `
                <li class="hero-process__stage hero-process__stage--${id} hero-process__animated">
                  <span class="hero-process__number">${String(index + 1).padStart(2, "0")}</span>
                  <span class="hero-process__node"></span>
                  <span class="hero-process__stage-copy"><strong>${title}</strong><small>${detail}</small></span>
                </li>`,
  )
  .join("")}
              </ol>
            </div>
            <div class="hero-process__output">
              <span class="hero-process__check">✓</span>
              <span><small>What you get</small><strong>A site you can send people to.</strong></span>
            </div>
          </div>
          <button class="hero-process__control" type="button" aria-label="Pause diagram motion" aria-pressed="false"></button>
        </div>
      </div>`;

const renderProductGlyph = (id: ProductId): string => {
  const open = `<svg class="product-glyph product-glyph--${id}" viewBox="0 0 64 64" aria-hidden="true" focusable="false">`;

  switch (id) {
    case "fix":
      return `${open}
          <rect class="product-glyph__line" x="8" y="12" width="48" height="40" rx="3" />
          <path class="product-glyph__muted" d="M8 22h48M14 17h1M19 17h1M24 17h1" />
          <path class="product-glyph__line" d="M16 33h8M30 33h8" />
          <path class="product-glyph__line" d="M22 43l4 4 9-10" />
          <circle class="product-glyph__accent" cx="27" cy="33" r="3" />
        </svg>`;
    case "ai":
      return `${open}
          <path class="product-glyph__muted" d="M16 20l11 8M48 20l-11 8M32 46v-9" />
          <circle class="product-glyph__line" cx="16" cy="18" r="4" />
          <circle class="product-glyph__line" cx="48" cy="18" r="4" />
          <circle class="product-glyph__line" cx="32" cy="48" r="4" />
          <circle class="product-glyph__accent" cx="32" cy="30" r="7" />
        </svg>`;
    case "customers":
      return `${open}
          <circle class="product-glyph__line" cx="27" cy="27" r="14" />
          <circle class="product-glyph__muted" cx="27" cy="27" r="6" />
          <path class="product-glyph__line" d="M37 37l11 11" />
          <circle class="product-glyph__accent" cx="27" cy="27" r="3" />
        </svg>`;
    case "website":
      return `${open}
          <rect class="product-glyph__line" x="8" y="12" width="48" height="40" rx="3" />
          <path class="product-glyph__muted" d="M8 22h48M14 17h1M19 17h1M24 17h1" />
          <path class="product-glyph__line" d="M16 30h16M16 37h10" />
          <rect class="product-glyph__muted" x="38" y="30" width="12" height="12" rx="2" />
          <circle class="product-glyph__accent" cx="44" cy="36" r="2.5" />
        </svg>`;
    case "app":
      return `${open}
          <rect class="product-glyph__line" x="6" y="14" width="34" height="24" rx="2" />
          <path class="product-glyph__muted" d="M6 30h34M18 44h10M23 38v6" />
          <rect class="product-glyph__line" x="44" y="18" width="14" height="30" rx="3" />
          <circle class="product-glyph__accent" cx="51" cy="43" r="2" />
        </svg>`;
    case "other":
      return `${open}
          <path class="product-glyph__muted" d="M15 15l10 10M49 15L39 25M15 49l10-10M49 49L39 39" />
          <circle class="product-glyph__line" cx="13" cy="13" r="3" />
          <circle class="product-glyph__line" cx="51" cy="13" r="3" />
          <circle class="product-glyph__line" cx="13" cy="51" r="3" />
          <circle class="product-glyph__line" cx="51" cy="51" r="3" />
          <circle class="product-glyph__accent" cx="32" cy="32" r="8" />
        </svg>`;
    default: {
      const exhaustive: never = id;
      return exhaustive;
    }
  }
};

const renderServiceArt = (id: ProductId): string => {
  switch (id) {
    case "fix":
      return `
        <svg class="service-art service-art--fix" data-service-art="fix" aria-hidden="true" viewBox="0 0 520 300">
          <rect class="art-stroke art-browser" x="38" y="28" width="284" height="244" rx="4" />
          <path class="art-stroke art-browser-bar" d="M38 62H322M58 45H66M74 45H82M90 45H98" />
          <g class="art-detail art-detail--one">
            <text class="art-label art-label--strong" x="62" y="88">Log</text>
            <path class="art-ui-line" d="M62 110h180M62 126h132M62 142h204" />
            <rect class="art-accent" x="62" y="156" width="196" height="18" rx="1" />
            <text class="art-label art-label--strong" x="70" y="169">Error</text>
            <path class="art-ui-line" d="M62 194h150M62 210h96M62 226h170" />
          </g>
          <g class="art-detail art-detail--two">
            <rect class="art-panel" x="362" y="42" width="124" height="96" rx="4" />
            <text class="art-label art-label--strong" x="424" y="66" text-anchor="middle" dominant-baseline="middle">Reproduce</text>
            <circle class="art-icon" cx="418" cy="100" r="11" />
            <path class="art-icon" d="m426 108 12 12M412 100h12M418 94v12" />
          </g>
          <g class="art-detail art-detail--three">
            <rect class="art-panel" x="362" y="166" width="124" height="96" rx="4" />
            <text class="art-label art-label--strong" x="424" y="190" text-anchor="middle" dominant-baseline="middle">Fixed</text>
            <circle class="art-status art-status--active" cx="424" cy="226" r="12" />
            <path class="art-check-small" d="m417 226 5 5 10-11" />
          </g>
          <path class="art-data-route" d="M322 90H362M322 214H362" />
        </svg>`;
    case "website":
      return `
        <svg class="service-art service-art--website" data-service-art="website" aria-hidden="true" viewBox="0 0 520 300">
          <rect class="art-stroke art-browser" x="38" y="28" width="444" height="244" rx="4" />
          <path class="art-stroke art-browser-bar" d="M38 62H482M58 45H66M74 45H82M90 45H98" />
          <g class="art-detail art-detail--one">
            <text class="art-label art-label--strong" x="62" y="88">Home</text>
            <text class="art-label" x="108" y="88">Shop</text>
            <text class="art-label" x="150" y="88">Contact</text>
            <path class="art-icon" d="M441 76h13l-2 11h-9l-3-15h-5M444 92h1M451 92h1" />
          </g>
          <g class="art-detail art-detail--two">
            <rect class="art-panel" x="62" y="106" width="396" height="70" rx="2" />
            <path class="art-ui-line" d="M82 126h132M82 140h96M82 151h70" />
            <rect class="art-accent" x="82" y="158" width="66" height="10" rx="1" />
            <path class="art-icon art-icon--soft" d="M345 122h92v38h-92zM357 150l20-17 14 11 15-14 20 20" />
          </g>
          <g class="art-detail art-detail--three">
            <rect class="art-panel" x="62" y="192" width="188" height="60" rx="2" />
            <rect class="art-panel" x="270" y="192" width="188" height="60" rx="2" />
            <rect class="art-ui-fill" x="74" y="204" width="48" height="36" rx="1" />
            <rect class="art-ui-fill" x="282" y="204" width="48" height="36" rx="1" />
            <path class="art-ui-line" d="M134 210h92M134 222h68M134 236h42M342 210h92M342 222h68M342 236h42" />
          </g>
        </svg>`;
    case "app":
      return `
        <svg class="service-art service-art--app" data-service-art="app" aria-hidden="true" viewBox="0 0 520 300">
          <rect class="art-stroke art-desktop" x="42" y="42" width="292" height="204" rx="5" />
          <path class="art-stroke art-desktop-stand" d="M42 214H334M156 274H220M188 246V274" />
          <g class="art-detail art-detail--one">
            <rect class="art-ui-fill" x="42" y="42" width="48" height="172" rx="4" />
            <path class="art-icon" d="M59 68h14M59 88h14M59 184h14" />
            <text class="art-label art-label--strong" x="112" y="78">Tasks</text>
            <path class="art-ui-line" d="M112 92h66" />
          </g>
          <g class="art-detail art-detail--two">
            <rect class="art-panel" x="112" y="112" width="198" height="36" rx="2" />
            <rect class="art-panel" x="112" y="164" width="198" height="36" rx="2" />
            <circle class="art-status" cx="128" cy="130" r="4" />
            <circle class="art-status art-status--active" cx="128" cy="182" r="4" />
            <path class="art-ui-line" d="M142 130h112M142 182h84" />
          </g>
          <g class="art-detail art-detail--three">
            <rect class="art-stroke art-phone" x="370" y="72" width="108" height="184" rx="14" />
            <text class="art-label art-label--accent" x="390" y="106">TASK</text>
            <rect class="art-panel" x="386" y="116" width="76" height="62" rx="3" />
            <path class="art-ui-line" d="M398 136h52M398 150h36" />
            <circle class="art-status art-status--active" cx="404" cy="198" r="8" />
            <path class="art-check-small" d="m399 198 4 4 7-9M402 232h44" />
          </g>
        </svg>`;
    case "customers":
      return `
        <svg class="service-art service-art--customers" data-service-art="customers" aria-hidden="true" viewBox="0 0 520 300">
          <g class="art-detail art-detail--one">
            <rect class="art-panel" x="34" y="42" width="148" height="82" rx="3" />
            <text class="art-label art-label--strong" x="52" y="68">Search</text>
            <circle class="art-icon" cx="56" cy="89" r="8" />
            <path class="art-icon" d="m62 95 8 8M80 86h76M80 100h54" />
          </g>
          <g class="art-detail art-detail--two">
            <rect class="art-panel" x="34" y="168" width="148" height="82" rx="3" />
            <text class="art-label art-label--accent" x="52" y="194">Ads</text>
            <rect class="art-ui-fill" x="52" y="208" width="26" height="22" rx="2" />
            <path class="art-ui-line" d="M88 211h68M88 225h48" />
          </g>
          <g class="art-detail art-detail--three">
            <rect class="art-accent" x="362" y="96" width="124" height="108" rx="4" />
            <text class="art-label art-label--strong" x="388" y="126">Visit</text>
            <path class="art-icon" d="M386 144h76v38h-76zM386 154h76M396 148h2M404 148h2" />
          </g>
          <path class="art-data-route" d="M182 83C248 83 260 144 362 144M182 209C252 209 280 164 362 164" />
          <path class="art-data-route art-data-route--arrow" d="m348 136 14 8-14 8M348 156l14 8-14 8" />
          <circle class="art-packet art-packet--x" cx="262" cy="111" r="5" />
          <circle class="art-packet art-packet--x art-packet--late" cx="288" cy="188" r="5" />
        </svg>`;
    case "ai":
      return `
        <svg class="service-art service-art--ai" data-service-art="ai" aria-hidden="true" viewBox="0 0 520 300">
          <path class="art-data-route" d="M112 150H194M250 84V100M306 150H378M250 200V237" />
          <g class="art-detail art-detail--one">
            <rect class="art-panel" x="28" y="124" width="84" height="52" rx="4" />
            <text class="art-label art-label--strong" x="70" y="150" text-anchor="middle" dominant-baseline="middle">Request</text>
            <rect class="art-accent" x="194" y="100" width="112" height="100" rx="8" />
            <text class="art-label art-label--accent" x="250" y="128" text-anchor="middle" dominant-baseline="middle">Agent</text>
            <circle class="art-agent-node" cx="226" cy="158" r="5" />
            <circle class="art-agent-node" cx="250" cy="174" r="5" />
            <circle class="art-agent-node" cx="274" cy="158" r="5" />
            <path class="art-icon" d="m226 158 24 16 24-16M226 158h48" />
          </g>
          <g class="art-detail art-detail--two">
            <rect class="art-panel" x="205" y="26" width="90" height="42" rx="4" />
            <text class="art-label" x="250" y="47" text-anchor="middle" dominant-baseline="middle">Memory</text>
          </g>
          <g class="art-detail art-detail--three">
            <rect class="art-panel" x="378" y="84" width="124" height="132" rx="5" />
            <text class="art-label art-label--strong" x="440" y="103" text-anchor="middle" dominant-baseline="middle">Tools</text>
            <path class="art-ui-line" d="M394 116H486M394 148H486M394 180H486" />
            <text class="art-label" x="440" y="133" text-anchor="middle" dominant-baseline="middle">CRM</text>
            <text class="art-label" x="440" y="165" text-anchor="middle" dominant-baseline="middle">Calendar</text>
            <text class="art-label" x="440" y="197" text-anchor="middle" dominant-baseline="middle">Messages</text>
          </g>
          <g class="art-detail art-detail--four">
            <rect class="art-panel" x="208" y="237" width="84" height="42" rx="4" />
            <text class="art-label art-label--strong" x="250" y="258" text-anchor="middle" dominant-baseline="middle">Done</text>
          </g>
          <circle class="art-packet art-packet--x" cx="154" cy="150" r="5" />
          <circle class="art-packet art-packet--y art-packet--late" cx="250" cy="218" r="5" />
        </svg>`;
    case "other":
      return `
        <svg class="service-art service-art--other" data-service-art="other" aria-hidden="true" viewBox="0 0 520 300">
          <path class="art-data-route" d="M132 62L222 131M132 238l90-69M388 62l-90 70M402 150H302M388 238l-90-70" />
          <g class="art-detail art-detail--one">
            <rect class="art-panel" x="34" y="34" width="98" height="56" rx="4" />
            <path class="art-icon" d="M74 46h18l-2 12H78l-3-16h-5" />
            <text class="art-label" x="83" y="72" text-anchor="middle" dominant-baseline="middle">Shop</text>
            <rect class="art-panel" x="34" y="210" width="98" height="56" rx="4" />
            <rect class="art-icon" x="76" y="220" width="14" height="20" rx="3" />
            <text class="art-label" x="83" y="251" text-anchor="middle" dominant-baseline="middle">App</text>
          </g>
          <g class="art-detail art-detail--two">
            <rect class="art-panel" x="388" y="34" width="112" height="56" rx="4" />
            <path class="art-icon" d="M432 44h24v14h-24zM432 49h24" />
            <text class="art-label" x="444" y="72" text-anchor="middle" dominant-baseline="middle">Payments</text>
            <rect class="art-panel" x="402" y="122" width="98" height="56" rx="4" />
            <circle class="art-icon" cx="451" cy="137" r="6" />
            <path class="art-icon" d="M441 154c2-7 6-10 10-10s8 3 10 10" />
            <text class="art-label" x="451" y="166" text-anchor="middle" dominant-baseline="middle">CRM</text>
            <rect class="art-panel" x="388" y="210" width="112" height="56" rx="4" />
            <path class="art-icon" d="M432 220h24v5h-24zM432 229h24v5h-24zM432 238h24v5h-24z" />
            <text class="art-label" x="444" y="255" text-anchor="middle" dominant-baseline="middle">Data</text>
          </g>
          <g class="art-detail art-detail--three">
            <circle class="art-accent art-hub art-hub--solid" cx="260" cy="150" r="42" />
            <text class="art-label art-label--accent" x="260" y="150" text-anchor="middle" dominant-baseline="middle">Connect</text>
          </g>
          <circle class="art-packet art-packet--x" cx="178" cy="97" r="5" />
          <circle class="art-packet art-packet--x art-packet--late" cx="342" cy="203" r="5" />
        </svg>`;
  }
};

export const renderSiteHeader = (baseUrl: string, homeHref: string): string => `
    <div id="top" class="page-top" tabindex="-1"></div>
    <header class="site-header">
      <a class="wordmark" href="${escapeHtml(homeHref)}#top" aria-label="Solved Tech home">
        <img src="${escapeHtml(publicAssetUrl("/brand/solved-tech-logo-dark.svg", baseUrl))}" alt="Solved Tech — Your digital problems, solved." width="180" height="40" decoding="sync" />
      </a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation" aria-label="Open menu">
        <span></span><span></span><span></span>
      </button>
      <nav id="primary-navigation" aria-label="Primary navigation">
        <a href="${escapeHtml(homeHref)}#packages">Websites</a>
        <a href="${escapeHtml(homeHref)}#services">Services</a>
        <a href="${escapeHtml(homeHref)}#approach">How we work</a>
        <a href="${escapeHtml(homeHref)}#team">Team</a>
        <a href="${escapeHtml(homeHref)}#contact">Get a quote</a>
      </nav>
    </header>`;

export const renderSiteFooter = (baseUrl: string): string => `
    <footer>
      <p>&copy; ${new Date().getFullYear()} Solved Tech</p>
      <a href="${escapeHtml(publicAssetUrl("/privacy/", baseUrl))}">Privacy notice</a>
      <a href="#top">Back to top</a>
    </footer>`;

const hasPlaceholder = (value: string): boolean => /\[\[[A-Z_]+\]\]/.test(value);

const renderCaseStudies = (studies: CaseStudy[]): string => {
  if (studies.length === 0) {
    return "";
  }

  const cards = studies
    .map(
      ({ id, title, client, situation, contribution, deliverable, technologies, result }) => `
          <article class="case-study" id="work-${escapeHtml(id)}" data-reveal>
            <p class="case-study__client">${escapeHtml(client)}</p>
            <h3>${escapeHtml(title)}</h3>
            <dl class="case-study__facts">
              <div><dt>Situation</dt><dd>${escapeHtml(situation)}</dd></div>
              <div><dt>What we did</dt><dd>${escapeHtml(contribution)}</dd></div>
              <div><dt>Delivered</dt><dd>${escapeHtml(deliverable)}</dd></div>
              <div><dt>Result</dt><dd>${escapeHtml(result)}</dd></div>
            </dl>
            <ul class="case-study__stack" aria-label="Technologies">${technologies.map((technology) => `<li>${escapeHtml(technology)}</li>`).join("")}</ul>
          </article>`,
    )
    .join("");

  return `
      <section id="work" class="work" aria-labelledby="work-heading">
        <div class="work__heading">
          <p data-reveal>Recent work</p>
          <h2 id="work-heading" data-reveal>Problems we have solved</h2>
        </div>
        <div class="work__grid">${cards}</div>
      </section>`;
};

const renderFaq = (entries: FaqEntry[]): string => {
  const answered = entries.filter(({ answer }) => !hasPlaceholder(answer));

  if (answered.length === 0) {
    return "";
  }

  const items = answered
    .map(
      ({ question, answer }) => `
          <div class="faq__item" data-reveal>
            <dt>${escapeHtml(question)}</dt>
            <dd>${escapeHtml(answer)}</dd>
          </div>`,
    )
    .join("");

  return `
      <section id="faq" class="faq" aria-labelledby="faq-heading">
        <div class="faq__heading">
          <p data-reveal>Before you get in touch</p>
          <h2 id="faq-heading" data-reveal>Questions we are often asked</h2>
        </div>
        <dl class="faq__list">${items}</dl>
      </section>`;
};

const resolveServicePage = (
  pages: ServicePage[],
  productId: ProductId,
): ServicePage => {
  const matches = pages.filter((page) => page.productId === productId);

  if (matches.length !== 1) {
    throw new Error(
      `Cannot render the product card for "${productId}": expected exactly one matching service page, found ${matches.length}.`,
    );
  }

  return matches[0];
};

export const renderHomepage = (
  content: SiteContent,
  config: ContactConfig,
  baseUrl: string = import.meta.env.BASE_URL,
): string => {
  const cards = content.products
    .map(({ id, question, title, outcome }, index) => {
      const page = resolveServicePage(servicePages, id);
      const href = publicAssetUrl(`/services/${page.slug}/`, baseUrl);

      return `
        <article class="product-card product-card--${escapeHtml(id)}">
          <a class="product-card__link" href="${escapeHtml(href)}" data-analytics="service_interest" data-service-id="${escapeHtml(id)}" data-placement="product-card">
            <span class="product-card__top">
              <span class="product-card__meta">
                <span class="product-card__index" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
                <span class="product-card__eyebrow">${escapeHtml(question)}</span>
              </span>
              ${renderProductGlyph(id)}
            </span>
            <h3 class="product-card__title">${escapeHtml(title)}</h3>
            <p class="product-card__outcome">${escapeHtml(outcome)}</p>
            <span class="product-card__action">View service <span aria-hidden="true">→</span></span>
          </a>
        </article>`;
    })
    .join("");
  const founders = content.founders
    .map(
      ({ name, role, image, imageSources, linkedin }) => {
        const srcset = imageSources.length
          ? ` srcset="${imageSources
              .map(({ path, width }) => `${escapeHtml(publicAssetUrl(path, baseUrl))} ${width}w`)
              .join(", ")}" sizes="(min-width: 48rem) 26rem, 80vw"`
          : "";

        return `
        <article class="founder" data-reveal>
          <div class="founder__portrait">
            <div class="founder__portrait-frame">
              <img src="${escapeHtml(publicAssetUrl(image, baseUrl))}"${srcset} alt="Portrait of ${escapeHtml(name)}" width="520" height="620" loading="lazy" />
            </div>
          </div>
          <div class="founder__details">
            <h3>${escapeHtml(name)}</h3>
            <p>${escapeHtml(role)}</p>
            <a href="${escapeHtml(linkedin)}" target="_blank" rel="noreferrer" aria-label="LinkedIn profile for ${escapeHtml(name)}">
              <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6.5 8.25H3.25V20H6.5V8.25ZM4.88 3A1.88 1.88 0 1 0 4.88 6.75 1.88 1.88 0 0 0 4.88 3ZM20.75 13.25c0-3.54-1.89-5.19-4.42-5.19-2.04 0-2.95 1.12-3.46 1.91V8.25H9.62V20h3.25v-5.82c0-1.53.29-3.01 2.19-3.01 1.87 0 1.89 1.75 1.89 3.11V20h3.25l.55-6.75Z"/></svg>
            </a>
          </div>
        </article>`;
      },
    )
    .join("");

  const packages = content.packages
    .map(({ id, name, summary, includes }) => {
      const href = mailtoWithSubject(config.email, `${QUOTE_SUBJECT}: ${name}`);
      const items = includes.map((item) => `<li>${escapeHtml(item)}</li>`).join("");

      return `
        <article class="package-card" id="package-${escapeHtml(id)}">
          <h3>${escapeHtml(name)}</h3>
          <p>${escapeHtml(summary)}</p>
          <ul>${items}</ul>
          <a href="${escapeHtml(href)}" data-analytics="contact_click" data-channel="email" data-placement="package" data-package-id="${escapeHtml(id)}">Get a quote</a>
        </article>`;
    })
    .join("");

  return `
    ${renderSiteHeader(baseUrl, "")}
    <main id="main-content">
      <section class="hero" aria-labelledby="hero-heading">
        <div class="hero__layout">
          <div class="hero__content">
            <p class="hero__eyebrow" data-reveal>Small businesses</p>
            <h1 id="hero-heading" data-reveal>Websites for small businesses.</h1>
            <p class="hero__lead" data-reveal>Fixed price, no jargon. A clear site that tells people what you do and how to get in touch.</p>
            ${renderContactActions(config, "hero__actions")}
            <p class="hero__trust" data-reveal>You speak with the people who build the site.</p>
          </div>
          ${renderHeroProcess()}
        </div>
      </section>
      <section id="packages" class="packages" aria-labelledby="packages-heading">
        <div class="packages__header" data-reveal>
          <h2 id="packages-heading">Simple website packages.</h2>
          <p>Starter, Business, Shop, and a monthly care plan. Each one is quoted before we build. We do not list a price until we know what you need.</p>
        </div>
        <div class="package-grid">${packages}</div>
      </section>
      <section id="services" class="services" aria-labelledby="services-heading">
        <div class="services__header" data-reveal>
          <div class="services__heading">
            <p class="services__eyebrow">Also available</p>
            <h2 id="services-heading">Other ways we can help.</h2>
          </div>
          <p class="services__intro">Websites come first. Apps, AI, bug fixing and automation are here when a London business needs them later.</p>
        </div>
        <div class="product-grid">${cards}</div>
      </section>
      <section id="approach" class="journey" aria-labelledby="approach-heading">
        <div class="journey__heading" data-reveal>
          <p>How we work</p>
          <h2 id="approach-heading">Assess, agree, build, hand over.</h2>
        </div>
        <ol class="journey__moments" data-reveal>
          <li class="journey__moment">
            <span class="journey__number">01</span>
            <span class="journey__signal" aria-hidden="true">
              <svg viewBox="0 0 48 48"><path d="M12 29c6-10 14-16 24-18M12 29h9M12 29v-9" /><circle cx="36" cy="11" r="3" /></svg>
            </span>
            <div><h3>Tell us what is happening.</h3><p>Describe the problem or the goal. No polished brief needed.</p></div>
          </li>
          <li class="journey__moment">
            <span class="journey__number">02</span>
            <span class="journey__signal" aria-hidden="true">
              <svg viewBox="0 0 48 48"><path d="M9 24h27M29 16l8 8-8 8" /></svg>
            </span>
            <div><h3>We assess and agree the scope.</h3><p>You get a short written assessment, a proposed scope and an estimate before work starts.</p></div>
          </li>
          <li class="journey__moment">
            <span class="journey__number">03</span>
            <span class="journey__signal" aria-hidden="true">
              <svg viewBox="0 0 48 48"><rect x="8" y="10" width="32" height="24" rx="2" /><path d="M17 40h14M24 34v6M13 16h22" /></svg>
            </span>
            <div><h3>We build and test.</h3><p>You see progress early and we test against the agreed scope.</p></div>
          </li>
          <li class="journey__moment">
            <span class="journey__number">04</span>
            <span class="journey__signal" aria-hidden="true">
              <svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="16" /><path d="m16 24 6 6 11-13" /></svg>
            </span>
            <div><h3>Handover you can rely on.</h3><p>We hand over with documentation and agree what happens after delivery.</p></div>
          </li>
        </ol>
        <p class="journey__note" data-reveal>For a bug, the first step is a diagnosis. We confirm the cause before we promise a fix.</p>
      </section>
      ${renderFaq(content.faq)}
      <section id="team" class="team" aria-labelledby="team-heading">
        <div class="team__heading">
          <p data-reveal>Who you will work with</p>
          <h2 id="team-heading" data-reveal>Meet the founders</h2>
        </div>
        <div class="team__grid">${founders}</div>
      </section>
      ${renderCaseStudies(content.caseStudies)}
      <section class="contact" id="contact" aria-labelledby="contact-heading">
        <h2 id="contact-heading" data-reveal>Tell us about the website you need.</h2>
        <p data-reveal>Email what your business does, who the site is for, and whether you want a simple site, a fuller site or a shop. We reply with a quote. There is no form on this page.</p>
        <p class="contact-caution" data-reveal>Please do not send passwords or confidential customer data in your first message.</p>
        <div data-reveal>${renderContactActions(config, "contact__actions")}</div>
        <dl class="contact-details" data-reveal>
          <div><dt>Phone</dt><dd>${escapeHtml(config.displayPhone)}</dd></div>
          <div><dt>Email</dt><dd>${escapeHtml(config.email)}</dd></div>
        </dl>
        <p class="contact-privacy" data-reveal><a href="${escapeHtml(publicAssetUrl("/privacy/", baseUrl))}">How we handle the details you send us</a></p>
        ${config.placeholder ? `<p class="contact-note"><strong>Trial contact details:</strong> ${escapeHtml(config.displayPhone)} and ${escapeHtml(config.email)} are non-production placeholders and must be replaced before launch.</p>` : ""}
      </section>
    </main>
    ${renderSiteFooter(baseUrl)}
  `;
};

export const renderPrivacyPage = (
  content: PrivacyContent,
  config: ContactConfig,
  baseUrl: string = import.meta.env.BASE_URL,
): string => {
  const sections = content.sections
    .map(
      ({ heading, paragraphs }) => `
        <section>
          <h2>${escapeHtml(heading)}</h2>
          ${paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
        </section>`,
    )
    .join("");

  return `
    ${renderSiteHeader(baseUrl, baseUrl)}
    <main id="main-content" class="page">
      <article class="prose" aria-labelledby="privacy-heading">
        <p class="page__eyebrow">Last updated ${escapeHtml(content.updated)}</p>
        <h1 id="privacy-heading">${escapeHtml(content.title)}</h1>
        ${sections}
        <section>
          <h2>Contact</h2>
          <p>Email <a href="mailto:${escapeHtml(config.email)}">${escapeHtml(config.email)}</a> or call <a href="tel:${escapeHtml(config.phone)}">${escapeHtml(config.displayPhone)}</a> with any question about this notice or to exercise your rights.</p>
        </section>
      </article>
    </main>
    ${renderSiteFooter(baseUrl)}
  `;
};

export const renderServicePage = (
  page: ServicePage,
  content: SiteContent,
  config: ContactConfig,
  baseUrl: string = import.meta.env.BASE_URL,
): string => {
  const product = content.products.find(({ id }) => id === page.productId);

  if (!product) {
    throw new Error(
      `Cannot render the service page "${page.slug}": no product is defined for "${page.productId}".`,
    );
  }

  const list = (items: string[]): string =>
    items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");

  return `
    ${renderSiteHeader(baseUrl, baseUrl)}
    <main id="main-content" class="page">
      <article class="service-detail" aria-labelledby="service-heading">
        <div class="service-hero">
          <div class="service-hero__copy">
            <p class="page__eyebrow">${escapeHtml(product.question)}</p>
            <h1 id="service-heading">${escapeHtml(page.title)}</h1>
            <p class="prose__lead">${escapeHtml(page.intro)}</p>
          </div>
          <div class="service-hero__visual">${renderServiceArt(page.productId)}</div>
        </div>
        <div class="service-detail__body">
          <section>
            <h2>Typical requests</h2>
            <ul>${list(page.requests)}</ul>
          </section>
          <section>
            <h2>What you receive</h2>
            <ul>${list(page.deliverables)}</ul>
          </section>
        </div>
        <nav class="service-detail__navigation" aria-label="Service navigation">
          <a href="${escapeHtml(baseUrl)}#approach">See how we work</a>
          <a href="${escapeHtml(baseUrl)}#services">Back to all services</a>
        </nav>
        <section class="service-contact" aria-labelledby="service-contact-heading">
          <h2 id="service-contact-heading">Tell us what is happening</h2>
          <p>Describe the problem or the goal, which system is involved and what outcome you want. Please do not send passwords or confidential customer data in your first message.</p>
          ${renderContactActions(config, "contact__actions")}
        </section>
      </article>
    </main>
    ${renderSiteFooter(baseUrl)}
  `;
};

const VORBIO_BAR_HEIGHTS = [24, 48, 40, 72, 104, 72, 40, 48, 24];

const renderVorbioVoice = (): string => `
            <svg class="vorbio-voice" viewBox="0 0 240 120" aria-hidden="true" focusable="false">
              <path class="vorbio-voice__baseline" d="M0 60H240" />
${VORBIO_BAR_HEIGHTS.map((height, index) => {
  const x = 12 + index * 26;

  return `              <rect class="vorbio-voice__bar" x="${x}" y="${60 - height / 2}" width="8" height="${height}" rx="4" />`;
}).join("\n")}
            </svg>`;

const renderVorbioConsole = (): string => `
          <figure class="vorbio-console">
            <figcaption class="vorbio-console__header">
              <span><span class="vorbio-console__status" aria-hidden="true"></span>Illustrative conversation</span>
              <span>Voice + chat</span>
            </figcaption>
            <div class="vorbio-console__call">
              <div class="vorbio-console__call-meta"><span>Incoming voice call</span><span>00:24</span></div>
${renderVorbioVoice()}
            </div>
            <ol class="vorbio-console__transcript">
              <li class="vorbio-console__message vorbio-console__message--customer"><span>Customer</span><p>Can I book a service visit for Thursday?</p></li>
              <li class="vorbio-console__message vorbio-console__message--vorbio"><span>Vorbio</span><p>I can help with that. Which service do you need?</p></li>
            </ol>
            <div class="vorbio-console__outcome">
              <span>Next action</span>
              <strong>Booking request captured</strong>
              <small>Ready for calendar check or team handover</small>
            </div>
          </figure>`;

const renderVorbioHeroActions = (
  config: ContactConfig,
): string => `
            <div class="vorbio-actions">
              <a class="vorbio-button vorbio-button--primary" href="mailto:${escapeHtml(config.email)}?subject=Vorbio%20demo" data-analytics="contact_click" data-channel="email" data-placement="vorbio-hero">Arrange a live demo <span aria-hidden="true">↗</span></a>
              <a class="vorbio-button" href="tel:${escapeHtml(config.phone)}" data-analytics="contact_click" data-channel="call" data-placement="vorbio-hero">Call about Vorbio</a>
            </div>`;

export const renderVorbioPage = (
  product: VorbioProduct,
  config: ContactConfig,
  baseUrl: string = import.meta.env.BASE_URL,
): string => {
  const highlights = product.highlights
    .map(
      ({ title, detail }, index) => `
          <li class="vorbio-card">
            <span class="vorbio-card__number" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
            <h3>${escapeHtml(title)}</h3>
            <p>${escapeHtml(detail)}</p>
          </li>`,
    )
    .join("");

  const steps = product.steps
    .map(
      ({ title, detail }, index) => `
          <li class="vorbio-step">
            <span class="vorbio-step__number" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
            <h3>${escapeHtml(title)}</h3>
            <p>${escapeHtml(detail)}</p>
          </li>`,
    )
    .join("");

  const workflow = product.workflow
    .map(
      ({ title, detail }, index) => `
          <li class="vorbio-flow__item">
            <span class="vorbio-flow__number" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
            <h3>${escapeHtml(title)}</h3>
            <p>${escapeHtml(detail)}</p>
          </li>`,
    )
    .join("");

  const controls = product.controls
    .map(
      ({ title, detail }) => `
            <li><h3>${escapeHtml(title)}</h3><p>${escapeHtml(detail)}</p></li>`,
    )
    .join("");

  const useCases = product.useCases
    .map((useCase) => `<li>${escapeHtml(useCase)}</li>`)
    .join("");

  return `
    ${renderSiteHeader(baseUrl, baseUrl)}
    <main id="main-content" class="page vorbio">
      <article class="vorbio-page" aria-labelledby="vorbio-heading">
        <header class="vorbio-hero">
          <div class="vorbio-hero__copy">
            <p class="page__eyebrow">${escapeHtml(product.eyebrow)}</p>
            <p class="vorbio-wordmark">${escapeHtml(product.name)}<span aria-hidden="true">.</span></p>
            <h1 id="vorbio-heading">${escapeHtml(product.tagline)}</h1>
            <p class="prose__lead">${escapeHtml(product.summary)}</p>
${renderVorbioHeroActions(config)}
            <p class="vorbio-hero__note">${escapeHtml(product.note)}</p>
          </div>
          <div class="vorbio-hero__visual">${renderVorbioConsole()}</div>
        </header>
        <ul class="vorbio-proof" aria-label="Vorbio product scope">
          <li><span>01</span><strong>Voice + chat</strong><small>One WhatsApp conversation</small></li>
          <li><span>02</span><strong>Connected actions</strong><small>Calendar, CRM or inbox</small></li>
          <li><span>03</span><strong>Human handover</strong><small>At the boundaries you set</small></li>
        </ul>
        <section class="vorbio-section vorbio-section--flow" aria-labelledby="vorbio-flow-heading">
          <div class="vorbio-section__heading"><p class="page__eyebrow">The operating model</p><h2 id="vorbio-flow-heading">From first hello to a useful next step.</h2></div>
          <ol class="vorbio-flow">${workflow}</ol>
        </section>
        <section class="vorbio-section" aria-labelledby="vorbio-capabilities-heading">
          <div class="vorbio-section__heading"><p class="page__eyebrow">Capability</p><h2 id="vorbio-capabilities-heading">Built for the whole first conversation.</h2></div>
          <ul class="vorbio-grid">${highlights}</ul>
        </section>
        <section class="vorbio-use-cases" aria-labelledby="vorbio-use-cases-heading">
          <div><p class="page__eyebrow">Good first fits</p><h2 id="vorbio-use-cases-heading">Start where response time and consistency matter.</h2></div>
          <ul>${useCases}</ul>
        </section>
        <section class="vorbio-control" aria-labelledby="vorbio-control-heading">
          <div class="vorbio-control__intro"><p class="page__eyebrow">Human by design</p><h2 id="vorbio-control-heading">AI that knows where its job ends.</h2><p>Vorbio is not given an open brief. We define its knowledge, actions and handover points with you before it speaks to customers.</p></div>
          <ul class="vorbio-control__list">${controls}</ul>
        </section>
        <section class="vorbio-section" aria-labelledby="vorbio-steps-heading">
          <div class="vorbio-section__heading"><p class="page__eyebrow">Implementation</p><h2 id="vorbio-steps-heading">Configured around your real conversations.</h2></div>
          <ol class="vorbio-steps">${steps}</ol>
        </section>
        <section class="vorbio-contact" aria-labelledby="vorbio-contact-heading">
          <p class="page__eyebrow">See it work</p>
          <h2 id="vorbio-contact-heading">Bring us one conversation your team handles every day.</h2>
          <p>We will map how Vorbio should answer, what it should capture and exactly when it should hand over—then arrange a focused demonstration.</p>
          ${renderContactActions(config, "contact__actions")}
        </section>
      </article>
    </main>
    ${renderSiteFooter(baseUrl)}
  `;
};
