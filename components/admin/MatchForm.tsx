"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { CloudinaryUpload } from "@/components/admin/CloudinaryUpload";
import { Button } from "@/components/shared/Button";
import { LEAGUES } from "@/lib/leagues";
import { slugify } from "@/lib/utils";
import type { Goalscorer, MatchFrontmatter } from "@/types";

export type MatchFormValues = MatchFrontmatter & {
  contentHtml: string;
};

interface MatchFormProps {
  mode: "create" | "edit";
  initial?: Partial<MatchFormValues>;
}

const emptyGoals: Goalscorer[] = [];

export function MatchForm({ mode, initial }: MatchFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState(initial?.title || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [excerpt, setExcerpt] = useState(initial?.excerpt || "");
  const [featuredImage, setFeaturedImage] = useState(
    initial?.featured_image || "/images/og-image.svg",
  );
  const [youtubeUrl, setYoutubeUrl] = useState(initial?.youtube_url || "");
  const [league, setLeague] = useState(initial?.league || "Premier League");
  const [matchDate, setMatchDate] = useState(
    initial?.match_date || new Date().toISOString().slice(0, 10),
  );
  const [teamHome, setTeamHome] = useState(initial?.team_home || "");
  const [teamAway, setTeamAway] = useState(initial?.team_away || "");
  const [scoreHome, setScoreHome] = useState(initial?.score_home ?? 0);
  const [scoreAway, setScoreAway] = useState(initial?.score_away ?? 0);
  const [referee, setReferee] = useState(initial?.referee || "");
  const [tags, setTags] = useState((initial?.tags || []).join(", "));
  const [popular, setPopular] = useState(Boolean(initial?.popular));
  const [downloadUrl, setDownloadUrl] = useState(initial?.download_url || "");
  const [downloadSize, setDownloadSize] = useState(
    initial?.download_size || "",
  );
  const [downloadFormat, setDownloadFormat] = useState(
    initial?.download_format || "MP4",
  );
  const [possessionHome, setPossessionHome] = useState(
    initial?.possession?.home ?? 50,
  );
  const [possessionAway, setPossessionAway] = useState(
    initial?.possession?.away ?? 50,
  );
  const [shotsHome, setShotsHome] = useState(initial?.shots?.home ?? 0);
  const [shotsAway, setShotsAway] = useState(initial?.shots?.away ?? 0);
  const [goalscorersText, setGoalscorersText] = useState(
    formatGoals(initial?.goalscorers || emptyGoals),
  );
  const [contentHtml, setContentHtml] = useState(
    initial?.contentHtml || "<p></p>",
  );

  const previewSlug = useMemo(
    () => (slugTouched ? slugify(slug) : slugify(title)),
    [slug, slugTouched, title],
  );

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const payload: MatchFormValues = {
      title,
      slug: previewSlug,
      excerpt,
      featured_image: featuredImage,
      youtube_url: youtubeUrl,
      league,
      match_date: matchDate,
      team_home: teamHome,
      team_away: teamAway,
      score_home: Number(scoreHome),
      score_away: Number(scoreAway),
      goalscorers: parseGoals(goalscorersText),
      possession: {
        home: Number(possessionHome),
        away: Number(possessionAway),
      },
      shots: { home: Number(shotsHome), away: Number(shotsAway) },
      referee,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      popular,
      download_url: downloadUrl || undefined,
      download_size: downloadSize || undefined,
      download_format: downloadFormat || undefined,
      contentHtml,
    };

    try {
      const endpoint =
        mode === "create"
          ? "/api/admin/matches"
          : `/api/admin/matches/${initial?.slug || previewSlug}`;
      const response = await fetch(endpoint, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Save failed");
      }
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-2">
        <Field label="Title">
          <input
            required
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
            className={inputClass}
          />
        </Field>
        <Field label="URL slug">
          <input
            required
            value={slugTouched ? slug : previewSlug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            className={inputClass}
          />
        </Field>
        <Field label="League">
          <select
            value={league}
            onChange={(e) => setLeague(e.target.value)}
            className={inputClass}
          >
            {LEAGUES.map((item) => (
              <option key={item.slug} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Match date">
          <input
            type="date"
            required
            value={matchDate}
            onChange={(e) => setMatchDate(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Home team">
          <input
            required
            value={teamHome}
            onChange={(e) => setTeamHome(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Away team">
          <input
            required
            value={teamAway}
            onChange={(e) => setTeamAway(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Home score">
          <input
            type="number"
            min={0}
            value={scoreHome}
            onChange={(e) => setScoreHome(Number(e.target.value))}
            className={inputClass}
          />
        </Field>
        <Field label="Away score">
          <input
            type="number"
            min={0}
            value={scoreAway}
            onChange={(e) => setScoreAway(Number(e.target.value))}
            className={inputClass}
          />
        </Field>
      </section>

      <Field label="Excerpt (SEO / card summary)">
        <textarea
          required
          rows={3}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className={inputClass}
        />
      </Field>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Field label="Featured image URL">
            <input
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              className={inputClass}
              placeholder="/images/match.jpg or Cloudinary URL"
            />
          </Field>
          <CloudinaryUpload
            kind="image"
            label="Upload featured image"
            onUploaded={({ url }) => setFeaturedImage(url)}
          />
          {featuredImage.startsWith("http") && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={featuredImage}
              alt="Featured preview"
              className="mt-2 h-28 w-auto rounded border border-[var(--line)] object-cover"
            />
          )}
        </div>
        <Field label="YouTube URL">
          <input
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            className={inputClass}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </Field>
        <Field label="Referee">
          <input
            value={referee}
            onChange={(e) => setReferee(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Tags (comma separated)">
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Possession home %">
          <input
            type="number"
            value={possessionHome}
            onChange={(e) => setPossessionHome(Number(e.target.value))}
            className={inputClass}
          />
        </Field>
        <Field label="Possession away %">
          <input
            type="number"
            value={possessionAway}
            onChange={(e) => setPossessionAway(Number(e.target.value))}
            className={inputClass}
          />
        </Field>
        <Field label="Shots home">
          <input
            type="number"
            value={shotsHome}
            onChange={(e) => setShotsHome(Number(e.target.value))}
            className={inputClass}
          />
        </Field>
        <Field label="Shots away">
          <input
            type="number"
            value={shotsAway}
            onChange={(e) => setShotsAway(Number(e.target.value))}
            className={inputClass}
          />
        </Field>
      </section>

      <Field label='Goalscorers (one per line: Player | 32&apos; | home/away)'>
        <textarea
          rows={4}
          value={goalscorersText}
          onChange={(e) => setGoalscorersText(e.target.value)}
          className={inputClass}
          placeholder={"Rashford | 32' | home\nSalah | 45' | away"}
        />
      </Field>

      <section className="rounded-md border-2 border-[var(--pitch)] bg-[var(--mist)] p-4">
        <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--pitch)]">
          Download section
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Leave download URL empty to show &quot;Coming soon&quot;. No ads are
          shown in this section on the public page.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="space-y-2 md:col-span-3">
            <Field label="Download URL">
              <input
                value={downloadUrl}
                onChange={(e) => setDownloadUrl(e.target.value)}
                className={inputClass}
                placeholder="https://.../file.mp4"
              />
            </Field>
            <CloudinaryUpload
              kind="video"
              label="Upload match file to Cloudinary"
              onUploaded={({ url, size, format }) => {
                setDownloadUrl(url);
                if (size) setDownloadSize(size);
                if (format) setDownloadFormat(format);
              }}
            />
          </div>
          <Field label="File size">
            <input
              value={downloadSize}
              onChange={(e) => setDownloadSize(e.target.value)}
              className={inputClass}
              placeholder="250MB"
            />
          </Field>
          <Field label="Format">
            <input
              value={downloadFormat}
              onChange={(e) => setDownloadFormat(e.target.value)}
              className={inputClass}
              placeholder="MP4"
            />
          </Field>
        </div>
      </section>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={popular}
          onChange={(e) => setPopular(e.target.checked)}
        />
        Mark as popular (homepage)
      </label>

      <div>
        <p className="mb-2 text-sm font-medium">Article content</p>
        <RichTextEditor value={contentHtml} onChange={setContentHtml} />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" variant="gold" disabled={saving}>
          {saving
            ? "Saving…"
            : mode === "create"
              ? "Publish article"
              : "Update article"}
        </Button>
        <Button href="/admin" variant="secondary" type="button">
          Cancel
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-[var(--ink)]">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-md border border-[var(--line)] bg-white px-3 py-2 text-sm outline-none ring-[var(--gold)] focus:ring-2";

function formatGoals(goals: Goalscorer[]) {
  return goals
    .map((goal) => `${goal.player} | ${goal.time} | ${goal.team}`)
    .join("\n");
}

function parseGoals(text: string): Goalscorer[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [player, time, team] = line.split("|").map((part) => part.trim());
      return {
        player: player || "Unknown",
        time: time || "0'",
        team: team === "away" ? "away" : "home",
      } as Goalscorer;
    });
}
