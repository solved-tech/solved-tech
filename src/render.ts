import type { ContactConfig, SiteContent } from "./content";

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

const renderProductScenes = (): string => `
  <svg viewBox="0 0 520 360" role="img" aria-label="Visual preview of the selected product">
    <g class="product-scene is-active" data-product-scene="0">
      <rect class="scene-line" x="68" y="66" width="384" height="228" rx="8" />
      <path class="scene-line" d="M68 108H452M98 87H110M122 87H134M146 87H158" />
      <rect class="scene-line scene-line--soft" x="106" y="142" width="138" height="20" rx="3" />
      <rect class="scene-line scene-line--soft" x="106" y="178" width="242" height="12" rx="3" />
      <rect class="scene-accent scene-accent--fill" x="106" y="220" width="116" height="42" rx="4" />
      <path class="scene-accent" d="M132 241H196" />
      <text class="scene-label" x="68" y="326">VISIT → ACTION</text>
    </g>
    <g class="product-scene" data-product-scene="1">
      <rect class="scene-line" x="68" y="70" width="274" height="188" rx="8" />
      <path class="scene-line" d="M68 224H342M178 294H232M205 258V294" />
      <rect class="scene-accent scene-device" x="314" y="122" width="132" height="190" rx="16" />
      <path class="scene-accent" d="M356 288H404" />
      <text class="scene-label" x="68" y="326">WEB · MOBILE · DESKTOP</text>
    </g>
    <g class="product-scene" data-product-scene="2">
      <circle class="scene-line scene-line--soft" cx="254" cy="174" r="112" />
      <circle class="scene-line" cx="254" cy="174" r="68" />
      <path class="scene-line" d="M112 174H396M254 32V316" />
      <path class="scene-accent scene-accent--path" d="M142 246C196 186 238 150 366 92" />
      <circle class="scene-accent" cx="366" cy="92" r="9" />
      <text class="scene-label" x="112" y="326">BE FOUND</text>
    </g>
    <g class="product-scene" data-product-scene="3">
      <rect class="scene-line" x="66" y="132" width="110" height="96" rx="8" />
      <rect class="scene-line" x="206" y="132" width="110" height="96" rx="8" />
      <rect class="scene-accent scene-accent--fill" x="346" y="132" width="110" height="96" rx="8" />
      <path class="scene-line" d="M176 180H206M316 180H346" />
      <path class="scene-accent scene-accent--arrow" d="M192 168L204 180L192 192M332 168L344 180L332 192" />
      <text class="scene-label" x="66" y="278">ASK</text>
      <text class="scene-label" x="206" y="278">HANDLE</text>
      <text class="scene-label" x="346" y="278">DONE</text>
    </g>
    <g class="product-scene" data-product-scene="4">
      <path class="scene-line" d="M148 98L260 180L372 98M148 262L260 180L372 262" />
      <circle class="scene-node" cx="148" cy="98" r="30" />
      <rect class="scene-node" x="340" y="66" width="64" height="64" rx="8" />
      <rect class="scene-node" x="116" y="230" width="64" height="64" rx="32" />
      <circle class="scene-node" cx="372" cy="262" r="30" />
      <circle class="scene-accent scene-accent--fill" cx="260" cy="180" r="42" />
      <text class="scene-label" x="108" y="326">YOUR PROBLEM → USEFUL ANSWER</text>
    </g>
  </svg>`;

export const renderHomepage = (
  content: SiteContent,
  config: ContactConfig,
  baseUrl: string = import.meta.env.BASE_URL,
): string => {
  const initialProduct = content.products[0];
  const products = content.products
    .map(
      ({ question, title, answer }, index) => `
        <button
          class="product-option${index === 0 ? " is-active" : ""}"
          type="button"
          data-product-option
          data-product-index="${index}"
          data-title="${escapeHtml(title)}"
          data-answer="${escapeHtml(answer)}"
          aria-pressed="${index === 0 ? "true" : "false"}"
        >
          <span class="product-option__number">${String(index + 1).padStart(2, "0")}</span>
          <strong>${escapeHtml(question)}</strong>
        </button>`,
    )
    .join("");
  const founders = content.founders
    .map(
      ({ name, role, image, linkedin }) => `
        <article class="founder" data-reveal>
          <div class="founder__portrait">
            <img src="${escapeHtml(publicAssetUrl(image, baseUrl))}" alt="Placeholder portrait for ${escapeHtml(name)}" width="520" height="620" loading="lazy" />
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
        <div class="product-showcase" data-reveal>
          <div class="product-options" aria-label="Choose what your business needs">
            ${products}
          </div>
          <div class="product-stage" data-product-stage data-active-product="0" aria-live="polite">
            <div class="product-stage__copy">
              <p class="product-stage__eyebrow">We can build it</p>
              <h3 data-product-title>${escapeHtml(initialProduct.title)}</h3>
              <p data-product-answer>${escapeHtml(initialProduct.answer)}</p>
            </div>
            <div class="product-stage__visual">${renderProductScenes()}</div>
          </div>
        </div>
      </section>
      <section id="approach" class="approach" aria-labelledby="approach-heading">
        <h2 id="approach-heading" data-reveal>Three steps. No fog.</h2>
        <ol>
          <li data-reveal><h3>Find what is stuck</h3></li>
          <li data-reveal><h3>Build the useful product</h3></li>
          <li data-reveal><h3>Show what changed</h3></li>
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
