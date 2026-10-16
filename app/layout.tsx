import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter/wght.css";
import "@fontsource-variable/jetbrains-mono/wght.css";
import "@/styles/tokens.css";
import "@/styles/base.css";
import "@/styles/components.css";
import { ConsentManager } from "@/components/ConsentManager";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { site } from "@/content/site";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

const reviewMode = (process.env.NEXT_PUBLIC_CONTENT_REVIEW ?? "on") === "on";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  applicationName: site.name,
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#f7f6f2",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" data-review={reviewMode ? "on" : "off"}>
      <body>
        <a className="skip-link" href="#main">
          Skip to main content
        </a>
        {reviewMode ? (
          <div className="review-bar" role="region" aria-label="Review build notice">
            <div className="container review-bar__inner">
              <strong>Review build — not for publication.</strong>
              <span>Dashed blocks are provisional drafts awaiting Vidran Labs approval. See docs/reconstruction-gaps.md.</span>
            </div>
          </div>
        ) : null}
        <Header />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <ConsentManager />
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
      </body>
    </html>
  );
}
