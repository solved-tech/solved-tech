# Measuring enquiries without website tracking

The site currently sends no analytics events. HTML data attributes are integration hooks, not collected conversions. This manual register is available while the owner decides whether to use an analytics provider.

Use a private copy of `lead-register.csv`. Never commit a populated register to this public repository. Store names, email addresses, messages and customer documents only in the existing restricted correspondence system; use a pseudonymous lead ID and an internal reference in the register. An ID is still personal data if it can be linked back to a person.

Create a record only when an enquiry is actually received. Reuse the same ID for follow-ups, including enquiries that move between WhatsApp, phone and email.

- `channel`: phone, whatsapp, email, referral or other.
- `service`: bug-fixing, software-development, automation, ai, website or marketing.
- `stage`: received, qualified, proposal, won, lost or closed-unqualified.
- `source`: record a source only if supplied by the enquirer; otherwise unknown.
- `qualified`: the enquiry concerns a service Solved Tech offers, the business need is clear enough for a next step and both sides agree to that step. A contact-button click alone is not a qualified enquiry.

Review unique enquiries by service/channel, qualified enquiries, proposals and wins weekly. Calculate stage ratios only from comparable cohorts, and show the sample size. Do not call this website conversion rate: there is no visitor denominator. Apply the confirmed enquiry-retention policy to the private register too.

Before calling measurement operational, record and trace one real received enquiry through this process without publishing its personal details. If a website analytics provider is later selected, update the privacy notice and validate consent requirements, event deduplication and data minimisation before collection begins.
