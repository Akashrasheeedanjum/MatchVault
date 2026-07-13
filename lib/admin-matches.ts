import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { MatchFrontmatter } from "@/types";
import { getLeagueByName } from "@/lib/leagues";
import { slugify } from "@/lib/utils";

const contentDirectory = path.join(process.cwd(), "content", "matches");

export type MatchFormInput = MatchFrontmatter & {
  contentHtml: string;
};

function leagueFolder(leagueName: string): string {
  const league = getLeagueByName(leagueName);
  return league?.slug || slugify(leagueName);
}

function filePathFor(leagueName: string, slug: string): string {
  return path.join(contentDirectory, leagueFolder(leagueName), `${slug}.md`);
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

export function buildMarkdownFile(input: MatchFormInput): string {
  const {
    contentHtml,
    title,
    slug,
    excerpt,
    featured_image,
    youtube_url,
    league,
    match_date,
    team_home,
    team_away,
    score_home,
    score_away,
    goalscorers,
    possession,
    shots,
    referee,
    tags,
    download_url,
    download_size,
    download_format,
    faq,
    popular,
  } = input;

  const frontmatter: Record<string, unknown> = {
    title,
    slug,
    excerpt,
    featured_image,
    youtube_url,
    league,
    match_date,
    team_home,
    team_away,
    score_home: Number(score_home),
    score_away: Number(score_away),
    goalscorers: goalscorers || [],
    possession,
    shots,
    referee,
    tags: tags || [],
    popular: Boolean(popular),
    content_format: "html",
  };

  if (download_url) frontmatter.download_url = download_url;
  if (download_size) frontmatter.download_size = download_size;
  if (download_format) frontmatter.download_format = download_format;
  if (faq?.length) frontmatter.faq = faq;

  const body = (contentHtml || "<p></p>").trim();
  return matter.stringify(`\n${body}\n`, frontmatter);
}

export function saveMatchMarkdown(input: MatchFormInput, isUpdate = false) {
  const slug = slugify(input.slug || input.title);
  const payload = { ...input, slug };

  const existing = findExistingFile(slug);
  if (!isUpdate && existing) {
    throw new Error(`A match with slug "${slug}" already exists.`);
  }
  if (isUpdate && !existing) {
    throw new Error(`Match "${slug}" not found.`);
  }

  const target =
    isUpdate && existing ? existing : filePathFor(payload.league, slug);

  fs.mkdirSync(path.dirname(target), { recursive: true });

  if (isUpdate && existing && existing !== target) {
    fs.writeFileSync(target, buildMarkdownFile(payload), "utf8");
    fs.unlinkSync(existing);
  } else {
    fs.writeFileSync(target, buildMarkdownFile(payload), "utf8");
  }

  return { slug, path: target };
}

export function deleteMatchMarkdown(slug: string) {
  const existing = findExistingFile(slug);
  if (!existing) throw new Error(`Match "${slug}" not found.`);
  fs.unlinkSync(existing);
}

export function readMatchSource(slug: string): {
  frontmatter: MatchFrontmatter & { content_format?: string };
  content: string;
} | null {
  const existing = findExistingFile(slug);
  if (!existing) return null;
  const raw = fs.readFileSync(existing, "utf8");
  const { data, content } = matter(raw);
  return {
    frontmatter: data as MatchFrontmatter & { content_format?: string },
    content: content.trim(),
  };
}
