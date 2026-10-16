/**
 * Content provenance report and release gate.
 *   npm run check:content   → report only
 *   npm run check:release   → exits 1 while anything provisional or unrecovered remains
 *   prebuild (automatic)    → --if-production: enforces the gate whenever the build is configured
 *                             for production, so a plain `npm run build` / Vercel deploy cannot
 *                             ship provisional content.
 */
import { contactRoutes } from "@/content/site";
import { legacyRedirects } from "@/content/redirects";
import { getArticles, pages } from "@/lib/content";
import type { Provenance } from "@/lib/types";

const productionBuild =
  process.env.SITE_INDEXING === "on" || process.env.NEXT_PUBLIC_CONTENT_REVIEW === "off" || process.env.VERCEL_ENV === "production";
const gateIfProduction = process.argv.includes("--if-production");
if (gateIfProduction && !productionBuild) {
  console.log("Review build: release gate not enforced (provisional content will be badged).");
  process.exit(0);
}
const release = process.argv.includes("--release") || gateIfProduction;
const tally: Record<Provenance, number> = { verified: 0, indexed: 0, brief: 0, provisional: 0 };
const blockers: string[] = [];

console.log("Page provenance (blocks: verified / indexed / brief / provisional)\n");
for (const p of pages) {
  const t: Record<Provenance, number> = { verified: 0, indexed: 0, brief: 0, provisional: 0 };
  p.blocks.forEach((b) => t[b.provenance]++);
  (Object.keys(t) as Provenance[]).forEach((k) => (tally[k] += t[k]));
  console.log(`${p.path.padEnd(42)} ${t.verified} / ${t.indexed} / ${t.brief} / ${t.provisional}`);
  if (t.provisional > 0) blockers.push(`${p.path}: ${t.provisional} provisional block(s)`);
  if (p.metaProvenance === "provisional") blockers.push(`${p.path}: provisional title/description`);
}

console.log("\nArticles");
for (const a of getArticles()) {
  console.log(`${a.path.padEnd(60)} body=${a.bodyStatus} provenance=${a.provenance}`);
  if (a.bodyStatus !== "recovered") blockers.push(`${a.path}: article body ${a.bodyStatus}`);
  if (a.provenance === "provisional") blockers.push(`${a.path}: provisional metadata`);
}

console.log("\nContact recipients");
for (const r of contactRoutes) {
  console.log(`${r.id.padEnd(20)} ${r.email.padEnd(28)} ${r.emailProvenance}`);
  if (r.emailProvenance !== "verified") blockers.push(`contact route "${r.id}": recipient ${r.email} not confirmed`);
}

for (const r of legacyRedirects) if (r.status !== "approved") blockers.push(`redirect ${r.from} → ${r.to}: ${r.status}`);

const totalBlocks = Object.values(tally).reduce((a, b) => a + b, 0);
console.log(`\nBlocks: ${totalBlocks} total — verified ${tally.verified}, indexed ${tally.indexed}, brief ${tally.brief}, provisional ${tally.provisional}`);
console.log(`Release blockers: ${blockers.length}`);

if (release) {
  if (blockers.length) {
    console.error("\nRELEASE GATE: FAIL\n" + blockers.map((b) => `  - ${b}`).join("\n"));
    if (gateIfProduction) console.error("\nThis build is configured for production (indexing on, review markers off, or VERCEL_ENV=production).");
    process.exit(1);
  }
  console.log("RELEASE GATE: PASS");
}
