import { expect, test } from "@playwright/test";
import { contactRoutes } from "@/content/site";

test.describe("enquiry pathways", () => {
  for (const route of contactRoutes) {
    test(`${route.id}: hosted on ${route.href} with a working direct email link`, async ({ page }) => {
      await page.goto(route.href);
      const form = page.locator("#enquiry form");
      await expect(form).toBeVisible();
      const direct = form.locator(`a[href^="mailto:${route.email}?subject="]`);
      await expect(direct).toHaveCount(1);
      const href = (await direct.getAttribute("href"))!;
      expect(decodeURIComponent(new URL(href).searchParams.get("subject")!)).toBe(route.subjectPrefix);
      // Every control has an accessible label.
      for (const field of route.fields) await expect(form.getByLabel(field.label, { exact: false }).first()).toBeVisible();
    });
  }

  test("empty submission shows an error summary, focuses it and marks fields invalid", async ({ page }) => {
    await page.goto("/start-a-project/");
    await page.getByRole("button", { name: "Prepare email" }).click();
    const summary = page.locator(".form-summary");
    await expect(summary).toBeFocused();
    await expect(summary).toContainText("There are 3 problems");
    await expect(page.getByLabel("Your name")).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByLabel("Organisation")).not.toHaveAttribute("aria-invalid", "true");
    // Summary links move focus to the field.
    await summary.getByRole("link", { name: "Enter your name." }).click();
    await expect(page.getByLabel("Your name")).toBeFocused();
  });

  test("errors clear as fields are corrected", async ({ page }) => {
    await page.goto("/start-a-project/");
    await page.getByRole("button", { name: "Prepare email" }).click();
    await page.getByLabel("Your name").fill("Ada");
    await expect(page.getByLabel("Your name")).not.toHaveAttribute("aria-invalid", "true");
    await expect(page.locator(".form-summary")).toContainText("There are 2 problems");
  });

  test("valid submission hands off a correctly encoded email and reports state truthfully", async ({ page }) => {
    await page.goto("/start-a-project/");
    await page.getByLabel("Your name").fill("Ada Lovelace");
    await page.getByLabel("Organisation").fill("Analytical & Co");
    await page.getByLabel("Area of work").selectOption("Data");
    await page.getByLabel("Describe the system or problem").fill("Line one\nLine two — with ünïcode & symbols?");
    await page.getByRole("button", { name: "Prepare email" }).click();

    const status = page.getByRole("status").filter({ hasText: "prepared message" });
    await expect(status).toBeVisible();
    await expect(status).toBeFocused();
    await expect(status).toContainText("Nothing has been sent yet");
    // The form is replaced, so it cannot be submitted twice.
    await expect(page.getByRole("button", { name: "Prepare email" })).toHaveCount(0);

    const href = (await page.getByRole("link", { name: "Open email again" }).getAttribute("href"))!;
    const url = new URL(href);
    expect(url.protocol).toBe("mailto:");
    expect(url.pathname).toBe("projects@vidran.net");
    expect(url.searchParams.get("subject")).toBe("Start a project: Analytical & Co — Ada Lovelace");
    const body = url.searchParams.get("body")!;
    expect(body).toContain("Area of work: Data");
    expect(body).toContain("Line one\r\nLine two — with ünïcode & symbols?");
    expect(href).not.toContain("+");

    await page.getByRole("button", { name: "Start over" }).click();
    await expect(page.getByLabel("Your name")).toHaveValue("");
  });

  test("text fields enforce maximum length in the browser", async ({ page }) => {
    await page.goto("/contact/");
    await page.getByLabel("Your name").fill("x".repeat(500));
    expect((await page.getByLabel("Your name").inputValue()).length).toBe(120);
  });

  test("careers profile link is validated", async ({ page }) => {
    await page.goto("/careers/");
    await page.getByLabel("Your name").fill("Grace");
    await page.getByLabel("Discipline").fill("Systems");
    await page.getByLabel("Portfolio or profile link").fill("my site");
    await page.getByLabel("Tell us about your work").fill("Compilers");
    await page.getByRole("button", { name: "Prepare email" }).click();
    await expect(page.locator(".form-summary")).toContainText("https://");
  });
});

test.describe("cookie settings", () => {
  test("no consent banner appears because no optional technology is used", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".consent-banner")).toHaveCount(0);
  });

  test("settings dialog opens from the footer, traps focus and returns it on Escape", async ({ page }) => {
    await page.goto("/");
    const button = page.getByRole("button", { name: "Cookie settings" });
    await button.click();
    const dialog = page.getByRole("dialog", { name: "Cookie settings" });
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("does not use analytics");
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(button).toBeFocused();
  });
});
