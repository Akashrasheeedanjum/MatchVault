import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    // Parent folder also has a lockfile; pin the app root explicitly.
    root: path.resolve(process.cwd()),
  },
  async redirects() {
    return [
      { source: "/leagues", destination: "/matches", permanent: true },
      { source: "/leagues/:slug", destination: "/matches", permanent: true },
      { source: "/teams", destination: "/matches", permanent: true },
      { source: "/teams/:slug", destination: "/matches", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
