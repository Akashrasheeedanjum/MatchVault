import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Teko, Outfit } from "next/font/google";
import "./globals.css";
import { AdClient } from "@/components/ads/AdClient";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";
import { websiteSchema } from "@/lib/schema";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

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
    default: `${SITE_NAME} - Football Clips & Match Analysis`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "football",
    "match analysis",
    "premier league",
    "la liga",
    "scenepack",
    "match highlights",
    SITE_NAME,
  ],
  authors: [{ name: SITE_NAME }],
  verification: googleVerification
    ? { google: googleVerification }
    : undefined,
  openGraph: {
    title: `${SITE_NAME} - Football Clips & Match Analysis`,
    description: SITE_DESCRIPTION,
    url: siteUrl,
    siteName: SITE_NAME,
    images: [
      {
        url: "/images/og-image.svg",
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} - Football Clips & Match Analysis`,
    description: SITE_DESCRIPTION,
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
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${teko.variable} ${outfit.variable} h-full`}
    >
      <body className="flex min-h-full flex-col antialiased">
        <AdClient />
        <SchemaMarkup data={websiteSchema()} />
        <SiteChrome>{children}</SiteChrome>
        <Analytics />
      </body>
    </html>
  );
}
