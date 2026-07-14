"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { CloudinaryUpload } from "@/components/admin/CloudinaryUpload";
import { Button } from "@/components/shared/Button";
import { slugify } from "@/lib/utils";
import type { ContentSection, MatchFrontmatter } from "@/types";

export type MatchFormValues = MatchFrontmatter & {
  contentHtml: string;
};

interface MatchFormProps {
  mode: "create" | "edit";
  initial?: Partial<MatchFormValues>;
}

const emptySection = (): ContentSection => ({
  image: "",
  text_html: "<p></p>",
});

function stripTags(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function MatchForm({ mode, initial }: MatchFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState(initial?.title || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [featuredImage, setFeaturedImage] = useState(
    initial?.featured_image || "/images/og-image.svg",
  );
  const [contentHtml, setContentHtml] = useState(
    initial?.contentHtml || "<p></p>",
  );
  const [sections, setSections] = useState<ContentSection[]>(() =>
    initial?.content_sections?.length
      ? initial.content_sections.map((s) => ({
          image: s.image || "",
          text_html: s.text_html || "<p></p>",
        }))
      : [],
  );
  const [googleDriveUrl, setGoogleDriveUrl] = useState(
    initial?.google_drive_url || "",
  );
  const [youtubeUrl, setYoutubeUrl] = useState(initial?.youtube_url || "");
  const [popular, setPopular] = useState(Boolean(initial?.popular));

  const previewSlug = useMemo(
    () => (slugTouched ? slugify(slug) : slugify(title)),
    [slug, slugTouched, title],
  );

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const excerpt =
      initial?.excerpt?.trim() ||
      stripTags(contentHtml).slice(0, 160) ||
      title;

    const payload: MatchFormValues = {
      title,
      slug: previewSlug,
      excerpt,
      featured_image: featuredImage,
      content_sections: sections
        .map((section) => ({
          image: section.image.trim(),
          text_html: section.text_html.trim(),
        }))
        .filter((section) => section.image || section.text_html),
      google_drive_url: googleDriveUrl || undefined,
      popular,
      youtube_url: youtubeUrl.trim(),
      league: initial?.league || "Football",
      match_date:
        initial?.match_date || new Date().toISOString().slice(0, 10),
      team_home: initial?.team_home || title,
      team_away: initial?.team_away || "",
      score_home: 0,
      score_away: 0,
      goalscorers: [],
      possession: { home: 50, away: 50 },
      shots: { home: 0, away: 0 },
      referee: "",
      tags: [],
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
    <form onSubmit={onSubmit} className="mx-auto max-w-3xl space-y-8">
      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Field label="Title">
        <input
          required
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
          className={inputClass}
          placeholder="Article title"
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

      <div className="space-y-2">
        <Field label="Main image">
          <input
            value={featuredImage}
            onChange={(e) => setFeaturedImage(e.target.value)}
            className={inputClass}
            placeholder="/images/photo.jpg or Cloudinary URL"
          />
        </Field>
        <CloudinaryUpload
          kind="image"
          label="Upload main image"
          onUploaded={({ url }) => setFeaturedImage(url)}
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-medium">Main context</p>
        <RichTextEditor value={contentHtml} onChange={setContentHtml} />
      </div>

      <Field label="YouTube video link (optional)">
        <input
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          className={inputClass}
          placeholder="https://www.youtube.com/watch?v=... or youtu.be/..."
        />
      </Field>
      <p className="-mt-6 text-xs text-[var(--muted)]">
        Paste a public YouTube URL. It appears on the article as a highlights
        player (good for AdSense when surrounded by your written content).
      </p>

      <section className="space-y-4 rounded-md border border-[var(--line)] bg-white p-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-xl">
              Sections
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Add image + text blocks as many times as you want.
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setSections((prev) => [...prev, emptySection()])}
          >
            Add section
          </Button>
        </div>

        {sections.length === 0 && (
          <p className="text-sm text-[var(--muted)]">
            No sections yet — optional. Click &quot;Add section&quot; when you
            need another image and related text.
          </p>
        )}

        {sections.map((section, index) => (
          <div
            key={index}
            className="space-y-3 border border-[var(--line)] bg-[var(--mist)] p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold">Section {index + 1}</p>
              <Button
                type="button"
                variant="ghost"
                onClick={() =>
                  setSections((prev) => prev.filter((_, i) => i !== index))
                }
              >
                Remove
              </Button>
            </div>
            <Field label="Image">
              <input
                value={section.image}
                onChange={(e) => {
                  const next = [...sections];
                  next[index] = { ...next[index], image: e.target.value };
                  setSections(next);
                }}
                className={inputClass}
                placeholder="Image URL"
              />
            </Field>
            <CloudinaryUpload
              kind="image"
              label={`Upload section ${index + 1} image`}
              onUploaded={({ url }) => {
                const next = [...sections];
                next[index] = { ...next[index], image: url };
                setSections(next);
              }}
            />
            <div>
              <p className="mb-2 text-sm font-medium">Related text</p>
              <RichTextEditor
                value={section.text_html}
                onChange={(html) => {
                  const next = [...sections];
                  next[index] = { ...next[index], text_html: html };
                  setSections(next);
                }}
              />
            </div>
          </div>
        ))}
      </section>

      <Field label="Google Drive download link (optional)">
        <input
          value={googleDriveUrl}
          onChange={(e) => setGoogleDriveUrl(e.target.value)}
          className={inputClass}
          placeholder="https://drive.google.com/file/d/.../view"
        />
      </Field>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={popular}
          onChange={(e) => setPopular(e.target.checked)}
        />
        Feature on homepage
      </label>

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
