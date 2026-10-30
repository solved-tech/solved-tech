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

Mara Ellison is a one-page contact sheet. The strips are the argument. Success is a visitor who sees the three keeps (07A2, 07B1, 07C3) and emails to hold them. The sample is location-neutral and has no phone number. Adrian Nica is a separate sample with his own published facts.

## Positioning

The site is the contact sheet made public: the sequence of pictures is the argument. It is not a booking SaaS, not a blog, and not a multi-page CMS. [Inferred for this sample run after the init decision page timed out unanswered.]

## Operating Context

Visitors compare portfolios on phones between other vendor tabs. Mara’s page needs the work (weddings and portraits) and one email path. It does not publish a town or a telephone number. Proof lives in the marked frames, not in invented review scores.

## Capabilities and Constraints

- Single static homepage under `samples/mara-ellison/`, copied into `dist/samples` by the existing build script.
- Self-hosted fonts and images only. Sibling samples stay `script-src 'none'`. The Mara contact sheet loads one same-origin script for the loupe, so its CSP is `script-src 'self'`.
- Synthetic studio identity for demonstration; footer must say it is a Solved Tech sample, not a live site.
- No prices, fake testimonials, or fabricated booking calendar. [Inferred: undecided real client identity — synthetic allowed and labelled.]
- Mara enquires by `mailto:hello@maraellison.example` only. No telephone on that sample.

## Brand Commitments

- Studio name for this sample: **Mara Ellison**.
- Voice: plain, specific, unhurried; no luxury clichés (“timeless”, “bespoke moments”).
- Must remain recognisable as a Solved Tech sample (footer credit pattern shared with sibling samples).

## Evidence on Hand

- Mara’s frames are Unsplash photographs. Each strip is derived from one source image (crop, tilt, exposure), not a real burst. The colophon says so. Do not describe them as Wikimedia plates or as Mara’s own shoots.
- No real reviews, prices, or calendar to cite for Mara Ellison — do not invent them.
- A second sample, `samples/adriannica/`, is for the real studio Adrian Nica (adriannica.ro): București / Ilfov, 0723 986 982, contact@adriannica.ro, foto și video for weddings, baptisms and civil ceremonies, plus published Christmas studio rates (from 300 lei / from 400 lei). Photographs in that sample are his published frames. Do not invent wedding package prices or a booking calendar.

## Product Principles

1. The photograph is the product; chrome stays quiet.
2. One job per section; enquire is the only conversion action.
3. Sample honesty: never imply a live business or real bookings.
4. Match the technical floor of sibling samples (a11y skip link, focus, responsive, local assets).

## Accessibility & Inclusion

Keyboard-focusable controls, visible focus, skip link, meaningful image alt text, `prefers-reduced-motion` respected. The Mara contact sheet is built to WCAG 2.2 AA (text 4.5:1, non-text UI 3:1, targets at least 44px).
