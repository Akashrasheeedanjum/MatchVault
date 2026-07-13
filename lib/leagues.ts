import type { LeagueInfo } from "@/types";

export const LEAGUES: LeagueInfo[] = [
  {
    name: "Premier League",
    slug: "premier-league",
    description:
      "In-depth analysis of English Premier League fixtures, tactics, and key moments.",
  },
  {
    name: "La Liga",
    slug: "la-liga",
    description:
      "Spanish top-flight match breakdowns covering El Clásico and beyond.",
  },
  {
    name: "Bundesliga",
    slug: "bundesliga",
    description:
      "German football analysis with focus on pressing, transitions, and derby nights.",
  },
  {
    name: "Serie A",
    slug: "serie-a",
    description:
      "Italian Serie A tactical reviews, including the Derby della Madonnina.",
  },
  {
    name: "Champions League",
    slug: "champions-league",
    description:
      "UEFA Champions League night-by-night analysis and tactical takeaways.",
  },
];

export function getLeagueBySlug(slug: string): LeagueInfo | undefined {
  return LEAGUES.find((league) => league.slug === slug);
}

export function getLeagueByName(name: string): LeagueInfo | undefined {
  return LEAGUES.find(
    (league) => league.name.toLowerCase() === name.toLowerCase(),
  );
}
