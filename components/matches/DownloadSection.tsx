import type { MatchPost } from "@/types";
import { Button } from "@/components/shared/Button";

/**
 * Timoff-style download block — Google Drive only.
 * NO ADS inside this section.
 */
export function DownloadSection({ match }: { match: MatchPost }) {
  const driveUrl = match.google_drive_url?.trim();

  return (
    <section
      id="download"
      aria-label="Download section"
      data-no-ads="true"
      className="article-download mt-10"
    >
      <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-[var(--ink)] sm:text-3xl">
        download full Scenepack 4k clips link
      </h2>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-[var(--ink)]">
          Google drive link
        </h3>
        {driveUrl ? (
          <p className="mt-3">
            <Button
              href={driveUrl}
              variant="gold"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Drive
            </Button>
          </p>
        ) : (
          <p className="mt-3 text-sm text-[var(--muted)]">Coming soon</p>
        )}
      </div>
    </section>
  );
}
