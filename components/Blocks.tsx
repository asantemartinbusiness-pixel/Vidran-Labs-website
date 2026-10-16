import Link from "next/link";
import type { ReactNode } from "react";
import { contactRoutes, footerNav, getContactRoute } from "@/content/site";
import { getArticles } from "@/lib/content";
import { inline } from "@/lib/inline";
import type { Action, Block, DevelopmentStatus, Provenance } from "@/lib/types";
import { EnquiryComposer } from "./EnquiryComposer";
import { Arrow, InfoIcon } from "./icons";

const STATUS_LABEL: Record<DevelopmentStatus, string> = {
  research: "Research",
  "in-development": "In development",
  planned: "Planned",
  exploratory: "Exploratory",
};

const PROVENANCE_LABEL: Record<Provenance, string> = {
  verified: "Verified",
  indexed: "Recovered · index",
  brief: "Owner brief",
  provisional: "Provisional draft",
};

function Rich({ text, as: Tag = "p", className }: { text: string; as?: "p" | "span" | "dd" | "div"; className?: string }) {
  return <Tag className={className ? `rich ${className}` : "rich"} dangerouslySetInnerHTML={{ __html: inline(text) }} />;
}

function Actions({ actions }: { actions: Action[] }) {
  return (
    <div className="btn-group">
      {actions.map((a) => (
        <Link key={a.href + a.label} href={a.href} className={`btn${a.variant && a.variant !== "primary" ? ` btn--${a.variant}` : ""}`}>
          {a.label}
          {a.variant === "text" ? <Arrow /> : null}
        </Link>
      ))}
    </div>
  );
}

function Eyebrow({ text, index }: { text?: string; index?: number }) {
  if (!text) return null;
  return (
    <p className="eyebrow">
      {index !== undefined ? <span className="eyebrow__index">{String(index).padStart(2, "0")}</span> : null}
      {text}
    </p>
  );
}

function Section({
  block,
  children,
  className = "",
  head,
}: {
  block: Block;
  children: ReactNode;
  className?: string;
  head?: ReactNode;
}) {
  return (
    <section className={`block ${className}`} data-provenance={block.provenance} id={block.id}>
      <span className="provenance-badge">{PROVENANCE_LABEL[block.provenance]}</span>
      <div className="container">
        {head ? (
          <div className="section-grid">
            <div className="section-grid__head">{head}</div>
            <div>{children}</div>
          </div>
        ) : (
          children
        )}
      </div>
    </section>
  );
}

function Head({ eyebrow, title, intro, level = 2, index }: { eyebrow?: string; title?: string; intro?: string; level?: 2 | 3; index?: number }) {
  const H = level === 2 ? "h2" : "h3";
  return (
    <div className="section-head">
      <Eyebrow text={eyebrow} index={index} />
      {title ? <H className="section-head__title">{title}</H> : null}
      {intro ? <Rich text={intro} className="section-head__intro" /> : null}
    </div>
  );
}

