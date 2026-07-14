import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { ContentSection, MatchFrontmatter } from "@/types";
import { slugify } from "@/lib/utils";
import {
  deleteArticleMarkdown,
  fetchArticleMarkdownBySlug,
  isCloudinaryConfigured,
  isServerlessReadonlyFs,
  uploadArticleMarkdown,
} from "@/lib/article-cloudinary";
import {
  commitArticleToGitHub,
  deleteArticleFromGitHub,
  githubArticleExists,
  isGitHubConfigured,
} from "@/lib/article-github";

const contentDirectory = path.join(process.cwd(), "content", "matches");

export type MatchFormInput = MatchFrontmatter & {
  contentHtml: string;
};

function filePathFor(slug: string): string {
  return path.join(contentDirectory, "articles", `${slug}.md`);
}

function findExistingFile(slug: string): string | null {
  if (!fs.existsSync(contentDirectory)) return null;
  const walk = (dir: string): string | null => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        const found = walk(full);
        if (found) return found;
      } else if (entry.name.endsWith(".md")) {
        const raw = fs.readFileSync(full, "utf8");
        const { data } = matter(raw);
        if ((data as MatchFrontmatter).slug === slug) return full;
      }
    }
    return null;
  };
  return walk(contentDirectory);
}

function normalizeSections(
  sections: ContentSection[] | undefined,
): ContentSection[] {
  return (sections || [])
    .map((section) => ({
      image: (section.image || "").trim(),
      text_html: (section.text_html || "").trim(),
    }))
    .filter((section) => section.image || section.text_html);
}

/** Simple blog-style markdown — only fields editors need. */
export function buildMarkdownFile(input: MatchFormInput): string {
  const {
    contentHtml,
    title,
    slug,
    excerpt,
    featured_image,
    content_sections,
    google_drive_url,
    youtube_url,
    popular,
    match_date,
  } = input;

  const sections = normalizeSections(content_sections);

  const frontmatter: Record<string, unknown> = {
    title,
    slug,
    excerpt: excerpt || title,
    featured_image,
    match_date: match_date || new Date().toISOString().slice(0, 10),
    popular: Boolean(popular),
    content_format: "html",
  };

  if (sections.length) frontmatter.content_sections = sections;
  if (google_drive_url) frontmatter.google_drive_url = google_drive_url;
  if (youtube_url?.trim()) frontmatter.youtube_url = youtube_url.trim();

  const body = (contentHtml || "<p></p>").trim();
  return matter.stringify(`\n${body}\n`, frontmatter);
}

function canWriteLocalContent(): boolean {
  if (isServerlessReadonlyFs()) return false;
  try {
    const dir = path.join(contentDirectory, "articles");
    fs.mkdirSync(dir, { recursive: true });
    const probe = path.join(dir, ".write-probe");
    fs.writeFileSync(probe, "ok", "utf8");
    fs.unlinkSync(probe);
    return true;
  } catch {
    return false;
  }
}

