# Predictive Layer — brand notes

Everything here is already wired into `styles.css` as custom properties.
Change a value in the `:root` block and it propagates across all five pages.

## Colour

Demo pass inspired by [Forge Origination](https://forgeorigination.com/) Webflow
tokens: cream paper, charcoal ink, forest brand, yellow CTA.

| Token              | Hex       | Use                                              |
| ------------------ | --------- | ------------------------------------------------ |
| `--sand`           | `#154339` | Forest brand fills, status, scored column.       |
| `--sand-2`         | `#10362e` | Deeper forest. Hover.                            |
| `--sand-text`      | `#154339` | Links and the accent word in the headline.       |
| `--sand-soft`      | `#1c3f36` | Soft forest emphasis.                            |
| `--sand-deep`      | `#0f2f28` | Darkest forest.                                  |
| `--forge-yellow`   | `#f9f637` | Primary buttons and highlight tags.              |
| `--forge-yellow-ink` | `#3b3b33` | Label on yellow buttons.                       |

`--sand*` names are historical; values follow Forge’s brand green.

Primary buttons are **yellow fill with charcoal text** (Forge CTA). Forest
green does work on links, ticks, and scored data.

| Token         | Hex       | Use                                       |
| ------------- | --------- | ----------------------------------------- |
| `--bg`        | `#f8f8f3` | Page. Cream paper.                        |
| `--bg-2`      | `#f3f3ec` | Soft inset surfaces                       |
| `--panel`     | `#ffffff` | Cards, nav, table headers                 |
| `--panel-2`   | `#edede2` | Hover, inset controls                     |
| `--line`      | `#d4d4c8` | Borders                                   |
| `--line-soft` | `#e6e6da` | Dividers inside panels                    |
| `--ink`       | `#3b3b33` | Headings                                  |
| `--ink-2`     | `#5c5c52` | Body text                                 |
| `--muted`     | `#7a7a6e` | Secondary and supporting text             |

Supporting colours, each with one job:

| Token     | Hex       | Use                                                        |
| --------- | --------- | ---------------------------------------------------------- |
| `--blue`  | `#2a4a7a` | Second state. "not yet", low intent.                        |
| `--amber` | `#a06b1a` | Caution. Low confidence, a subsampled run.                  |
| `--red`   | `#b03a3f` | Errors and destructive actions only. Never a data category. |

Yellow is not used as the only cue for a data category — forest vs steel blue
carries state, with the word always present.

## Type

- **Wordmark**: Space Grotesk 600, self-hosted at `wordmark.woff2`.
- **Everything else**: IBM Plex Sans 400/500/600 under `fonts/`. SIL OFL.
- No third-party font requests at runtime.

## Layout

- Left-aligned. Container 1120px.
- Nav floating bar, 6px radius.
- One accent phrase per headline in `--sand-text` via `.hl`.

## Rules we have been keeping

- No trackers, no analytics, no third-party requests of any kind.
- One CTA: Get in touch, to zfu126@gmail.com.
- The address is assembled in JavaScript at runtime, never in the HTML source.
- Plain English. No "revolutionary", no jargon where a short word works.
