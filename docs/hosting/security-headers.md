# Response headers for the production host

GitHub Pages cannot send custom response headers. The repository ships a Content-Security-Policy
and a referrer policy as `<meta>` elements in every prerendered page (`src/head.ts`,
`renderSecurityMeta`). The headers below must be configured on the final host (H5) because they
cannot be expressed in `<meta>` at all. When both a header and a `<meta>` policy are present the
browser enforces both; a request must satisfy every policy.

| Header | Value | Why |
| --- | --- | --- |
| `Content-Security-Policy` | same value as the `<meta>` in `src/head.ts`, plus `; frame-ancestors 'none'` | `frame-ancestors`, `report-to`/`report-uri` and `sandbox` are ignored in `<meta>`; the header adds them |
| `X-Frame-Options` | `DENY` | Fallback for clients without CSP 2 support |
| `X-Content-Type-Options` | `nosniff` | Prevents MIME sniffing of assets |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Mirrors the `<meta>` value |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | Only after HTTPS is confirmed on the final domain and all subdomains |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | The site uses none of these |

## Verify after deployment

```bash
curl -sI https://<production-host>/ | grep -i -E 'content-security-policy|x-frame-options|x-content-type-options|referrer-policy|strict-transport-security|permissions-policy'
npm run build && node scripts/check-csp.mts
```

The second command loads every built page under the meta policy in headless Chromium and fails on
any console error, so run it before tightening the policy further.

## Inline styles

The hero pipeline's seven node delays live in `src/styles.css` as `--pipeline-delay` declarations
keyed by node modifier, and `src/render.ts` emits no `style` attributes at all, so `style-src`
needs no `'unsafe-inline'`. `tests/render.test.ts` pins the measured crossing times in the
stylesheet, and `scripts/check-csp.mts` fails on any console error, so an inline style creeping
back in would be caught.
