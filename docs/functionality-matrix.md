# Functionality matrix

User journeys from mandate §19, with how each is implemented and verified. "E2E" = Playwright, desktop (1440px)
and mobile (Pixel 7) Chromium. All results from the run recorded in `docs/verification-report.md`.

| # | Journey | Implementation | Verification | Result |
|---|---|---|---|---|
| 1 | Arrive at the homepage | `/` static page | E2E routes: 200, one h1, metadata | Pass |
| 2 | Understand company and positioning | Home hero + capability grid; `/company/`, `/mission/` | Manual review; content provisional | Pass (content pending approval) |
| 3 | Navigate to every top-level page | Primary nav (8 items + CTA), footer (20 links) | Unit: every nav href resolves; E2E link crawl | Pass |
| 4 | Explore product and solution information | `/products/`, `/solutions/` | E2E routes + crawl | Pass |
| 5 | Explore industry capabilities | `/industries/` | E2E routes | Pass |
| 6 | Discover Sage | Home card, Products dropdown, `/products/` | E2E: dropdown → Sage | Pass |
| 7 | Navigate every Sage subpage | Sidebar (11 links, `aria-current`), mobile disclosure, prev/next pager, breadcrumbs | E2E desktop sidebar + pager; mobile disclosure | Pass |
| 8 | Read documentation and FAQs | `/products/sage/documentation/`, `/products/sage/faq/` (native accordion) | E2E FAQ expand/collapse | Pass |
| 9 | Access the early-access pathway | `/products/sage/early-access/` composer | E2E pathway render + direct link | Pass |
| 10 | Explore research and articles | `/research/`, `/research-agenda/`, `/insights/`, 2 articles | E2E routes; Article JSON-LD | Pass (article text pending) |
| 11 | Institutional & procurement | `/institutional-procurement/` composer | E2E | Pass |
| 12 | Start a project enquiry | `/start-a-project/` composer | E2E full validation + hand-off | Pass |
| 13 | Partnership enquiry | `/partnerships/` composer | E2E | Pass |
| 14 | Find support | `/support/` composer + guidance | E2E | Pass |
| 15 | Careers and media | `/careers/`, `/newsroom/` composers | E2E incl. URL validation | Pass |
| 16 | Privacy, accessibility, cookie, terms | Footer legal row on every page | E2E routes + crawl | Pass (legal text pending) |
| 17 | Use the site on mobile | Responsive layouts, mobile nav | E2E mobile project; overflow at 320/375/430/768/1024/1440/1920 on all 36 pages | Pass |
| 18 | Keyboard-only use | Skip link, focus rings, disclosure nav, dialog, form summary | E2E keyboard tests; manual check in §Manual QA | Pass |
| 19 | Recover from invalid URLs | Real 404 with error design + destinations; `/opps/` preserved | E2E 404 tests | Pass |
| 20 | Complete every interactive workflow | 9 enquiry pathways, nav, consent dialog, FAQ | E2E | Pass (recipients pending) |

## Interactive behaviours

| Behaviour | Where | Keyboard | Touch | Reduced motion | No-JS |
|---|---|---|---|---|---|
| Desktop dropdowns | Header ≥1100px | Enter/Space toggle, Tab through, Escape returns focus, focus-out closes | Tap toggles; outside tap closes | No animation | Top-level links still navigate |
| Mobile menu | Header <1100px | Escape closes → focus to toggle; background inert | 56px rows, 44px+ targets | Fade disabled | Menu button inert; footer nav covers all routes |
| Sage section nav | Sage pages | Standard links | Disclosure on mobile | — | Works (native `<details>`) |
| FAQ accordion | Sage FAQ | Native | Native | Icon transition disabled | Works |
| Enquiry composer | 9 pages | Full; error summary focus | 48px controls | — | `<noscript>` direct email link |
| Cookie settings | Footer | `<dialog>` focus containment, Escape | — | — | Button inert (no optional cookies exist) |
| Skip link | All pages | First Tab stop | — | — | Works |

## Manual QA checklist (performed in Chromium during development)

Performed with scripted Chromium checks (scripts kept out of the repo; results and screenshots in `docs/evidence/`):

- [x] Tab order follows visual order on `/start-a-project/` (skip link → logo → nav → CTA → breadcrumbs → fields → submit → footnote links → footer).
- [x] Focus ring visible on light, alt and dark surfaces (`focus-dark-hero.png`, `focus-footer.png`). The dark-surface ring was initially ~2.3:1 and was fixed to use the light accent.
- [x] Forced-colors (Windows High Contrast) mode: 2px `CanvasText` outline on focused buttons, card links and footer links (fixed after adversarial review).
- [x] 200% zoom equivalent (640 CSS px) on `/products/sage/roadmap/`: no horizontal overflow; the status table stacks; the only "clipped" nodes are intentionally visually-hidden table caption/header (`zoom-200-roadmap.png`).
- [x] Error summary focused, links move focus to fields; inline errors associated via `aria-describedby` (`form-errors-1440.jpg`).
- [x] Mobile menu: focus cannot reach content behind it in 30 Tab presses; panel fills the viewport under the header (`mobile-menu-375.png`). Initially broken (clipped by a `backdrop-filter` containing block) and fixed.
- [ ] Screen-reader pass with NVDA/JAWS/VoiceOver — **not performed** (no assistive technology available in this environment).
- [ ] Firefox and Safari/WebKit — **not tested** (only Chromium available in this environment).
- [ ] Real email client hand-off on iOS/Android/desktop — **not tested** (headless browser does not open mail apps).
