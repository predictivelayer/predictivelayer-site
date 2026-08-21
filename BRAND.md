# Predictive Layer — brand notes

Everything here is already wired into `styles.css` as custom properties.
Change a value in the `:root` block and it propagates across all five pages.

## Colour

Cool light page, navy ink, one accent: deep teal. The teal is for accents,
links and data. It is never the primary button.

| Token         | Hex       | Use                                              |
| ------------- | --------- | ------------------------------------------------ |
| `--sand`      | `#0f6b5c` | Fills. Status dot, tick marks, scored column.    |
| `--sand-2`    | `#0c574b` | Deeper teal. Hover and secondary fills.          |
| `--sand-text` | `#0a5c4f` | Text and links. The accent word in the headline. |
| `--sand-soft` | `#1a8a78` | Lifted teal. Rolling cells, soft emphasis.       |
| `--sand-deep` | `#0a3d34` | Reserved. Dark teal blocks.                      |

The token names say sand and the values are teal-green. That is history, not
intent: the palette moved and the names did not. Renaming them touches every
file, so it is a job for the next big change rather than a patch.

Primary buttons are **navy fill with white text**, not teal. One button per
page is the loudest thing on it, and teal is doing work elsewhere.

| Token         | Hex       | Use                                       |
| ------------- | --------- | ----------------------------------------- |
| `--bg`        | `#eef1f5` | Page. Cool slate.                         |
| `--bg-2`      | `#f7f8fb` | Soft inset surfaces                       |
| `--panel`     | `#ffffff` | Cards, nav, table headers                 |
| `--panel-2`   | `#e8ecf2` | Hover, inset controls                     |
| `--line`      | `#cfd6e0` | Borders                                   |
| `--line-soft` | `#e2e7ee` | Dividers inside panels                    |
| `--ink`       | `#0b1628` | Headings                                  |
| `--ink-2`     | `#3a4658` | Body text                                 |
| `--muted`     | `#667385` | Secondary and supporting text             |

Supporting colours, each with one job:

| Token     | Hex       | Use                                                        |
| --------- | --------- | ---------------------------------------------------------- |
| `--blue`  | `#2f5fbf` | Second state. "not yet", low intent.                        |
| `--amber` | `#b7791f` | Caution. Low confidence, a subsampled run.                  |
| `--red`   | `#c43c42` | Errors and destructive actions only. Never a data category. |

Never pair red with green to mean two categories in a table. Red and green is
the pair roughly one man in twelve cannot separate. Blue against teal is the
pair we ship, and the word is always there as well as the colour.

## Contrast, measured

| Pair                            | Ratio | AA normal text |
| ------------------------------- | ----- | -------------- |
| `--sand-text` on `--bg`         | 5.9+  | pass           |
| `--sand-text` on `--panel`      | 6.3+  | pass           |
| `--ink-2` on `--bg`             | 7.0+  | pass           |
| `--muted` on `--panel`          | 4.6+  | pass           |
| white on the navy button        | 16.0+ | pass           |

`--muted` is the tightest pair on the site. Anything lighter than `#667385`
fails AA on a white panel, so treat that value as a floor rather than a
preference.

## Atmosphere

A soft teal–navy radial wash sits behind the top of every page, plus a faint
diagonal grain. Opacity stays low so it reads as depth, not decoration.

## Type

- **Wordmark**: Space Grotesk 600, self-hosted at `wordmark.woff2`. Subset to
  the sixteen characters of "Predictive Layer", so it weighs 1.4KB. SIL Open
  Font License. To change the wordmark text you must re-subset the font.
- **Headings**: IBM Plex Serif 500, self-hosted under `fonts/`. SIL OFL.
- **Body / UI**: IBM Plex Sans 400/500/600, self-hosted under `fonts/`. SIL OFL.
- No third-party font requests at runtime.
- Headings are weight 500, not bold. `h1` 3.2rem, `h2` 2.1rem.
- Letter-spacing on headings is `-0.022em`.

## Layout

- Everything is left-aligned. Container is 1120px.
- The nav is a floating rounded pill, inset 18px from the top.
- One accent phrase per headline, in `--sand-text`, using `.hl`.

## Motion

The hero demo plays once on load and stops on its last frame. It does not
loop. Under `prefers-reduced-motion` it renders the finished state straight
away and never animates.

## Rules we have been keeping

- No trackers, no analytics, no third-party requests of any kind.
- One CTA: Get in touch, to zfu126@gmail.com.
- The address is assembled in JavaScript at runtime, never in the HTML source.
- Plain English. No "revolutionary", no jargon where a short word works.
