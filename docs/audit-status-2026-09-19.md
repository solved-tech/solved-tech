# Audit remediation status 19 September 2026

This status supersedes the 18 September plans only where the current implementation below differs. The original plans remain as history, not as a statement that every finding is closed.

Baseline: main at e33e57705ee0e19cfef25afaa349ef4f9beaa163. The five live HTML pages matched that deployment artifact during the retest. Nine findings were resolved within the observed scope, six were partial and F03 was unresolved. F11 was resolved for preview isolation, not a launched website.

## Implemented in this branch

- F07: all six services are reachable from the need selector. Agentic/MCP jargon is replaced with business language. Decorative service artwork is capped at its 520px design width to shorten wide-screen rows without removing content.
- F13: canonical, social tags and Organization data use the confirmed GitHub Pages origin independently of the launch switch. Preview noindex remains in place; sitemap generation remains reserved for launch. An unconfirmed origin still emits no metadata. Privacy noindex does not block metadata for the commercial pages.
- F14: separate EE's phone connection from the WhatsApp service. The official WhatsApp policy names WhatsApp LLC for UK users; link to that policy rather than repeating the old plan's unverified WhatsApp Ireland assumption. The email provider and complete real processing arrangements still need confirmation.
- Verification: responsive checks now build and exercise the prerendered production artifact, and run unit/type/CSP checks before browser tests.
- F16: an empty private-use lead register and operating instructions are supplied as an option. No tracking vendor, fake conversion or claim of operational collection has been added.

## Open facts and external configuration

- F01: verify the mailbox/provider, DNS and actual delivery. The earlier plan says both that all channels are monitored and that the mailbox is not set up. MX was absent in the retest; no test messages or calls were sent.
- F03: two or three real case studies and permission to publish are still needed. Empty case-study content remains empty.
- F14: identify the email processor and confirm retention, actual providers, transfers and the notice with the owner. The WhatsApp correction alone is not full legal verification.
- F15: custom HTTP headers cannot be applied by this static GitHub Pages repository. Existing CSP/referrer meta are active; anti-framing and nosniff require control of HTTP delivery. No hosting migration is authorised or performed by this change.
- F16: owner must select/operate the measurement process. A private manual register is an option, not proof of received events or qualified leads.
- Launch: `siteStatus.launched` remains false. Resolve real contact readiness and approve release before switching. Privacy remaining noindex is a reasonable independent setting and is not a technical blocker to indexing commercial pages. Verify the final built pages and sitemap when the switch is changed.

## Verification and rollback

Run `npm test`, `npm run check`, `npm run build`; responsive tests require the build first (`npm run test:responsive`). CI performs this sequence and checks CSP on the built pages. The existing 13 responsive profiles are retained.

The patch changes no infrastructure, DNS, user data or analytics provider. Revert this branch's commit to restore its presentation/metadata behaviour. Do not claim live remediation until the reviewed change is merged, deployed and smoke-tested.

Sources: https://www.whatsapp.com/legal/privacy-policy and the baseline audit's HTTP, GitHub artifact and browser evidence. The privacy notice is not a substitute for confirmation of actual business processing.
