import type { Metadata } from "next";
import { Blocks } from "@/components/Blocks";
import { getPage } from "@/lib/content";

export const metadata: Metadata = { title: "Page not found | Vidran Labs", robots: { index: false, follow: true } };

/** Real 404 response for unknown URLs, reusing the original /opps/ error-page content. */
export default function NotFound() {
  const errorPage = getPage("/opps/")!;
  return <Blocks blocks={errorPage.blocks} compactHero />;
}
