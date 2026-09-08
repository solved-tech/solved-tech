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
          <rect class="art-stroke art-desktop" x="42" y="32" width="326" height="226" rx="5" />
          <path class="art-stroke art-desktop-stand" d="M42 226H368M170 278H240M205 258V278" />
          <g class="art-detail art-detail--one">
            <rect class="art-ui-fill" x="42" y="32" width="62" height="194" rx="4" />
            <path class="art-icon" d="M62 62h22M62 82h22M62 102h22M62 182h22" />
            <text class="art-label art-label--strong" x="126" y="62">Tasks</text>
            <path class="art-ui-line" d="M126 74h76" />
          </g>
          <g class="art-detail art-detail--two">
            <rect class="art-panel" x="126" y="92" width="218" height="52" rx="2" />
            <path class="art-data-line" d="M142 130l36-18 32 8 42-22 34 12 42-28" />
            <path class="art-ui-line" d="M126 166h218M126 194h218" />
            <circle class="art-status" cx="140" cy="158" r="4" />
            <circle class="art-status art-status--active" cx="140" cy="186" r="4" />
            <circle class="art-status" cx="140" cy="214" r="4" />
            <path class="art-ui-line" d="M154 158h108M154 186h86M154 214h122" />
          </g>
          <g class="art-detail art-detail--three">
            <rect class="art-accent art-phone" x="346" y="74" width="132" height="196" rx="15" />
            <text class="art-label art-label--accent" x="370" y="108">TASK</text>
            <rect class="art-panel" x="366" y="124" width="92" height="72" rx="3" />
            <path class="art-ui-line" d="M378 142h62M378 156h48" />
            <circle class="art-status art-status--active" cx="388" cy="178" r="8" />
            <path class="art-check-small" d="m383 178 4 4 7-9M390 246h44" />
          </g>
        </svg>`;
    case "traffic":
      return `
        <svg class="service-art service-art--traffic" data-service-art="traffic" aria-hidden="true" viewBox="0 0 520 300">
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
          <path class="art-data-route" d="M112 150H188M250 100V68M312 122L394 56M312 150H394M312 178l82 66M250 200v38" />
          <path class="art-data-route art-data-route--arrow" d="m176 142 12 8-12 8M242 80l8-12 8 12M382 48l12 8-12 8M382 142l12 8-12 8M382 236l12 8-12 8M242 226l8 12 8-12" />
          <g class="art-detail art-detail--one">
            <rect class="art-panel" x="24" y="124" width="88" height="52" rx="4" />
            <text class="art-label art-label--strong" x="39" y="155">Request</text>
            <rect class="art-accent" x="188" y="100" width="124" height="100" rx="8" />
            <text class="art-label art-label--accent" x="226" y="132">Agent</text>
            <circle class="art-agent-node" cx="226" cy="160" r="6" />
            <circle class="art-agent-node" cx="250" cy="172" r="6" />
            <circle class="art-agent-node" cx="274" cy="154" r="6" />
            <path class="art-icon" d="M226 160l24 12 24-18M250 172l24-18" />
          </g>
          <g class="art-detail art-detail--two">
            <rect class="art-panel" x="202" y="26" width="96" height="42" rx="4" />
            <text class="art-label" x="222" y="52">Memory</text>
          </g>
          <g class="art-detail art-detail--three">
            <rect class="art-panel" x="394" y="34" width="102" height="44" rx="4" />
            <text class="art-label" x="428" y="61">CRM</text>
            <rect class="art-panel" x="394" y="128" width="102" height="44" rx="4" />
            <text class="art-label" x="408" y="155">Calendar</text>
            <rect class="art-panel" x="394" y="222" width="102" height="44" rx="4" />
            <text class="art-label" x="408" y="249">Messages</text>
          </g>
          <g class="art-detail art-detail--four">
            <rect class="art-panel" x="208" y="238" width="84" height="42" rx="4" />
            <text class="art-label art-label--strong" x="229" y="264">Done</text>
            <path class="art-check-small" d="m270 256 5 5 9-12" />
          </g>
          <circle class="art-packet art-packet--x" cx="148" cy="150" r="5" />
          <circle class="art-packet art-packet--y" cx="250" cy="82" r="5" />
          <circle class="art-packet art-packet--y art-packet--late" cx="250" cy="218" r="5" />
        </svg>`;
    case "other":
      return `
        <svg class="service-art service-art--other" data-service-art="other" aria-hidden="true" viewBox="0 0 520 300">
          <path class="art-data-route" d="M132 62L260 150M132 238l128-88M388 62l-128 88M402 150H302M388 238l-128-88" />
          <g class="art-detail art-detail--one">
            <rect class="art-panel" x="34" y="34" width="98" height="56" rx="4" />
            <path class="art-icon" d="M50 54h18l-2 15H52l-4-20h-6M54 77h1M64 77h1" />
            <text class="art-label" x="78" y="67">Shop</text>
            <rect class="art-panel" x="34" y="210" width="98" height="56" rx="4" />
            <rect class="art-icon" x="49" y="222" width="22" height="32" rx="4" />
            <text class="art-label" x="82" y="243">App</text>
          </g>
          <g class="art-detail art-detail--two">
            <rect class="art-panel" x="388" y="34" width="112" height="56" rx="4" />
            <path class="art-icon" d="M402 51h24v18h-24zM402 57h24" />
            <text class="art-label" x="435" y="67">Payments</text>
            <rect class="art-panel" x="402" y="122" width="98" height="56" rx="4" />
            <circle class="art-icon" cx="420" cy="142" r="7" />
            <path class="art-icon" d="M408 165c2-9 8-14 12-14s10 5 12 14" />
            <text class="art-label" x="442" y="154">CRM</text>
            <rect class="art-panel" x="388" y="210" width="112" height="56" rx="4" />
            <path class="art-icon" d="M402 226h24v7h-24zM402 237h24v7h-24zM402 248h24v7h-24z" />
            <text class="art-label" x="438" y="243">Data</text>
          </g>
          <g class="art-detail art-detail--three">
            <circle class="art-accent art-hub" cx="260" cy="150" r="42" />
            <circle class="art-agent-node" cx="248" cy="142" r="5" />
            <circle class="art-agent-node" cx="272" cy="142" r="5" />
            <circle class="art-agent-node" cx="260" cy="163" r="5" />
            <path class="art-icon" d="m248 142 12 21 12-21M248 142h24" />
            <text class="art-label art-label--accent" x="235" y="188">Connect</text>
          </g>
          <circle class="art-packet art-packet--x" cx="188" cy="101" r="5" />
          <circle class="art-packet art-packet--x art-packet--late" cx="338" cy="199" r="5" />
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
