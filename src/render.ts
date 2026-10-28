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
import { servicePagesRo } from "./content-ro";
import type { Locale } from "./locale";
import { localizePath } from "./locale";
import { uiCopy } from "./ui-copy";

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

const mailtoWithSubject = (email: string, subject: string): string =>
  `mailto:${email}?subject=${encodeURIComponent(subject)}`;

const pagesFor = (locale: Locale): ServicePage[] => {
  switch (locale) {
    case "en":
      return servicePages;
    case "ro":
      return servicePagesRo;
    default: {
      const exhaustive: never = locale;
      return exhaustive;
    }
  }
};

const homeHrefFor = (locale: Locale, baseUrl: string): string =>
  locale === "ro" ? publicAssetUrl("/ro/", baseUrl) : baseUrl;

const renderLanguageSwitcher = (locale: Locale, pagePath: string, baseUrl: string): string => {
  const copy = uiCopy(locale);
  const links = (["en", "ro"] as const)
    .map((code) => {
      const href = publicAssetUrl(localizePath(pagePath, code), baseUrl);
      const current = code === locale ? ' aria-current="page"' : "";
      const lang = code === "en" ? "en-GB" : "ro";
      const label = code === "en" ? "EN" : "RO";

      return `<a href="${escapeHtml(href)}" lang="${lang}" hreflang="${lang}" data-locale-switch="${code}"${current}>${label}</a>`;
    })
    .join("");

  return `<div class="language-switcher" role="group" aria-label="${escapeHtml(copy.languageLabel)}">${links}</div>`;
};

const renderContactActions = (
  config: ContactConfig,
  className: string,
  locale: Locale,
): string => {
  const copy = uiCopy(locale);
  const isHero = className === "hero__actions";
  const placement = isHero ? "hero" : "contact";
  const quoteSubject = isHero ? copy.heroQuoteSubject : copy.quoteSubject;

  return `
  <div class="${className}">
    <a class="contact-action contact-action--quote" href="${escapeHtml(mailtoWithSubject(config.email, quoteSubject))}" data-analytics="contact_click" data-channel="email" data-placement="${placement}">${escapeHtml(copy.quoteLabel)}</a>
  </div>`;
};

const renderHeroProcess = (locale: Locale): string => {
  const copy = uiCopy(locale);

  return `
      <div class="hero__visual" data-reveal>
        <div class="hero-process">
          <div class="hero-process__interface" aria-hidden="true">
            <div class="hero-process__topbar">
              <span><i class="hero-process__live hero-process__animated"></i>${escapeHtml(copy.yourProject)}</span>
              <span>${escapeHtml(copy.howItHappens)}</span>
            </div>
            <div class="hero-process__input">
              <span>${escapeHtml(copy.whatYouTellUs)}</span>
              <strong>${escapeHtml(copy.whatYouNeedDone)}</strong>
            </div>
            <div class="hero-process__pipeline">
              <span class="hero-process__rail"></span>
              <span class="hero-process__signal hero-process__animated"></span>
              <ol class="hero-process__stages">
${copy.stages
  .map(
    ({ id, title, detail }, index) => `
                <li class="hero-process__stage hero-process__stage--${id} hero-process__animated">
                  <span class="hero-process__number">${String(index + 1).padStart(2, "0")}</span>
                  <span class="hero-process__node"></span>
                  <span class="hero-process__stage-copy"><strong>${escapeHtml(title)}</strong><small>${escapeHtml(detail)}</small></span>
                </li>`,
  )
  .join("")}
              </ol>
            </div>
            <div class="hero-process__output">
              <span class="hero-process__check">✓</span>
              <span><small>${escapeHtml(copy.whatYouGet)}</small><strong>${escapeHtml(copy.workYouCanUse)}</strong></span>
            </div>
          </div>
          <button class="hero-process__control" type="button" aria-label="${escapeHtml(copy.pauseMotion)}" aria-pressed="false" data-label-pause="${escapeHtml(copy.pauseMotion)}" data-label-resume="${escapeHtml(copy.resumeMotion)}"></button>
        </div>
      </div>`;
};

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

