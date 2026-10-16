import { expect, test } from "@playwright/test";
import { PATHS } from "./helpers";

test("every link on every page resolves (link-check report)", async ({ page, request }) => {
  const internal = new Map<string, string>(); // href → first page seen
  const mailto = new Set<string>();
  const external = new Set<string>();
  for (const path of PATHS) {
    await page.goto(path);
    const hrefs = await page.locator("a[href]").evaluateAll((as) => as.map((a) => a.getAttribute("href")!));
    for (const h of hrefs) {
      if (h.startsWith("mailto:")) mailto.add(h);
      else if (h.startsWith("#")) continue;
      else if (/^https?:/.test(h)) external.add(h);
      else if (!internal.has(h.split("#")[0]!)) internal.set(h.split("#")[0]!, path);
    }
  }
  const broken: string[] = [];
  for (const [href, from] of internal) {
    const status = (await request.get(href, { maxRedirects: 0 })).status();
    if (status !== 200) broken.push(`${href} (${status}) on ${from}`);
  }
  for (const m of mailto) {
    const u = new URL(m);
    if (!/^[^@]+@[^@]+\.[a-z]+$/.test(u.pathname) || !u.searchParams.get("subject")) broken.push(`bad mailto ${m}`);
  }
  console.log(`Link check: ${internal.size} internal targets, ${mailto.size} mailto links, ${external.size} external links, ${broken.length} broken`);
  expect(external.size).toBe(0);
  expect(broken).toEqual([]);
});
