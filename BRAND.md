# Predictive Layer — brand notes

Everything here is already wired into `styles.css` as custom properties.
Change a value in the `:root` block and it propagates across all five pages.

## Colour

The site is a deep warm brown with one colour: sand. Everything is drawn
from a single warm ramp, so nothing on the page is neutral grey and nothing
is pure black.

| Token         | Hex       | Use                                                    |
| ------------- | --------- | ------------------------------------------------------ |
| `--sand`      | `#c5b57c` | Fills. Primary button, status dot.                      |
| `--sand-2`    | `#9a8d5d` | Deeper sand. Held for hover and secondary fills.        |
| `--sand-text` | `#e2d6a3` | Text and links. The accent word in the headline.        |
| `--sand-soft` | `#f6e8c3` | Palest. Link hover.                                     |
| `--sand-deep` | `#5c4a29` | Reserved. Dark sand blocks.                             |

Primary buttons are sand fill with `#1c0f07` text, not white. Contrast 9.17,
comfortably past AA.

| Token         | Hex       | Use                                    |
| ------------- | --------- | -------------------------------------- |
| `--bg`        | `#1c0f07` | Page. Deep warm brown, not black.      |
| `--bg-2`      | `#22140a` | Demo panel                             |
| `--panel`     | `#271709` | Cards, nav, table headers              |
| `--panel-2`   | `#33200f` | Hover, inset controls                  |
| `--line`      | `#3d2814` | Borders                                |
| `--line-soft` | `#2c1b0d` | Dividers inside panels                 |
| `--ink`       | `#f6e8c3` | Headings. Warm cream, never pure white |
| `--ink-2`     | `#c9bda0` | Body text                              |
| `--muted`     | `#a2957c` | Secondary and supporting text          |

Supporting colours, each with one job:

| Token     | Hex       | Use                                                        |
| --------- | --------- | ---------------------------------------------------------- |
| `--blue`  | `#5b93d6` | Second state. "not yet", low intent. Cool on purpose so it separates from the warm brand. |
| `--amber` | `#d9962b` | Caution. Low confidence, a subsampled run.                  |
| `--red`   | `#e5484d` | Errors and destructive actions only. Never a data category. |

Never pair red with the brand colour to mean two categories in a table.
Blue against sand is the pair we ship.

## Glow

A warm radial gradient sits behind the top of every page, at `.30` opacity
in the centre. It is deliberately visible, not a subtle wash.

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
