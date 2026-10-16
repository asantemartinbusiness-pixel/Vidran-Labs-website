import { primaryNav } from "@/content/site";
import { getArticle, getPage } from "./content";
import { normalisePath } from "./paths";

export interface Crumb {
  label: string;
  href: string;
}

function labelFor(path: string): string {
  const page = getPage(path);
  if (page) return page.navLabel ?? page.title;
  return getArticle(path)?.title ?? path;
}

/** Logical parent: URL hierarchy first, then the navigation group a page sits in. */
function parentOf(path: string): string | null {
  if (path === "/") return null;
  const segments = path.split("/").filter(Boolean);
  if (segments.length > 1) return `/${segments.slice(0, -1).join("/")}/`;
  if (getArticle(path)) return "/insights/";
  for (const group of primaryNav) {
    if (group.children?.some((c) => normalisePath(c.href) === path) && normalisePath(group.href) !== path) {
      return normalisePath(group.href);
    }
  }
  return "/";
}

export function breadcrumbsFor(p: string): Crumb[] {
  const path = normalisePath(p);
  const trail: Crumb[] = [];
  let cur: string | null = path;
  const seen = new Set<string>();
  while (cur && !seen.has(cur)) {
    seen.add(cur);
    trail.unshift({ label: cur === "/" ? "Home" : labelFor(cur), href: cur });
    cur = parentOf(cur);
  }
  if (trail[0]?.href !== "/") trail.unshift({ label: "Home", href: "/" });
  return trail;
}
