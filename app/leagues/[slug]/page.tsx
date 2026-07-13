import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/shared/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { MatchCard } from "@/components/matches/MatchCard";
import { AdBanner } from "@/components/ads/AdBanner";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";
import { getMatchesByLeague } from "@/lib/posts";
import { getLeagueBySlug, LEAGUES } from "@/lib/leagues";
import { teamSlug } from "@/lib/teams";
import { breadcrumbSchema } from "@/lib/schema";
import { absoluteUrl } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return LEAGUES.map((league) => ({ slug: league.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const league = getLeagueBySlug(slug);
  if (!league) return { title: "League not found" };

  return {
    title: `${league.name} Match Analysis`,
    description: league.description,
    alternates: { canonical: absoluteUrl(`/leagues/${league.slug}`) },
    openGraph: {
      title: `${league.name} Match Analysis | MatchVault`,
      description: league.description,
      url: absoluteUrl(`/leagues/${league.slug}`),
    },
  };
}

export default async function LeaguePage({ params }: PageProps) {
  const { slug } = await params;
  const league = getLeagueBySlug(slug);
  if (!league) notFound();

  const matches = await getMatchesByLeague(slug);
  const teams = Array.from(
    new Set(matches.flatMap((match) => [match.team_home, match.team_away])),
  ).sort();

  return (
    <>
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: league.name, url: `/leagues/${league.slug}` },
        ])}
      />
      <Container className="py-10">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: league.name },
          ]}
        />
        <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-wide">
          {league.name}
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">{league.description}</p>

        <p className="mt-4 text-sm text-[var(--muted)]">
          Path:{" "}
          <Link href="/" className="text-[var(--pitch)]">
            Home
          </Link>{" "}
          → {league.name} → Team → Match
        </p>

        <div className="my-8">
          <AdBanner position="top" />
        </div>

        {teams.length > 0 && (
          <section className="mb-10">
            <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide">
              Teams in this league
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {teams.map((name) => (
                <Link
                  key={name}
                  href={`/teams/${teamSlug(name)}`}
                  className="rounded border border-[var(--line)] bg-[var(--surface)] px-3 py-1.5 text-sm hover:border-[var(--pitch)] hover:text-[var(--pitch)]"
                >
                  {name}
                </Link>
              ))}
            </div>
          </section>
        )}

        <h2 className="mb-6 font-[family-name:var(--font-display)] text-2xl tracking-wide">
          Match analyses
        </h2>

        {matches.length === 0 ? (
          <p className="text-[var(--muted)]">
            No match analyses published for this league yet. Check back soon.
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {matches.map((match, index) => (
              <MatchCard
                key={match.slug}
                match={match}
                priority={index === 0}
              />
            ))}
          </div>
        )}

        <p className="mt-10 text-sm text-[var(--muted)]">
          <Link href="/teams" className="text-[var(--pitch)]">
            Browse all teams
          </Link>
          {" · "}
          <Link href="/matches" className="text-[var(--pitch)]">
            All matches
          </Link>
          {" · "}
          <Link href="/about" className="text-[var(--pitch)]">
            About MatchVault
          </Link>
        </p>
      </Container>
    </>
  );
}
