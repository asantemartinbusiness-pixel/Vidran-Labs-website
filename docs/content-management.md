# Content management

Content lives in the repository as typed data. Edits go through pull requests, so every change is reviewed and
type-checked, and the release gate shows what is still provisional.

## Edit a page

1. Find the page in `content/pages/` (`core.ts`, `research.ts`, `contact.ts`, `sage.ts`, `trust.ts`).
2. Edit the block's text. Inline Markdown is supported in body strings: `[link](/path/)`, `**bold**`, `*italic*`.
3. When the copy is approved or replaced with original text, change the block's `provenance` to `"verified"`.
   Update `metaProvenance` once the page title/description are approved.
4. Run `npm run typecheck && npm test` — unit tests fail on broken internal links, duplicate titles/descriptions,
   missing h1, or Sage availability claims.

Block types and their fields are defined in `lib/types.ts` (`hero`, `prose`, `cards`, `steps`, `definitions`,
`status`, `faq`, `routes`, `enquiry`, `articles`, `notice`, `cta`, `sitemap`).

## Add a page

Add a `PageDoc` to the relevant file with a unique `path` (leading and trailing slash), `title`, `description`
(40–200 chars), `template`, and blocks starting with one `hero`. It is automatically routed, prerendered, added
to the sitemap and covered by the e2e suite. Add it to navigation in `content/site.ts` if needed.

## Add or restore an article

Create `content/articles/<slug>.md`:

```markdown
---
title: Article title
description: One-sentence standfirst.
date: 2026-03-14
author: Name Surname
category: Insights
provenance: verified
bodyStatus: recovered
---
Article body in Markdown…
```

The URL is `/<slug>/` (matching WordPress post URLs). Articles are sorted newest first.

## Contact recipients

`content/site.ts` → `contactRoutes`. Set each `email` and change `emailProvenance` to `"verified"` once confirmed.

## Brand

Colours and fonts: `styles/tokens.css`. Logo: `components/Wordmark.tsx` and `app/icon.svg`.

## Release gate

`npm run check:content` prints provenance per page; `npm run check:release` exits non-zero while anything is
provisional, unrecovered, unconfirmed or unapproved. Run it in CI before any production deployment.

## Migrating to a CMS later

Each `PageDoc` block maps directly to a CMS "block" object type; `lib/content.ts` is the only module to change.
