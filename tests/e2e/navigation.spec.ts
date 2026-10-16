import { expect, test } from "@playwright/test";

const isMobile = (name: string) => name.startsWith("mobile");

test.describe("desktop navigation", () => {
  test.beforeEach(({}, info) => test.skip(isMobile(info.project.name), "desktop only"));

  test("skip link moves focus to main content", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to main content" });
    await expect(skip).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("main#main")).toBeFocused();
  });

  test("dropdown opens, exposes state, and closes with Escape returning focus", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("navigation", { name: "Primary" }).getByRole("button", { name: "Products" });
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    const menu = page.locator(`#${await trigger.getAttribute("aria-controls")}`.replace(/:/g, "\\:"));
    await expect(menu).toBeVisible();
    await expect(menu.getByRole("link", { name: /Sage/ }).first()).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("dropdown is fully keyboard operable", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("navigation", { name: "Primary" }).getByRole("button", { name: "Contact" });
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: /^Contact Find the right/ })).toBeFocused();
    // Tabbing past the last item closes the menu.
    for (let i = 0; i < 5; i++) await page.keyboard.press("Tab");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("only one dropdown is open at a time and outside clicks close it", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary" });
    await nav.getByRole("button", { name: "Research" }).click();
    await nav.getByRole("button", { name: "Company" }).click();
    await expect(nav.getByRole("button", { name: "Research" })).toHaveAttribute("aria-expanded", "false");
    await expect(nav.getByRole("button", { name: "Company" })).toHaveAttribute("aria-expanded", "true");
    await page.locator("h1").click();
    await expect(nav.getByRole("button", { name: "Company" })).toHaveAttribute("aria-expanded", "false");
  });

  test("navigating via a dropdown link lands on the page and marks the section active", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary" });
    await nav.getByRole("button", { name: "Products" }).click();
    await nav.getByRole("link", { name: /^Sage Pre-release/ }).click();
    await expect(page).toHaveURL(/\/products\/sage\/$/);
    await expect(nav.getByRole("button", { name: "Products" })).toHaveClass(/is-active/);
    await expect(nav.getByRole("button", { name: "Products" })).toHaveAttribute("aria-expanded", "false");
  });

  test("top-level link shows aria-current on its page", async ({ page }) => {
    await page.goto("/solutions/");
    await expect(page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Solutions" })).toHaveAttribute("aria-current", "page");
  });

  test("Sage pages share a contextual navigation with current page and pager", async ({ page }) => {
    await page.goto("/products/sage/security/");
    const side = page.locator(".sage-sidenav");
    await expect(side.getByRole("link", { name: "Security" })).toHaveAttribute("aria-current", "page");
    await expect(side.getByRole("link")).toHaveCount(11);
    await page.getByRole("navigation", { name: "Sage pages" }).getByRole("link", { name: /Next/ }).click();
    await expect(page).toHaveURL(/\/products\/sage\/compatibility\/$/);
    await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toContainText("Sage");
  });
});

test.describe("mobile navigation", () => {
  test.beforeEach(({}, info) => test.skip(!isMobile(info.project.name), "mobile only"));

  test("menu opens, expands a section, navigates and closes", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Menu" });
    await toggle.click();
    await expect(page.getByRole("button", { name: "Close" })).toHaveAttribute("aria-expanded", "true");
    const panel = page.locator("#mobile-nav");
    await expect(panel).toBeVisible();
    await expect(page.locator("main#main")).toHaveAttribute("inert", "");
    // Regression: the panel must sit directly under the header and fill the rest of the viewport.
    const header = (await page.locator("header.site-header").boundingBox())!;
    const box = (await panel.boundingBox())!;
    const vh = page.viewportSize()!.height;
    expect(Math.abs(box.y - (header.y + header.height))).toBeLessThanOrEqual(1);
    expect(box.y + box.height).toBeGreaterThanOrEqual(vh - 1);
    const expand = panel.getByRole("button", { name: "Contact pages" });
    await expand.click();
    await expect(expand).toHaveAttribute("aria-expanded", "true");
    await panel.getByRole("link", { name: "Partnerships" }).click();
    await expect(page).toHaveURL(/\/partnerships\/$/);
    await expect(panel).toBeHidden();
    await expect(page.locator("main#main")).not.toHaveAttribute("inert", "");
  });

  test("Escape closes the menu and returns focus to the toggle", async ({ page }) => {
    await page.goto("/company/");
    await page.getByRole("button", { name: "Menu" }).click();
    await page.keyboard.press("Escape");
    await expect(page.locator("#mobile-nav")).toBeHidden();
    await expect(page.getByRole("button", { name: "Menu" })).toBeFocused();
  });

  test("same-page links and the skip link close the menu", async ({ page }) => {
    await page.goto("/contact/");
    await page.getByRole("button", { name: "Menu" }).click();
    await page.locator("#mobile-nav .mobile-nav__link", { hasText: "Contact" }).click();
    await expect(page.locator("#mobile-nav")).toBeHidden();
    await expect(page.locator("main#main")).not.toHaveAttribute("inert", "");
    await page.getByRole("button", { name: "Menu" }).click();
    await page.locator(".skip-link").focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#mobile-nav")).toBeHidden();
    await expect(page.locator("main#main")).toBeFocused();
  });

  test("current section is pre-expanded and marked", async ({ page }) => {
    await page.goto("/mission/");
    await page.getByRole("button", { name: "Menu" }).click();
    const panel = page.locator("#mobile-nav");
    await expect(panel.getByRole("link", { name: "Mission" })).toHaveAttribute("aria-current", "page");
  });

  test("Sage section navigation is available as a disclosure", async ({ page }) => {
    await page.goto("/products/sage/faq/");
    const details = page.locator(".sage-mobilenav");
    await details.locator("summary").click();
    await details.getByRole("link", { name: "Roadmap" }).click();
    await expect(page).toHaveURL(/\/roadmap\/$/);
  });
});

test.describe("interaction details", () => {
  test("FAQ answers expand and collapse natively", async ({ page }) => {
    await page.goto("/products/sage/faq/");
    const item = page.locator("details.faq__item").first();
    await item.locator("summary").click();
    await expect(item).toHaveAttribute("open", "");
    await item.locator("summary").click();
    await expect(item).not.toHaveAttribute("open", "");
  });

  test("reduced motion removes transitions", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto("/");
    const dur = await page.locator(".btn").first().evaluate((e) => getComputedStyle(e).transitionDuration);
    expect(dur.split(",").every((d) => parseFloat(d) === 0)).toBe(true);
    await ctx.close();
  });
});
