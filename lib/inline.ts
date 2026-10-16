import { Marked, type Tokens } from "marked";

/**
 * Markdown for repository-authored content and restored articles.
 * Defence in depth: raw HTML is always escaped (never passed through), and link/image
 * URLs are restricted to relative paths, fragments, http(s) and mailto.
 */
const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

export function isSafeUrl(href: string): boolean {
  const url = href.trim();
  if (url.startsWith("//") || url.startsWith("\\")) return false; // protocol-relative → another origin
  if (/^(\/(?!\/)|#|\.\.?\/)/.test(url)) return true; // relative path or fragment (not protocol-relative //)
  if (!/^[a-z][a-z0-9+.-]*:/i.test(url)) return !url.includes(":"); // bare relative like "page/"
  return /^(https?:|mailto:)/i.test(url);
}

const md = new Marked({
  gfm: true,
  walkTokens(token) {
    if ((token.type === "link" || token.type === "image") && !isSafeUrl((token as Tokens.Link).href)) {
      (token as Tokens.Link).href = "#";
    }
  },
  renderer: {
    html(token) {
      return escapeHtml(token.text);
    },
  },
});

export function inline(text: string): string {
  return md.parseInline(text, { async: false }) as string;
}

export function markdown(text: string): string {
  return md.parse(text, { async: false }) as string;
}
