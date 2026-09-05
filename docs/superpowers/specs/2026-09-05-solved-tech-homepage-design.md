# Solved Tech Homepage Design

## Goal

Create one immersive English-language landing page for Solved Tech, aimed at
small and medium-sized businesses in the UK. The page should sell tangible
digital products, show the business problems each product solves, and make
contact a one-click action.

## Audience

Owners and decision-makers in UK SMEs who want more customers, better digital
products, connected systems, or less repetitive work. The page assumes no
technical knowledge.

## Positioning

Solved Tech is presented as a product-building partner. The page leads with
what a client can buy, then explains the recognisable problem and useful result
behind it. Technology names remain secondary.

## Page Structure

1. Hero that names the offer: websites, shops, apps, connected systems, and
   digital assistants. It includes adjacent Call and WhatsApp actions.
2. A product-first showcase headed “What do you need?” with five direct
   questions:
   - “Need a website?” covers websites and online shops.
   - “Need an app?” covers web, mobile, and desktop products.
   - “Need more traffic?” covers search visibility and paid advertising.
   - “Want to use AI in your business?” covers useful assistants and
     automated routine work.
   - “Need something else?” covers connected systems, integrations, and
     custom problems.
3. Each question expands into one short result-focused sentence and a simple
   product visual. No catalogue-style paragraphs or technology lists.
4. A single visual three-step process: find the blockage, build the useful
   product, and show what changed.
5. A founders section with two clearly marked placeholder portraits, names,
   roles, and LinkedIn destinations. Placeholder content must not resemble real
   identities.
6. A final contact block that says “Whatever you need to move forward, call
   us.” It has only two primary actions: Call us and WhatsApp us. During the
   trial, both use conspicuous non-production UK placeholders.
7. Minimal footer.

## Visual Direction

- Dark grey and white form the main palette.
- Orange appears sparingly on primary actions, progress cues, and meaningful
  highlights.
- Large, disciplined typography and generous spacing create confidence.
- A fine technical grid sits behind the page and shifts gently with scroll
  progress.
- Code becomes a quiet environmental texture rather than a visual feature:
  eight or fewer fragments, low contrast, irregular positions across the full
  document, and independent drift of no more than eight pixels. It is not
  fixed to the viewport and contains no bright orange lines.
- Product visuals receive the stronger contrast and orange emphasis previously
  given to the code layer.
- Scroll-triggered transitions reveal content progressively.
- Motion stays restrained, preserves reading flow, and respects reduced-motion
  preferences.
- The layout remains clear and fully usable without animation.

## Copy Direction

Copy is terse, human, calm, and quietly confident. Psychological marketing is
used ethically through recognition, clarity, specificity, reduced perceived
risk, and a simple next step. It does not use urgency tricks, fear, inflated
claims, or technical language for status.

Avoid common AI-generated patterns: vague superlatives, “revolutionary” claims,
formulaic three-part slogans, excessive em dashes, repetitive headings,
generic gradient decoration, rounded-card walls, ornamental icons, fake
statistics, and filler.

## Responsive and Accessible Behaviour

- Mobile-first layout with comfortable tap targets and readable line lengths.
- Semantic landmarks and heading order.
- Visible keyboard focus and complete keyboard operation.
- Sufficient colour contrast.
- Reduced-motion behaviour for all non-essential animation.
- Contact methods have clear accessible names.

## Technical Direction

Use Vite with TypeScript and repository-local npm tooling. Keep the landing page
framework-free: semantic HTML, modular TypeScript, and CSS. Use
`IntersectionObserver` only as progressive enhancement for scroll reveals.
Render the background grid as an inline, decorative SVG rather than a gradient
or external image. Drive its subtle offset and scale from the existing
scroll-progress value, keep it non-interactive and hidden from assistive
technology, and leave it static when reduced motion is preferred.
Store contact destinations and founder profiles in typed configuration
objects. Trial contact links use visibly labelled placeholder values and must
be replaced before launch. Both controls still use the final one-click
destinations: `tel:` for Call and `https://wa.me/` for WhatsApp.

## Verification

- Automated tests cover the five product groups, problem/result copy,
  two-action contact model, placeholder status, founder placeholders, and
  interactive product selection.
- The production build must complete successfully.
- Browser checks cover desktop and mobile layouts, keyboard navigation, console
  errors, reduced motion, and primary contact interactions.
- A final copy review checks clarity, accuracy, and the prohibited AI patterns.

## Scope

This release contains one responsive homepage. Real founder information, real
contact details, a CMS, blog, client portal, backend contact processing,
case-study pages, and additional routes are out of scope.
