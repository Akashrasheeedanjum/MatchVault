import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Teko, Outfit } from "next/font/google";
import "./globals.css";
import { AdClient } from "@/components/ads/AdClient";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";
import { websiteSchema } from "@/lib/schema";
import { SiteChrome } from "@/components/layout/SiteChrome";

const teko = Teko({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const outfit = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://matchvault.com";
const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MatchVault - Football Match Analysis & Highlights",
    template: "%s | MatchVault",
  },
  description:
    "Detailed tactical analysis, match highlights, and full match downloads from Premier League, La Liga, Bundesliga, Serie A, and more.",
  keywords: [
    "football",
    "match analysis",
    "premier league",
    "la liga",
    "tactical analysis",
    "match highlights",
    "MatchVault",
  ],
  authors: [{ name: "MatchVault" }],
  verification: googleVerification
    ? { google: googleVerification }
    : undefined,
  openGraph: {
    title: "MatchVault - Football Match Analysis & Highlights",
    description:
      "Detailed tactical analysis, match highlights, and full match downloads.",
    url: siteUrl,
    siteName: "MatchVault",
    images: [
      {
        url: "/images/og-image.svg",
        width: 1200,
        height: 630,
        alt: "MatchVault",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MatchVault - Football Match Analysis & Highlights",
    description:
      "Detailed tactical analysis, match highlights, and full match downloads.",
    images: ["/images/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${teko.variable} ${outfit.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <AdClient />
        <SchemaMarkup data={websiteSchema()} />
        <SiteChrome>{children}</SiteChrome>
        <Analytics />
      </body>
    </html>
  );
}
