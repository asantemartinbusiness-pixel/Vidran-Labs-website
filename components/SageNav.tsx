import Link from "next/link";
import { sageNav } from "@/content/site";
import { Chevron } from "./icons";

export function SageSideNav({ current }: { current: string }) {
  return (
    <nav className="sage-sidenav" aria-label="Sage">
      <p className="eyebrow sage-sidenav__title">Sage</p>
      <ul className="sage-sidenav__list">
        {sageNav.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="sage-sidenav__link" aria-current={item.href === current ? "page" : undefined}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function SageMobileNav({ current }: { current: string }) {
  const here = sageNav.find((i) => i.href === current);
  return (
    <div className="container">
      <details className="sage-mobilenav">
        <summary>
          <span>
            <span className="meta">Sage · </span>
            {here?.label ?? "Overview"}
          </span>
          <Chevron />
        </summary>
        <nav aria-label="Sage">
          <ul>
            {sageNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={item.href === current ? "page" : undefined}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </details>
    </div>
  );
}

export function SagePager({ current }: { current: string }) {
  const i = sageNav.findIndex((n) => n.href === current);
  const prev = i > 0 ? sageNav[i - 1] : undefined;
  const next = i >= 0 && i < sageNav.length - 1 ? sageNav[i + 1] : undefined;
  return (
    <nav className="pager" aria-label="Sage pages">
      {prev ? (
        <Link href={prev.href} className="pager__link" rel="prev">
          <span className="meta">Previous</span>
          <span className="pager__title">{prev.label}</span>
        </Link>
      ) : null}
      {next ? (
        <Link href={next.href} className="pager__link pager__link--next" rel="next">
          <span className="meta">Next</span>
          <span className="pager__title">{next.label}</span>
        </Link>
      ) : null}
    </nav>
  );
}
