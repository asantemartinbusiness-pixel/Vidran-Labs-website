# Source inventory

**Audit date:** 16 October 2026 · **Source:** https://vidran.net/ · **Auditor role:** Website Archaeologist (02)

## 1. Summary

The source website could not be read directly. Every recovery path available to this session was attempted and is
recorded below. The only recoverable material was short fragments in a third-party search index, mostly from an
**earlier generation** of the site that predates the route structure in the reconstruction mandate.

**Consequence:** the reconstruction preserves the full mandated URL structure, navigation, page types and
functional pathways, but most page copy is drafted and marked `provisional`. Nothing provisional can reach
production: `npm run check:release` fails until it is approved or replaced.

## 2. Recovery attempts

| # | Method | Target | Result | Evidence |
|---|---|---|---|---|
| 1 | Direct HTTP from build container | `vidran.net` `/`, `/robots.txt`, `/sitemap.xml`, `/wp-sitemap.xml`, `/sitemap_index.xml`, `/company/`, `/products/sage/`, `/wp-json/wp/v2/pages` | **Blocked** — egress proxy refused the connection (`CONNECT 403`) | curl exit 56 for all 8 URLs |
| 2 | External fetcher (outside the container) | `https://vidran.net/`, `/company/`, `/robots.txt` | **Failed** — `getaddrinfo ENOTFOUND vidran.net` (the domain no longer resolves in DNS) | WebFetch error |
| 3 | Internet Archive | `web.archive.org/web/2026/…`, CDX index for `vidran.net/*` | **Unavailable** — host blocked from both the container and the external fetcher | curl 403; WebFetch refusal |
| 4 | Search-engine index | 8 targeted queries (brand, tagline, Sage, articles, contact, legal name) | **Partial** — fragments recovered (§3) | Query log in §5 |
| 5 | Local repository | `/home/user/Vidran-Labs-website` | Empty repository (no commits, no export, no assets) | `git status` |
| 6 | WordPress export / DB / media backup | — | **Not supplied** | — |
| 7 | WordPress admin (read-only) | — | **Not supplied**; no attempt made to authenticate | — |

The mandate noted that at preparation time the homepage showed an account-suspension notice while interior pages
loaded. By the audit date the domain did not resolve at all. Neither state was treated as the intended design.

## 3. Recovered fragments (search-index snapshot)

Wording below passed through a search summariser and is **unconfirmed**; it is used only where marked `indexed`.

| URL | Indexed title | Recovered content | Generation | Used? |
|---|---|---|---|---|
| `/` | Vidran Labs | "Empowering the Caribbean with Cutting-Edge Technology"; Contact link | Earlier | No — superseded by owner-brief positioning "Technology for Systems That Matter." |
| `/about-us/` | About Us | Mission to bring advanced technology to the Caribbean across software, renewable energy and engineering; "bridge the technological resource gap" | Earlier | No — legacy URL; proposed redirect to `/company/` |
| `/portfolio/vidran-labs/` | Vidran Labs | "Sage o.1" desktop OS; built-in apps (Web, Mail, Photos, Notes) syncing via "Sage Cloud"; "Vidran Silicon V1 and V2" chips; free updates | Earlier | **No** — these are shipped-product and hardware claims that conflict with the brief's pre-release framing. Flagged G-07. |
| `/mission/` | Mission | "Our mission is to revolutionize the technological landscape of the Caribbean."; benefit communities and open opportunities; "Our Product" heading; footer "© Vidran Labs Solutions, Inc." | Current | Yes — `/mission/` hero (indexed) and legal name in footer |
| `/contact-us/` | Page Not Found | "Find the right contact route"; Start a Project, Institutional, Partnerships, Support | Current (served at old URL) | Yes — `/contact/` heading and route structure |
| `/opps/` | Page Not Found | Title only | Current | Yes — error page title |
| `/mission/` (nav) | — | Contact sub-items "New & Media" [sic], "Contact Us", "Investors" | Current | Media route implemented on `/newsroom/`; **Investors** flagged G-09 |

No content was recovered for: `/company/`, `/solutions/`, `/industries/`, `/products/`, `/research/`,
`/research-agenda/`, `/work/`, `/insights/`, `/newsroom/`, `/careers/`, all four contact sub-pages, all eleven Sage
pages, all five trust/legal pages, and both known articles (titles only, from the mandate).

## 4. Owner-supplied facts (reconstruction mandate)

Treated as authoritative and marked `brief`:

- Company: Vidran Labs (legal entity Vidran Labs Solutions, Inc., corroborated by index).
- Positioning: **Technology for Systems That Matter.**
- Scope: software, AI, automation, data, digital infrastructure, intelligent systems, products, research.
- Primary navigation: Products, Solutions, Industries, Research, Work, Insights, Company, Contact.
- Full route inventory (§5 of the mandate), including two article URLs.
- Sage is a **pre-release operating-system initiative under active development**.
- Historic plugins: Elementor, Contact Form 7, Forminator (usage on specific pages unconfirmed).

## 5. Search query log

1. `"Vidran Labs" vidran.net` · 2. `vidran.net "Technology for Systems That Matter"` · 3. `vidran.net products sage architecture security compatibility roadmap early access` ·
4. `vidran.net "Digital infrastructure is economic infrastructure"` · 5. `vidran.net "Why Caribbean technology needs regional context"` ·
6. `vidran.net contact-us support partnerships media email vidranlabs.com` · 7. `"Vidran Labs" Sage operating system Caribbean` ·
8. `"Vidran Labs Solutions" OR "vidranlabs.com"`

One summary referred to contact addresses "under the vidranlabs.com domain"; a follow-up query found no such
addresses and no results for that domain. **No email address was recovered** (see G-03).

## 6. What would close the gap

In order of value: (1) a WordPress export (`.xml`) or database dump; (2) a `wp-content/uploads` media archive;
(3) read-only WordPress admin access; (4) a full-site Wayback Machine capture retrieved from an unrestricted
network; (5) the brand guidelines / logo files. Any of (1)–(3) would allow most provisional blocks to be replaced
with verified copy without code changes.
