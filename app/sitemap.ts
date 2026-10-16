import type { MetadataRoute } from "next";
import { getArticles, pages } from "@/lib/content";
import { absoluteUrl } from "@/lib/paths";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...pages.filter((p) => !p.noindex).map((p) => ({ url: absoluteUrl(p.path) })),
    ...getArticles().map((a) => ({ url: absoluteUrl(a.path), ...(a.date ? { lastModified: a.date } : {}) })),
  ];
}
