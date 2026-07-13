import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { Button } from "@/components/shared/Button";
import { MatchCard } from "@/components/matches/MatchCard";
import { AdBanner } from "@/components/ads/AdBanner";
import { FaqSection } from "@/components/shared/FaqSection";
import { getLatestMatches, getPopularMatches } from "@/lib/posts";
import { LEAGUES } from "@/lib/leagues";

export const metadata: Metadata = {
  title: "MatchVault - Football Match Analysis & Highlights",
  description:
    "Your vault for football match analysis, tactical breakdowns, and highlights from Europe's top leagues.",
  alternates: { canonical: "/" },
};

const homeFaqs = [
  {
    question: "What is MatchVault?",
    answer:
      "MatchVault is a football content platform publishing detailed match analysis, tactical breakdowns, embedded highlights, and (soon) downloadable match files.",
  },
  {
    question: "Which leagues do you cover?",
    answer:
      "We cover Premier League, La Liga, Bundesliga, Serie A, and Champions League fixtures, with more competitions added over time.",
  },
  {
    question: "Are match downloads available?",
    answer:
      "Download sections are reserved on each match page and kept ad-free. Full download delivery ships in a later phase after the content site is AdSense-ready.",
  },
];

export default async function HomePage() {
  const [latest, popular] = await Promise.all([
    getLatestMatches(4),
    getPopularMatches(3),
  ]);

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
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent, transparent 40px, #fff 40px, #fff 41px)",
          }}
        />
        <Container className="relative flex min-h-[72vh] flex-col justify-center py-16 sm:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--gold)]">
            Football match vault
          </p>
          <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-5xl leading-none tracking-wide sm:text-7xl">
            MatchVault
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
            Tactical analysis, derby breakdowns, and match highlights from the
            leagues that matter — written for fans who want more than the final
            score.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/matches" variant="gold">
              Explore matches
            </Button>
            <Button
              href="/leagues/premier-league"
              variant="secondary"
              className="border-white/40 text-white hover:bg-white hover:text-[var(--pitch-deep)]"
            >
              Browse leagues
            </Button>
          </div>
        </Container>
      </section>

      <Container className="py-6">
        <AdBanner position="top" />
      </Container>

      <Container as="section" className="py-12">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--pitch)]">
              Latest
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl tracking-wide">
              Latest matches
            </h2>
          </div>
          <Link href="/matches" className="text-sm font-semibold text-[var(--pitch)]">
            View all →
          </Link>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {latest.map((match) => (
            <MatchCard key={match.slug} match={match} />
          ))}
        </div>
      </Container>

      <Container as="section" className="py-12">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--pitch)]">
            Popular
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl tracking-wide">
            Popular matches
          </h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((match) => (
            <MatchCard key={match.slug} match={match} />
          ))}
        </div>
      </Container>

      <Container as="section" className="py-12">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--pitch)]">
            Competitions
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl tracking-wide">
            Leagues
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LEAGUES.map((league) => (
            <Link
              key={league.slug}
              href={`/leagues/${league.slug}`}
              className="group border border-[var(--line)] bg-[var(--surface)] p-5 transition hover:border-[var(--pitch)]"
            >
              <h3 className="font-[family-name:var(--font-display)] text-xl tracking-wide text-[var(--ink)] group-hover:text-[var(--pitch)]">
                {league.name}
              </h3>
              <p className="mt-2 text-sm text-[var(--muted)]">{league.description}</p>
            </Link>
          ))}
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
            Built for fans who study the game
          </h2>
          <p className="mt-4 max-w-2xl text-[var(--muted)]">
            MatchVault publishes clear, original football analysis — match context,
            tactical themes, and key moments — so every visit delivers value beyond
            a scoreline.
          </p>
          <Button href="/about" variant="primary" className="mt-6">
            Learn more
          </Button>
        </Container>
      </section>
    </>
  );
}
