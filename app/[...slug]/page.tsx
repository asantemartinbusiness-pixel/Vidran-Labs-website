import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleView, PageView } from "@/components/PageView";
import { allPaths, getArticle, getPage, isIndexableArticle } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

// Only known content paths exist; everything else is a genuine 404.
export const dynamicParams = false;

type Props = { params: Promise<{ slug: string[] }> };

export function generateStaticParams() {
  return allPaths()
    .filter((p) => p !== "/")
    .map((p) => ({ slug: p.split("/").filter(Boolean) }));
}

const toPath = (slug: string[]) => `/${slug.join("/")}/`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const path = toPath((await params).slug);
  const page = getPage(path);
  if (page) return pageMetadata({ path, title: page.title, description: page.description, noindex: page.noindex });
  const article = getArticle(path);
  if (article)
    return pageMetadata({ path, title: article.title, description: article.description, type: "article", noindex: !isIndexableArticle(article) });
  return {};
}

export default async function ContentPage({ params }: Props) {
  const path = toPath((await params).slug);
  const page = getPage(path);
  if (page) return <PageView page={page} />;
  const article = getArticle(path);
  if (article) return <ArticleView article={article} />;
  notFound();
}
