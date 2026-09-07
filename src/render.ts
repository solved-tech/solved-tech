import type { ContactConfig, ProductOffer, SiteContent } from "./content";

const escapeHtml = (value: string): string =>
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

const publicAssetUrl = (path: string, baseUrl: string): string => {
  const base = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return `${base}${path.replace(/^\/+/, "")}`;
};

const renderContactActions = (
  config: ContactConfig,
  className: string,
): string => `
  <div class="${className}">
    <a class="contact-action contact-action--call" href="tel:${escapeHtml(config.phone)}">Call us</a>
    <a class="contact-action contact-action--whatsapp" href="https://wa.me/${escapeHtml(config.whatsapp)}" target="_blank" rel="noreferrer">WhatsApp us</a>
  </div>`;

const renderServiceArt = (id: ProductOffer["id"]): string => {
  switch (id) {
    case "website":
      return `
        <svg class="service-art service-art--website" data-service-art="website" aria-hidden="true" viewBox="0 0 520 300">
          <rect class="art-stroke art-browser" x="48" y="42" width="424" height="216" rx="4" />
          <path class="art-stroke art-browser-bar" d="M48 84H472M80 63H92M104 63H116M128 63H140" />
          <rect class="art-stroke art-page-line art-page-line--one" x="84" y="118" width="160" height="18" rx="2" />
          <rect class="art-stroke art-page-line art-page-line--two" x="84" y="150" width="284" height="10" rx="2" />
          <rect class="art-stroke art-page-line art-page-line--three" x="84" y="172" width="224" height="10" rx="2" />
          <rect class="art-accent art-page-action" x="84" y="204" width="112" height="34" rx="2" />
        </svg>`;
    case "app":
      return `
        <svg class="service-art service-art--app" data-service-art="app" aria-hidden="true" viewBox="0 0 520 300">
          <rect class="art-stroke art-desktop" x="62" y="52" width="292" height="184" rx="5" />
          <path class="art-stroke art-desktop-stand" d="M62 202H354M180 268H236M208 236V268" />
          <rect class="art-accent art-phone" x="328" y="92" width="126" height="178" rx="15" />
          <path class="art-accent art-phone-detail" d="M370 248H412" />
        </svg>`;
    case "traffic":
      return `
        <svg class="service-art service-art--traffic" data-service-art="traffic" aria-hidden="true" viewBox="0 0 520 300">
          <circle class="art-stroke art-orbit art-orbit--outer" cx="260" cy="146" r="104" />
          <circle class="art-stroke art-orbit" cx="260" cy="146" r="64" />
          <path class="art-stroke art-axis" d="M110 146H410M260 26V266" />
          <path class="art-accent art-traffic-route" d="M112 240C184 166 248 130 408 66" />
          <circle class="art-accent art-target" cx="408" cy="66" r="9" />
        </svg>`;
    case "ai":
      return `
        <svg class="service-art service-art--ai" data-service-art="ai" aria-hidden="true" viewBox="0 0 520 300">
          <rect class="art-stroke art-step art-step--one" x="42" y="104" width="116" height="88" rx="6" />
          <rect class="art-stroke art-step art-step--two" x="202" y="104" width="116" height="88" rx="6" />
          <rect class="art-accent art-step art-step--three" x="362" y="104" width="116" height="88" rx="6" />
          <path class="art-accent art-connector art-connector--one" d="M158 148H202" />
          <path class="art-accent art-connector art-connector--two" d="M318 148H362" />
          <path class="art-accent art-check" d="M397 148L414 164L445 128" />
        </svg>`;
    case "other":
      return `
        <svg class="service-art service-art--other" data-service-art="other" aria-hidden="true" viewBox="0 0 520 300">
          <path class="art-accent art-connections" d="M132 74L260 150L388 74M132 226L260 150L388 226" />
          <circle class="art-stroke art-block art-block--one" cx="132" cy="74" r="30" />
          <rect class="art-stroke art-block art-block--two" x="358" y="44" width="60" height="60" rx="6" />
          <rect class="art-stroke art-block art-block--three" x="102" y="196" width="60" height="60" rx="30" />
          <circle class="art-stroke art-block art-block--four" cx="388" cy="226" r="30" />
          <circle class="art-accent art-hub" cx="260" cy="150" r="38" />
        </svg>`;
  }
};

