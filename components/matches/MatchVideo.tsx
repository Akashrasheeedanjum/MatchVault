import { getYouTubeId } from "@/lib/utils";

/**
 * Responsive YouTube embed — labeled and framed for content-first AdSense policy.
 * Uses youtube-nocookie for privacy-friendly embeds.
 */
export function MatchVideo({
  youtubeUrl,
  title,
}: {
  youtubeUrl: string;
  title: string;
}) {
  const videoId = getYouTubeId(youtubeUrl);

  if (!youtubeUrl?.trim()) return null;

  if (!videoId) {
    return (
      <div className="my-8 rounded-lg border border-dashed border-[var(--line)] bg-[var(--mist)] px-4 py-8 text-center text-sm text-[var(--muted)]">
        Invalid YouTube link
      </div>
    );
  }

  return (
    <section
      aria-label="Match highlights video"
      className="my-8 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface)] shadow-[0_8px_30px_rgba(13,40,24,0.06)]"
    >
      <div className="flex items-center justify-between gap-3 border-b border-[var(--line)] bg-[var(--mist)] px-4 py-3 sm:px-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--pitch)]">
            Highlights
          </p>
          <h2 className="mt-0.5 font-[family-name:var(--font-display)] text-lg tracking-wide text-[var(--ink)] sm:text-xl">
            Watch on YouTube
          </h2>
        </div>
        <a
          href={`https://www.youtube.com/watch?v=${videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-xs font-semibold text-[var(--pitch)] hover:underline"
        >
          Open ↗
        </a>
      </div>

      <div className="relative aspect-video bg-black">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0`}
          title={`${title} — highlights`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 h-full w-full"
          loading="lazy"
        />
      </div>

      <p className="px-4 py-3 text-xs leading-relaxed text-[var(--muted)] sm:px-5">
        Official / public highlights embed. Original match analysis continues
        below — ads never appear inside the download section.
      </p>
    </section>
  );
}
