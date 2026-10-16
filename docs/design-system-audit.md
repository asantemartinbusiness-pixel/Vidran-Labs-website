# Design system audit

## Direction

**"Factory-floor blueprint on warm vellum."** The site uses a monochrome, instrument-like visual language. Hierarchy
comes from scale, spacing and shape, never from colour. It was adopted at Vidran Labs' request from a style
reference (T1 Energy's public site, `t1energy.com`).

**We adopted the aesthetic only.** We did not take the reference's name, logo, copy, imagery or proprietary
typeface. The Vidran Labs identity (wordmark, content, positioning) is unchanged.

The original Vidran Labs brand assets are still unrecovered (G-06), so this system is the working identity until
approved assets exist. Visual fidelity to the *original* vidran.net is still unverified (G-08).

## Foundations (`styles/tokens.css`)

| Category | Decision | Notes |
|---|---|---|
| Surfaces (tonal elevation) | L0 Vellum `#f0efe9` → L1 Paper White `#ffffff` → L2 Carbon Warm `#322d2a` → L3 Onyx Depth `#0f0e12` | No shadows anywhere. Depth comes from tone alone. |
| Text | Carbon Warm on vellum (11.8:1) | Pure black is never used for text. |
| Secondary text | **Carbon Muted `#6a635e`** (derived) | The reference's Mercury `#8b8b8b` is 2.96:1 on vellum, which fails WCAG AA. The derived warm grey gives 5.1:1 on vellum and 5.9:1 on white. Mercury is kept for decorative and disabled use only. |
| On-dark text | White; muted `#b9b4ae` | Muted is 6.6:1 on carbon and 7.6:1 on onyx. |
| Accent | **None** | The site is monochrome by design. |
| Error (functional exception) | `#9b2c2c` | Used only for form errors (6.5:1 on vellum), and always paired with text and a thicker border. |
| Typeface | One family: Inter Variable, self-hosted | Inter is the reference's documented substitute for its proprietary sans. The second (mono) typeface was removed. |
| Weights | 300 for display and headings; 400 for everything else; 500 only for inline `<strong>` | No bold headlines. |
| Type scale | label 12 · body-sm 14 · body 16 · subheading 22 · heading 26→32 · display 36→52 | Display line-height 1.0, body 1.3–1.4. Tracking 0.01em throughout; labels use 0.12em. Headings use `clamp()` so they fit at 320px. |
| Spacing | 4px base: 4, 8, 12, 16, 24, 36, 48, 60, 96, 120 | 48px section rhythm, 22px card padding, 8px gap between elements. |
| Layout | 1200px maximum content width; 5/7 editorial split on desktop | |
| Radii | small 8 · body 12 · nav 16 · porthole panels 80 (scaling down to 32 on phones) · pills 100 | Nothing below 8px on containers. |
| Focus | 2px vellum gap + 2px carbon ring; inverted on dark surfaces; `CanvasText` outline in forced-colors mode | Verified in `docs/evidence/`. |
| Targets | 44px minimum for buttons, nav and form controls; at least 24px for inline links | Tested (WCAG 2.5.8). |
| Motion | 120 / 220 / 320 ms with `cubic-bezier(.2,0,0,1)`; durations become 0 under reduced motion | Tested. |

## Signature devices

1. **Whisper-light display.** Headlines are 300 weight at up to 52px, with a line-height of 1.0.
2. **Square section label.** A 4px solid square comes before uppercase micro-type. The same square marks
   footer headings, notices, status chips and mobile sub-links.
3. **Porthole geometry.** Hero panels, CTA bands and the enquiry well use an 80px radius. Buttons, chips and the
   Sage navigation use 100px pills.

## Components

| Component | Treatment |
|---|---|
| Navigation | A floating Carbon pill (16px radius) holds the wordmark, links and a white pill CTA. The surrounding strip stays click-through. Dropdowns are white panels with a 1px carbon border and no shadow. |
| Mobile navigation | A full-height vellum panel with carbon hairline rows, light 22px labels, and 44px circular expand toggles. The page behind it is inert. |
| Hero (light) | Vellum background: label, then display headline, then muted 22px lede. |
| Hero (porthole) | An 80px-radius Carbon panel with a faint blueprint grid, white display type at bottom-left, and an Onyx caption card linking to Sage. **It stands in for the reference's full-bleed industrial photography until approved imagery exists.** |
| Buttons | A matched pill pair: filled Carbon and ghost outline. On dark surfaces they invert to white. |
| Cards | White, 12px radius, 8px gaps. On hover they invert to Carbon instead of lifting on a shadow. |
| Accordion (FAQ) | Carbon hairline rows with light 22px questions and a 40px circular +/− control. Built on native `<details>`. |
| Specification rows | Steps, definitions and the status table use carbon hairlines with light 22px terms. |
| Status chips | Monochrome pills whose fill encodes maturity: solid = in development, outline = planned, dashed = research or exploratory. The text label is always present. |
| Notices | A white 12px panel with a square label; "pending" notices use a dashed outline. |
| CTA band | An 80px-radius white porthole with display-size light headline. |
| Enquiry form | Sits in a white porthole well. Inputs have a vellum fill, a 1px carbon border and a 12px radius. Errors use a 2px red border plus text. The status panel is Carbon. |
| Sage section nav | Pill links with a Carbon pill marking the current page. On mobile it becomes a white `<details>` disclosure. The previous/next pager uses white cards that stack below 560px. |
| Footer | The full-width Onyx terminator, with the tagline set as light display type and square-labelled column headings. |
| Review markers | Monochrome dashed outlines with pill badges. They are hidden in production. |

## Deliberate deviations from the reference

| Reference | Here | Why |
|---|---|---|
| Mercury `#8b8b8b` for secondary text | `#6a635e` | WCAG 1.4.3 contrast |
| "No accent colours" | Dark red for form errors only | Errors must be unmistakable (WCAG 3.3.1). The red is always paired with text. |
| Full-bleed photography | Carbon blueprint panels | No approved Vidran imagery exists, and stock or borrowed photos are not acceptable |
| Weights 300/400 only | 500 for inline `<strong>` | Emphasis inside body copy needs some signal |
| 36px vertical nav padding | 72px-high pill with 12px padding | Keeps 8 nav items and a CTA on one line |
| Nav anchored top-right | Full-container-width pill | Fits the 8-item information architecture |

## Avoided by design

Shadows, gradients, accent hues, icon-per-card grids, illustrations, stock photography, bold headlines,
and sharp-cornered containers.
