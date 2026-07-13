import Image from "next/image";
import type { MatchPost } from "@/types";
import { formatDate } from "@/lib/utils";

export function MatchHero({ match }: { match: MatchPost }) {
  return (
    <header className="relative mb-8 overflow-hidden rounded-lg bg-[var(--pitch-deep)] text-white">
      <div className="absolute inset-0">
        <Image
          src={match.featured_image}
          alt=""
          fill
          priority
          className="object-cover opacity-35"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--pitch-deep)] via-[var(--pitch-deep)]/80 to-transparent" />
      </div>

      <div className="relative px-6 py-10 sm:px-10 sm:py-14">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--gold)]">
          {match.league} · {formatDate(match.match_date)}
        </p>
        <h1 className="mt-3 max-w-3xl font-[family-name:var(--font-display)] text-3xl tracking-wide sm:text-5xl">
          {match.title}
        </h1>
        <p className="mt-4 max-w-2xl text-base text-white/80 sm:text-lg">
          {match.excerpt}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-white/70">
          <span>{match.readingTime}</span>
          <span aria-hidden="true">·</span>
          <span>Referee: {match.referee}</span>
        </div>
      </div>
    </header>
  );
}
