# Architecture

## Decision

**Next.js 16 (App Router) + React 19 + TypeScript (strict), every route statically generated, served by the Next.js
Node server (or any Next-compatible host such as Vercel).**

| Considered | Verdict | Reason |
|---|---|---|
| Static export (`output: "export"`) to any CDN | Rejected for now | Loses framework-level security headers, real 404 status and redirects; each would need host-specific config. Remains a viable fallback — the site has no server-only runtime code. |
| Headless WordPress | Rejected | Original WordPress is unavailable; re-introducing it adds hosting, patching and attack surface for a ~40-page site. |
| Headless CMS (Sanity/Contentful/etc.) | Deferred | The typed content model maps 1:1 to a CMS schema later; adding one now would be premature. |
| Tailwind CSS | Not used | A single token file + ~1,200 lines of component CSS is smaller and easier to rebrand than utility classes across components. |
| Server-side form handling | Not built | See `docs/form-inventory.md` — structured email avoids holding personal data. Contract documented. |

## Structure

```
app/
  layout.tsx            Root shell: fonts, skip link, review bar, header, main, footer, consent, Organization JSON-LD
  page.tsx              Home
  [...slug]/page.tsx    All other pages and articles; generateStaticParams + dynamicParams=false → unknown = 404
  not-found.tsx         Real 404 using the /opps/ design
  sitemap.ts robots.ts  Search infrastructure (indexing gated by SITE_INDEXING)
  opengraph-image.tsx   Generated social preview
  icon.svg
components/             Header, Footer, Blocks (block renderer), PageView, SageNav, Breadcrumbs,
                        EnquiryComposer, ConsentManager, JsonLd, Wordmark, icons
content/
  site.ts               Site identity, navigation, footer, contact routes, consent categories
  pages/*.ts            Page documents: ordered, typed blocks with provenance
  articles/*.md         Articles: front-matter + Markdown
  redirects.ts          Legacy redirects with approval status
lib/                    types, content registry, enquiry (validation/mailto), consent store, breadcrumbs, seo, paths, inline markdown
styles/                 tokens.css, base.css, components.css
scripts/                content-report.ts (release gate), route-manifest.ts
tests/unit tests/e2e    Vitest and Playwright suites
docs/                   Inventories, reviews, verification evidence
```

## Rendering & data flow

1. `lib/content.ts` assembles page documents and parses articles at build time.
2. `generateStaticParams` emits every known path; Next prerenders all 36 routes to HTML.
3. `PageView` chooses a template (standard, sage, legal, error) and renders blocks via `Blocks.tsx`.
4. Only three client components ship JavaScript: `Header` (nav state), `EnquiryComposer`, `ConsentManager`.
   Everything else is server-rendered HTML.

## Configuration

| Variable | Default | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://vidran.net` | Canonical URLs, sitemap, JSON-LD |
| `SITE_INDEXING` | `off` | `on` only for approved production: enables robots allow, removes `noindex` and `X-Robots-Tag` |
| `NEXT_PUBLIC_CONTENT_REVIEW` | `on` | Shows review bar and provenance markers; set `off` for production |

No secrets are required. `.env.example` documents all variables.

## Dependencies

Runtime: `next`, `react`, `react-dom`, `marked` (trusted Markdown), two `@fontsource-variable` fonts.
Dev: `typescript` 5.9, `vitest` 5, `@playwright/test` 1.56 (matches preinstalled Chromium), `@axe-core/playwright`,
`tsx`. `npm audit`: 0 vulnerabilities. `gray-matter` was removed (vulnerable `js-yaml` chain) in favour of a 10-line
front-matter parser.