export const renderSiteHeader = (
  baseUrl: string,
  homeHref: string,
  locale: Locale = "en",
  pagePath = "/",
): string => {
  const copy = uiCopy(locale);

  return `
    <div id="top" class="page-top" tabindex="-1"></div>
    <header class="site-header">
      <a class="wordmark" href="${escapeHtml(homeHref)}#top" aria-label="${escapeHtml(copy.homeLabel)}">
        <img src="${escapeHtml(publicAssetUrl("/brand/solved-tech-logo-dark.svg", baseUrl))}" alt="Solved Tech — Your digital problems, solved." width="180" height="40" decoding="sync" />
      </a>
      <div class="site-header__end">
        ${renderLanguageSwitcher(locale, pagePath, baseUrl)}
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation" aria-label="${escapeHtml(copy.openMenu)}" data-label-open="${escapeHtml(copy.openMenu)}" data-label-close="${escapeHtml(copy.closeMenu)}">
          <span></span><span></span><span></span>
        </button>
        <nav id="primary-navigation" aria-label="${escapeHtml(copy.primaryNavigation)}">
          <a href="${escapeHtml(homeHref)}#packages">${escapeHtml(copy.navWebsites)}</a>
          <a href="${escapeHtml(homeHref)}#services">${escapeHtml(copy.navServices)}</a>
          <a href="${escapeHtml(homeHref)}#approach">${escapeHtml(copy.navApproach)}</a>
          <a href="${escapeHtml(homeHref)}#team">${escapeHtml(copy.navTeam)}</a>
          <a href="${escapeHtml(homeHref)}#contact">${escapeHtml(copy.navQuote)}</a>
        </nav>
      </div>
    </header>`;
};

export const renderSiteFooter = (baseUrl: string, locale: Locale = "en"): string => {
  const copy = uiCopy(locale);

  return `
    <footer>
      <p>&copy; ${new Date().getFullYear()} Solved Tech</p>
      <a href="${escapeHtml(publicAssetUrl(localizePath("/privacy/", locale), baseUrl))}">${escapeHtml(copy.privacyNotice)}</a>
      <a href="#top">${escapeHtml(copy.backToTop)}</a>
    </footer>`;
};

const hasPlaceholder = (value: string): boolean => /\[\[[A-Z_]+\]\]/.test(value);

const renderCaseStudies = (studies: CaseStudy[], locale: Locale): string => {
  if (studies.length === 0) {
    return "";
  }

  const copy = uiCopy(locale);
  const cards = studies
    .map(
      ({ id, title, client, situation, contribution, deliverable, technologies, result }) => `
          <article class="case-study" id="work-${escapeHtml(id)}" data-reveal>
            <p class="case-study__client">${escapeHtml(client)}</p>
            <h3>${escapeHtml(title)}</h3>
            <dl class="case-study__facts">
              <div><dt>${escapeHtml(copy.caseSituation)}</dt><dd>${escapeHtml(situation)}</dd></div>
              <div><dt>${escapeHtml(copy.caseWhatWeDid)}</dt><dd>${escapeHtml(contribution)}</dd></div>
              <div><dt>${escapeHtml(copy.caseDelivered)}</dt><dd>${escapeHtml(deliverable)}</dd></div>
              <div><dt>${escapeHtml(copy.caseResult)}</dt><dd>${escapeHtml(result)}</dd></div>
            </dl>
            <ul class="case-study__stack" aria-label="${escapeHtml(copy.caseTechnologies)}">${technologies.map((technology) => `<li>${escapeHtml(technology)}</li>`).join("")}</ul>
          </article>`,
    )
    .join("");

  return `
      <section id="work" class="work" aria-labelledby="work-heading">
        <div class="work__heading">
          <p data-reveal>${escapeHtml(copy.caseRecentWork)}</p>
          <h2 id="work-heading" data-reveal>${escapeHtml(copy.caseHeading)}</h2>
        </div>
        <div class="work__grid">${cards}</div>
      </section>`;
};

