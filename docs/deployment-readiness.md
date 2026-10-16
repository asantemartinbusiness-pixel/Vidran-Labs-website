# Deployment readiness

**No deployment has been performed or is authorised.** This checklist is for the person who approves production.

## Pre-production checklist

### Blocking (must be done)

- [ ] `npm run check:release` passes — all provisional copy approved or replaced (G-01), articles restored (G-02),
      recipients confirmed (G-03), legal text supplied (G-04), redirects approved (G-05).
- [ ] Brand assets supplied and applied (G-06): logo, colours, fonts, favicon, OG image.
- [ ] `vidran.net` DNS/hosting resolved (G-12) and MX records confirmed for every enquiry mailbox.
- [ ] Production environment variables: `NEXT_PUBLIC_SITE_URL=https://vidran.net`, `SITE_INDEXING=on`,
      `NEXT_PUBLIC_CONTENT_REVIEW=off`.
- [ ] Legal review of privacy/cookie text against hosting provider's log retention.

### Verification on the production build

- [ ] `npm ci && npm run typecheck && npm test && npm run build && npm run test:e2e` all green.
      (With `SITE_INDEXING=on`, the e2e test "review builds are not indexable" is expected to fail; run it in the
      review configuration, or skip that one test for the production run.)
- [ ] Each enquiry pathway opens a mail client on iOS, Android, macOS and Windows and reaches the confirmed inbox
      (one internal test message per mailbox, with recipients' agreement).
- [ ] Firefox and Safari smoke test of navigation, forms and dialog.
- [ ] Screen-reader pass (VoiceOver + NVDA) on home, Sage roadmap, start-a-project.
- [ ] Response headers present on the host (CSP, HSTS, `X-Frame-Options`, etc.).
- [ ] `robots.txt` allows crawling; `sitemap.xml` uses `https://vidran.net`; `/opps/` is `noindex`.

### Recommended

- [ ] Uptime monitor on `/` and a content route.
- [ ] Submit sitemap in Google Search Console and Bing Webmaster Tools.
- [ ] CI workflow running typecheck, unit tests, build, e2e and the release gate on pull requests.

## Hosting

Any Next.js 16-compatible Node host (e.g. Vercel, or `next start` behind a reverse proxy). All pages are static;
there are no server-side secrets, databases or API routes. If a pure static host is mandated, `output: "export"`
is possible, but security headers, 404 status and redirects must then be configured on the host.

## Rollback

The site is stateless. Roll back by redeploying the previous build. DNS changes should be prepared with low TTLs
in advance of cut-over.

## Redirect & SEO plan

| Item | Plan |
|---|---|
| URL preservation | All 34 mandated page URLs and 2 article URLs preserved exactly, with trailing slashes. |
| Trailing slash | Non-slash variants 308 → slash form (Next `trailingSlash: true`). |
| Legacy URLs | `/about-us/` → `/company/`, `/contact-us/` → `/contact/`, `/portfolio/vidran-labs/` → `/products/sage/`: 307 now, 308 after approval. |
| Unknown URLs | HTTP 404 with helpful destinations — never a blanket redirect to home. |
| WordPress system URLs | `/wp-admin/`, `/wp-login.php`, `/feed/` return 404. `/?p=123` serves the homepage (query ignored; canonical points to `/`). If analytics show traffic to `/feed/`, add an RSS route. |
| Canonicals | Absolute self-referencing canonical on every page from `NEXT_PUBLIC_SITE_URL`. |
| Metadata | Unique title and description per page (unit-tested); Open Graph + Twitter card; generated OG image. |
| Structured data | `Organization` and `WebSite` site-wide; `BreadcrumbList` on interior pages; `Article` on articles. |
| Sitemap | `/sitemap.xml` — all indexable pages and articles (unit + e2e tested). |
| Indexing | Off by default; enabled only by `SITE_INDEXING=on`. |
| Discovered legacy URLs | Re-run a crawl of search-console "Not found" reports in the first 30 days and add redirects for any URL with traffic. |
