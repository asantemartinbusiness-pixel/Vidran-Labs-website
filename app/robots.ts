import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { indexingEnabled } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  if (!indexingEnabled) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/", disallow: ["/opps/"] }, sitemap: `${site.url}/sitemap.xml` };
}