export async function saveMatchMarkdown(
  input: MatchFormInput,
  isUpdate = false,
) {
  const slug = slugify(input.slug || input.title);
  const payload = { ...input, slug };
  const markdown = buildMarkdownFile(payload);

  // Local disk (npm run dev / Node server with writable FS)
  if (canWriteLocalContent()) {
    const existing = findExistingFile(slug);
    if (!isUpdate && existing) {
      throw new Error(`An article with slug "${slug}" already exists.`);
    }
    if (isUpdate && !existing) {
      throw new Error(`Article "${slug}" not found.`);
    }

    const target = isUpdate && existing ? existing : filePathFor(slug);
    fs.mkdirSync(path.dirname(target), { recursive: true });

    if (isUpdate && existing && existing !== target) {
      fs.writeFileSync(target, markdown, "utf8");
      fs.unlinkSync(existing);
    } else {
      fs.writeFileSync(target, markdown, "utf8");
    }

    // Also mirror to Cloudinary when configured
    let cloudinaryUrl: string | undefined;
    if (isCloudinaryConfigured()) {
      try {
        const uploaded = await uploadArticleMarkdown(slug, markdown);
        cloudinaryUrl = uploaded.url;
      } catch {
        // local file already saved — Cloudinary mirror is best-effort
      }
    }

    return {
      slug,
      path: target,
      storage: "filesystem" as const,
      cloudinaryUrl,
    };
  }

  // Vercel / serverless — cannot write project disk.
  const hasGitHub = isGitHubConfigured();
  const hasCloudinary = isCloudinaryConfigured();

  if (!hasGitHub && !hasCloudinary) {
    throw new Error(
      "Vercel cannot write content/matches/articles on disk. Fix: add Cloudinary env vars (required for live article save) and optionally GITHUB_TOKEN to also commit into the repo. Then redeploy.",
    );
  }

  const remoteCloud = hasCloudinary
    ? await fetchArticleMarkdownBySlug(slug)
    : null;
  const remoteGit = hasGitHub ? await githubArticleExists(slug) : false;
  const local = findExistingFile(slug);

  if (!isUpdate && (remoteCloud || remoteGit)) {
    throw new Error(`An article with slug "${slug}" already exists.`);
  }
  if (isUpdate && !remoteCloud && !remoteGit && !local) {
    throw new Error(`Article "${slug}" not found.`);
  }

  const errors: string[] = [];
  let githubPath: string | undefined;
  let cloudinaryUrl: string | undefined;

  // Prefer Cloudinary first so the live site updates immediately
  if (hasCloudinary) {
    try {
      const uploaded = await uploadArticleMarkdown(slug, markdown);
      cloudinaryUrl = uploaded.url;
    } catch (error) {
      errors.push(
        error instanceof Error ? error.message : "Cloudinary upload failed",
      );
    }
  }

  if (hasGitHub) {
    try {
      const committed = await commitArticleToGitHub(
        slug,
        markdown,
        isUpdate ? `Update article ${slug}` : `Add article ${slug}`,
      );
      githubPath = committed.path;
    } catch (error) {
      errors.push(
        error instanceof Error ? error.message : "GitHub commit failed",
      );
    }
  }

  if (!cloudinaryUrl && !githubPath) {
    throw new Error(`Article save failed: ${errors.join(" | ")}`);
  }

  // Cloudinary is required for instant live view on Vercel
  if (hasCloudinary && !cloudinaryUrl) {
    throw new Error(
      `Article must save on Cloudinary for Vercel. ${errors.join(" | ")}`,
    );
  }

  return {
    slug,
    path: cloudinaryUrl || githubPath || "",
    storage: cloudinaryUrl ? ("cloudinary" as const) : ("github" as const),
    githubPath,
    cloudinaryUrl,
    warnings: errors.length ? errors : undefined,
  };
}

export async function deleteMatchMarkdown(slug: string) {
  const existing = findExistingFile(slug);
  let deleted = false;

  if (existing && canWriteLocalContent()) {
    fs.unlinkSync(existing);
    deleted = true;
  }

  if (isGitHubConfigured()) {
    try {
      const remoteDeleted = await deleteArticleFromGitHub(slug);
      deleted = deleted || remoteDeleted;
    } catch {
      // continue — try Cloudinary
    }
  }

  if (isCloudinaryConfigured()) {
    const remoteDeleted = await deleteArticleMarkdown(slug);
    deleted = deleted || remoteDeleted;
  }

  if (!deleted) {
    if (isServerlessReadonlyFs() && existing) {
      throw new Error(
        "This sample article is built into the site. Remove it from GitHub content/matches, or override it by saving again.",
      );
    }
    throw new Error(`Article "${slug}" not found.`);
  }
}

export async function readMatchSource(slug: string): Promise<{
  frontmatter: MatchFrontmatter & { content_format?: string };
  content: string;
} | null> {
  const remote = await fetchArticleMarkdownBySlug(slug);
  if (remote) {
    const { data, content } = matter(remote);
    return {
      frontmatter: data as MatchFrontmatter & { content_format?: string },
      content: content.trim(),
    };
  }

  const existing = findExistingFile(slug);
  if (!existing) return null;
  const raw = fs.readFileSync(existing, "utf8");
  const { data, content } = matter(raw);
  return {
    frontmatter: data as MatchFrontmatter & { content_format?: string },
    content: content.trim(),
  };
}
