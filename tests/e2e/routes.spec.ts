import { expect, test } from "@playwright/test";
import { ARTICLES, PAGES, PATHS, SITE_URL } from "./helpers";

test.describe("every route", () => {
  for (const path of PATHS) {
    test(`renders ${path}`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("main#main")).toBeVisible();
      await expect(page.locator("header.site-header")).toBeVisible();
      await expect(page.locator("footer.site-footer")).toBeVisible();
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${SITE_URL}${path}`);
      const desc = await page.locator('meta[name="description"]').getAttribute("content");
      expect(desc?.length ?? 0).toBeGreaterThan(40);
      await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
      // Headings must not skip levels (h1 → h3 without h2).
      const levels = await page.locator("main h1, main h2, main h3, main h4").evaluateAll((els) => els.map((e) => Number(e.tagName[1])));
      for (let i = 1; i < levels.length; i++) expect(levels[i]! - levels[i - 1]!).toBeLessThanOrEqual(1);
      expect(errors).toEqual([]);
    });
  }

  test("page titles are unique", async ({ page }) => {
    const titles = new Set<string>();
    for (const path of PATHS) {
      await page.goto(path);
      titles.add(await page.title());
    }
    expect(titles.size).toBe(PATHS.length);
  });
});

test.describe("status codes", () => {
  test("unknown URLs return a genuine 404 with the error page design", async ({ page }) => {
    const res = await page.goto("/this-page-does-not-exist/");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1, name: "Page not found" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Go to the homepage" })).toHaveAttribute("href", "/");
  });

  test("nested unknown URLs under real sections also 404", async ({ request }) => {
    expect((await request.get("/products/sage/not-a-page/")).status()).toBe(404);
  });

  test("/opps/ shows the original Page Not Found content with a genuine 404 status", async ({ page }) => {
    const res = await page.goto("/opps/");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1, name: "Page not found" })).toBeVisible();
  });

  test("proposed legacy redirects are temporary until approved", async ({ request }) => {
    const res = await request.get("/about-us/", { maxRedirects: 0 });
    expect(res.status()).toBe(307);
    expect(res.headers()["location"]).toBe("/company/");
  });

  test("URLs without a trailing slash are normalised", async ({ request }) => {
    const res = await request.get("/company", { maxRedirects: 0 });
    expect(res.status()).toBe(308);
    expect(res.headers()["location"]).toBe("/company/");
  });
});

test.describe("responsive layout", () => {
  const widths = [320, 375, 430, 768, 1024, 1440, 1920];
  for (const width of widths) {
    test(`no horizontal overflow on any page at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      const offenders: string[] = [];
      for (const path of PATHS) {
        await page.goto(path);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        if (overflow > 0) offenders.push(`${path} (+${overflow}px)`);
      }
      expect(offenders).toEqual([]);
    });
  }

  test("touch targets in the header and footer are at least 24px (WCAG 2.5.8)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/");
    const small = await page.locator("header a, header button, footer a, footer button").evaluateAll((els) =>
      els
        .filter((e) => (e as HTMLElement).offsetParent !== null)
        .map((e) => ({ t: e.textContent?.trim(), r: e.getBoundingClientRect() }))
        .filter(({ r }) => r.height < 24 || r.width < 24)
        .map(({ t }) => t),
    );
    expect(small).toEqual([]);
  });
});

test.describe("security headers", () => {
  test("pages send CSP and hardening headers", async ({ request }) => {
    const h = (await request.get("/")).headers();
    expect(h["content-security-policy"]).toContain("default-src 'self'");
    expect(h["content-security-policy"]).toContain("frame-ancestors 'none'");
    expect(h["x-content-type-options"]).toBe("nosniff");
    expect(h["x-frame-options"]).toBe("DENY");
    expect(h["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(h["x-powered-by"]).toBeUndefined();
  });

  test("no third-party requests are made", async ({ page }) => {
    const external: string[] = [];
    page.on("request", (r) => {
      const u = new URL(r.url());
      if (!["localhost", "127.0.0.1"].includes(u.hostname) && u.protocol.startsWith("http")) external.push(r.url());
    });
    for (const p of ["/", "/products/sage/", "/start-a-project/", "/digital-infrastructure-is-economic-infrastructure/"]) {
      await page.goto(p, { waitUntil: "networkidle" });
    }
    expect(external).toEqual([]);
  });
});

test.describe("search infrastructure", () => {
  test("sitemap lists every indexable page and no thin or error pages", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    for (const p of PAGES.filter((pg) => !pg.noindex && pg.template !== "error")) expect(xml).toContain(`<loc>${SITE_URL}${p.path}</loc>`);
    for (const a of ARTICLES) expect(xml.includes(`<loc>${SITE_URL}${a.path}</loc>`)).toBe(a.bodyStatus === "recovered");
    expect(xml).not.toContain("/opps/");
  });

  test("review builds are not indexable", async ({ request, page }) => {
    expect(await (await request.get("/robots.txt")).text()).toContain("Disallow: /");
    expect((await request.get("/")).headers()["x-robots-tag"]).toContain("noindex");
    await page.goto("/");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });

  test("structured data is valid JSON with organisation and breadcrumbs", async ({ page }) => {
    await page.goto("/products/sage/roadmap/");
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    const types = blocks.map((b) => JSON.parse(b)["@type"]);
    expect(types).toEqual(expect.arrayContaining(["Organization", "WebSite", "BreadcrumbList"]));
  });

  test("articles carry Article structured data", async ({ page }) => {
    await page.goto("/why-caribbean-technology-needs-regional-context/");
    const types = (await page.locator('script[type="application/ld+json"]').allTextContents()).map((b) => JSON.parse(b)["@type"]);
    expect(types).toContain("Article");
  });

  test("social preview image is served", async ({ request }) => {
    const res = await request.get("/opengraph-image/");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("image/png");
  });
});
