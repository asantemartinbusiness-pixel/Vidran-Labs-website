import type { Metadata } from "next";
import { site } from "@/content/site";
import type { Crumb } from "./breadcrumbs";
import { absoluteUrl } from "./paths";

export const indexingEnabled = process.env.SITE_INDEXING === "on";

export function pageMetadata({
  path,
  title,
  description,
  noindex,
  type = "website",
}: {
  path: string;
  title: string;
  description: string;
  noindex?: boolean;
  type?: "website" | "article";
}): Metadata {
  const fullTitle = path === "/" ? title : `${title} | ${site.name}`;
  const index = indexingEnabled && !noindex;
  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: absoluteUrl(path) },
    robots: index ? { index: true, follow: true } : { index: false, follow: !noindex },
    openGraph: {
      type,
      url: absoluteUrl(path),
      title: fullTitle,
      description,
      siteName: site.name,
      locale: "en",
    },
    twitter: { card: "summary_large_image", title: fullTitle, description },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    legalName: site.legalName,
    url: `${site.url}/`,
    slogan: site.tagline,
  };
}

export function websiteJsonLd() {
  return { "@context": "https://schema.org", "@type": "WebSite", name: site.name, url: `${site.url}/` };
}

export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, item: absoluteUrl(c.href) })),
  };
}

export function articleJsonLd(a: { path: string; title: string; description: string; date?: string; author?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.description,
    mainEntityOfPage: absoluteUrl(a.path),
    publisher: { "@type": "Organization", name: site.legalName },
    ...(a.date ? { datePublished: a.date } : {}),
    ...(a.author ? { author: { "@type": "Person", name: a.author } } : { author: { "@type": "Organization", name: site.name } }),
  };
}
