import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/shared/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { MatchCard } from "@/components/matches/MatchCard";
import { AdBanner } from "@/components/ads/AdBanner";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";
import {
  getAllTeams,
  getMatchesByTeam,
  getTeamBySlug,
} from "@/lib/teams";
import { getLeagueByName } from "@/lib/leagues";
import { breadcrumbSchema } from "@/lib/schema";
import { absoluteUrl } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const teams = await getAllTeams();
  return teams.map((team) => ({ slug: team.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const team = await getTeamBySlug(slug);
  if (!team) return { title: "Team not found" };

  const title = `${team.name} Match Analysis`;
  const description = `Tactical match analysis and highlights featuring ${team.name} on MatchVault.`;

  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(`/teams/${team.slug}`) },
    openGraph: {
      title,
      description,
      url: absoluteUrl(`/teams/${team.slug}`),
    },
  };
}

export default async function TeamPage({ params }: PageProps) {
  const { slug } = await params;
  const team = await getTeamBySlug(slug);
  if (!team) notFound();

  const matches = await getMatchesByTeam(slug);
  const primaryLeague = getLeagueByName(team.leagues[0] || "");

  return (
    <>
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          ...(primaryLeague
            ? [
                {
                  name: primaryLeague.name,
                  url: `/leagues/${primaryLeague.slug}`,
                },
              ]
            : []),
          { name: team.name, url: `/teams/${team.slug}` },
        ])}
      />
      <Container className="py-10">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            ...(primaryLeague
              ? [
                  {
                    name: primaryLeague.name,
                    href: `/leagues/${primaryLeague.slug}`,
                  },
                ]
              : []),
            { name: team.name },
          ]}
        />

        <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-wide">
          {team.name}
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">
          All MatchVault articles featuring {team.name}. Continue to a match
          page for full analysis, video, related matches, and related articles.
        </p>

        <div className="my-6 flex flex-wrap gap-3 text-sm">
          {primaryLeague && (
            <Link
              href={`/leagues/${primaryLeague.slug}`}
              className="font-medium text-[var(--pitch)]"
            >
              ← Back to {primaryLeague.name}
            </Link>
          )}
          <Link href="/teams" className="text-[var(--muted)] hover:text-[var(--pitch)]">
            All teams
          </Link>
          <Link href="/matches" className="text-[var(--muted)] hover:text-[var(--pitch)]">
            All matches
          </Link>
        </div>

        <AdBanner position="top" className="mb-8" />

        {matches.length === 0 ? (
          <p className="text-[var(--muted)]">No matches yet for this team.</p>
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
      </Container>
    </>
  );
}
