/**
 * Legacy URLs from the previous site generation that appear in search indexes
 * (see docs/route-manifest.md). They are PROPOSED redirects pending approval,
 * so they are temporary (307) until the redirect plan is signed off.
 * Switch `permanent` to true only after approval.
 */
export interface LegacyRedirect {
  from: string;
  to: string;
  permanent: boolean;
  status: "proposed" | "approved";
  evidence: string;
}

export const legacyRedirects: LegacyRedirect[] = [
  { from: "/about-us/", to: "/company/", permanent: false, status: "proposed", evidence: "Indexed 'About Us' page of the earlier site generation" },
  { from: "/contact-us/", to: "/contact/", permanent: false, status: "proposed", evidence: "Indexed as 'Page Not Found'; carried the contact-route list" },
  { from: "/portfolio/vidran-labs/", to: "/products/sage/", permanent: false, status: "proposed", evidence: "Indexed page describing Sage o.1 (earlier generation)" },
];
