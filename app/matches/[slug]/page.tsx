import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { MatchHero } from "@/components/matches/MatchHero";
import { MatchInfo } from "@/components/matches/MatchInfo";
import { MatchVideo } from "@/components/matches/MatchVideo";
import { MatchContent } from "@/components/matches/MatchContent";
import { DownloadSection } from "@/components/matches/DownloadSection";
import { RelatedMatches } from "@/components/matches/RelatedMatches";
import { RelatedArticles } from "@/components/matches/RelatedArticles";
import { FaqSection } from "@/components/shared/FaqSection";
import { AdBanner } from "@/components/ads/AdBanner";
import { AdSidebar } from "@/components/ads/AdSidebar";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";
import { getAllMatchSlugs, getMatchBySlug } from "@/lib/posts";
import {
  getRelatedArticles,
  getRelatedMatchesForNav,
  teamSlug,
} from "@/lib/teams";
import {
  articleSchema,
  breadcrumbSchema,
  faqSchema,
  videoObjectSchema,
} from "@/lib/schema";
import { absoluteUrl, formatDate } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllMatchSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const match = await getMatchBySlug(slug);
  if (!match) return { title: "Match not found" };

  const url = absoluteUrl(`/matches/${match.slug}`);

  return {
    title: match.title,
    description: match.excerpt,
    keywords: match.tags,
    alternates: { canonical: url },
    openGraph: {
      title: match.title,
      description: match.excerpt,
      url,
      type: "article",
      publishedTime: match.match_date,
      images: [
        {
          url: match.featured_image,
          width: 1200,
          height: 630,
          alt: match.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: match.title,
      description: match.excerpt,
      images: [match.featured_image],
    },
  };
}

export default async function MatchDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const match = await getMatchBySlug(slug);
  if (!match) notFound();

  const relatedMatches = await getRelatedMatchesForNav(match, 3);
  const relatedArticles = await getRelatedArticles(
    match,
    relatedMatches.map((item) => item.slug),
    3,
  );
  const faqs = match.faq || [];
  const homeTeamPath = `/teams/${teamSlug(match.team_home)}`;
  const awayTeamPath = `/teams/${teamSlug(match.team_away)}`;

  const schemas = [
    articleSchema(match),
    videoObjectSchema(match),
    breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: match.league, url: `/leagues/${match.leagueSlug}` },
      { name: match.team_home, url: homeTeamPath },
      { name: match.team_away, url: awayTeamPath },
      { name: match.title, url: `/matches/${match.slug}` },
    ]),
    ...(faqs.length ? [faqSchema(faqs)] : []),
  ];

  return (
    <>
      <SchemaMarkup data={schemas} />
      <Container className="py-8">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: match.league, href: `/leagues/${match.leagueSlug}` },
            { name: match.team_home, href: homeTeamPath },
            { name: match.team_away, href: awayTeamPath },
            { name: `${match.team_home} vs ${match.team_away}` },
          ]}
        />

        <nav
          aria-label="Match path"
          className="mb-6 rounded-md border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--muted)]"
        >
          <Link href="/" className="text-[var(--pitch)] hover:underline">
            Home
          </Link>
          <span className="mx-2">→</span>
          <Link
            href={`/leagues/${match.leagueSlug}`}
            className="text-[var(--pitch)] hover:underline"
          >
            {match.league}
          </Link>
          <span className="mx-2">→</span>
          <Link href={homeTeamPath} className="text-[var(--pitch)] hover:underline">
            {match.team_home}
          </Link>
          <span className="mx-2">→</span>
          <Link href={awayTeamPath} className="text-[var(--pitch)] hover:underline">
            {match.team_away}
          </Link>
          <span className="mx-2">→</span>
          <span className="text-[var(--ink)]">Match analysis</span>
        </nav>

        <div className="mb-6">
          <AdBanner position="top" />
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          <article>
            <MatchHero match={match} />
            <MatchInfo match={match} />
            <MatchVideo youtubeUrl={match.youtube_url} title={match.title} />

            <p className="mb-6 text-sm text-[var(--muted)]">
              Published {formatDate(match.match_date)} ·{" "}
              <Link
                href={`/leagues/${match.leagueSlug}`}
                className="font-medium text-[var(--pitch)]"
              >
                {match.league}
              </Link>
              {" · "}
              <Link href={homeTeamPath} className="font-medium text-[var(--pitch)]">
                {match.team_home}
              </Link>
              {" vs "}
              <Link href={awayTeamPath} className="font-medium text-[var(--pitch)]">
                {match.team_away}
              </Link>
            </p>

            <MatchContent match={match} />
            <FaqSection faqs={faqs} />
            <RelatedMatches matches={relatedMatches} />
            <RelatedArticles matches={relatedArticles} />

            {/* NO ADS inside download section */}
            <DownloadSection match={match} />
          </article>

          <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
            <AdSidebar />
            <div className="hidden border border-[var(--line)] bg-[var(--surface)] p-4 lg:block">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--pitch)]">
                Navigate
              </h2>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link href={`/leagues/${match.leagueSlug}`} className="hover:text-[var(--pitch)]">
                    {match.league}
                  </Link>
                </li>
                <li>
                  <Link href={homeTeamPath} className="hover:text-[var(--pitch)]">
                    {match.team_home}
                  </Link>
                </li>
                <li>
                  <Link href={awayTeamPath} className="hover:text-[var(--pitch)]">
                    {match.team_away}
                  </Link>
                </li>
                <li>
                  <Link href="/matches" className="hover:text-[var(--pitch)]">
                    All matches
                  </Link>
                </li>
                <li>
                  <Link href="/teams" className="hover:text-[var(--pitch)]">
                    All teams
                  </Link>
                </li>
              </ul>
            </div>
            <div className="hidden border border-[var(--line)] bg-[var(--surface)] p-4 lg:block">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--pitch)]">
                Match tags
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {match.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded bg-[var(--mist)] px-2 py-1 text-xs text-[var(--ink)]"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
            <AdSidebar />
          </aside>
        </div>

        <div className="mt-10">
          <AdBanner position="bottom" />
        </div>
      </Container>
    </>
  );
}
