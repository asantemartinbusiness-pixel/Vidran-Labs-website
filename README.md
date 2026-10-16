# Vidran Labs website

Reconstruction of [vidran.net](https://vidran.net/) — the corporate website of Vidran Labs Solutions, Inc.
**Status: review candidate, not approved for production.** See [`docs/executive-handover.md`](docs/executive-handover.md).

> The original site was offline during reconstruction and no export was available, so most copy is drafted and
> marked *provisional*. Review builds outline provisional blocks with a dashed border, and `npm run check:release`
> blocks production until they are approved or replaced. Start with [`docs/reconstruction-gaps.md`](docs/reconstruction-gaps.md).

## Quick start

Requires Node.js 22+.

```bash
npm ci
cp .env.example .env.local   # optional; defaults are safe for review
npm run dev                  # http://localhost:3000
```

Production build:

```bash
npm run build && npm start
```

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build (all routes statically generated) / serve it |
| `npm run typecheck` | TypeScript strict check |
| `npm test` | Unit tests (Vitest): validation, mailto encoding, consent, route inventory, links, content guards |
| `npm run test:e2e` | End-to-end tests (Playwright, desktop + mobile Chromium). **Run `npm run build` first.** |
| `npm run check:content` | Provenance report: what is verified, recovered, owner-supplied or provisional |
| `npm run check:release` | Release gate — fails while anything provisional or unconfirmed remains |
| `npx tsx scripts/route-manifest.ts` | Regenerates `docs/route-manifest.md` from the content model |

In environments with a preinstalled Chromium (e.g. `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`) no browser
download is needed; otherwise run `npx playwright install chromium` once.

## Environment

| Variable | Default | Production value |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://vidran.net` | Canonical origin |
| `SITE_INDEXING` | `off` | `on` (only for the approved production deployment) |
| `NEXT_PUBLIC_CONTENT_REVIEW` | `on` | `off` |

No secrets are required.

## Where things live

- `content/` — all page copy, navigation, contact pathways, articles, redirects ([how to edit](docs/content-management.md))
- `components/`, `app/`, `lib/`, `styles/` — implementation ([architecture](docs/architecture.md))
- `tests/` — unit and end-to-end suites
- `docs/` — inventories, reviews and verification evidence

## Documentation

| Document | Purpose |
|---|---|
| [executive-handover.md](docs/executive-handover.md) | What was rebuilt, preserved, improved, not recovered; status and next steps |
| [source-inventory.md](docs/source-inventory.md) | How the source was investigated and what was recovered |
| [reconstruction-gaps.md](docs/reconstruction-gaps.md) | Unverified-source register and decisions needing approval |
| [route-manifest.md](docs/route-manifest.md) | Source → destination URLs, page completion matrix, legacy redirects |
| [content-inventory.md](docs/content-inventory.md) | Content provenance per page |
| [asset-manifest.md](docs/asset-manifest.md) | Assets in use and assets still needed |
| [form-inventory.md](docs/form-inventory.md) | Enquiry pathways, validation, server-integration contract |
| [functionality-matrix.md](docs/functionality-matrix.md) | User journeys, interactions, manual QA checklist |
| [design-system-audit.md](docs/design-system-audit.md) | Tokens and components |
| [architecture.md](docs/architecture.md) | Stack decision and structure |
| [security-review.md](docs/security-review.md) | Security & privacy review |
| [verification-report.md](docs/verification-report.md) | Test, accessibility, performance and link-check results |
| [deployment-readiness.md](docs/deployment-readiness.md) | Deployment checklist, redirect and SEO plan |
| [content-management.md](docs/content-management.md) | How to edit content |
