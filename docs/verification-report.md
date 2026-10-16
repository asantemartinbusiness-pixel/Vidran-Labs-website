# Verification report

**Date:** 16 October 2026 · **Build:** Next.js 16.4.2 production build, review configuration
(`SITE_INDEXING=off`, `NEXT_PUBLIC_CONTENT_REVIEW=on`) · **Environment:** Linux container, Node 22.22,
Chromium 141 (Playwright 1.56 build 1194). Results below were produced by the commands shown and were not
edited by hand.

## 1. Summary

| Check | Result |
|---|---|
| TypeScript strict (`npm run typecheck`) | Pass, 0 errors |
| Unit tests (`npm test`) | **38 / 38 pass** (4 files) |
| Production build (`npm run build`) | Pass, 36 content routes prerendered (34 at 200, `/opps/` as 404, plus 2 articles) |
| End-to-end (`npm run test:e2e`) | **182 pass, 0 fail**, 13 skipped (device-specific tests skipped on the other project) |
| Automated accessibility (axe-core 4.14, WCAG 2.0/2.1/2.2 A+AA + best practice) | **0 violations** on all 35 routes + 404, mobile menu, form error state and cookie dialog |
| Link check (crawl of every page) | 35 internal targets, 9 mailto links, 0 external, **0 broken** |
| Horizontal overflow at 320 / 375 / 430 / 768 / 1024 / 1440 / 1920 px | **None** on any page |
| `npm audit` | 0 vulnerabilities |
| Release gate (`npm run check:release`) | **FAIL (intended)** — 82 blockers listed; see §5 |

## 2. What the e2e suite proves

- **Routes:** every route returns 200, has exactly one `h1`, no skipped heading levels, header/main/footer
  landmarks, self-canonical, meta description, Open Graph tags, no console errors; titles unique.
- **Status codes:** unknown URLs 404 with the error design; `/opps/` 404 with its original content; legacy URLs
  307 to proposed destinations; non-slash URLs 308.
- **Navigation (desktop):** skip link; dropdown state, Escape returns focus, keyboard Tab through and out
  closes; single open menu; outside click; active section; `aria-current`; Sage sidebar (11 links) and pager.
- **Navigation (mobile):** open/expand/navigate/close; background `inert`; panel geometry under header;
  Escape returns focus; same-page links and skip link close the menu; current section marked; Sage disclosure.
- **Forms:** all 9 pathways render with labelled controls and correct direct mailto; empty submission → focused
  summary with correct count and field links; errors clear on correction; email-length error persists until
  fixed; valid submission → exact RFC 6068 mailto (subject, CRLF body, Unicode, `&`), focused truthful status,
  no double submission, Start over refocuses; maxlength; URL validation.
- **Consent:** no banner (no optional cookies); dialog opens from footer, Escape closes, focus returns.
- **Security/SEO:** CSP and hardening headers; no third-party requests; sitemap contents; review builds not
  indexable; JSON-LD types; OG image served.
- **Motion:** transitions disabled under `prefers-reduced-motion`.

## 3. Performance (Lighthouse 12.8, simulated throttling)

Mobile = Moto G Power emulation, Slow 4G, 4× CPU. Desktop = desktop preset. SEO is 66 only because review
builds are deliberately `noindex`; an indexing-enabled build of the homepage scored **SEO 100, Performance 98,
Accessibility 100, Best Practices 100**.

| Page | Form | Perf | A11y | BP | FCP | LCP | CLS | TBT | Transfer |
|---|---|---|---|---|---|---|---|---|---|
| `/` | mobile | 98 | 100 | 100 | 1.4 s | 2.1 s | 0 | 90 ms | 282 KiB |
| `/` | desktop | 100 | 100 | 100 | 0.4 s | 0.6 s | 0 | 0 ms | 292 KiB |
| `/products/sage/` | mobile | 96 | 100 | 100 | 1.4 s | **2.6 s** | 0 | 60 ms | 283 KiB |
| `/products/sage/` | desktop | 100 | 100 | 100 | 0.4 s | 0.6 s | 0 | 0 ms | 350 KiB |
| `/products/sage/roadmap/` | mobile | 97 | 100 | 100 | 1.4 s | 2.5 s | 0 | 50 ms | 277 KiB |
| `/products/sage/roadmap/` | desktop | 100 | 100 | 100 | 0.4 s | 0.6 s | 0 | 0 ms | 349 KiB |
| `/start-a-project/` | mobile | 98 | 100 | 100 | 1.4 s | 2.2 s | 0 | 50 ms | 271 KiB |
| `/start-a-project/` | desktop | 100 | 100 | 100 | 0.4 s | 0.6 s | 0 | 0 ms | 291 KiB |
| `/insights/` | mobile | 95 | 100 | 100 | 1.4 s | **2.8 s** | 0 | 90 ms | 274 KiB |
| `/insights/` | desktop | 100 | 100 | 100 | 0.4 s | 0.6 s | 0 | 0 ms | 308 KiB |
| Article | mobile | 96 | 100 | 100 | 1.4 s | **2.6 s** | 0 | 40 ms | 269 KiB |
| Article | desktop | 100 | 100 | 100 | 0.4 s | 0.6 s | 0.007 | 0 ms | 364 KiB |

