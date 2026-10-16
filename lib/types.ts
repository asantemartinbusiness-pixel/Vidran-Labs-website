/**
 * Content provenance. Every rendered block declares where its words came from,
 * so reviewers can separate recovered source material from drafted copy.
 *
 * - indexed:     recovered from a search-index snapshot of vidran.net; wording unconfirmed.
 * - brief:       stated by Vidran Labs in the reconstruction brief (owner-supplied).
 * - provisional: drafted during reconstruction because the source is unrecoverable.
 *                Must be approved or replaced before production (release gate).
 * - verified:    confirmed against original source or approved by Vidran Labs.
 */
export type Provenance = "verified" | "indexed" | "brief" | "provisional";

export interface Action {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "text";
}

export interface CardItem {
  title: string;
  body: string;
  href?: string;
  meta?: string;
}

export type DevelopmentStatus = "research" | "in-development" | "planned" | "exploratory";

interface BlockBase {
  provenance: Provenance;
  id?: string;
}

export type Block =
  | (BlockBase & {
      type: "hero";
      eyebrow?: string;
      title: string;
      lede?: string;
      actions?: Action[];
      /** "dark" renders the carbon porthole panel (stands in for photography). */
      tone?: "light" | "dark";
      /** Small caption card on a dark panel, linking to a featured item. */
      feature?: { label: string; title: string; href: string };
    })
  | (BlockBase & { type: "prose"; eyebrow?: string; title?: string; paragraphs: string[]; aside?: string })
  | (BlockBase & { type: "cards"; eyebrow?: string; title?: string; intro?: string; columns?: 2 | 3 | 4; items: CardItem[] })
  | (BlockBase & { type: "steps"; eyebrow?: string; title: string; intro?: string; items: { title: string; body: string }[] })
  | (BlockBase & { type: "definitions"; eyebrow?: string; title: string; intro?: string; items: { term: string; detail: string }[] })
  | (BlockBase & {
      type: "status";
      eyebrow?: string;
      title: string;
      intro?: string;
      rows: { item: string; status: DevelopmentStatus; note: string }[];
    })
  | (BlockBase & { type: "faq"; eyebrow?: string; title: string; items: { q: string; a: string }[] })
  | (BlockBase & { type: "routes"; eyebrow?: string; title: string; intro?: string; routes: ContactRouteId[] })
  | (BlockBase & { type: "enquiry"; route: ContactRouteId; title?: string; intro?: string })
  | (BlockBase & { type: "articles"; eyebrow?: string; title: string; intro?: string; limit?: number })
  | (BlockBase & { type: "notice"; tone: "info" | "pending"; title: string; body: string })
  | (BlockBase & { type: "cta"; title: string; body?: string; actions: Action[] })
  | (BlockBase & { type: "sitemap"; title: string });

export type Template = "standard" | "sage" | "legal" | "error";

export interface PageDoc {
  /** Canonical path with leading and trailing slash, e.g. "/products/sage/". */
  path: string;
  /** Document <title> (site name is appended). */
  title: string;
  /** Short label used in breadcrumbs and sub-navigation. */
  navLabel?: string;
  description: string;
  template: Template;
  noindex?: boolean;
  /** Provenance of title + description metadata. */
  metaProvenance: Provenance;
  blocks: Block[];
}

export interface ArticleDoc {
  path: string;
  slug: string;
  title: string;
  description: string;
  date?: string;
  author?: string;
  category: "Insights" | "Newsroom" | "Research";
  provenance: Provenance;
  bodyStatus: "recovered" | "pending-recovery" | "draft";
  html: string;
}

export type ContactRouteId =
  | "general"
  | "start-a-project"
  | "institutional"
  | "partnerships"
  | "support"
  | "sage-early-access"
  | "careers"
  | "media"
  | "research";

export interface EnquiryField {
  name: string;
  label: string;
  kind: "text" | "textarea" | "select";
  required: boolean;
  maxLength: number;
  options?: string[];
  hint?: string;
  autoComplete?: string;
  /** Error shown when a required field is empty; defaults to "Enter …" / "Choose …". */
  requiredMessage?: string;
}

export interface ContactRoute {
  id: ContactRouteId;
  label: string;
  summary: string;
  /** Page that hosts this pathway. */
  href: string;
  email: string;
  /** Provenance of the recipient address. Provisional addresses block release. */
  emailProvenance: Provenance;
  subjectPrefix: string;
  fields: EnquiryField[];
}

export interface NavItem {
  label: string;
  href: string;
  description?: string;
  children?: NavItem[];
}
