# Solved Tech Homepage Design

## Goal

Create one immersive English-language landing page for Solved Tech, aimed at
small and medium-sized businesses in the UK. The page should make a broad
technical offer easy to understand and make contact feel like a low-risk next
step.

## Audience

Owners and decision-makers in UK SMEs who want more customers, better digital
products, connected systems, or less repetitive work. The page assumes no
technical knowledge.

## Positioning

Solved Tech is presented as a practical partner that solves business problems,
not as a catalogue of technologies. Copy leads with recognisable outcomes and
introduces service names only when they help a visitor choose.

## Page Structure

1. Hero with a direct promise and a primary call-booking action.
2. Familiar business frustrations that show understanding without creating
   fear.
3. Five outcome-led service groups:
   - Get found: Google Ads, technical SEO, and on-page SEO.
   - Sell online: online shops and conversion-focused websites.
   - Build products: websites, SaaS platforms, mobile apps, and desktop apps.
   - Connect systems: APIs and business integrations.
   - Automate work: agentic workflows, MCP solutions, voice agents, and
     WhatsApp agents.
4. A short, plain-language working process.
5. Trust signals based only on verifiable facts; no invented clients,
   testimonials, metrics, or awards.
6. Contact choices in this order: call, WhatsApp, voice note, quote.
7. Minimal footer.

## Visual Direction

- Dark grey and white form the main palette.
- Orange appears sparingly on primary actions, progress cues, and meaningful
  highlights.
- Large, disciplined typography and generous spacing create confidence.
- A fine technical grid sits behind the page and shifts gently with scroll
  progress. Sparse orange intersections appear near key moments without
  competing with the copy.
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
Store contact destinations in one configuration object. Until production
contact details are supplied, contact controls use an explicit local preview
state and do not invent addresses or phone numbers.

## Verification

- Automated tests cover content structure, service grouping, contact priority,
  and contact configuration behaviour.
- The production build must complete successfully.
- Browser checks cover desktop and mobile layouts, keyboard navigation, console
  errors, reduced motion, and primary contact interactions.
- A final copy review checks clarity, accuracy, and the prohibited AI patterns.

## Scope

This release contains one responsive homepage. A CMS, blog, client portal,
backend contact processing, case-study pages, and additional routes are out of
scope.