**Against targets:** Performance ≥ 90 ✓ on all. Accessibility ≥ 95 ✓. CLS ≤ 0.1 ✓. TBT (INP proxy) low ✓.
Mobile LCP ≤ 2.5 s: **met on 3 of 6 templates in the lab; 2.6–2.8 s on 3.** These are lab numbers on a local
server, not field (CrUX p75) data, which cannot exist until the site is live.

Likely cause and fix: the LCP element is the hero heading, which repaints when the self-hosted variable fonts
swap in. Recommended follow-up: load the same WOFF2 files through `next/font/local` (adds preload and a
metric-matched fallback, removing the swap repaint) and subset to Latin. Not done in this pass because the
typefaces themselves are provisional (G-06).

## 4. Accessibility beyond automation

See `docs/functionality-matrix.md` → Manual QA. Performed: tab order, focus visibility on all surfaces,
forced-colors focus, 200% zoom equivalent, error handling, mobile focus containment. **Not performed:**
screen-reader testing with real assistive technology, Firefox/Safari. Automated checks are not proof of WCAG
conformance; an independent audit is recommended before publication.

## 5. Release gate

`npm run check:release` lists every blocker: provisional blocks and metadata on 33 pages, two articles pending
recovery, nine unconfirmed recipients, three unapproved redirects. It runs automatically before every
production-configured build (`prebuild`), so these cannot be deployed by accident.

## 6. Adversarial review and corrective actions

An independent reviewer agent tested the build (security, accessibility, UX/QA, content honesty). Findings and
outcomes:

| # | Sev. | Finding | Outcome |
|---|---|---|---|
| 1 | High | Release gate not enforced on `next build`/Vercel | **Fixed** — `prebuild` gate for production-configured builds; verified both ways |
| 2 | High | Some drafted copy labelled `brief`, bypassing the gate | **Fixed** — 10 blocks relabelled `provisional`; home/Sage hero ledes cut back to brief-only wording; all drafted metadata marked provisional |
| 3 | High | No focus indicator in forced-colors mode | **Fixed** — transparent outline + forced-colors `CanvasText` outline; verified |
| 4 | Med | Mobile menu stuck open on same-page links | **Fixed** + regression test |
| 5 | Med | `javascript:` links possible via Markdown; raw HTML passed by `markdown()` | **Fixed** — URL allow-list, HTML escaped; unit tests |
| 6 | Med | Inline Markdown double-escaped | **Fixed**; unit test |
| 7 | Med | "Start over" dropped focus to `<body>` | **Fixed** + regression test |
| 8 | Med | Docs referenced missing files; consent copy overstated storage | **Fixed** — `check:links` removed (link check is in e2e), `security-review.md` written, copy corrected |
| 9 | Low | No security.txt; reports go to provisional address | Documented as G-13 |
| 10 | Low | `/opps/` was a soft-404 (200) | **Fixed** — real 404 with original content |
| 11 | Low | Thin pending articles in sitemap | **Fixed** — excluded and `noindex` until recovered |
| 12 | Low | Skip link failed with mobile menu open | **Fixed** + regression test |
| 13 | Low | Footer year fixed at build | Accepted, documented G-14 |
| 14 | Low | Email-length error cleared prematurely | **Fixed** + regression test; limit explained in form inventory |
| — | Note | Bidi override characters passed through | **Fixed** + unit test |

Additional defects found by our own manual QA and fixed: mobile menu clipped by a `backdrop-filter` containing
block (all mobile visitors affected; the automated suite had missed it — geometry assertion added); low-contrast
focus ring on dark surfaces; unnatural required-field messages ("Enter area of work").

## 7. Visual verification

Source pages could not be inspected, so **fidelity to the original design is UNVERIFIED for every page** (G-08).
Screenshots of the reconstruction for review: `docs/evidence/` (10 templates at 375 px and 1440 px, dropdown,
form errors, cookie dialog, mobile menu, focus states, 200% zoom).

## 8. Cross-browser

Chromium only (desktop 1440 and Pixel 7 emulation). Firefox and WebKit were not available in this environment.
