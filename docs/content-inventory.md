# Content inventory

How each page's content is sourced. Block-level provenance lives in `content/pages/*.ts`; this report is produced
by `npm run check:content` (output reproduced below).

## Provenance key

| Tag | Meaning | Publishable? |
|---|---|---|
| `verified` | Confirmed against source or approved by Vidran Labs | Yes |
| `indexed` | Recovered from a search-index snapshot of vidran.net; wording unconfirmed | Yes, after wording check |
| `brief` | Stated by Vidran Labs in the reconstruction mandate | Yes |
| `provisional` | Drafted during reconstruction; source unrecoverable | **No** — release gate blocks |

## Editorial rules applied to provisional copy

- No invented clients, case studies, numbers, dates, team members, locations, certifications, partners or awards.
- Sage is described only as a pre-release initiative; capabilities are "design goals". A unit test fails if Sage
  copy claims availability.
- Sections that would require facts (case studies, open roles, partners, announcements, release notes,
  compatibility lists) show a truthful empty/pending state instead of filler.
- Legal pages contain only factual statements about how this website is built, with a notice that approved legal
  text is required.
- British English spelling, sentence-case headings, no superlatives.

## Recovered text used verbatim (subject to confirmation)

| Text | Where used | Source |
|---|---|---|
| "Technology for Systems That Matter." | Home hero, footer, OG image, Organization `slogan` | Brief |
| "Our mission is to revolutionize the technological landscape of the Caribbean." | `/mission/` hero | Index (`/mission/`) |
| "Find the right contact route" | `/contact/` hero, nav description | Index (`/contact-us/`) |
| Start a Project · Institutional · Partnerships · Support | `/contact/` routes, nav | Index + brief |
| "Vidran Labs Solutions, Inc." | Footer ©, Terms, Newsroom fact sheet, JSON-LD | Index + brief |
| "Page Not Found" | `/opps/`, 404 | Index |
| Article titles (2) | Article pages, Insights list | Brief |

## Content report

```
Page provenance (blocks: verified / indexed / brief / provisional)

/                                          0 / 1 / 1 / 4
/company/                                  0 / 0 / 0 / 5
/mission/                                  0 / 1 / 0 / 3
/solutions/                                0 / 0 / 0 / 4
/industries/                               0 / 0 / 0 / 4
/products/                                 0 / 0 / 0 / 4
/work/                                     0 / 0 / 0 / 4
/careers/                                  0 / 0 / 0 / 4
/research/                                 0 / 0 / 0 / 4
/research-agenda/                          0 / 0 / 0 / 4
/insights/                                 0 / 1 / 0 / 1
/newsroom/                                 0 / 0 / 1 / 3
/contact/                                  0 / 2 / 0 / 2
/start-a-project/                          0 / 1 / 0 / 2
/institutional-procurement/                0 / 1 / 0 / 3
/partnerships/                             0 / 1 / 0 / 3
/support/                                  0 / 1 / 0 / 3
/products/sage/                            0 / 0 / 2 / 3
/products/sage/interface/                  0 / 0 / 1 / 3
/products/sage/architecture/               0 / 0 / 1 / 3
/products/sage/security/                   0 / 0 / 1 / 4
/products/sage/compatibility/              0 / 0 / 1 / 3
/products/sage/roadmap/                    0 / 0 / 1 / 3
/products/sage/documentation/              0 / 0 / 1 / 3
/products/sage/release-notes/              0 / 0 / 1 / 2
/products/sage/faq/                        0 / 0 / 0 / 2
/products/sage/developer-platform/         0 / 0 / 1 / 3
/products/sage/early-access/               0 / 0 / 0 / 3
/responsible-technology/                   0 / 0 / 0 / 3
/accessibility/                            0 / 0 / 0 / 4
/privacy-policy/                           0 / 0 / 0 / 3
/cookie-policy/                            0 / 0 / 0 / 4
/terms-service/                            0 / 0 / 0 / 3
/opps/                                     0 / 1 / 1 / 0

Articles
/digital-infrastructure-is-economic-infrastructure/          body=pending-recovery provenance=provisional
/why-caribbean-technology-needs-regional-context/            body=pending-recovery provenance=provisional

Contact recipients
general              hello@vidran.net             provisional
start-a-project      projects@vidran.net          provisional
institutional        procurement@vidran.net       provisional
partnerships         partnerships@vidran.net      provisional
support              support@vidran.net           provisional
sage-early-access    sage@vidran.net              provisional
careers              careers@vidran.net           provisional
media                media@vidran.net             provisional
research             research@vidran.net          provisional

Blocks: 129 total — verified 0, indexed 10, brief 13, provisional 106
Release blockers: 82
```
