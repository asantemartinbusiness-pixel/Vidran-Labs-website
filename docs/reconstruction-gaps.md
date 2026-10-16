# Reconstruction gaps & decisions requiring approval

Unverified-source register and decision log. Each item blocks production unless marked otherwise.
`npm run check:release` enforces items G-01 to G-05 automatically.

| ID | Gap | Impact | Current handling | Decision / input needed | Owner |
|---|---|---|---|---|---|
| G-01 | **Page copy unrecoverable** for 30 of 34 pages; partial for 4 | 106 of 129 content blocks, and all page titles/descriptions except `/opps/`, are drafted | Drafted conservatively from the owner brief; every block tagged `provisional`; dashed outline + badge in review builds | Supply WordPress export **or** approve/edit drafted copy page by page (`content/pages/*.ts`) | Vidran Labs (content) |
| G-02 | **Article bodies unrecoverable** (2 known articles) | Articles show title, standfirst and a "text pending recovery" notice | Not rewritten — essays published under the company name must be original | Supply original article text; confirm any further articles, dates and bylines | Vidran Labs (editorial) |
| G-03 | **Enquiry recipient addresses unknown** | Enquiry emails would go to unconfirmed mailboxes | Placeholder `*@vidran.net` addresses, all tagged `provisional`; documented in `docs/form-inventory.md` | Confirm the mailbox for each of the 9 pathways, and that `vidran.net` mail is active (the domain currently does not resolve) | Vidran Labs (ops) |
| G-04 | **Legal text unrecoverable** — privacy, cookie, terms | Legal pages carry factual engineering statements only, plus a "legal text required" notice | Engineering team has not drafted legal terms | Legal counsel to supply approved text | Legal |
| G-05 | **Legacy redirects** `/about-us/`, `/contact-us/`, `/portfolio/vidran-labs/` | SEO equity and old links | Temporary 307 redirects to nearest current pages | Approve → set `permanent: true` (308) in `content/redirects.ts` | Vidran Labs (marketing) |
| G-06 | **Brand assets unrecoverable** — logo, colours, typefaces, imagery, OG image, favicon | Visual identity is a provisional system, not the original | Restrained provisional wordmark and tokens (`styles/tokens.css`, `components/Wordmark.tsx`) | Supply logo (SVG), brand colours, licensed fonts, approved imagery | Brand |
| G-07 | **Conflicting Sage claims** in the earlier site generation ("Sage o.1", built-in apps, Sage Cloud, "Vidran Silicon V1/V2", free updates) | Publishing these would present Sage as shipped and imply proprietary silicon | Not used. All Sage pages state pre-release status per the brief | Confirm current Sage facts: any public build? any hardware programme? | Product |
| G-08 | **Visual fidelity unverifiable** | Mandate §20 comparison impossible | Marked **UNVERIFIED** for every page; screenshots of the reconstruction are in `docs/evidence/` | Supply screenshots/export of the last good version if pixel fidelity matters | Brand |
| G-09 | **"Investors" link** seen in indexed navigation | Possible missing route | Not built (no URL or content recovered) | Confirm whether an investor-relations page existed and its URL | Vidran Labs |
| G-10 | **Form technology on original pages unknown** (CF7/Forminator installed historically) | If original pages used server-submitted forms, the mailto approach changes the journey | Structured-email pathways with client validation; server-form contract documented (`docs/form-inventory.md` §4) | Confirm whether a CRM/inbox integration is wanted | Vidran Labs (ops) |
| G-11 | **Careers roles, case studies, partners, newsroom items, research agenda** | Sections show truthful empty states | No roles, clients, partners or announcements invented | Supply verified items when available | Vidran Labs |
| G-12 | **Hosting / domain** — `vidran.net` does not resolve | Site cannot be served or receive mail at that domain | Out of scope for the rebuild (mandate §25) | Resolve registrar/DNS/hosting separately before launch | Infrastructure |
| G-13 | **No verified security contact** | Sage security page and FAQ route vulnerability reports to the provisional support address | Advises not to send exploit details until a secure channel is provided | Confirm a security mailbox; then add `/.well-known/security.txt` | Security |
| G-14 | **Footer © year is set at build time** | Shows the build year until the next rebuild | Accepted for a static site | Rebuild at least yearly (any content change triggers one) | Engineering |

## Proposed copy decisions (for approval)

These go beyond reconstruction and need explicit sign-off:

1. Homepage hero lede, "Our approach" and the closing CTA are new copy.
2. "Caribbean relevance. Global standards." used as a pull-quote (derived from the brief's defaults).
3. Sector list on `/industries/` is illustrative and explicitly says it is not a list of past engagements.
4. Principles on `/company/`, `/responsible-technology/` and `/careers/` are proposed company positions.
5. Sage roadmap statuses (in development / planned) are inferred — product owner must confirm each row.
6. Mission lede paraphrases the indexed mission text; confirm wording.
