import type { MatchPost } from "@/types";
import { Button } from "@/components/shared/Button";

/**
 * Download section — NO ADS allowed inside this component or its wrapper.
 * Keep ad units above or below (outside) this block only.
 */
export function DownloadSection({ match }: { match: MatchPost }) {
  const hasDownload = Boolean(match.download_url);

  return (
    <section
      id="download"
      aria-label="Download section"
      data-no-ads="true"
      className="mt-12 border-2 border-[var(--pitch)] bg-[var(--mist)] p-6 sm:p-8"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--pitch)]">
        Download
      </p>
      <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl tracking-wide text-[var(--ink)]">
        Download {match.team_home} vs {match.team_away}
      </h2>
      <p className="mt-2 text-sm text-[var(--muted)]">
        {hasDownload
          ? "Get the full match file. This section is ad-free."
          : "Download will be available in a later phase. This section is reserved and kept ad-free for AdSense compliance."}
      </p>

      <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <div>
          <dt className="inline text-[var(--muted)]">Format: </dt>
          <dd className="inline font-medium">
            {match.download_format || "MP4"}
          </dd>
        </div>
        <div>
          <dt className="inline text-[var(--muted)]">Size: </dt>
          <dd className="inline font-medium">
            {match.download_size || "Coming soon"}
          </dd>
        </div>
      </dl>

      {hasDownload ? (
        <Button
          href={match.download_url}
          variant="gold"
          className="mt-6"
        >
          Download now
        </Button>
      ) : (
        <Button variant="secondary" className="mt-6" disabled>
          Coming soon
        </Button>
      )}
    </section>
  );
}
