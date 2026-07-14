import Link from "next/link";
import Image from "next/image";
import type { MatchPost } from "@/types";
import { formatRelativeDate } from "@/lib/utils";

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
      </Link>

      <div className="mt-4 flex flex-1 flex-col">
        <p className="text-xs uppercase tracking-wider text-[var(--muted)]">
          {formatRelativeDate(match.match_date)}
        </p>
        <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl leading-tight tracking-wide text-[var(--ink)]">
          <Link
            href={`/matches/${match.slug}`}
            className="hover:text-[var(--pitch)]"
          >
            {match.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--muted)]">
          {match.excerpt}
        </p>
        <Link
          href={`/matches/${match.slug}`}
          className="mt-4 text-sm font-semibold text-[var(--pitch)] hover:text-[var(--gold-deep)]"
        >
          read more
        </Link>
      </div>
    </article>
  );
}
