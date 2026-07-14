import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { Button } from "@/components/shared/Button";
import {
  FeaturedPost,
  PostListItem,
} from "@/components/matches/PostListItem";
import { AdBanner } from "@/components/ads/AdBanner";
import { AdSidebar } from "@/components/ads/AdSidebar";
import { FaqSection } from "@/components/shared/FaqSection";
import { getAllMatches, getPopularMatches } from "@/lib/posts";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${SITE_NAME} - Football Clips & Match Analysis`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

const homeFaqs = [
  {
    question: `What is ${SITE_NAME}?`,
    answer: `${SITE_NAME} publishes football match analysis, rare clips, and downloadable scenepacks with Google Drive links when available.`,
  },
  {
    question: "How do I browse articles?",
    answer:
      "Open Articles from the menu for the full feed, or start from the latest posts on the homepage.",
  },
  {
    question: "Where are the download links?",
    answer:
      "Each article ends with a Google Drive download button. That section stays ad-free for AdSense compliance.",
  },
];

export default async function HomePage() {
  const [matches, popular] = await Promise.all([
    getAllMatches(),
    getPopularMatches(1),
  ]);
  const latest = matches.slice(0, 8);
  const featured = popular[0] || latest[0];

  return (
    <>
      <section className="relative overflow-hidden bg-[var(--pitch-deep)] text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(212,175,55,0.25), transparent 40%), radial-gradient(circle at 80% 0%, rgba(45,90,61,0.5), transparent 45%), linear-gradient(135deg, transparent 40%, rgba(26,71,42,0.9) 100%)",
          }}
        />
        <Container className="relative flex min-h-[48vh] flex-col justify-center py-14 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--gold)]">
            {SITE_TAGLINE}
          </p>
          <h1 className="mt-4 max-w-4xl font-[family-name:var(--font-display)] text-4xl leading-none tracking-wide sm:text-6xl md:text-7xl">
            {SITE_NAME}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
            Latest match posts, featured clips, and Google Drive downloads —
            built in the style of a football content store.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/matches" variant="gold">
              Latest posts
            </Button>
            <Button
              href="/about"
              variant="secondary"
              className="border-white/40 text-white hover:bg-white hover:text-[var(--pitch-deep)]"
            >
              About us
            </Button>
          </div>
        </Container>
      </section>

      <Container as="section" className="py-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div>
            <div className="mb-6 flex items-end justify-between gap-4">
              <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-wide">
                Latest Posts
              </h2>
              <Link
                href="/matches"
                className="text-sm font-semibold text-[var(--pitch)]"
              >
                Show more
              </Link>
            </div>
            <div>
              {latest.map((match, index) => (
                <PostListItem
                  key={match.slug}
                  match={match}
                  priority={index === 0}
                />
              ))}
            </div>
            <div className="mt-10">
              <AdBanner position="top" />
            </div>
            {matches.length > latest.length && (
              <div className="mt-8">
                <Button href="/matches" variant="secondary">
                  Show more
                </Button>
              </div>
            )}
          </div>

          <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
            {featured ? <FeaturedPost match={featured} /> : null}
            <AdSidebar />
          </aside>
        </div>
      </Container>

      <Container as="section" className="py-12">
        <FaqSection faqs={homeFaqs} />
      </Container>

      <section className="border-y border-[var(--line)] bg-[var(--surface)]">
        <Container className="py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--pitch)]">
            About
          </p>
          <h2 className="mt-2 max-w-2xl font-[family-name:var(--font-display)] text-3xl tracking-wide">
            Football clips and analysis in one place
          </h2>
          <p className="mt-4 max-w-2xl text-[var(--muted)]">
            {SITE_NAME} publishes original match write-ups with image galleries
            and Google Drive downloads when files are ready.
          </p>
          <Button href="/about" variant="primary" className="mt-6">
            Learn more
          </Button>
        </Container>
      </section>
    </>
  );
}
