# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

delegated: static HTML/CSS with self-hosted fonts, matching the existing Solved Tech sample homepage pattern under `samples/` (no framework, CSP locked to self).

## Users

Couples and families who want to hire a photographer for a wedding day, engagement, or portrait session. They land from a search or a referral, skim the work in under a minute, and decide whether to enquire.

Secondary: Solved Tech prospects viewing this page as a portfolio sample of a small-business site (clearly labelled as a sample, not a live client site).

## Product Purpose

A one-page photographer homepage that lets the photographs lead, states who the photographer is and where they work, and makes enquiry the only hard action. Success is a visitor who understands the work and sends an email or call without hunting.

## Positioning

The site is the contact sheet made public: the sequence of pictures is the argument. It is not a booking SaaS, not a blog, and not a multi-page CMS. [Inferred for this sample run after the init decision page timed out unanswered.]

## Operating Context

Visitors compare portfolios on phones between other vendor tabs. They need location, typical work (weddings and portraits), and a direct enquire path. Proof lives in the images and a short about line, not in invented review scores.

## Capabilities and Constraints

- Single static homepage under `samples/mara-ellison/`, copied into `dist/samples` by the existing build script.
- Self-hosted fonts and images only; same CSP posture as sibling samples (`script-src 'none'`).
- Synthetic studio identity for demonstration; footer must say it is a Solved Tech sample, not a live site.
- No prices, fake testimonials, or fabricated booking calendar. [Inferred: undecided real client identity — synthetic allowed and labelled.]
- Enquire via `mailto:` (and optional `tel:` if a sample number is authored as clearly fictional).

## Brand Commitments

- Studio name for this sample: **Mara Ellison**.
- Voice: plain, specific, unhurried; no luxury clichés (“timeless”, “bespoke moments”).
- Must remain recognisable as a Solved Tech sample (footer credit pattern shared with sibling samples).

## Evidence on Hand

- No client-supplied photographs yet. Use openly licensed photography (e.g. Wikimedia Commons) with credits, or synthetic plates clearly not claiming to be Mara’s shoots.
- No real reviews, prices, or calendar to cite — do not invent them.

## Product Principles

1. The photograph is the product; chrome stays quiet.
2. One job per section; enquire is the only conversion action.
3. Sample honesty: never imply a live business or real bookings.
4. Match the technical floor of sibling samples (a11y skip link, focus, responsive, local assets).

## Accessibility & Inclusion

Keyboard-focusable controls, visible focus, skip link, meaningful image alt text, `prefers-reduced-motion` respected. No product-specific WCAG target beyond the sibling samples’ bar.
