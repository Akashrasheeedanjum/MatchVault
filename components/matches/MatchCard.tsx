import Link from "next/link";
import Image from "next/image";
import type { MatchPost } from "@/types";
import { formatDate } from "@/lib/utils";
import { teamSlug } from "@/lib/teams";

export function MatchCard({
  match,
  priority = false,
}: {
  match: MatchPost;
  priority?: boolean;
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden border-b border-[var(--line)] pb-6">
      <Link
        href={`/matches/${match.slug}`}
        className="relative block aspect-[16/10] overflow-hidden bg-[var(--mist)]"
      >
        <Image
          src={match.featured_image}
          alt={match.title}
          fill
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <span className="absolute left-3 top-3 rounded bg-[var(--pitch-deep)]/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--gold)]">
          {match.league}
        </span>
      </Link>

      <div className="mt-4 flex flex-1 flex-col">
        <p className="text-xs uppercase tracking-wider text-[var(--muted)]">
          {formatDate(match.match_date)}
        </p>
        <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl leading-tight tracking-wide text-[var(--ink)]">
          <Link
            href={`/matches/${match.slug}`}
            className="hover:text-[var(--pitch)]"
          >
            {match.team_home} {match.score_home}–{match.score_away}{" "}
            {match.team_away}
          </Link>
        </h3>
        <p className="mt-2 text-xs text-[var(--muted)]">
          <Link
            href={`/leagues/${match.leagueSlug}`}
            className="hover:text-[var(--pitch)]"
          >
            {match.league}
          </Link>
          {" · "}
          <Link
            href={`/teams/${teamSlug(match.team_home)}`}
            className="hover:text-[var(--pitch)]"
          >
            {match.team_home}
          </Link>
          {" vs "}
          <Link
            href={`/teams/${teamSlug(match.team_away)}`}
            className="hover:text-[var(--pitch)]"
          >
            {match.team_away}
          </Link>
        </p>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--muted)]">
          {match.excerpt}
        </p>
        <Link
          href={`/matches/${match.slug}`}
          className="mt-4 text-sm font-semibold text-[var(--pitch)] hover:text-[var(--gold-deep)]"
        >
          Read analysis →
        </Link>
      </div>
    </article>
  );
}
