import { marked } from "marked";

/**
 * Render trusted, repository-authored inline Markdown (links, emphasis, code).
 * Content is never user-supplied; raw HTML in source strings is escaped.
 */
const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function inline(text: string): string {
  return marked.parseInline(escapeHtml(text), { async: false }) as string;
}

export function markdown(text: string): string {
  return marked.parse(text, { async: false }) as string;
}
