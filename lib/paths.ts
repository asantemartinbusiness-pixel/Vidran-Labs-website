import { site } from "@/content/site";

export function normalisePath(path: string): string {
  let p = path.startsWith("/") ? path : `/${path}`;
  if (!p.endsWith("/")) p = `${p}/`;
  return p.replace(/\/{2,}/g, "/");
}

export function absoluteUrl(path: string): string {
  return `${site.url}${normalisePath(path)}`;
}

export function isActivePath(current: string, href: string): boolean {
  const c = normalisePath(current);
  const h = normalisePath(href);
  return h === "/" ? c === "/" : c === h || c.startsWith(h);
}
