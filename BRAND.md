# Predictive Layer — brand notes

Everything here is already wired into `styles.css` as custom properties.
Change a value in the `:root` block and it propagates across all five pages.

## Colour

Black page, neutral greys, one colour: green. The green is for accents,
links and data. It is never the primary button.

| Token         | Hex       | Use                                              |
| ------------- | --------- | ------------------------------------------------ |
| `--sand`      | `#309d4b` | Fills. Status dot, tick marks, scored column.    |
| `--sand-2`    | `#277f3d` | Deeper green. Hover and secondary fills.         |
| `--sand-text` | `#4fbc6c` | Text and links. The accent word in the headline. |
| `--sand-soft` | `#c1e6c6` | Palest. Link hover.                              |
| `--sand-deep` | `#1f4d2d` | Reserved. Dark green blocks.                     |

The token names say sand and the values are green. That is history, not
intent: the palette moved and the names did not. Renaming them touches every
file, so it is a job for the next big change rather than a patch.

Primary buttons are **white fill with black text**, not green. One button per
page is the loudest thing on it, and green is doing work elsewhere.

| Token         | Hex       | Use                                       |
| ------------- | --------- | ----------------------------------------- |
| `--bg`        | `#000`    | Page. True black.                         |
| `--bg-2`      | `#080808` | Demo panel                                |
| `--panel`     | `#0c0c0c` | Cards, nav, table headers                 |
| `--panel-2`   | `#131313` | Hover, inset controls                     |
| `--line`      | `#1e1e1e` | Borders                                   |
| `--line-soft` | `#161616` | Dividers inside panels                    |
| `--ink`       | `#fff`    | Headings                                  |
| `--ink-2`     | `#a3a3a3` | Body text                                 |
| `--muted`     | `#808080` | Secondary and supporting text             |

Supporting colours, each with one job:

| Token     | Hex       | Use                                                        |
| --------- | --------- | ---------------------------------------------------------- |
| `--blue`  | `#4a86e8` | Second state. "not yet", low intent.                        |
| `--amber` | `#d9962b` | Caution. Low confidence, a subsampled run.                  |
| `--red`   | `#e5484d` | Errors and destructive actions only. Never a data category. |

Never pair red with green to mean two categories in a table. Red and green is
the pair roughly one man in twelve cannot separate. Blue against green is the
pair we ship, and the word is always there as well as the colour.

## Contrast, measured

| Pair                            | Ratio | AA normal text |
| ------------------------------- | ----- | -------------- |
| `--sand-text` on `--bg`         | 8.74  | pass           |
| `--sand-text` on `--panel`      | 8.14  | pass           |
| `--ink-2` on `--bg`             | 8.33  | pass           |
| `--muted` on `--panel`          | 4.95  | pass           |
| `--muted` on `--panel-2`        | 4.70  | pass           |
| black on the white button       | 21.0  | pass           |
| black on the button hover       | 14.9  | pass           |

`--muted` is the tightest pair on the site. Anything darker than `#808080`
fails AA on a panel, so treat that value as a floor rather than a preference.

## Glow

A green radial gradient sits behind the top of every page, `.13` opacity in
the centre falling to nothing by 74%. On true black anything stronger reads as
a smear rather than a light source.

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
