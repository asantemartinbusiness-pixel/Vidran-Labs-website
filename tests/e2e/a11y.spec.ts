import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { PATHS } from "./helpers";

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"];

for (const path of PATHS) {
  test(`axe: ${path}`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
    const summary = results.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(" ")).slice(0, 3).join(" | ")}`);
    expect(summary).toEqual([]);
  });
}

test("axe: open mobile menu and form error state", async ({ page }, info) => {
  test.skip(!info.project.name.startsWith("mobile"));
  await page.goto("/start-a-project/");
  await page.getByRole("button", { name: "Prepare email" }).click();
  let results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  expect(results.violations.map((v) => v.id)).toEqual([]);
  await page.getByRole("button", { name: "Menu" }).click();
  // While the menu is open, <main> is intentionally inert (modal behaviour), so the
  // best-practice "page has main / h1" rules cannot see it. All WCAG rules still run.
  results = await new AxeBuilder({ page }).withTags(TAGS).disableRules(["landmark-one-main", "page-has-heading-one"]).analyze();
  expect(results.violations.map((v) => v.id)).toEqual([]);
});

test("axe: cookie dialog", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Cookie settings" }).click();
  const results = await new AxeBuilder({ page }).include("dialog").withTags(TAGS).analyze();
  expect(results.violations.map((v) => v.id)).toEqual([]);
});

test("axe: 404 error page", async ({ page }) => {
  await page.goto("/opps/");
  const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  expect(results.violations.map((v) => v.id)).toEqual([]);
});
