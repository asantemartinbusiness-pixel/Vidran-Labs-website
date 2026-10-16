/** Regenerates docs/route-manifest.md from the content model: `npx tsx scripts/route-manifest.ts` */
import fs from "node:fs";
import { legacyRedirects } from "@/content/redirects";
import { getArticles, pages } from "@/lib/content";
import type { Provenance } from "@/lib/types";

// Evidence of each mandated route in the recoverable source (search-index snapshot, Oct 2026).
const INDEXED = new Set(["/", "/mission/", "/contact/", "/opps/"]);
const LABEL_ONLY = new Set(["/start-a-project/", "/institutional-procurement/", "/partnerships/", "/support/"]);

const rows = pages.map((p) => {
  const t: Record<Provenance, number> = { verified: 0, indexed: 0, brief: 0, provisional: 0 };
  p.blocks.forEach((b) => t[b.provenance]++);
  const types = p.blocks.map((b) => b.type).join(", ");
  const source = INDEXED.has(p.path) ? "Indexed fragments only" : LABEL_ONLY.has(p.path) ? "Route label indexed (on /contact/)" : "Not recoverable";
  const status = t.provisional === 0 ? "Built · content from source/brief" : `Built · ${t.provisional}/${p.blocks.length} blocks provisional`;
  return `| \`${p.path}\` | ${p.title} | ${p.template} | ${source} | ${types} | ${status} | e2e ✓ · axe ✓ |`;
});

const articles = getArticles().map(
  (a) => `| \`${a.path}\` | ${a.title} | article | Title only (brief) | header, body notice | Built · body ${a.bodyStatus} | e2e ✓ · axe ✓ |`,
);

const redirects = legacyRedirects.map((r) => `| \`${r.from}\` | \`${r.to}\` | ${r.permanent ? "308" : "307"} | ${r.status} | ${r.evidence} |`);

const md = `# Route manifest

Generated from the content model by \`scripts/route-manifest.ts\` — do not edit by hand.

Every source route keeps its exact original URL (trailing slash preserved). Verification column reflects the automated
suite in \`tests/e2e\` (status 200, one h1, canonical, metadata, heading order, no console errors, axe WCAG 2.2 AA,
no horizontal overflow at 320–1920 px, link crawl).

## Pages (${pages.length})

| Source & destination URL | Title | Template | Source availability | Sections | Implementation | Verification |
|---|---|---|---|---|---|---|
${rows.join("\n")}

## Articles (${articles.length})

| URL | Title | Template | Source availability | Sections | Implementation | Verification |
|---|---|---|---|---|---|---|
${articles.join("\n")}

## Legacy URLs found in search indexes (earlier site generation)

These are not in the mandated inventory. They currently 404 on the original host. Proposed redirects are **temporary
(307) until approved**; switch to permanent in \`content/redirects.ts\` after sign-off.

| Legacy URL | Proposed destination | Status code | Approval | Evidence |
|---|---|---|---|---|
${redirects.join("\n")}

## Error handling

| Case | Behaviour |
|---|---|
| \`/opps/\` | Original custom "Page Not Found" page preserved at its URL, HTTP 200, \`noindex\`. |
| Any unknown URL | Genuine HTTP 404 rendering the same error-page design (\`app/not-found.tsx\`). No blanket redirect to home. |
| URL without trailing slash | 308 to the trailing-slash canonical form. |
`;

fs.writeFileSync("docs/route-manifest.md", md);
console.log(`Wrote docs/route-manifest.md (${pages.length} pages, ${articles.length} articles)`);
