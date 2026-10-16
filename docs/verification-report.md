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
| End-to-end (`npm run test:e2e`) | **182 pass, 0 fail**, 13 skipped (device-specific tests skipped on the other project). Re-run after the redesign. |
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

Measured after the vellum/carbon redesign. Mobile is Moto G Power emulation on Slow 4G with 4× CPU throttling;
desktop uses the desktop preset. SEO scores 66 only because review builds are deliberately `noindex`. An
indexing-enabled build previously scored SEO 100.

| Page | Form | Perf | A11y | BP | FCP | LCP | CLS | TBT | Transfer |
|---|---|---|---|---|---|---|---|---|---|
| `/` | mobile | 97 | 100 | 100 | 1.3 s | 2.5 s | 0 | 80 ms | 237 KiB |
| `/` | desktop | 100 | 100 | 100 | 0.3 s | 0.5 s | 0 | 0 ms | 251 KiB |
| `/products/sage/` | mobile | 95 | 100 | 100 | 1.2 s | 2.5 s | 0 | 150 ms | 242 KiB |
| `/products/sage/` | desktop | 100 | 100 | 100 | 0.3 s | 0.6 s | 0 | 0 ms | 288 KiB |
| `/products/sage/roadmap/` | mobile | 98 | 100 | 100 | 1.2 s | 2.3 s | 0 | 70 ms | 237 KiB |
| `/products/sage/roadmap/` | desktop | 100 | 100 | 100 | 0.3 s | 0.5 s | 0 | 0 ms | 308 KiB |
| `/start-a-project/` | mobile | 97 | 100 | 100 | 1.2 s | 2.4 s | 0 | 110 ms | 231 KiB |
| `/start-a-project/` | desktop | 100 | 100 | 100 | 0.3 s | 0.5 s | 0 | 0 ms | 250 KiB |
| `/insights/` | mobile | 99 | 100 | 100 | 1.2 s | 1.8 s | 0 | 120 ms | 233 KiB |
| `/insights/` | desktop | 100 | 100 | 100 | 0.3 s | 0.5 s | 0 | 0 ms | 293 KiB |
| Article | mobile | 97 | 100 | 100 | 1.2 s | 2.5 s | 0 | 100 ms | 229 KiB |
| Article | desktop | 100 | 100 | 100 | 0.3 s | 0.6 s | 0 | 0 ms | 308 KiB |

**Against targets:**

- Performance ≥ 90: met on all pages ✓
- Accessibility ≥ 95: met ✓
- CLS ≤ 0.1: met ✓
- TBT, used as a proxy for INP: low ✓
- **Mobile LCP ≤ 2.5 s: now met on all 6 templates in the lab** (1.8–2.5 s). Before the redesign, three templates
  measured 2.6–2.8 s. Removing the second typeface cut about 45 KiB per page.

These are lab numbers from a local server. Field data (CrUX p75) can't exist until the site is live. Three
templates sit right at the 2.5 s limit, so loading the font through `next/font/local` (preload plus metric-matched
fallback) is still a worthwhile safety margin.

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

Defects caught by the suite during the vellum/carbon redesign, all fixed:

- The Sage pager overflowed by 24px at 320px. It now stacks below 560px.
- Error-summary links were only 20px tall under the tighter 1.3 leading (WCAG 2.5.8). They are now at least 24px.
- The mobile-panel geometry test measured during the slide-in animation. It now waits for the animation to finish,
  and passed 35/35 under 6-way parallel load.

Additional defects found by our own manual QA and fixed: mobile menu clipped by a `backdrop-filter` containing
block (all mobile visitors affected; the automated suite had missed it — geometry assertion added); low-contrast
focus ring on dark surfaces; unnatural required-field messages ("Enter area of work").

## 7. Visual verification

Source pages could not be inspected, so **fidelity to the original design is UNVERIFIED for every page** (G-08).
Screenshots of the reconstruction for review: `docs/evidence/` (10 templates at 375 px and 1440 px, dropdown,
form errors, cookie dialog, mobile menu, focus states, 200% zoom).

## 8. Cross-browser

Chromium only (desktop 1440 and Pixel 7 emulation). Firefox and WebKit were not available in this environment.
