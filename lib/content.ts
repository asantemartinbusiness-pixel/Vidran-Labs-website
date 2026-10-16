import fs from "node:fs";
import path from "node:path";
import { corePages } from "@/content/pages/core";
import { researchPages } from "@/content/pages/research";
import { contactPages } from "@/content/pages/contact";
import { sagePages } from "@/content/pages/sage";
import { trustPages } from "@/content/pages/trust";
import type { ArticleDoc, PageDoc, Provenance } from "./types";
import { markdown } from "./inline";
import { normalisePath } from "./paths";

export const pages: PageDoc[] = [...corePages, ...researchPages, ...contactPages, ...sagePages, ...trustPages];

const ARTICLE_DIR = path.join(process.cwd(), "content", "articles");

/** Minimal front-matter parser: `key: value` lines between --- fences. */
export function parseFrontMatter(source: string): { data: Record<string, string>; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(source);
  if (!match) return { data: {}, body: source };
  const data: Record<string, string> = {};
  for (const line of match[1]!.split(/\r?\n/)) {
    const i = line.indexOf(":");
    if (i > 0) data[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
  }
  return { data, body: match[2] ?? "" };
}

let articleCache: ArticleDoc[] | null = null;

export function getArticles(): ArticleDoc[] {
  if (articleCache) return articleCache;
  const files = fs.existsSync(ARTICLE_DIR) ? fs.readdirSync(ARTICLE_DIR).filter((f) => f.endsWith(".md")) : [];
  articleCache = files
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const { data, body } = parseFrontMatter(fs.readFileSync(path.join(ARTICLE_DIR, file), "utf8"));
      if (!data.title || !data.description) throw new Error(`Article ${file} is missing title or description`);
      return {
        slug,
        path: `/${slug}/`,
        title: data.title,
        description: data.description,
        date: data.date || undefined,
        author: data.author || undefined,
        category: (data.category as ArticleDoc["category"]) ?? "Insights",
        provenance: (data.provenance as Provenance) ?? "provisional",
        bodyStatus: (data.bodyStatus as ArticleDoc["bodyStatus"]) ?? "draft",
        html: body.trim() ? markdown(body) : "",
      } satisfies ArticleDoc;
    })
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? "") || a.title.localeCompare(b.title));
  return articleCache;
}

export function getPage(p: string): PageDoc | undefined {
  const n = normalisePath(p);
  return pages.find((d) => d.path === n);
}

export function getArticle(p: string): ArticleDoc | undefined {
  const n = normalisePath(p);
  return getArticles().find((a) => a.path === n);
}

/** Every routable path, for static generation, sitemap and tests. */
export function allPaths(): string[] {
  return [...pages.map((p) => p.path), ...getArticles().map((a) => a.path)];
}
