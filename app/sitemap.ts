import type { MetadataRoute } from "next";
import { getAllMatches } from "@/lib/posts";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://matchvault.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const matches = await getAllMatches();

  const staticRoutes = [
    "",
    "/matches",
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
    priority:
      path === ""
        ? 1
        : path.startsWith("/privacy") ||
            path === "/terms" ||
            path === "/dmca" ||
            path === "/cookie-policy"
          ? 0.4
          : 0.7,
  }));

  const matchRoutes = matches.map((match) => ({
    url: `${siteUrl}/matches/${match.slug}`,
    lastModified: new Date(match.match_date),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...matchRoutes];
}
