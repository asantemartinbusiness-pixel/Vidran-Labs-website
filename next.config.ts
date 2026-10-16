import type { NextConfig } from "next";
import { legacyRedirects } from "./content/redirects";

const isDev = process.env.NODE_ENV !== "production";

// Static corporate site: no third-party scripts, no remote images, no embeds.
// 'unsafe-inline' for scripts is required by Next.js inline bootstrap on statically
// generated pages without per-request nonces. See docs/security-review.md.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  `connect-src 'self'${isDev ? " ws:" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "manifest-src 'self'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  ...(isDev ? [] : [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" }]),
];

const indexing = process.env.SITE_INDEXING === "on";

const nextConfig: NextConfig = {
  // WordPress used trailing-slash URLs; preserve them exactly.
  trailingSlash: true,
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          ...securityHeaders,
          ...(indexing ? [] : [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]),
        ],
      },
    ];
  },
  async redirects() {
    return legacyRedirects.map((r) => ({ source: r.from, destination: r.to, permanent: r.permanent }));
  },
};

export default nextConfig;
