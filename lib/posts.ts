import fs from "fs";
import path from "path";
import { cache } from "react";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import readingTime from "reading-time";
import type { MatchFrontmatter, MatchPost } from "@/types";
import { getLeagueByName } from "@/lib/leagues";
import { slugify } from "@/lib/utils";
import { fetchAllCloudinaryMarkdown, fetchArticleMarkdownBySlug } from "@/lib/article-cloudinary";

const contentDirectory = path.join(process.cwd(), "content", "matches");

function walkMarkdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }

  return files;
}

function normalizeFrontmatter(
  raw: Partial<MatchFrontmatter>,
  content: string,
): MatchFrontmatter {
  const title = raw.title?.trim() || "Untitled";
  const plain = content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

  return {
    title,
    slug: raw.slug?.trim() || slugify(title),
    excerpt: raw.excerpt?.trim() || plain.slice(0, 160) || title,
    featured_image: raw.featured_image || "/images/og-image.svg",
    content_sections: raw.content_sections || [],
    google_drive_url: raw.google_drive_url,
    popular: Boolean(raw.popular),
    content_format: raw.content_format,
    match_date: raw.match_date || new Date().toISOString().slice(0, 10),
    youtube_url: raw.youtube_url || "",
    league: raw.league || "Football",
    team_home: raw.team_home || title,
    team_away: raw.team_away || "",
    score_home: raw.score_home ?? 0,
    score_away: raw.score_away ?? 0,
    goalscorers: raw.goalscorers || [],
    possession: raw.possession || { home: 50, away: 50 },
    shots: raw.shots || { home: 0, away: 0 },
    referee: raw.referee || "",
    tags: raw.tags || [],
    gallery_images: raw.gallery_images,
    download_size: raw.download_size,
    download_format: raw.download_format,
    faq: raw.faq,
  };
}

function buildMatchPost(
  raw: Partial<MatchFrontmatter>,
  content: string,
  contentHtml: string,
): MatchPost {
  const frontmatter = normalizeFrontmatter(raw, content);
  const sectionText = (frontmatter.content_sections || [])
    .map((s) => s.text_html || "")
    .join(" ");
  const readingSource = `${content} ${sectionText}`;
  const isHtml =
    frontmatter.content_format === "html" || content.trim().startsWith("<");
  const stats = readingTime(
    isHtml ? readingSource.replace(/<[^>]+>/g, " ") : readingSource,
  );
  const league = getLeagueByName(frontmatter.league || "Football");

  return {
    ...frontmatter,
    match_date: frontmatter.match_date!,
    youtube_url: frontmatter.youtube_url || "",
    league: frontmatter.league || "Football",
    team_home: frontmatter.team_home || frontmatter.title,
    team_away: frontmatter.team_away || "",
    score_home: frontmatter.score_home ?? 0,
    score_away: frontmatter.score_away ?? 0,
    goalscorers: frontmatter.goalscorers || [],
    possession: frontmatter.possession || { home: 50, away: 50 },
    shots: frontmatter.shots || { home: 0, away: 0 },
    referee: frontmatter.referee || "",
    tags: frontmatter.tags || [],
    content,
    contentHtml,
    readingTime: stats.text,
    leagueSlug: league?.slug || slugify(frontmatter.league || "football"),
  };
}

function parseMarkdownSource(markdown: string, withHtml: boolean): MatchPost {
  const { data, content } = matter(markdown);
  const frontmatter = data as MatchFrontmatter;
  if (!withHtml) {
    return buildMatchPost(frontmatter, content, "");
  }

  const isHtml =
    frontmatter.content_format === "html" || content.trim().startsWith("<");
  if (isHtml) {
    return buildMatchPost(frontmatter, content, content.trim());
  }

  // Sync path for list views — full HTML resolved in getMatchBySlug.
  return buildMatchPost(frontmatter, content, "");
}

function byMatchDateDesc(a: MatchPost, b: MatchPost) {
  return new Date(b.match_date).getTime() - new Date(a.match_date).getTime();
}

async function loadLocalMatches(): Promise<MatchPost[]> {
  const files = walkMarkdownFiles(contentDirectory);
  return files.map((filePath) => {
    const fileContents = fs.readFileSync(filePath, "utf8");
    return parseMarkdownSource(fileContents, false);
  });
}

async function loadRemoteMatches(): Promise<MatchPost[]> {
  try {
    const remote = await fetchAllCloudinaryMarkdown();
    return remote.map(({ markdown }) => parseMarkdownSource(markdown, false));
  } catch {
    return [];
  }
}

export const getAllMatches = cache(async (): Promise<MatchPost[]> => {
  const [local, remote] = await Promise.all([
    loadLocalMatches(),
    loadRemoteMatches(),
  ]);

  const bySlug = new Map<string, MatchPost>();
  for (const match of local) bySlug.set(match.slug, match);
  // Cloudinary (admin publishes on Vercel) overrides bundled sample files.
  for (const match of remote) bySlug.set(match.slug, match);

  return Array.from(bySlug.values()).sort(byMatchDateDesc);
});

export const getMatchBySlug = cache(
  async (slug: string): Promise<MatchPost | undefined> => {
    try {
      const remoteMarkdown = await fetchArticleMarkdownBySlug(slug);
      if (remoteMarkdown) {
        const { data, content } = matter(remoteMarkdown);
        const frontmatter = data as MatchFrontmatter;
        const isHtml =
          frontmatter.content_format === "html" ||
          content.trim().startsWith("<");
        const contentHtml = isHtml
          ? content.trim()
          : (await remark().use(html).process(content)).toString();
        return buildMatchPost(frontmatter, content, contentHtml);
      }
    } catch {
      // fall through to local files
    }

    const files = walkMarkdownFiles(contentDirectory);
    for (const filePath of files) {
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContents);
      const frontmatter = data as MatchFrontmatter;
      if (frontmatter.slug !== slug) continue;

      const isHtml =
        frontmatter.content_format === "html" ||
        content.trim().startsWith("<");
      const contentHtml = isHtml
        ? content.trim()
        : (await remark().use(html).process(content)).toString();

      return buildMatchPost(frontmatter, content, contentHtml);
    }

    return undefined;
  },
);

export async function getMatchesByLeague(
  leagueSlug: string,
): Promise<MatchPost[]> {
  const matches = await getAllMatches();
  return matches.filter((match) => match.leagueSlug === leagueSlug);
}

export async function getPopularMatches(limit = 3): Promise<MatchPost[]> {
  const matches = await getAllMatches();
  const popular = matches.filter((match) => match.popular);
  const pool = popular.length > 0 ? popular : matches;
  return pool.slice(0, limit);
}

export async function getLatestMatches(limit = 4): Promise<MatchPost[]> {
  const matches = await getAllMatches();
  return matches.slice(0, limit);
}

export async function getRelatedMatches(
  current: MatchPost,
  limit = 3,
): Promise<MatchPost[]> {
  const matches = await getAllMatches();
  return matches
    .filter((match) => match.slug !== current.slug)
    .slice(0, limit);
}

export async function getAllMatchSlugs(): Promise<string[]> {
  const matches = await getAllMatches();
  return matches.map((match) => match.slug);
}
