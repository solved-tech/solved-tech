# Contact Actions Design

## Goal

Expand both homepage contact groups from Call and WhatsApp to three clear
actions: Call, WhatsApp, and Email.

## Contact Details

- Email address: `contact@solvedtech.co.uk`
- The email is temporary until the company confirms production contact
  details.
- Existing placeholder phone and WhatsApp numbers remain unchanged.

## Action Order

Both the hero and final contact section use:

1. Call us
2. WhatsApp us
3. Email us

Call remains the primary orange action.

## Visual Treatment

- Call keeps its orange background.
- WhatsApp gains a small recognisable WhatsApp logo.
- WhatsApp uses a restrained `#25d366` border and text accent rather than a
  solid green background.
- Email gains a small envelope icon and remains neutral.
- All icons are decorative because the adjacent text supplies each accessible
  name.
- All three controls keep a minimum 48-pixel touch target.

## Responsive Behaviour

- The hero contact group wraps without horizontal overflow.
- The final contact group uses three equal columns where space permits.
- Below 40rem, the final contact actions stack in one column.
- Button text and icons remain vertically centred.

## Markup and Accessibility

- WhatsApp remains an external link with `target="_blank"` and
  `rel="noreferrer"`.
- Email uses `mailto:contact@solvedtech.co.uk`.
- Icon SVGs use `aria-hidden="true"` and `focusable="false"`.
- Visible action text remains the accessible link name.

## Verification

- Content tests require the approved email address.
- Renderer tests require one Email action in each contact group.
- Renderer tests require two WhatsApp icons and two Email icons.
- Renderer tests verify action order in each group.
- Full tests, TypeScript, Vite build, and whitespace checks pass.
- Browser review covers desktop and a 390-pixel viewport with no horizontal
  overflow.

## Out of Scope

Real phone numbers, form submission, email forms, tracking, deployment,
pushes, and pull requests remain unchanged.
