# Executive handover — Vidran Labs website reconstruction

**Status: CONDITIONAL REVIEW**

The website is complete and verified as a working system, and ready for stakeholders to review its structure,
design and behaviour. It is **not** ready for publication. Most of the words on it, and its visual identity,
are provisional, because the original site could not be recovered. Publication needs content and brand inputs
from Vidran Labs. It does not need further engineering.

## The key fact

`vidran.net` no longer resolves in DNS, the Internet Archive was unreachable from this environment, and no
WordPress export, database or media archive was supplied. The only recoverable source material was a handful of
search-index fragments, mostly from an *earlier* version of the site. See `source-inventory.md`.

So we rebuilt everything that can be rebuilt without the original words and assets. Every drafted sentence is
labelled, and the build refuses to publish them until they are approved.

## What was rebuilt

- **All 34 mandated pages and both known articles, at their original URLs**: home, company, mission, solutions,
  industries, products, research, research agenda, work, insights, newsroom, careers, contact; four contact
  sub-routes; all eleven Sage pages; five trust and legal pages; and the custom error page.
- **Navigation**: the full header with keyboard-accessible dropdowns, a mobile menu, breadcrumbs, a four-column
  footer and legal links. The Sage pages work as one connected section, with a sidebar and previous/next links.
- **Nine enquiry pathways**: general, start a project, institutional and procurement, partnerships, support,
  Sage early access, careers, media and research. Each one validates the visitor's input and then opens a
  prepared email in their own email app. Nothing is stored, and the site never claims a message was sent.
- **Search and trust infrastructure**: canonical URLs, unique metadata, a sitemap, robots rules, structured
  data, a social preview image, real 404s, security headers, cookie settings, and an indexing switch that is
  off by default.
- **A design system**: design tokens and about 15 reusable components in an editorial, institutional style,
  without the usual template look.

## What was preserved

- The URL structure, including trailing slashes, and the primary navigation order.
- The positioning line "Technology for Systems That Matter."
- The mission statement wording that could be recovered, and "Find the right contact route" with its four routes.
- The legal entity name "Vidran Labs Solutions, Inc." and the "Page Not Found" error page.
- Sage's status as a pre-release initiative. It is never presented as shipped.

## What was improved

- **Real HTTP behaviour.** Missing pages return a genuine 404. Legacy URLs from the earlier site get redirects,
  which are proposed and waiting for your approval.
- **Accessibility.** There are zero automated WCAG 2.2 AA violations across the site. The site works fully by
  keyboard, keeps a visible focus indicator in high-contrast mode, and respects reduced-motion settings.
- **Performance.** Lighthouse scores 95–100 on every template we tested, with no layout shift and no
  third-party scripts.
- **Security.** Strict headers, sanitised content rendering, no personal data held, and zero dependency
  vulnerabilities.
- **Honesty controls.** Each content block records where its words came from, and a release gate blocks
  publishing anything unapproved.

## What could not be recovered

Page copy for 30 of 34 pages, both article bodies, the logo, colours, fonts, imagery, legal text, and the
enquiry email addresses. The full register is in `reconstruction-gaps.md`. We did not invent clients, figures,
dates, partners, certifications, job openings, or Sage features. Where those would normally appear, the page
says the information is pending.

## Integrations that need configuration

- **Enquiry mailboxes.** All nine addresses are placeholders. Each needs confirming, and `vidran.net` email
  needs to be working.
- **An optional server form.** Only needed if you want enquiries delivered without relying on the visitor's
  email app. The contract is written up in `form-inventory.md` §4.
- **Analytics.** Not included. If you add it later, it must go through the consent manager that is already in
  place.

## Risks still open

| Risk | Level | Note |
|---|---|---|
| Publishing drafted copy as company statements | High → controlled | The release gate blocks it, but approval still needs to be a deliberate content review |
| Domain and hosting outage (G-12) | High | Separate infrastructure problem; this work does not fix it |
| Visual identity differs from the original | Medium | Brand assets can be dropped in at three points in the code |
| Mobile loading speed slightly over target on 3 of 6 page templates in lab tests (2.6–2.8 s vs 2.5 s) | Low | Fix identified: a different font-loading method |
| No screen-reader or Firefox/Safari testing yet | Medium | Do this before launch |

## What production approval needs

1. Content: either a WordPress export, or page-by-page approval of the drafted copy (G-01, G-02).
2. Confirmed enquiry mailboxes and a security contact (G-03, G-13).
3. Legal text for the privacy policy, cookie policy and terms (G-04).
4. Brand assets: logo, colours and fonts (G-06).
5. A decision on the legacy redirects (G-05), and confirmation of the Sage facts from the earlier site (G-07).
6. Domain and hosting restored, then the checklist in `deployment-readiness.md` completed.

## How this was done

The 15 specialist roles in the mandate were carried out by one engineering agent working in sequence, not by
15 separate agents. One independent reviewer agent then tried to break the build. It reported 14 findings, all
of which were fixed or documented (`verification-report.md` §6). Our own manual QA found three more defects,
including a broken mobile menu that the automated tests had missed. All were fixed and the full suite was run
again.