export function BlockView({ block, isFirst, compactHero, sectionIndex }: { block: Block; isFirst: boolean; compactHero?: boolean; sectionIndex?: number }) {
  switch (block.type) {
    case "hero": {
      const dark = block.tone === "dark";
      const Title = isFirst ? "h1" : "h2";
      return (
        <section
          className={`block hero${compactHero ? " hero--compact" : ""}${dark ? " on-dark hero--grid" : ""}`}
          data-provenance={block.provenance}
        >
          <span className="provenance-badge">{PROVENANCE_LABEL[block.provenance]}</span>
          <div className="container">
            <div className="hero__inner">
              <Eyebrow text={block.eyebrow} />
              <Title className="hero__title">{block.title}</Title>
              {block.lede ? <Rich text={block.lede} className="hero__lede" /> : null}
              {block.actions ? <Actions actions={block.actions} /> : null}
            </div>
          </div>
        </section>
      );
    }

    case "prose":
      return (
        <Section block={block} head={<Head eyebrow={block.eyebrow} title={block.title} index={sectionIndex} />}>
          <div className="prose">
            {block.paragraphs.map((p, i) => (
              <Rich key={i} text={p} />
            ))}
            {block.aside ? <p className="pullquote">{block.aside}</p> : null}
          </div>
        </Section>
      );

    case "cards":
      return (
        <Section block={block}>
          <div className="section-head section-head--stack">
            <Eyebrow text={block.eyebrow} index={sectionIndex} />
            {block.title ? <h2 className="section-head__title">{block.title}</h2> : null}
            {block.intro ? <Rich text={block.intro} className="section-head__intro" /> : null}
          </div>
          <ul className={`rule-grid rule-grid--${block.columns ?? 3}`}>
            {block.items.map((item) => (
              <li key={item.title} className={`card${item.href ? " card--link" : ""}`}>
                {item.meta ? <p className="meta">{item.meta}</p> : null}
                <h3 className="card__title">
                  {item.href ? (
                    <Link href={item.href} className="card__link">
                      {item.title}
                    </Link>
                  ) : (
                    item.title
                  )}
                </h3>
                <Rich text={item.body} className="card__body" />
                {item.href ? (
                  <span className="card__more" aria-hidden="true">
                    Learn more <Arrow />
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </Section>
      );

    case "steps":
      return (
        <Section block={block} head={<Head eyebrow={block.eyebrow} title={block.title} intro={block.intro} index={sectionIndex} />}>
          <ol className="steps">
            {block.items.map((s) => (
              <li key={s.title} className="steps__item">
                <h3 className="steps__title">{s.title}</h3>
                <Rich text={s.body} className="steps__body" />
              </li>
            ))}
          </ol>
        </Section>
      );

    case "definitions":
      return (
        <Section block={block} head={<Head eyebrow={block.eyebrow} title={block.title} intro={block.intro} index={sectionIndex} />}>
          <dl className="defs">
            {block.items.map((d) => (
              <div key={d.term} className="defs__row">
                <dt>{d.term}</dt>
                <Rich as="dd" text={d.detail} />
              </div>
            ))}
          </dl>
        </Section>
      );

    case "status":
      return (
        <Section block={block} head={<Head eyebrow={block.eyebrow} title={block.title} intro={block.intro} index={sectionIndex} />}>
          <table className="status-table">
            <caption className="visually-hidden">{block.title}</caption>
            <thead>
              <tr>
                <th scope="col">Item</th>
                <th scope="col">Status</th>
                <th scope="col">Notes</th>
              </tr>
            </thead>
            <tbody>
              {block.rows.map((r) => (
                <tr key={r.item}>
                  <th scope="row">{r.item}</th>
                  <td>
                    <span className={`chip chip--${r.status}`}>{STATUS_LABEL[r.status]}</span>
                  </td>
                  <td>{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      );

    case "faq":
      return (
        <Section block={block} head={<Head eyebrow={block.eyebrow} title={block.title} index={sectionIndex} />}>
          <div className="faq">
            {block.items.map((f) => (
              <details key={f.q} className="faq__item">
                <summary className="faq__q">
                  {f.q}
                  <span className="faq__icon" aria-hidden="true" />
                </summary>
                <Rich text={f.a} className="faq__a" />
              </details>
            ))}
          </div>
        </Section>
      );

    case "routes": {
      const routes = block.routes.map((id) => contactRoutes.find((r) => r.id === id)!);
      return (
        <Section block={block}>
          <div className="section-head section-head--stack">
            <Eyebrow text={block.eyebrow} index={sectionIndex} />
            <h2 className="section-head__title">{block.title}</h2>
            {block.intro ? <Rich text={block.intro} className="section-head__intro" /> : null}
          </div>
          <ul className={`rule-grid rule-grid--${routes.length >= 4 ? 4 : 2}`}>
            {routes.map((r) => (
              <li key={r.id} className="card card--link">
                <h3 className="card__title">
                  <Link href={r.href} className="card__link">
                    {r.label}
                  </Link>
                </h3>
                <p className="card__body">{r.summary}</p>
                <span className="card__more" aria-hidden="true">
                  Continue <Arrow />
                </span>
              </li>
            ))}
          </ul>
        </Section>
      );
    }

    case "enquiry": {
      const route = getContactRoute(block.route);
      return (
        <section className="block block--alt" data-provenance={block.provenance} id="enquiry">
          <span className="provenance-badge">{PROVENANCE_LABEL[block.provenance]}</span>
          <div className="container">
            <div className="section-grid">
              <div className="section-grid__head">
                <Head eyebrow="Enquiry" title={block.title ?? route.label} intro={block.intro} />
              </div>
              <EnquiryComposer route={route} />
            </div>
          </div>
        </section>
      );
    }

    case "articles": {
      const all = getArticles();
      const items = block.limit ? all.slice(0, block.limit) : all;
      return (
        <Section block={block}>
          <div className="section-head section-head--stack">
            <Eyebrow text={block.eyebrow} index={sectionIndex} />
            <h2 className="section-head__title">{block.title}</h2>
          </div>
          {items.length === 0 ? (
            <p className="empty-state">No articles have been published yet.</p>
          ) : (
            <ul className="article-list">
              {items.map((a) => (
                <li key={a.slug} className="article-list__item">
                  <p className="meta">
                    {a.category}
                    {a.date ? ` · ${a.date}` : ""}
                  </p>
                  <div>
                    <h3 className="article-list__title">
                      <Link href={a.path}>{a.title}</Link>
                    </h3>
                    <p className="article-list__desc">{a.description}</p>
                  </div>
                  <span className="card__more" aria-hidden="true">
                    Read <Arrow />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Section>
      );
    }

    case "notice":
      return (
        <section className="block block--tight" data-provenance={block.provenance}>
          <span className="provenance-badge">{PROVENANCE_LABEL[block.provenance]}</span>
          <div className="container">
            <div className={`notice${block.tone === "pending" ? " notice--pending" : ""}`} role="note">
              <h2 className="notice__title">
                <InfoIcon />
                {block.title}
              </h2>
              <Rich text={block.body} className="notice__body" />
            </div>
          </div>
        </section>
      );

    case "cta":
      return (
        <Section block={block}>
          <div className="cta">
            <div>
              <h2 className="cta__title">{block.title}</h2>
              {block.body ? <Rich text={block.body} className="cta__body" /> : null}
            </div>
            <Actions actions={block.actions} />
          </div>
        </Section>
      );

    case "sitemap":
      return (
        <Section block={block}>
          <h2 className="section-head__title section-head--stack">{block.title}</h2>
          <div className="link-columns">
            {footerNav.map((group) => (
              <div key={group.title}>
                <h3 className="meta">{group.title}</h3>
                <ul>
                  {group.items.map((i) => (
                    <li key={i.href}>
                      <Link className="link" href={i.href}>
                        {i.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      );
  }
}

export function Blocks({ blocks, compactHero }: { blocks: Block[]; compactHero?: boolean }) {
  let n = 0;
  return (
    <>
      {blocks.map((block, i) => {
        const numbered = ["cards", "steps", "definitions", "status", "prose", "routes", "articles"].includes(block.type) && "eyebrow" in block && block.eyebrow;
        return <BlockView key={i} block={block} isFirst={i === 0} compactHero={compactHero} sectionIndex={numbered ? ++n : undefined} />;
      })}
    </>
  );
}