export const renderHomepage = (
  content: SiteContent,
  config: ContactConfig,
  baseUrl: string = import.meta.env.BASE_URL,
): string => {
  const services = content.products
    .map(
      ({ id, question, title, answer }, index) => `
        <article class="service-box service-box--${escapeHtml(id)}" data-reveal>
          <a class="service-box__link" href="#contact">
            <span class="service-box__number">${String(index + 1).padStart(2, "0")}</span>
            <strong>${escapeHtml(question)}</strong>
            <span class="service-box__product">${escapeHtml(title)}</span>
            <p>${escapeHtml(answer)}</p>
            <span class="service-box__artwork">${renderServiceArt(id)}</span>
            <span class="service-box__cta">Talk to us <span aria-hidden="true">→</span></span>
          </a>
        </article>`,
    )
    .join("");
  const founders = content.founders
    .map(
      ({ name, role, image, linkedin }) => `
        <article class="founder" data-reveal>
          <div class="founder__portrait">
            <div class="founder__portrait-frame">
              <img src="${escapeHtml(publicAssetUrl(image, baseUrl))}" alt="Placeholder portrait for ${escapeHtml(name)}" width="520" height="620" loading="lazy" />
            </div>
            <span>Photo placeholder</span>
          </div>
          <div class="founder__details">
            <h3>${escapeHtml(name)}</h3>
            <p>${escapeHtml(role)}</p>
            <a href="${escapeHtml(linkedin)}" target="_blank" rel="noreferrer" aria-label="LinkedIn profile placeholder for ${escapeHtml(name)}">
              <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6.5 8.25H3.25V20H6.5V8.25ZM4.88 3A1.88 1.88 0 1 0 4.88 6.75 1.88 1.88 0 0 0 4.88 3ZM20.75 13.25c0-3.54-1.89-5.19-4.42-5.19-2.04 0-2.95 1.12-3.46 1.91V8.25H9.62V20h3.25v-5.82c0-1.53.29-3.01 2.19-3.01 1.87 0 1.89 1.75 1.89 3.11V20h3.25l.55-6.75Z"/></svg>
            </a>
          </div>
        </article>`,
    )
    .join("");

  return `
    <svg class="ambient-grid" aria-hidden="true" focusable="false" preserveAspectRatio="none" viewBox="0 0 1600 1000">
      <defs>
        <pattern id="ambient-grid-pattern" width="64" height="64" patternUnits="userSpaceOnUse">
          <path d="M 0 0 H 64" />
          <path d="M 0 0 V 64" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#ambient-grid-pattern)" />
      <circle class="ambient-grid__accent" cx="192" cy="192" r="2.5" />
      <circle class="ambient-grid__accent" cx="1216" cy="384" r="2.5" />
      <circle class="ambient-grid__accent" cx="832" cy="832" r="2.5" />
    </svg>
    <div class="code-field" aria-hidden="true">
      <code data-language="typescript">const useful = solve(problem);</code>
      <code data-language="python">build(what_people_need)</code>
      <code data-language="swift">await idea.makeUseful()</code>
      <code data-language="sql">SELECT next_step FROM business;</code>
      <code data-language="html">&lt;product&gt;ready&lt;/product&gt;</code>
      <code data-language="css">.friction { display: none; }</code>
      <code data-language="terraform">resource "progress" "next" {}</code>
      <code data-language="shell">$ ship --when-ready</code>
    </div>
    <header id="top" class="site-header">
      <a class="wordmark" href="#top" aria-label="Solved Tech home">
        <img src="${escapeHtml(publicAssetUrl("/brand/solved-tech-logo-dark.svg", baseUrl))}" alt="Solved Tech — Your digital problems, solved." width="180" height="40" decoding="sync" />
      </a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation" aria-label="Open menu">
        <span></span><span></span><span></span>
      </button>
      <nav id="primary-navigation" aria-label="Primary navigation">
        <a href="#services">Products</a>
        <a href="#approach">Process</a>
        <a href="#team">Team</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>
    <main id="main-content">
      <section class="hero" aria-labelledby="hero-heading">
        <div class="hero__signal" aria-hidden="true">
          <svg viewBox="0 0 320 320" focusable="false">
            <circle class="hero__signal-ring hero__signal-ring--outer" cx="160" cy="160" r="136" />
            <circle class="hero__signal-ring" cx="160" cy="160" r="88" />
            <path class="hero__signal-axis" d="M24 160H296M160 24V296" />
            <path class="hero__signal-path" d="M76 224C112 148 164 106 252 84" />
            <circle class="hero__signal-node" cx="76" cy="224" r="6" />
            <circle class="hero__signal-point" cx="252" cy="84" r="3" />
          </svg>
        </div>
        <p class="hero__eyebrow" data-reveal>Websites. Apps. Growth. AI.</p>
        <h1 id="hero-heading" data-reveal>Whatever your business needs next, we build it.</h1>
        <p data-reveal>Bring us the problem. We will turn it into something useful.</p>
        ${renderContactActions(config, "hero__actions")}
      </section>
      <section id="services" class="services" aria-labelledby="services-heading">
        <h2 id="services-heading" data-reveal>What do you need?</h2>
        <div class="service-grid">${services}</div>
      </section>
      <section id="approach" class="journey" aria-labelledby="approach-heading">
        <div class="journey__heading" data-reveal>
          <p>What happens next</p>
          <h2 id="approach-heading">One call. Then we make it simple.</h2>
        </div>
        <ol class="journey__moments" data-reveal>
          <li class="journey__moment">
            <span class="journey__number">01</span>
            <span class="journey__signal" aria-hidden="true">
              <svg viewBox="0 0 48 48"><path d="M12 29c6-10 14-16 24-18M12 29h9M12 29v-9" /><circle cx="36" cy="11" r="3" /></svg>
            </span>
            <div><h3>Tell us what’s stuck.</h3><p>No polished brief needed.</p></div>
          </li>
          <li class="journey__moment">
            <span class="journey__number">02</span>
            <span class="journey__signal" aria-hidden="true">
              <svg viewBox="0 0 48 48"><path d="M9 24h27M29 16l8 8-8 8" /></svg>
            </span>
            <div><h3>Get a clear next move.</h3><p>We explain the simplest useful route.</p></div>
          </li>
          <li class="journey__moment">
            <span class="journey__number">03</span>
            <span class="journey__signal" aria-hidden="true">
              <svg viewBox="0 0 48 48"><rect x="8" y="10" width="32" height="24" rx="2" /><path d="M17 40h14M24 34v6M13 16h22" /></svg>
            </span>
            <div><h3>See something real, early.</h3><p>React to progress, not paperwork.</p></div>
          </li>
          <li class="journey__moment">
            <span class="journey__number">04</span>
            <span class="journey__signal" aria-hidden="true">
              <svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="16" /><path d="m16 24 6 6 11-13" /></svg>
            </span>
            <div><h3>Move forward with confidence.</h3><p>We launch it with you.</p></div>
          </li>
        </ol>
      </section>
      <section id="team" class="team" aria-labelledby="team-heading">
        <div class="team__heading">
          <p data-reveal>Who you will work with</p>
          <h2 id="team-heading" data-reveal>Meet the founders</h2>
        </div>
        <div class="team__grid">${founders}</div>
      </section>
      <section class="contact" id="contact" aria-labelledby="contact-heading">
        <h2 id="contact-heading" data-reveal>Whatever you need to move forward, call us.</h2>
        <p data-reveal>One click starts the conversation.</p>
        <div data-reveal>${renderContactActions(config, "contact__actions")}</div>
        ${config.placeholder ? `<p class="contact-note"><strong>Trial contact details:</strong> ${escapeHtml(config.displayPhone)} is a non-production placeholder and must be replaced before launch.</p>` : ""}
      </section>
    </main>
    <footer>
      <p>&copy; ${new Date().getFullYear()} Solved Tech</p>
      <a href="#top">Back to top</a>
    </footer>
  `;
};
