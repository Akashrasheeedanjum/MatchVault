import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/shared/Button";

export const metadata: Metadata = {
  title: "About MatchVault",
  description:
    "Learn about MatchVault's mission to deliver detailed football match analysis and tactical insights for fans and AdSense-ready publishing.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About MatchVault",
    description:
      "Football match analysis, tactical breakdowns, and highlight context from Europe's biggest leagues.",
  },
};

export default function AboutPage() {
  return (
    <Container className="py-10">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "About" }]} />
      <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-wide">
        About MatchVault
      </h1>
      <div className="legal-prose mt-6 max-w-3xl">
        <p>
          MatchVault is a football content platform built for fans who want more
          than a final score. We publish original match analysis, tactical
          breakdowns, and highlight context from Europe&apos;s biggest leagues.
        </p>
        <h2>Our mission</h2>
        <p>
          Our mission is to make high-quality football analysis accessible,
          readable, and useful — whether you are revisiting a derby or studying
          how a result was built phase by phase.
        </p>
        <h2>What we publish</h2>
        <ul>
          <li>Match previews and post-match tactical analysis</li>
          <li>Embedded video highlights with written context</li>
          <li>
            League hubs for{" "}
            <Link href="/leagues/premier-league">Premier League</Link>,{" "}
            <Link href="/leagues/la-liga">La Liga</Link>,{" "}
            <Link href="/leagues/bundesliga">Bundesliga</Link>,{" "}
            <Link href="/leagues/serie-a">Serie A</Link>, and more
          </li>
          <li>
            Team pages such as{" "}
            <Link href="/teams">clubs across Europe</Link> linking into related
            matches and articles
          </li>
          <li>Clear match statistics and key talking points</li>
        </ul>
        <h2>How to browse MatchVault</h2>
        <p>
          Use this navigation path on every match page:{" "}
          <strong>Home → League → Home team → Away team → Match → Related
          matches → Related articles</strong>.
        </p>
        <h2>Advertising &amp; downloads</h2>
        <p>
          MatchVault is designed as an AdSense-ready publisher: original articles
          first, transparent legal pages, and a dedicated download section kept
          free of advertisements. See our{" "}
          <Link href="/privacy">Privacy Policy</Link>,{" "}
          <Link href="/terms">Terms</Link>, and{" "}
          <Link href="/cookie-policy">Cookie Policy</Link> for details.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href="/matches" variant="primary">
            Browse matches
          </Button>
          <Button href="/contact" variant="secondary">
            Contact us
          </Button>
        </div>
      </div>
    </Container>
  );
}
