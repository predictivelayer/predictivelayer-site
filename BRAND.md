# Predictive Layer — brand notes

Everything here is already wired into `styles.css` as custom properties.
Change a value in the `:root` block and it propagates across all five pages.

## Colour

Cool institutional paper, navy ink, one accent: muted gold. Aimed at PE and
diligence readers. Gold is for accents, links and scored data — never the
primary button.

| Token         | Hex       | Use                                              |
| ------------- | --------- | ------------------------------------------------ |
| `--sand`      | `#8f7340` | Fills. Status dot, tick marks, scored column.    |
| `--sand-2`    | `#735c33` | Deeper gold. Hover and secondary fills.          |
| `--sand-text` | `#6a542d` | Text and links. The accent word in the headline. |
| `--sand-soft` | `#a8894c` | Lifted gold. Rolling cells, soft emphasis.       |
| `--sand-deep` | `#3f3118` | Reserved. Dark gold blocks.                      |

The token names say sand; the values are gold. That is history, not intent.

Primary buttons are **navy fill with white text**. One button per page is the
loudest thing on it; gold does work elsewhere.

| Token         | Hex       | Use                                       |
| ------------- | --------- | ----------------------------------------- |
| `--bg`        | `#f4f5f7` | Page. Cool institutional paper.           |
| `--bg-2`      | `#eef0f3` | Soft inset surfaces                       |
| `--panel`     | `#ffffff` | Cards, nav, table headers                 |
| `--panel-2`   | `#e8ebf0` | Hover, inset controls                     |
| `--line`      | `#c8ced8` | Borders                                   |
| `--line-soft` | `#e1e4ea` | Dividers inside panels                    |
| `--ink`       | `#0a1628` | Headings                                  |
| `--ink-2`     | `#3a4658` | Body text                                 |
| `--muted`     | `#667385` | Secondary and supporting text             |

Supporting colours, each with one job:

| Token     | Hex       | Use                                                        |
| --------- | --------- | ---------------------------------------------------------- |
| `--blue`  | `#2a4a7a` | Second state. "not yet", low intent.                        |
| `--amber` | `#a06b1a` | Caution. Low confidence, a subsampled run.                  |
| `--red`   | `#b03a3f` | Errors and destructive actions only. Never a data category. |

Never pair red with green to mean two categories in a table. Steel blue
against gold is the pair we ship, and the word is always there as well as
the colour.

## Atmosphere

A faint navy radial behind the top of the page only. No coloured glow, no
grain. Restraint reads as trust.

## Type

- **Wordmark**: Space Grotesk 600, self-hosted at `wordmark.woff2`. Subset to
  the sixteen characters of "Predictive Layer", so it weighs 1.4KB. SIL Open
  Font License. To change the wordmark text you must re-subset the font.
- **Everything else**: IBM Plex Sans 400/500/600, self-hosted under `fonts/`.
  SIL OFL. No decorative serif — deal-memo clarity over editorial flourish.
- No third-party font requests at runtime.
- Headings are weight 500, not bold. `h1` 3.2rem, `h2` 2.1rem.
- Letter-spacing on headings is `-0.025em`.

## Layout

- Everything is left-aligned. Container is 1120px.
- The nav is a floating bar, inset 18px from the top, 6px radius.
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
