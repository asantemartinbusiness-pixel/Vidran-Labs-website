import Link from "next/link";
import type { Crumb } from "@/lib/breadcrumbs";

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  if (crumbs.length < 2) return null;
  return (
    <nav className="breadcrumbs container" aria-label="Breadcrumb">
      <ol className="breadcrumbs__list">
        {crumbs.map((c, i) => (
          <li key={c.href} className="breadcrumbs__item">
            {i === crumbs.length - 1 ? <span aria-current="page">{c.label}</span> : <Link href={c.href}>{c.label}</Link>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
