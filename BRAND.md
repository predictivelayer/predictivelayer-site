# Predictive Layer — brand notes

Everything here is already wired into `styles.css` as custom properties.
Change a value in the `:root` block and it propagates across all five pages.

## Colour

The site is black and greyscale with one colour: green. It is sampled from
cartesia.ai, which is the reference we picked.

| Token          | Hex       | Use                                                        |
| -------------- | --------- | ---------------------------------------------------------- |
| `--green`      | `#309d4b` | Fills. Primary button, logo mark, status dot.               |
| `--green-2`    | `#277f3d` | Hover state for the primary button.                         |
| `--green-text` | `#4fbc6c` | Text and links. Lifted so it stays readable on black.       |
| `--green-deep` | `#1f4d2d` | Reserved. Dark green blocks, if we ever want one.           |
| `--green-soft` | `#c1e6c6` | Pale tint. Link hover.                                      |

Do not set small text in `--green`. On black it sits near the readable
limit. That is what `--green-text` is for.

| Token         | Hex       | Use                                    |
| ------------- | --------- | -------------------------------------- |
| `--bg`        | `#000000` | Page                                   |
| `--bg-2`      | `#060606` | Demo panel                             |
| `--panel`     | `#0c0c0c` | Cards, nav, table headers              |
| `--panel-2`   | `#131313` | Hover, inset controls                  |
| `--line`      | `#1e1e1e` | Borders                                |
| `--line-soft` | `#161616` | Dividers inside panels                 |
| `--ink`       | `#ffffff` | Headings                               |
| `--ink-2`     | `#a3a3a3` | Body text                              |
| `--muted`     | `#6e6e6e` | Secondary and supporting text          |

## Type

- **Wordmark**: Space Grotesk 600, self-hosted at `wordmark.woff2`. Subset to
  the sixteen characters of "Predictive Layer", so it weighs 1.4KB. SIL Open
  Font License. To change the wordmark text you must re-subset the font.
- **Everything else**: the system stack. No webfont, no third-party request.
- Headings are weight 500, not bold. `h1` 3.2rem, `h2` 2.1rem.
- Letter-spacing on headings is `-0.022em`.

## Layout

- Everything is left-aligned. Container is 1120px.
- The nav is a floating rounded pill, inset 18px from the top.
- One accent phrase per headline, in `--green-text`, using `.hl`.

## Rules we have been keeping

- No trackers, no analytics, no third-party requests of any kind.
- One CTA: Get in touch, to zfu126@gmail.com.
- Plain English. No "revolutionary", no jargon where a short word works.
