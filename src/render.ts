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

const renderContactActions = (
  config: ContactConfig,
  className: string,
): string => `
  <div class="${className}">
    <a class="contact-action contact-action--call" href="tel:${escapeHtml(config.phone)}">Call us</a>
    <a class="contact-action contact-action--whatsapp" href="https://wa.me/${escapeHtml(config.whatsapp)}" target="_blank" rel="noreferrer">${whatsappIcon}<span>WhatsApp us</span></a>
    <a class="contact-action contact-action--email" href="mailto:${escapeHtml(config.email)}">${emailIcon}<span>Email us</span></a>
  </div>`;

export const pipelinePath =
  "M80 140C80 58 178 25 320 28C478 31 560 76 560 140C560 218 470 250 320 252C164 254 80 218 80 140Z";

// Node delays are measured closest crossings on the rendered route.
const renderHeroPipeline = (): string => `
  <div class="hero__pipeline" data-reveal aria-hidden="true">
    <svg viewBox="0 0 640 300" focusable="false">
      <path class="hero-pipeline__route" d="${pipelinePath}" />
      <circle class="hero-pipeline__signal" r="5" />

      <g class="hero-pipeline__node hero-pipeline__node--ai" transform="translate(80 140)" style="--pipeline-delay: 0s">
        <circle class="hero-pipeline__node-ring" r="25" />
        <path class="hero-pipeline__icon" d="M-9-7H9V8H-9ZM-5-12V-7M5-12V-7M-4-1h1M3-1h1M-4 4h8" />
        <text y="43">AI</text>
      </g>

      <g class="hero-pipeline__node" transform="translate(150 58)" style="--pipeline-delay: 0.911s">
        <circle class="hero-pipeline__node-ring" r="25" />
        <circle class="hero-pipeline__icon" r="10" />
        <circle class="hero-pipeline__icon" r="5" />
        <path class="hero-pipeline__icon" d="M0-14V-9M0 9V14M-14 0H-9M9 0H14" />
        <text y="43">Customers</text>
      </g>

      <g class="hero-pipeline__node" transform="translate(280 36)" style="--pipeline-delay: 1.952s">
        <circle class="hero-pipeline__node-ring" r="25" />
        <rect class="hero-pipeline__icon" x="-13" y="-10" width="26" height="20" rx="1" />
        <path class="hero-pipeline__icon" d="M-13-4H13M-9-7h1M-5-7h1" />
        <text y="43">Websites</text>
      </g>

      <g class="hero-pipeline__node" transform="translate(420 54)" style="--pipeline-delay: 3.059s">
        <circle class="hero-pipeline__node-ring" r="25" />
        <rect class="hero-pipeline__icon" x="-13" y="-11" width="26" height="22" rx="1" />
        <path class="hero-pipeline__icon" d="M-13-5H13M-8 0h6v6h-6M2 0h6M2 5h6" />
        <text y="43">Web apps</text>
      </g>

      <g class="hero-pipeline__node" transform="translate(552 118)" style="--pipeline-delay: 4.302s">
        <circle class="hero-pipeline__node-ring" r="25" />
        <rect class="hero-pipeline__icon" x="-8" y="-14" width="16" height="28" rx="2" />
        <path class="hero-pipeline__icon" d="M-3-10H3M-2 10H2" />
        <text y="43">Mobile apps</text>
      </g>

      <g class="hero-pipeline__node" transform="translate(500 220)" style="--pipeline-delay: 5.313s">
        <circle class="hero-pipeline__node-ring" r="25" />
        <rect class="hero-pipeline__icon" x="-14" y="-11" width="28" height="19" rx="1" />
        <path class="hero-pipeline__icon" d="M0 8V13M-7 13H7" />
        <text y="43">Desktop apps</text>
      </g>

      <g class="hero-pipeline__node" transform="translate(280 246)" style="--pipeline-delay: 7.045s">
        <circle class="hero-pipeline__node-ring" r="25" />
        <path class="hero-pipeline__icon" d="M-9-6L8-10M-9-6L-2 10M8-10L10 7M-2 10L10 7" />
        <circle class="hero-pipeline__icon hero-pipeline__icon-dot" cx="-9" cy="-6" r="3" />
        <circle class="hero-pipeline__icon hero-pipeline__icon-dot" cx="8" cy="-10" r="3" />
        <circle class="hero-pipeline__icon hero-pipeline__icon-dot" cx="-2" cy="10" r="3" />
        <circle class="hero-pipeline__icon hero-pipeline__icon-dot" cx="10" cy="7" r="3" />
        <text y="43">Custom systems</text>
      </g>
    </svg>
  </div>`;

const renderCapabilities = (provides: ProductOffer["provides"]): string => `
  <div class="service-box__provides">
    <span>We provide</span>
    <ul class="service-box__capabilities">
      ${provides
        .map(
          (capability) =>
            `<li class="service-box__capability">${escapeHtml(capability)}</li>`,
        )
        .join("")}
    </ul>
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

export const renderHomepage = (
  content: SiteContent,
  config: ContactConfig,
  baseUrl: string = import.meta.env.BASE_URL,
): string => {
  const services = content.products
    .map(
      ({ id, question, title, answer, provides }, index) => {
        const questionId = `service-${id}-question`;

        return `
        <article class="service-box service-box--${escapeHtml(id)}" aria-labelledby="${questionId}">
          <header class="service-box__header">
            <div class="service-box__heading">
              <span class="service-box__number">${String(index + 1).padStart(2, "0")}</span>
              <h3 id="${questionId}" class="service-box__question">${escapeHtml(question)}</h3>
            </div>
            <span class="service-box__product">${escapeHtml(title)}</span>
            <p>${escapeHtml(answer)}</p>
          </header>
          <div class="service-box__body">
            <span class="service-box__artwork" data-reveal>${renderServiceArt(id)}</span>
            ${renderCapabilities(provides)}
          </div>
          <a class="service-box__cta" href="#contact" aria-label="Talk to us about ${escapeHtml(title)}">
            Talk to us <span aria-hidden="true">→</span>
          </a>
        </article>`;
      },
    )
    .join("");
  const founders = content.founders
    .map(
      ({ name, role, image, linkedin }) => `
        <article class="founder" data-reveal>
          <div class="founder__portrait">
            <div class="founder__portrait-frame">
              <img src="${escapeHtml(publicAssetUrl(image, baseUrl))}" alt="Portrait of ${escapeHtml(name)}" width="520" height="620" loading="lazy" />
            </div>
          </div>
          <div class="founder__details">
            <h3>${escapeHtml(name)}</h3>
            <p>${escapeHtml(role)}</p>
            <a href="${escapeHtml(linkedin)}" target="_blank" rel="noreferrer" aria-label="LinkedIn profile for ${escapeHtml(name)}">
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
        <p class="hero__eyebrow" data-reveal>AI. Growth. Apps. Websites.</p>
        <h1 id="hero-heading" data-reveal>Whatever your business needs next, we build it.</h1>
        <p data-reveal>Bring us the problem. We will turn it into something useful.</p>
        ${renderHeroPipeline()}
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
        ${config.placeholder ? `<p class="contact-note"><strong>Trial contact details:</strong> ${escapeHtml(config.displayPhone)} and ${escapeHtml(config.email)} are non-production placeholders and must be replaced before launch.</p>` : ""}
      </section>
    </main>
    <footer>
      <p>&copy; ${new Date().getFullYear()} Solved Tech</p>
      <a href="#top">Back to top</a>
    </footer>
  `;
};
