import { describe, expect, it } from "vitest";
import { contactRoutes, footerNav, legalNav, primaryNav, sageNav } from "@/content/site";
import { legacyRedirects } from "@/content/redirects";
import { breadcrumbsFor } from "@/lib/breadcrumbs";
import { allPaths, getArticles, pages, parseFrontMatter } from "@/lib/content";
import type { Block } from "@/lib/types";

// Minimum known route inventory from the reconstruction mandate (§5).
const REQUIRED = [
  "/", "/company/", "/mission/", "/solutions/", "/industries/", "/products/", "/research/", "/research-agenda/",
  "/work/", "/insights/", "/newsroom/", "/careers/", "/contact/",
  "/start-a-project/", "/institutional-procurement/", "/partnerships/", "/support/",
  "/products/sage/", "/products/sage/interface/", "/products/sage/architecture/", "/products/sage/security/",
  "/products/sage/compatibility/", "/products/sage/roadmap/", "/products/sage/documentation/",
  "/products/sage/release-notes/", "/products/sage/faq/", "/products/sage/developer-platform/", "/products/sage/early-access/",
  "/responsible-technology/", "/accessibility/", "/privacy-policy/", "/cookie-policy/", "/terms-service/", "/opps/",
  "/digital-infrastructure-is-economic-infrastructure/", "/why-caribbean-technology-needs-regional-context/",
];

const paths = new Set(allPaths());

function linksIn(block: Block): string[] {
  const text = JSON.stringify(block);
  const md = [...text.matchAll(/\]\((\/[^)\s#]*)/g)].map((m) => m[1]!);
  const hrefs = [...text.matchAll(/"href":"(\/[^"#]*)/g)].map((m) => m[1]!);
  return [...md, ...hrefs];
}

describe("route inventory", () => {
  it("implements every route in the mandated inventory", () => {
    const missing = REQUIRED.filter((p) => !paths.has(p));
    expect(missing).toEqual([]);
  });

  it("has no duplicate paths and every path uses trailing-slash form", () => {
    const list = allPaths();
    expect(new Set(list).size).toBe(list.length);
    list.forEach((p) => expect(p).toMatch(/^\/([a-z0-9-]+\/)*$/));
  });

  it("gives every page a unique title and description", () => {
    const titles = pages.map((p) => p.title);
    const descs = pages.map((p) => p.description);
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descs).size).toBe(descs.length);
    pages.forEach((p) => {
      expect(p.description.length).toBeGreaterThan(40);
      expect(p.description.length).toBeLessThanOrEqual(200);
    });
  });

  it("starts every page with a hero (exactly one h1)", () => {
    pages.forEach((p) => {
      expect(p.blocks[0]?.type).toBe("hero");
      expect(p.blocks.filter((b) => b.type === "hero")).toHaveLength(1);
    });
  });
});

describe("links", () => {
  it("resolves every internal link in page content", () => {
    const broken: string[] = [];
    for (const page of pages) for (const block of page.blocks) for (const l of linksIn(block)) if (!paths.has(l)) broken.push(`${page.path} → ${l}`);
    expect(broken).toEqual([]);
  });

  it("resolves every navigation, footer, legal and Sage link", () => {
    const all = [...primaryNav.flatMap((i) => [i, ...(i.children ?? [])]), ...footerNav.flatMap((g) => g.items), ...legalNav, ...sageNav];
    expect(all.filter((i) => !paths.has(i.href)).map((i) => i.href)).toEqual([]);
  });

  it("hosts every contact route on an existing page", () => {
    contactRoutes.forEach((r) => expect(paths.has(r.href)).toBe(true));
  });

  it("covers every Sage page in the Sage navigation", () => {
    const sagePages = pages.filter((p) => p.template === "sage").map((p) => p.path).sort();
    expect(sageNav.map((n) => n.href).sort()).toEqual(sagePages);
  });

  it("redirects legacy URLs only to existing pages, never to themselves", () => {
    legacyRedirects.forEach((r) => {
      expect(paths.has(r.to)).toBe(true);
      expect(paths.has(r.from)).toBe(false);
    });
  });
});

describe("content integrity guards", () => {
  it("never describes Sage as available or released", () => {
    const sageText = JSON.stringify(pages.filter((p) => p.template === "sage")).toLowerCase();
    const claims = /(?<!not )(?:now available|download now|(?<!not )generally available|buy now|shipping now|is released)/g;
    expect(sageText.match(claims) ?? []).toEqual([]);
  });

  it("does not ship unrecovered articles as if their text were recovered", () => {
    getArticles().forEach((a) => {
      if (a.bodyStatus === "pending-recovery") expect(a.html).toBe("");
    });
  });
});

describe("breadcrumbs", () => {
  it("builds the Sage hierarchy", () => {
    expect(breadcrumbsFor("/products/sage/roadmap/").map((c) => c.label)).toEqual(["Home", "Products", "Sage", "Roadmap"]);
  });

  it("uses navigation groups for flat URLs", () => {
    expect(breadcrumbsFor("/start-a-project/").map((c) => c.href)).toEqual(["/", "/contact/", "/start-a-project/"]);
    expect(breadcrumbsFor("/why-caribbean-technology-needs-regional-context/")[1]?.href).toBe("/insights/");
  });
});

describe("front matter", () => {
  it("parses key/value pairs and body", () => {
    const { data, body } = parseFrontMatter("---\ntitle: A: B\ncategory: Insights\n---\nHello");
    expect(data).toEqual({ title: "A: B", category: "Insights" });
    expect(body).toBe("Hello");
  });
});