const renderFaq = (entries: FaqEntry[], locale: Locale): string => {
  const answered = entries.filter(({ answer }) => !hasPlaceholder(answer));

  if (answered.length === 0) {
    return "";
  }

  const copy = uiCopy(locale);
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
          <p data-reveal>${escapeHtml(copy.faqEyebrow)}</p>
          <h2 id="faq-heading" data-reveal>${escapeHtml(copy.faqHeading)}</h2>
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

const JOURNEY_ICONS = [
  '<svg viewBox="0 0 48 48"><path d="M12 29c6-10 14-16 24-18M12 29h9M12 29v-9" /><circle cx="36" cy="11" r="3" /></svg>',
  '<svg viewBox="0 0 48 48"><path d="M9 24h27M29 16l8 8-8 8" /></svg>',
  '<svg viewBox="0 0 48 48"><rect x="8" y="10" width="32" height="24" rx="2" /><path d="M17 40h14M24 34v6M13 16h22" /></svg>',
  '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="16" /><path d="m16 24 6 6 11-13" /></svg>',
] as const;

export const renderHomepage = (
  content: SiteContent,
  config: ContactConfig,
  baseUrl: string = import.meta.env.BASE_URL,
  locale: Locale = "en",
): string => {
  const copy = uiCopy(locale);
  const cards = content.products
    .map(({ id, question, title, outcome }, index) => {
      const page = resolveServicePage(pagesFor(locale), id);
      const href = publicAssetUrl(localizePath(`/services/${page.slug}/`, locale), baseUrl);

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
            <span class="product-card__action">${escapeHtml(copy.viewService)} <span aria-hidden="true">→</span></span>
          </a>
        </article>`;
    })
    .join("");
  const founders = content.founders
    .map(
      ({ name, role, image, imageSources, linkedin, bio }) => {
        const srcset = imageSources.length
          ? ` srcset="${imageSources
              .map(({ path, width }) => `${escapeHtml(publicAssetUrl(path, baseUrl))} ${width}w`)
              .join(", ")}" sizes="(min-width: 48rem) 26rem, 80vw"`
          : "";
        const paragraphs = bio.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");

        return `
        <article class="founder" data-reveal>
          <div class="founder__portrait">
            <div class="founder__portrait-frame">
              <img src="${escapeHtml(publicAssetUrl(image, baseUrl))}"${srcset} alt="${escapeHtml(copy.portraitAlt(name))}" width="520" height="620" loading="lazy" />
            </div>
          </div>
          <div class="founder__details">
            <h3>${escapeHtml(name)} · ${escapeHtml(role)}</h3>
            <a class="founder__linkedin" href="${escapeHtml(linkedin)}" target="_blank" rel="noopener noreferrer">
              <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6.5 8.25H3.25V20H6.5V8.25ZM4.88 3A1.88 1.88 0 1 0 4.88 6.75 1.88 1.88 0 0 0 4.88 3ZM20.75 13.25c0-3.54-1.89-5.19-4.42-5.19-2.04 0-2.95 1.12-3.46 1.91V8.25H9.62V20h3.25v-5.82c0-1.53.29-3.01 2.19-3.01 1.87 0 1.89 1.75 1.89 3.11V20h3.25l.55-6.75Z"/></svg>
              LinkedIn
            </a>
          </div>
          <div class="founder__bio">
            ${paragraphs}
          </div>
        </article>`;
      },
    )
    .join("");

  const packages = content.packages
    .map(({ id, name, summary, includes }) => {
      const href = mailtoWithSubject(config.email, `${copy.quoteSubject}: ${name}`);
      const items = includes.map((item) => `<li>${escapeHtml(item)}</li>`).join("");

      return `
        <article class="package-card" id="package-${escapeHtml(id)}">
          <h3>${escapeHtml(name)}</h3>
          <p>${escapeHtml(summary)}</p>
          <ul>${items}</ul>
          <a href="${escapeHtml(href)}" data-analytics="contact_click" data-channel="email" data-placement="package" data-package-id="${escapeHtml(id)}">${escapeHtml(copy.navQuote)}</a>
        </article>`;
    })
    .join("");

  const journey = copy.journey
    .map(
      ({ title, body }, index) => `
          <li class="journey__moment">
            <span class="journey__number">${String(index + 1).padStart(2, "0")}</span>
            <span class="journey__signal" aria-hidden="true">
              ${JOURNEY_ICONS[index] ?? ""}
            </span>
            <div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(body)}</p></div>
          </li>`,
    )
    .join("");

  return `
    ${renderSiteHeader(baseUrl, "", locale, "/")}
    <main id="main-content">
      <section class="hero" aria-labelledby="hero-heading">
        <div class="hero__layout">
          <div class="hero__content">
            <p class="hero__eyebrow" data-reveal>${escapeHtml(copy.heroEyebrow)}</p>
            <h1 id="hero-heading" data-reveal>${escapeHtml(copy.heroHeading)}</h1>
            <p class="hero__lead" data-reveal>${escapeHtml(copy.heroLead)}</p>
            ${renderContactActions(config, "hero__actions", locale)}
            <p class="hero__trust" data-reveal>${escapeHtml(copy.heroTrust)}</p>
          </div>
          ${renderHeroProcess(locale)}
        </div>
      </section>
      <section id="packages" class="packages" aria-labelledby="packages-heading">
        <div class="packages__header" data-reveal>
          <h2 id="packages-heading">${escapeHtml(copy.packagesHeading)}</h2>
          <p>${escapeHtml(copy.packagesIntro)}</p>
        </div>
        <div class="package-grid">${packages}</div>
      </section>
      <section id="services" class="services" aria-labelledby="services-heading">
        <div class="services__header" data-reveal>
          <div class="services__heading">
            <p class="services__eyebrow">${escapeHtml(copy.servicesEyebrow)}</p>
            <h2 id="services-heading">${escapeHtml(copy.servicesHeading)}</h2>
          </div>
          <p class="services__intro">${escapeHtml(copy.servicesIntro)}</p>
        </div>
        <div class="product-grid">${cards}</div>
      </section>
      <section id="approach" class="journey" aria-labelledby="approach-heading">
        <div class="journey__heading" data-reveal>
          <p>${escapeHtml(copy.approachEyebrow)}</p>
          <h2 id="approach-heading">${escapeHtml(copy.approachHeading)}</h2>
        </div>
        <ol class="journey__moments" data-reveal>${journey}
        </ol>
        <p class="journey__note" data-reveal>${escapeHtml(copy.journeyNote)}</p>
      </section>
      ${renderFaq(content.faq, locale)}
      <section id="team" class="team" aria-labelledby="team-heading">
        <div class="team__heading">
          <p data-reveal>${escapeHtml(copy.teamEyebrow)}</p>
          <h2 id="team-heading" data-reveal>${escapeHtml(copy.teamHeading)}</h2>
        </div>
        <div class="team__grid">${founders}</div>
      </section>
      ${renderCaseStudies(content.caseStudies, locale)}
      <section class="contact" id="contact" aria-labelledby="contact-heading">
        <h2 id="contact-heading" data-reveal>${escapeHtml(copy.contactHeading)}</h2>
        <p data-reveal>${escapeHtml(copy.contactLead)}</p>
        <p class="contact-caution" data-reveal>${escapeHtml(copy.contactCaution)}</p>
        <div data-reveal>${renderContactActions(config, "contact__actions", locale)}</div>
        <dl class="contact-details" data-reveal>
          <div><dt>${escapeHtml(copy.emailLabel)}</dt><dd><a href="mailto:${escapeHtml(config.email)}">${escapeHtml(config.email)}</a></dd></div>
        </dl>
        <p class="contact-privacy" data-reveal><a href="${escapeHtml(publicAssetUrl(localizePath("/privacy/", locale), baseUrl))}">${escapeHtml(copy.contactPrivacy)}</a></p>
        ${config.placeholder ? `<p class="contact-note"><strong>${escapeHtml(copy.trialContact)}</strong> ${escapeHtml(config.email)} is a non-production placeholder and must be replaced before launch.</p>` : ""}
      </section>
    </main>
    ${renderSiteFooter(baseUrl, locale)}
  `;
};

