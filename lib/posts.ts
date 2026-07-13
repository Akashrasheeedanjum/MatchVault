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

function buildMatchPost(
  frontmatter: MatchFrontmatter,
  content: string,
  contentHtml: string,
): MatchPost {
  const isHtml =
    frontmatter.content_format === "html" || content.trim().startsWith("<");
  const stats = readingTime(
    isHtml ? content.replace(/<[^>]+>/g, " ") : content,
  );
  const league = getLeagueByName(frontmatter.league);

  return {
    ...frontmatter,
    content,
    contentHtml,
    readingTime: stats.text,
    leagueSlug: league?.slug || slugify(frontmatter.league),
  };
}

/** List/card data — frontmatter only, no markdown→HTML. */
function parseMatchSummary(filePath: string): MatchPost {
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);
  return buildMatchPost(data as MatchFrontmatter, content, "");
}

function byMatchDateDesc(a: MatchPost, b: MatchPost) {
  return new Date(b.match_date).getTime() - new Date(a.match_date).getTime();
}

/** Cached per request — list pages never pay for remark. */
export const getAllMatches = cache(async (): Promise<MatchPost[]> => {
  const files = walkMarkdownFiles(contentDirectory);
  return files.map(parseMatchSummary).sort(byMatchDateDesc);
});

export const getMatchBySlug = cache(
  async (slug: string): Promise<MatchPost | undefined> => {
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
    .filter(
      (match) =>
        match.slug !== current.slug &&
        (match.leagueSlug === current.leagueSlug ||
          match.tags.some((tag) => current.tags.includes(tag))),
    )
    .slice(0, limit);
}

export function getAllMatchSlugs(): string[] {
  const files = walkMarkdownFiles(contentDirectory);
  return files.map((filePath) => {
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContents);
    return (data as MatchFrontmatter).slug;
  });
}
