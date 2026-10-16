# Design system audit

## Source extraction

The original Elementor theme, colours, typography and layouts could not be inspected (domain offline, no export).
**No original design decision could be extracted.** The system below is a provisional, coherent foundation built to
the mandate's direction — editorial, technical, institutional; restrained; not a SaaS template — and structured so
the real brand values drop into tokens without touching components. Visual fidelity to the original is
**unverified** (G-08).

## Foundations — `styles/tokens.css`

| Category | Decision | Notes |
|---|---|---|
| Neutrals | Ink `#0d1117`, ink-2 `#39404a`, ink-3 `#5a626d`; paper `#f7f6f2`, paper-2 `#efede6`; surface `#fff`; rule `#d8d5cb` | Warm paper rather than pure white for an editorial feel. ink-3 on paper = 5.9:1 (AA for body text). |
| Accent | Deep green `#0b5c4a` (hover `#084638`); tint `#e3efe9` | One accent only. 7.4:1 on paper. Deliberately avoids blue/purple gradients. |
| Dark surfaces | Night `#0b0f14`, text `#ecebe6`, muted `#a7adb5`, accent `#86d3bc` | Footer and Sage hero. All ≥ 4.5:1. |
| Semantic | Info `#2f5674`/`#e8eef3`; pending `#8a5a00`/`#fbf1dc`; error `#a4161a`/`#fbe9e9` | Used by notices, form errors, review markers. |
| Status | Research (violet), In development (green), Planned (blue), Exploratory (ochre) | Always paired with a text label — colour is never the only signal. |
| Type families | Inter Variable (UI/body); JetBrains Mono Variable (eyebrows, metadata, labels) | Self-hosted, no third-party requests. Provisional until brand fonts supplied. |
| Type scale | xs 12 · sm 14 · base 17 · lg 20 · xl 20–24 fluid · 2xl 26–40 fluid · display 38–80 fluid | `clamp()` — no breakpoint jumps. Display tracking −0.035em. |
| Line height | 1.08 display · 1.25 headings · 1.62 body | Measure capped at 66ch. |
| Spacing | 4px base: 4, 8, 12, 16, 24, 32, 48, 64, 96; section rhythm `clamp(56px…112px)` | |
| Layout | Container 1240px + fluid gutter 16–40px; editorial 4/8 split ≥960px | Section heads sticky beside content on desktop. |
| Shape | 2px radius; 1px hairline rules | Ruled grids (shared borders) instead of floating rounded cards. |
| Focus | 2px paper + 2px accent ring on every interactive element | Visible on light and dark surfaces. |
| Targets | 44px minimum for buttons, nav, menu, form controls | Exceeds WCAG 2.5.8 (24px); tested. |
| Motion | 120/200/320ms, `cubic-bezier(.2,0,0,1)`; all durations → 0 under `prefers-reduced-motion` | Tested. No animation library. |
| Breakpoints | 640 · 720 · 900 · 960 · 1024 · 1100 (nav collapse) | Content-driven, not device-driven. |

## Components

| Component | Location | Notes |
|---|---|---|
| Global header, desktop nav, dropdowns | `components/Header.tsx` | Disclosure pattern (button + `aria-expanded`/`aria-controls`), not ARIA menu. Escape, outside click and focus-out close. Active section underline. |
| Mobile navigation | `components/Header.tsx` | Full-height panel, accordion sub-sections, background `inert`, scroll lock, Escape returns focus, auto-closes on route change and resize. |
| Breadcrumbs | `components/Breadcrumbs.tsx` | All pages except home/error; mirrored as BreadcrumbList JSON-LD. |
| Page hero / product hero | `Blocks.tsx` `hero` | Light (default) and dark grid variant (Sage). Compact variant for interior pages. |
| Section header | `Blocks.tsx` `Head` | Numbered mono eyebrow + heading + intro. |
| Editorial prose + pull-quote | `prose` block | |
| Capability / product / research cards | `cards` block | Ruled grid, 2–4 columns; whole-card link via stretched pseudo-element (single link per card). |
| Steps, definition list, status table | `steps`, `definitions`, `status` | Status table collapses to stacked rows < 720px. |
| FAQ / accordion | `faq` block | Native `<details>`/`<summary>` — works without JS. |
| Contact-route cards | `routes` block | |
| Enquiry form controls, error summary, status | `components/EnquiryComposer.tsx` | See `docs/form-inventory.md`. |
| Notices | `notice` block | Info and pending tones, `role="note"`. |
| CTA band | `cta` block | |
| Article list / empty state | `articles` block | |
| Sage contextual nav + pager | `components/SageNav.tsx` | Sticky sidebar ≥1024px; `<details>` disclosure on mobile; previous/next pager. |
| Cookie settings dialog / banner | `components/ConsentManager.tsx` | Native `<dialog>` (focus containment, Escape). Banner only renders when optional categories exist. |
| Footer | `components/Footer.tsx` | 4 link groups, legal row, cookie settings, legal entity. |
| Error page | `app/not-found.tsx` + `/opps/` content | |
| Review-mode markers | `styles/components.css` | Dashed outline + provenance badge; hidden when `NEXT_PUBLIC_CONTENT_REVIEW=off`. |

## Avoided by design

Glowing gradients, glassmorphism cards, floating decorative shapes, stock photography, icon-per-card grids,
animated counters, fabricated logos/testimonial strips, scroll-jacking.

## Brand-specialist review notes

- The system is coherent across all templates (verified by screenshots in `docs/evidence/`).
- Large empty right-hand space in the home hero at ≥1440px is intentional editorial whitespace; once approved
  imagery exists, a hero visual slot is the obvious addition.
- Because the identity is provisional, the most important next step for brand fidelity is receiving the logo,
  colour values and typefaces — expected change is limited to `tokens.css`, `Wordmark.tsx` and `app/icon.svg`.
