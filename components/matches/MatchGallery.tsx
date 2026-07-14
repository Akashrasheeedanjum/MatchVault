import Image from "next/image";
import type { MatchPost } from "@/types";

export function MatchGallery({
  match,
  mode = "full",
}: {
  match: MatchPost;
  /** full = main + thumbs; main = featured only; thumbs = gallery row only */
  mode?: "full" | "main" | "thumbs";
}) {
  const gallery = (match.gallery_images || []).filter(Boolean).slice(0, 3);
  const showMain = mode === "full" || mode === "main";
  const showThumbs = (mode === "full" || mode === "thumbs") && gallery.length > 0;

  if (!showMain && !showThumbs) return null;

  return (
    <section aria-label="Match images" className="mb-8 space-y-3">
      {showMain && (
        <div className="relative aspect-[16/9] overflow-hidden bg-[var(--mist)]">
          <Image
            src={match.featured_image}
            alt={match.title}
            fill
            priority
            loading="eager"
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 800px"
          />
        </div>
      )}

      {showThumbs && (
        <div
          className={`grid gap-3 ${
            gallery.length === 1
              ? "grid-cols-1"
              : gallery.length === 2
                ? "grid-cols-2"
                : "grid-cols-3"
          }`}
        >
          {gallery.map((src, index) => (
            <div
              key={`${src}-${index}`}
              className="relative aspect-[4/3] overflow-hidden bg-[var(--mist)]"
            >
              <Image
                src={src}
                alt={`${match.title} photo ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 33vw, 250px"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
