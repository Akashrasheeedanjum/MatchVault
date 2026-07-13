import { getYouTubeId } from "@/lib/utils";

export function MatchVideo({
  youtubeUrl,
  title,
}: {
  youtubeUrl: string;
  title: string;
}) {
  const videoId = getYouTubeId(youtubeUrl);

  if (!videoId) {
    return (
      <div className="mb-8 flex aspect-video items-center justify-center rounded-lg bg-[var(--mist)] text-sm text-[var(--muted)]">
        Video unavailable
      </div>
    );
  }

  return (
    <div className="mb-8 overflow-hidden rounded-lg border border-[var(--line)] bg-black">
      <div className="relative aspect-video">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
          loading="lazy"
        />
      </div>
    </div>
  );
}
