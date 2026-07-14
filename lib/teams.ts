import { cache } from "react";
import type { MatchPost } from "@/types";
import { getAllMatches } from "@/lib/posts";
import { slugify } from "@/lib/utils";

export interface TeamInfo {
  name: string;
  slug: string;
  matchCount: number;
  leagues: string[];
}

export function teamSlug(name: string): string {
  return slugify(name);
}

export const getAllTeams = cache(async (): Promise<TeamInfo[]> => {
  const matches = await getAllMatches();
  const map = new Map<string, TeamInfo>();

  for (const match of matches) {
    for (const name of [match.team_home, match.team_away]) {
      if (!name?.trim()) continue;
      const slug = teamSlug(name);
      const existing = map.get(slug);
      if (existing) {
        existing.matchCount += 1;
        if (!existing.leagues.includes(match.league)) {
          existing.leagues.push(match.league);
        }
      } else {
        map.set(slug, {
          name,
          slug,
          matchCount: 1,
          leagues: [match.league],
        });
      }
    }
  }

  return Array.from(map.values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
});

export async function getTeamBySlug(
  slug: string,
): Promise<TeamInfo | undefined> {
  const teams = await getAllTeams();
  return teams.find((team) => team.slug === slug);
}

export async function getMatchesByTeam(slug: string): Promise<MatchPost[]> {
  const matches = await getAllMatches();
  return matches.filter(
    (match) =>
      teamSlug(match.team_home) === slug ||
      teamSlug(match.team_away) === slug,
  );
}

export async function getRelatedMatchesForNav(
  current: MatchPost,
  limit = 3,
): Promise<MatchPost[]> {
  const matches = await getAllMatches();
  return matches
    .filter((match) => match.slug !== current.slug)
    .slice(0, limit);
}

export async function getRelatedArticles(
  current: MatchPost,
  excludeSlugs: string[] = [],
  limit = 3,
): Promise<MatchPost[]> {
  const excluded = new Set([current.slug, ...excludeSlugs]);
  const matches = await getAllMatches();

  const related = matches.filter(
    (match) =>
      !excluded.has(match.slug) &&
      (match.leagueSlug === current.leagueSlug ||
        (match.tags || []).some((tag) => (current.tags || []).includes(tag))),
  );

  if (related.length >= limit) return related.slice(0, limit);

  const extras = matches.filter(
    (match) =>
      !excluded.has(match.slug) &&
      !related.some((item) => item.slug === match.slug),
  );

  return [...related, ...extras].slice(0, limit);
}
