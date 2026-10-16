# Security & privacy review

Scope: the website codebase in this repository. Hosting, DNS and mail infrastructure are out of scope (G-12).

## Threat model

A static, public, informational site with **no accounts, no database, no server-side input handling, no
third-party scripts and no stored personal data**. Main risks: content injection (XSS) via authored or restored
content, clickjacking, misleading enquiry handling, supply-chain vulnerabilities, and accidental indexing or
publication of unapproved content.

## Controls

| Area | Control | Evidence |
|---|---|---|
| HTTP headers | CSP (`default-src 'self'`, `object-src 'none'`, `frame-ancestors 'none'`, `base-uri 'self'`, `form-action 'self'`), HSTS (2 years, subdomains), `X-Frame-Options: DENY`, `nosniff`, strict `Referrer-Policy`, restrictive `Permissions-Policy`, COOP, no `X-Powered-By` | `next.config.ts`; e2e "security headers" |
| Third parties | None. Fonts self-hosted; no analytics, embeds, CDNs or tag managers | e2e "no third-party requests are made" |
| Markdown / rich text | Raw HTML always escaped; link and image URLs restricted to relative, `#`, `http(s):`, `mailto:`; protocol-relative URLs rejected | `lib/inline.ts`; `tests/unit/inline.test.ts` |
| Structured data | JSON-LD serialised with `<` escaped | `components/JsonLd.tsx` |
| Enquiry pathways | No transmission or storage by the site. Values sanitised (control chars, bidi overrides, single-line newlines), parameters encoded with `encodeURIComponent` so extra mailto headers (`&cc=`, `%0D%0ABcc:`) cannot be injected; length capped | `lib/enquiry.ts`; unit tests; adversarial review confirmed |
| Consent | No optional technology exists; consent store defaults to deny; any future loader must check `hasConsent()` | `lib/consent.ts`; unit tests |
| Indexing / publication | `noindex` header + meta + robots disallow by default; release gate runs in `prebuild` and fails production-configured builds while provisional content remains | `scripts/content-report.ts`; `package.json` |
| Secrets | None required; `.env*` ignored; `.env.example` has no values | `.gitignore` |
| Dependencies | 6 runtime packages; `npm audit` 0 vulnerabilities; `gray-matter` removed (vulnerable `js-yaml` chain); Vitest upgraded past tinypool/mocker advisories | `package.json`, `package-lock.json` |

## Accepted risks / limitations

| Risk | Rationale | Mitigation path |
|---|---|---|
| `script-src 'unsafe-inline'` | Next.js inlines bootstrap scripts on statically generated pages; nonces force dynamic rendering. Exposure is limited because there is no user-generated content and all rendered Markdown is sanitised. | Move to nonce-based CSP via middleware if the site gains dynamic or user-supplied content. |
| `style-src 'unsafe-inline'` | Next.js style injection. Low risk. | Same as above. |
| Spam to published addresses | Equivalent to any published email address. | Mailbox-level filtering; server form with rate limiting if needed (`docs/form-inventory.md` §4). |
| No `/.well-known/security.txt` | No verified security contact exists yet (G-03). | Publish once a verified address exists (G-13). |

## Adversarial review

An independent reviewer agent attacked the build on 16 Oct 2026 (security, accessibility, UX/QA, content honesty).
All 14 findings were accepted and fixed or documented — see `docs/verification-report.md` §6.
