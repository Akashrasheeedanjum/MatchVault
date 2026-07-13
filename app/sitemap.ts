import type { MetadataRoute } from "next";
import { getAllMatches } from "@/lib/posts";
import { LEAGUES } from "@/lib/leagues";
import { getAllTeams } from "@/lib/teams";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://matchvault.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [matches, teams] = await Promise.all([
    getAllMatches(),
    getAllTeams(),
  ]);

  const staticRoutes = [
    "",
    "/matches",
    "/teams",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/dmca",
    "/cookie-policy",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : path.startsWith("/privacy") || path === "/terms" || path === "/dmca" || path === "/cookie-policy" ? 0.4 : 0.7,
  }));

  const leagueRoutes = LEAGUES.map((league) => ({
    url: `${siteUrl}/leagues/${league.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const teamRoutes = teams.map((team) => ({
    url: `${siteUrl}/teams/${team.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  const matchRoutes = matches.map((match) => ({
    url: `${siteUrl}/matches/${match.slug}`,
    lastModified: new Date(match.match_date),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...leagueRoutes, ...teamRoutes, ...matchRoutes];
}
