import {
  getContactState,
  type ContactConfig,
  type ContactMethodId,
  type SiteContent,
} from "./content";

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

const contactDestination = (
  id: ContactMethodId,
  config: ContactConfig,
): string => {
  switch (id) {
    case "call":
      return `tel:${config.phone}`;
    case "whatsapp":
    case "voice":
      return `https://wa.me/${config.whatsapp}`;
    case "quote":
      return `mailto:${config.quoteEmail}`;
  }
};

const renderContactControl = (
  id: ContactMethodId,
  label: string,
  config: ContactConfig,
  extraAttributes = "",
): string =>
  getContactState(config) === "preview"
    ? `<button type="button" data-contact-preview="${escapeHtml(id)}"${extraAttributes}>${escapeHtml(label)}</button>`
    : `<a href="${escapeHtml(contactDestination(id, config))}"${extraAttributes}>${escapeHtml(label)}</a>`;

export const renderHomepage = (
  content: SiteContent,
  config: ContactConfig,
): string => {
  const preview = getContactState(config) === "preview";
  const services = content.services
    .map(
      ({ title, summary, detail }, index) => `
        <article class="service" data-reveal>
          <p class="service-number">${String(index + 1).padStart(2, "0")}</p>
          <h3>${escapeHtml(title)}</h3>
          <p>${escapeHtml(summary)}</p>
          <p>${escapeHtml(detail)}</p>
        </article>`,
    )
    .join("");
  const contactMethods = content.contactMethods
    .map(
      ({ id, label, note }) => `
        <li data-reveal>
          ${renderContactControl(id, label, config)}
          <p>${escapeHtml(note)}</p>
        </li>`,
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
    <header id="top" class="site-header">
      <a class="wordmark" href="#top" aria-label="Solved Tech home">Solved Tech</a>
      <nav aria-label="Primary navigation">
        <a href="#services">Services</a>
        <a href="#approach">Approach</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>
    <main id="main-content">
      <section class="hero" aria-labelledby="hero-heading">
        <h1 id="hero-heading" data-reveal>Technology should solve the next business problem. Not create another one.</h1>
        <p data-reveal>We help UK businesses attract customers, build useful digital products and remove repetitive work.</p>
        ${renderContactControl("call", "Book a call", config, " data-reveal")}
      </section>
      <section class="problem" aria-labelledby="problem-heading">
        <h2 id="problem-heading" data-reveal>Your business does not need more digital noise.</h2>
        <p data-reveal>It needs a clear answer to the problem holding it back.</p>
      </section>
      <section id="services" class="services" aria-labelledby="services-heading">
        <h2 id="services-heading" data-reveal>What we can solve</h2>
        ${services}
      </section>
      <section id="approach" class="approach" aria-labelledby="approach-heading">
        <h2 id="approach-heading" data-reveal>A clear way forward</h2>
        <ol>
          <li data-reveal><h3>Find the blockage</h3><p>Understand what is getting in the way and why it matters.</p></li>
          <li data-reveal><h3>Build what changes it</h3><p>Choose and make the simplest useful solution.</p></li>
          <li data-reveal><h3>Show what improved</h3><p>Make the result clear so you know what changed.</p></li>
        </ol>
      </section>
      <section class="trust" aria-labelledby="trust-heading">
        <h2 id="trust-heading" data-reveal>Clarity from the start</h2>
        <p data-reveal>We explain the work in plain language, set out the next step and do not make claims we cannot support.</p>
      </section>
      <section class="contact" id="contact" aria-labelledby="contact-heading">
        <h2 id="contact-heading" data-reveal>Tell us what needs solving</h2>
        <p data-reveal>Choose the easiest way to start the conversation.</p>
        <ul>${contactMethods}</ul>
        ${preview ? '<p class="contact-note">Contact details are being connected. These preview controls do not send or place anything yet.</p>' : ""}
      </section>
    </main>
    <footer>
      <p>&copy; ${new Date().getFullYear()} Solved Tech</p>
      <a href="#top">Back to top</a>
    </footer>
  `;
};
