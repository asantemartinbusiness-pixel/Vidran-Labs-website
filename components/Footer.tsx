import Link from "next/link";
import { footerNav, legalNav, site } from "@/content/site";
import { CookieSettingsButton } from "./ConsentManager";
import { Wordmark } from "./Wordmark";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__top">
          <div>
            <Wordmark />
            <p className="site-footer__tagline">{site.tagline}</p>
          </div>
          <nav className="site-footer__cols" aria-label="Footer">
            {footerNav.map((group) => (
              <div key={group.title}>
                <h2 className="site-footer__heading">{group.title}</h2>
                <ul className="site-footer__list">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href}>{item.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className="site-footer__bottom">
          <nav aria-label="Legal">
            <ul className="site-footer__legal">
              {legalNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
              <li>
                <CookieSettingsButton />
              </li>
            </ul>
          </nav>
          <p className="site-footer__copy">
            © {year} {site.legalName}
          </p>
        </div>
      </div>
    </footer>
  );
}