export const renderPrivacyPage = (
  content: PrivacyContent,
  config: ContactConfig,
  baseUrl: string = import.meta.env.BASE_URL,
  locale: Locale = "en",
): string => {
  const copy = uiCopy(locale);
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
    ${renderSiteHeader(baseUrl, homeHrefFor(locale, baseUrl), locale, "/privacy/")}
    <main id="main-content" class="page">
      <article class="prose" aria-labelledby="privacy-heading">
        <p class="page__eyebrow">${escapeHtml(copy.privacyUpdated(content.updated))}</p>
        <h1 id="privacy-heading">${escapeHtml(content.title)}</h1>
        ${sections}
        <section>
          <h2>${escapeHtml(copy.privacyContactHeading)}</h2>
          <p>${escapeHtml(copy.privacyContactBefore)}<a href="mailto:${escapeHtml(config.email)}">${escapeHtml(config.email)}</a>${escapeHtml(copy.privacyContactAfter)}</p>
        </section>
      </article>
    </main>
    ${renderSiteFooter(baseUrl, locale)}
  `;
};

export const renderServicePage = (
  page: ServicePage,
  content: SiteContent,
  config: ContactConfig,
  baseUrl: string = import.meta.env.BASE_URL,
  locale: Locale = "en",
): string => {
  const copy = uiCopy(locale);
  const product = content.products.find(({ id }) => id === page.productId);
  const homeHref = homeHrefFor(locale, baseUrl);

  if (!product) {
    throw new Error(
      `Cannot render the service page "${page.slug}": no product is defined for "${page.productId}".`,
    );
  }

  const list = (items: string[]): string =>
    items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");

  return `
    ${renderSiteHeader(baseUrl, homeHref, locale, `/services/${page.slug}/`)}
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
            <h2>${escapeHtml(copy.typicalRequests)}</h2>
            <ul>${list(page.requests)}</ul>
          </section>
          <section>
            <h2>${escapeHtml(copy.whatYouReceive)}</h2>
            <ul>${list(page.deliverables)}</ul>
          </section>
        </div>
        <nav class="service-detail__navigation" aria-label="${escapeHtml(copy.serviceNavigation)}">
          <a href="${escapeHtml(homeHref)}#approach">${escapeHtml(copy.seeHowWeWork)}</a>
          <a href="${escapeHtml(homeHref)}#services">${escapeHtml(copy.backToServices)}</a>
        </nav>
        <section class="service-contact" aria-labelledby="service-contact-heading">
          <h2 id="service-contact-heading">${escapeHtml(copy.serviceContactHeading)}</h2>
          <p>${escapeHtml(copy.serviceContactBody)}</p>
          ${renderContactActions(config, "contact__actions", locale)}
        </section>
      </article>
    </main>
    ${renderSiteFooter(baseUrl, locale)}
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

const renderVorbioConsole = (locale: Locale): string => {
  const copy = uiCopy(locale);

  return `
          <figure class="vorbio-console">
            <figcaption class="vorbio-console__header">
              <span><span class="vorbio-console__status" aria-hidden="true"></span>${escapeHtml(copy.illustrativeConversation)}</span>
              <span>${escapeHtml(copy.voiceAndChat)}</span>
            </figcaption>
            <div class="vorbio-console__call">
              <div class="vorbio-console__call-meta"><span>${escapeHtml(copy.incomingVoiceCall)}</span><span>00:24</span></div>
${renderVorbioVoice()}
            </div>
            <ol class="vorbio-console__transcript">
              <li class="vorbio-console__message vorbio-console__message--customer"><span>${escapeHtml(copy.customer)}</span><p>${escapeHtml(copy.sampleQuestion)}</p></li>
              <li class="vorbio-console__message vorbio-console__message--vorbio"><span>Vorbio</span><p>${escapeHtml(copy.sampleAnswer)}</p></li>
            </ol>
            <div class="vorbio-console__outcome">
              <span>${escapeHtml(copy.nextAction)}</span>
              <strong>${escapeHtml(copy.bookingCaptured)}</strong>
              <small>${escapeHtml(copy.bookingReady)}</small>
            </div>
          </figure>`;
};

const renderVorbioHeroActions = (
  config: ContactConfig,
  locale: Locale,
): string => {
  const copy = uiCopy(locale);

  return `
            <div class="vorbio-actions">
              <a class="vorbio-button vorbio-button--primary" href="${escapeHtml(mailtoWithSubject(config.email, copy.vorbioDemoSubject))}" data-analytics="contact_click" data-channel="email" data-placement="vorbio-hero">${escapeHtml(copy.vorbioDemoLabel)} <span aria-hidden="true">↗</span></a>
            </div>`;
};

export const renderVorbioPage = (
  product: VorbioProduct,
  config: ContactConfig,
  baseUrl: string = import.meta.env.BASE_URL,
  locale: Locale = "en",
): string => {
  const copy = uiCopy(locale);
  const homeHref = homeHrefFor(locale, baseUrl);
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

  const proof = copy.vorbioProof
    .map(
      ({ title, detail }, index) =>
        `<li><span>${String(index + 1).padStart(2, "0")}</span><strong>${escapeHtml(title)}</strong><small>${escapeHtml(detail)}</small></li>`,
    )
    .join("\n          ");

  return `
    ${renderSiteHeader(baseUrl, homeHref, locale, "/services/vorbio/")}
    <main id="main-content" class="page vorbio">
      <article class="vorbio-page" aria-labelledby="vorbio-heading">
        <header class="vorbio-hero">
          <div class="vorbio-hero__copy">
            <p class="page__eyebrow">${escapeHtml(product.eyebrow)}</p>
            <p class="vorbio-wordmark">${escapeHtml(product.name)}<span aria-hidden="true">.</span></p>
            <h1 id="vorbio-heading">${escapeHtml(product.tagline)}</h1>
            <p class="prose__lead">${escapeHtml(product.summary)}</p>
${renderVorbioHeroActions(config, locale)}
            <p class="vorbio-hero__note">${escapeHtml(product.note)}</p>
          </div>
          <div class="vorbio-hero__visual">${renderVorbioConsole(locale)}</div>
        </header>
        <ul class="vorbio-proof" aria-label="${escapeHtml(copy.vorbioProofLabel)}">
          ${proof}
        </ul>
        <section class="vorbio-section vorbio-section--flow" aria-labelledby="vorbio-flow-heading">
          <div class="vorbio-section__heading"><p class="page__eyebrow">${escapeHtml(copy.vorbioFlowEyebrow)}</p><h2 id="vorbio-flow-heading">${escapeHtml(copy.vorbioFlowHeading)}</h2></div>
          <ol class="vorbio-flow">${workflow}</ol>
        </section>
        <section class="vorbio-section" aria-labelledby="vorbio-capabilities-heading">
          <div class="vorbio-section__heading"><p class="page__eyebrow">${escapeHtml(copy.vorbioCapabilityEyebrow)}</p><h2 id="vorbio-capabilities-heading">${escapeHtml(copy.vorbioCapabilityHeading)}</h2></div>
          <ul class="vorbio-grid">${highlights}</ul>
        </section>
        <section class="vorbio-use-cases" aria-labelledby="vorbio-use-cases-heading">
          <div><p class="page__eyebrow">${escapeHtml(copy.vorbioFitsEyebrow)}</p><h2 id="vorbio-use-cases-heading">${escapeHtml(copy.vorbioFitsHeading)}</h2></div>
          <ul>${useCases}</ul>
        </section>
        <section class="vorbio-control" aria-labelledby="vorbio-control-heading">
          <div class="vorbio-control__intro"><p class="page__eyebrow">${escapeHtml(copy.vorbioControlEyebrow)}</p><h2 id="vorbio-control-heading">${escapeHtml(copy.vorbioControlHeading)}</h2><p>${escapeHtml(copy.vorbioControlBody)}</p></div>
          <ul class="vorbio-control__list">${controls}</ul>
        </section>
        <section class="vorbio-section" aria-labelledby="vorbio-steps-heading">
          <div class="vorbio-section__heading"><p class="page__eyebrow">${escapeHtml(copy.vorbioStepsEyebrow)}</p><h2 id="vorbio-steps-heading">${escapeHtml(copy.vorbioStepsHeading)}</h2></div>
          <ol class="vorbio-steps">${steps}</ol>
        </section>
        <section class="vorbio-contact" aria-labelledby="vorbio-contact-heading">
          <p class="page__eyebrow">${escapeHtml(copy.vorbioContactEyebrow)}</p>
          <h2 id="vorbio-contact-heading">${escapeHtml(copy.vorbioContactHeading)}</h2>
          <p>${escapeHtml(copy.vorbioContactBody)}</p>
          ${renderContactActions(config, "contact__actions", locale)}
        </section>
      </article>
    </main>
    ${renderSiteFooter(baseUrl, locale)}
  `;
};
