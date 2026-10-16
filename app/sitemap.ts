import type { MetadataRoute } from "next";
import { getArticles, isIndexableArticle, pages } from "@/lib/content";
import { absoluteUrl } from "@/lib/paths";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...pages.filter((p) => !p.noindex && p.template !== "error").map((p) => ({ url: absoluteUrl(p.path) })),
    ...getArticles()
      .filter(isIndexableArticle)
      .map((a) => ({ url: absoluteUrl(a.path), ...(a.date ? { lastModified: a.date } : {}) })),
  ];
}
