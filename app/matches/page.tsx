import type { Metadata } from "next";
import { Container } from "@/components/shared/Container";
import { MatchCard } from "@/components/matches/MatchCard";
import { AdBanner } from "@/components/ads/AdBanner";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { getAllMatches } from "@/lib/posts";

export const metadata: Metadata = {
  title: "All Matches",
  description:
    "Browse all MatchVault football match analyses across Premier League, La Liga, Bundesliga, Serie A, and more.",
  alternates: { canonical: "/matches" },
};

export default async function MatchesPage() {
  const matches = await getAllMatches();

  return (
    <Container className="py-10">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Matches" },
        ]}
      />
      <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-wide">
        All matches
      </h1>
      <p className="mt-3 max-w-2xl text-[var(--muted)]">
        Tactical breakdowns and highlight analysis from Europe&apos;s biggest fixtures.
      </p>

      <div className="my-8">
        <AdBanner position="top" />
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {matches.map((match, index) => (
          <MatchCard
            key={match.slug}
            match={match}
            priority={index === 0}
          />
        ))}
      </div>
    </Container>
  );
}
