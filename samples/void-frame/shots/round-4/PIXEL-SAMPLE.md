# Pixel samples — round 4

Viewport 1440×900, device scale 1. Source still: `track-1440-fold.png`, taken with `document.activeElement` on `body` and the stamp ring hidden. Glyphs are Oswald. `-webkit-font-smoothing` computes to `antialiased` on the stamp and on `.ink`.

Tokens:

| token | hex | rgb |
| --- | --- | --- |
| chalk | `#FFFFFF` | 255, 255, 255 |
| void | `#000000` | 0, 0, 0 |

A pixel is chromatic when its channels are not equal. The stamp column in this still, x=1368 through x=1439 and y=0 through y=899, contains 0 chromatic pixels.

## Computed colour

Stamps are `button` elements, so `:link` and `:visited` do not match. Those states are still set to the same token as the resting stamp. Hover and `:focus-visible` were measured on the live page.

| stamp | state | button | ink | background |
| --- | --- | --- | --- | --- |
| 002 / flesh | rest, hover, focus-visible | `rgb(255, 255, 255)` | `rgb(255, 255, 255)` | `rgb(0, 0, 0)` |
| 003 / wasteland | rest, hover | `rgb(255, 255, 255)` | `rgb(255, 255, 255)` | `rgb(0, 0, 0)` |
| 001 / brutalism | rest, hover | `rgb(0, 0, 0)` | `rgb(0, 0, 0)` | `rgb(255, 255, 255)` |

Quiet stamps compute at 12.24px. The pressed stamp computes at 20.16px.

## Glyph pixels

Coordinates are PNG pixels, origin at the top left.

| stamp | role | x | y | sampled | token |
| --- | --- | --- | --- | --- | --- |
| 002 / flesh | glyph | 1406 | 430 | 255, 255, 255 | chalk `#FFFFFF` |
| 002 / flesh | plate behind the glyph | 1392 | 409 | 0, 0, 0 | void `#000000` |
| 003 / wasteland | glyph | 1401 | 700 | 255, 255, 255 | chalk `#FFFFFF` |
| 003 / wasteland | plate behind the glyph | 1392 | 694 | 0, 0, 0 | void `#000000` |
| 001 / brutalism | glyph | 1404 | 74 | 0, 0, 0 | void `#000000` |
| 001 / brutalism | plate behind the glyph | 1387 | 55 | 255, 255, 255 | chalk `#FFFFFF` |

The quiet stamps are thin, so some edge pixels are grayscale coverage rather than a solid token. They stay on the gray axis. Two samples from 002 / flesh:

| x | y | sampled | channels |
| --- | --- | --- | --- |
| 1402 | 443 | 254, 254, 254 | equal |
| 1409 | 454 | 2, 2, 2 | equal |

Round 3’s still of the same column had chromatic edge pixels such as 167, 231, 255 and 255, 231, 167. This still has none. The 180° stamp is axis-aligned, so Chromium was still LCD-rasterising it after `-webkit-font-smoothing: antialiased`. The button already rotates; `will-change: transform` promotes that layer and the smoothing stays on the token.
