import { breadcrumbsFor } from "@/lib/breadcrumbs";
import type { ArticleDoc, PageDoc } from "@/lib/types";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { Blocks } from "./Blocks";
import { Breadcrumbs } from "./Breadcrumbs";
import { JsonLd } from "./JsonLd";
import { SageMobileNav, SagePager, SageSideNav } from "./SageNav";
import Link from "next/link";
import { InfoIcon } from "./icons";

export function PageView({ page }: { page: PageDoc }) {
  const crumbs = page.path === "/" || page.template === "error" ? [] : breadcrumbsFor(page.path);
  const ld = crumbs.length > 1 ? <JsonLd data={breadcrumbJsonLd(crumbs)} /> : null;

  if (page.template === "sage") {
    const [hero, ...rest] = page.blocks;
    return (
      <>
        {ld}
        <Breadcrumbs crumbs={crumbs} />
        {hero ? <Blocks blocks={[hero]} compactHero={page.path !== "/products/sage/"} /> : null}
        <SageMobileNav current={page.path} />
        <div className="container sage-layout">
          <SageSideNav current={page.path} />
          <div className="sage-content">
            <Blocks blocks={rest} />
            <SagePager current={page.path} />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {ld}
      <Breadcrumbs crumbs={crumbs} />
      <Blocks blocks={page.blocks} compactHero={page.path !== "/"} />
    </>
  );
}

export function ArticleView({ article }: { article: ArticleDoc }) {
  const crumbs = breadcrumbsFor(article.path);
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={articleJsonLd(article)} />
      <Breadcrumbs crumbs={crumbs} />
      <article className="article container" data-provenance={article.provenance} style={{ position: "relative" }}>
        <span className="provenance-badge">{article.provenance === "provisional" ? "Provisional draft" : "Recovered"}</span>
        <header className="article__header">
          <p className="eyebrow">
            {article.category}
            {article.date ? <time dateTime={article.date}> · {article.date}</time> : null}
          </p>
          <h1 className="article__title">{article.title}</h1>
          <p className="article__standfirst">{article.description}</p>
          {article.author ? <p className="meta">By {article.author}</p> : null}
        </header>
        {article.bodyStatus === "pending-recovery" || !article.html ? (
          <div className="article__body">
            <div className="notice notice--pending" role="note">
              <h2 className="notice__title">
                <InfoIcon />
                Article text pending recovery
              </h2>
              <p className="notice__body">
                This article was published on the original site, but its text could not be recovered for the reconstruction. It
                will be restored from Vidran Labs&apos; archive rather than rewritten.
              </p>
            </div>
            <p>
              <Link className="link" href="/insights/">
                Back to all insights
              </Link>
            </p>
          </div>
        ) : (
          <div className="article__body rich" dangerouslySetInnerHTML={{ __html: article.html }} />
        )}
      </article>
    </>
  );
}
