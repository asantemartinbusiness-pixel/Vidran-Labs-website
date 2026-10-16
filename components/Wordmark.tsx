import Link from "next/link";
import { site } from "@/content/site";

/**
 * PROVISIONAL wordmark. The original Vidran Labs logo could not be recovered
 * (docs/asset-manifest.md, A-01). Replace this component's SVG with the
 * approved logo asset when supplied.
 */
export function Wordmark() {
  return (
    <Link href="/" className="wordmark" aria-label={`${site.name} — home`}>
      <svg className="wordmark__mark" viewBox="0 0 22 22" aria-hidden="true" focusable="false">
        <rect x="0.75" y="0.75" width="20.5" height="20.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5 6l6 10 6-10" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <span>
        <span className="wordmark__name">Vidran</span> <span className="wordmark__suffix">Labs</span>
      </span>
    </Link>
  );
}
