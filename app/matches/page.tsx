import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { PostListItem, FeaturedPost } from "@/components/matches/PostListItem";
import { AdBanner } from "@/components/ads/AdBanner";
import { AdSidebar } from "@/components/ads/AdSidebar";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { getAllMatches, getPopularMatches } from "@/lib/posts";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "All Articles",
  description: `Browse all ${SITE_NAME} football articles, clips, and Google Drive downloads.`,
  alternates: { canonical: "/matches" },
};

export default async function MatchesPage() {
  const [matches, popular] = await Promise.all([
    getAllMatches(),
    getPopularMatches(1),
  ]);
  const featured = popular[0] || matches[0];

  return (
    <>
      <section className="border-b border-[var(--line)] bg-[var(--pitch-deep)] text-white">
        <Container className="py-12 sm:py-16">
          <Breadcrumbs
            items={[{ name: "Home", href: "/" }, { name: "Articles" }]}
            className="mb-4 text-white/65 [&_a]:text-[var(--gold)] [&_span]:text-white"
          />
          <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-wide sm:text-5xl">
            All articles
          </h1>
          <p className="mt-3 max-w-2xl text-white/75">
            Match analysis, highlight write-ups, and downloadable clips.
          </p>
        </Container>
      </section>

      <Container className="py-10 sm:py-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div>
            {matches.map((match, index) => (
              <PostListItem
                key={match.slug}
                match={match}
                priority={index === 0}
              />
            ))}
            <div className="mt-10">
              <AdBanner position="bottom" />
            </div>
          </div>
          <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
            {featured ? <FeaturedPost match={featured} /> : null}
            <AdSidebar />
          </aside>
        </div>
      </Container>
    </>
  );
}
