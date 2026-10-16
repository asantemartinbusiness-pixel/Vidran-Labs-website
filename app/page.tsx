import type { Metadata } from "next";
import { PageView } from "@/components/PageView";
import { getPage } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

const home = getPage("/")!;

export const metadata: Metadata = pageMetadata({ path: "/", title: home.title, description: home.description });

export default function HomePage() {
  return <PageView page={home} />;
}
