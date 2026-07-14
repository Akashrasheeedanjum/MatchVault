import Image from "next/image";
import Link from "next/link";
import type { MatchPost } from "@/types";
import { formatRelativeDate } from "@/lib/utils";
import { SITE_NAME } from "@/lib/site";

/** Timoff-style vertical post row for Latest Posts. */
export function PostListItem({
  match,
  priority = false,
}: {
  match: MatchPost;
  priority?: boolean;
}) {
  return (
    <article className="border-b border-[var(--line)] py-8 first:pt-0 last:border-b-0">
      <Link
        href={`/matches/${match.slug}`}
        className="group grid gap-5 sm:grid-cols-[220px_minmax(0,1fr)]"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-[var(--mist)] sm:aspect-[4/3]">
          <Image
            src={match.featured_image}
            alt={match.title}
            fill
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 220px"
          />
        </div>
        <div className="flex min-w-0 flex-col">
          <p className="text-xs uppercase tracking-wider text-[var(--muted)]">
            {SITE_NAME}
          </p>
          <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl leading-tight tracking-wide text-[var(--ink)] group-hover:text-[var(--pitch)] sm:text-2xl">
            {match.title}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[var(--muted)]">
            {match.excerpt}
          </p>
          <p className="mt-3 text-xs text-[var(--muted)]">
            {formatRelativeDate(match.match_date)}
          </p>
          <span className="mt-4 text-sm font-semibold text-[var(--pitch)]">
            read more
          </span>
        </div>
      </Link>
    </article>
  );
}

export function FeaturedPost({ match }: { match: MatchPost }) {
  return (
    <article className="border border-[var(--line)] bg-[var(--surface)]">
      <Link href={`/matches/${match.slug}`} className="group block">
        <div className="relative aspect-[16/10] overflow-hidden bg-[var(--mist)]">
          <Image
            src={match.featured_image}
            alt={match.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 300px"
          />
        </div>
        <div className="p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--pitch)]">
            Featured Post
          </p>
          <h3 className="mt-2 font-[family-name:var(--font-display)] text-lg leading-snug tracking-wide text-[var(--ink)] group-hover:text-[var(--pitch)]">
            {match.title}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm text-[var(--muted)]">
            {match.excerpt}
          </p>
        </div>
      </Link>
    </article>
  );
}
