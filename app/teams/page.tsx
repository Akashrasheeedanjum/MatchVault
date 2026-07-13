import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { getAllTeams } from "@/lib/teams";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Football Teams",
  description:
    "Browse MatchVault team hubs — match analysis for clubs across Premier League, La Liga, Bundesliga, Serie A, and more.",
  alternates: { canonical: absoluteUrl("/teams") },
  openGraph: {
    title: "Football Teams | MatchVault",
    description:
      "Browse team hubs and match analysis across Europe's top leagues.",
    url: absoluteUrl("/teams"),
  },
};

export default async function TeamsPage() {
  const teams = await getAllTeams();

  return (
    <Container className="py-10">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Teams" }]} />
      <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-wide">
        Teams
      </h1>
      <p className="mt-3 max-w-2xl text-[var(--muted)]">
        Follow the navigation path: Home → League → Team → Match → Related
        content. Pick a club to see every MatchVault analysis featuring that side.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => (
          <Link
            key={team.slug}
            href={`/teams/${team.slug}`}
            className="border border-[var(--line)] bg-[var(--surface)] p-4 transition hover:border-[var(--pitch)]"
          >
            <h2 className="font-[family-name:var(--font-display)] text-xl tracking-wide">
              {team.name}
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {team.matchCount} match{team.matchCount === 1 ? "" : "es"} ·{" "}
              {team.leagues.join(", ")}
            </p>
          </Link>
        ))}
      </div>

      <p className="mt-10 text-sm text-[var(--muted)]">
        Also browse by{" "}
        <Link href="/leagues/premier-league" className="text-[var(--pitch)]">
          league
        </Link>{" "}
        or view{" "}
        <Link href="/matches" className="text-[var(--pitch)]">
          all matches
        </Link>
        .
      </p>
    </Container>
  );
}
