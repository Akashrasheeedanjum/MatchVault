import Link from "next/link";
import type { MatchPost } from "@/types";
import { MatchCard } from "@/components/matches/MatchCard";

export function RelatedArticles({ matches }: { matches: MatchPost[] }) {
  if (matches.length === 0) return null;

  return (
    <section className="mt-12">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--pitch)]">
            Keep reading
          </p>
          <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl tracking-wide">
            Related articles
          </h2>
        </div>
        <Link href="/matches" className="text-sm font-medium text-[var(--pitch)]">
          View all
        </Link>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {matches.map((match) => (
          <MatchCard key={match.slug} match={match} />
        ))}
      </div>
    </section>
  );
}
