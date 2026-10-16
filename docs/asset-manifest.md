# Asset manifest

No original assets could be recovered (see `docs/source-inventory.md`). Every visual asset in the build is either
generated in code or a licensed open-source font, and every brand asset is **provisional**.

| ID | Asset | Original source | Local destination | Usage | Format / size | Alt text | Licence / status |
|---|---|---|---|---|---|---|---|
| A-01 | Logo / wordmark | Not recovered | `components/Wordmark.tsx` (inline SVG + text) | Header, footer | SVG 22×22 + text | Link label "Vidran Labs — home"; mark is decorative | Provisional — replace with approved logo |
| A-02 | Favicon | Not recovered | `app/icon.svg` | Browser tab | SVG 32×32 | n/a | Provisional |
| A-03 | Inter Variable | Google Fonts / rsms (OFL) | `node_modules/@fontsource-variable/inter` → self-hosted by Next | All text | WOFF2, subset per unicode-range | n/a | SIL OFL 1.1 — provisional choice |
| A-04 | JetBrains Mono Variable | JetBrains (OFL) | `node_modules/@fontsource-variable/jetbrains-mono` | Labels, metadata | WOFF2 | n/a | SIL OFL 1.1 — provisional choice |
| A-05 | Social preview image | Not recovered | `app/opengraph-image.tsx` (generated PNG) | `og:image`, `twitter:image` | PNG 1200×630 | "Vidran Labs — Technology for Systems That Matter." | Provisional |
| A-06 | Sage hero grid texture | New | CSS gradient (`.hero--grid`) | Sage overview hero | CSS | Decorative | New, no licence needed |
| A-07 | UI icons (chevron, arrow, info, menu) | New | `components/icons.tsx`, `Header.tsx` | Navigation, CTAs, notices | Inline SVG | `aria-hidden` | New |
| A-08 | Select chevron | New | `styles/components.css` (data URI) | Form selects | SVG data URI | Decorative | New |

## Missing original assets (to be supplied)

| Expected asset | Where it belongs |
|---|---|
| Primary and secondary logo (SVG), brand mark | `components/Wordmark.tsx`, `app/icon.svg`, OG image |
| Brand colour values and typefaces | `styles/tokens.css` (`--color-*`, `--font-*`) |
| Hero / brand imagery | Home hero, Company, Mission (no slot rendered until supplied) |
| Sage interface imagery | `/products/sage/` and `/products/sage/interface/` (pending notice currently shown) |
| Research artwork, article thumbnails | Insights list and article pages |
| Social preview images per page | `opengraph-image` per route segment |
| Downloadable resources (PDFs, fact sheets) | Newsroom, Institutional & procurement |

No stock photography or third-party hotlinked imagery is used. When raster images are added, use `next/image` with
explicit `width`/`height` (or `fill` + aspect-ratio container) to keep CLS at 0, and record each here.
