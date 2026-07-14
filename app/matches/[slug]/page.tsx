import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { MatchContent } from "@/components/matches/MatchContent";
import { DownloadSection } from "@/components/matches/DownloadSection";
import { AdBanner } from "@/components/ads/AdBanner";
import { AdSidebar } from "@/components/ads/AdSidebar";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";
import { FeaturedPost } from "@/components/matches/PostListItem";
import { getAllMatchSlugs, getMatchBySlug, getPopularMatches } from "@/lib/posts";
import {
  articleSchema,
  breadcrumbSchema,
  faqSchema,
  videoObjectSchema,
} from "@/lib/schema";
import { absoluteUrl, formatRelativeDate } from "@/lib/utils";
import { SITE_NAME } from "@/lib/site";
import { FaqSection } from "@/components/shared/FaqSection";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllMatchSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const match = await getMatchBySlug(slug);
  if (!match) return { title: "Article not found" };

  const url = absoluteUrl(`/matches/${match.slug}`);

  return {
    title: match.title,
    description: match.excerpt,
    keywords: match.tags,
    alternates: { canonical: url },
    openGraph: {
      title: match.title,
      description: match.excerpt,
      url,
      type: "article",
      publishedTime: match.match_date,
      images: [
        {
          url: match.featured_image,
          width: 1200,
          height: 630,
          alt: match.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: match.title,
      description: match.excerpt,
      images: [match.featured_image],
    },
  };
}

export default async function MatchDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const match = await getMatchBySlug(slug);
  if (!match) notFound();

  const popular = await getPopularMatches(1);
  const featured =
    popular.find((item) => item.slug !== match.slug) || popular[0] || null;
  const faqs = match.faq || [];

  const schemas = [
    articleSchema(match),
    ...(match.youtube_url ? [videoObjectSchema(match)] : []),
    breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Articles", url: "/matches" },
      { name: match.title, url: `/matches/${match.slug}` },
    ]),
    ...(faqs.length ? [faqSchema(faqs)] : []),
  ];

  return (
    <>
      <SchemaMarkup data={schemas} />
      <Container className="py-8 sm:py-10">
        {/* Content first (no ad above title) — preferred for AdSense review */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          <article className="min-w-0">
            <header className="mb-6 border-b border-[var(--line)] pb-6">
              <h1 className="font-[family-name:var(--font-display)] text-3xl leading-tight tracking-wide text-[var(--ink)] sm:text-4xl md:text-[2.75rem]">
                {match.title}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--muted)]">
                <span className="font-semibold text-[var(--pitch)]">
                  {SITE_NAME}
                </span>
                <span aria-hidden="true">·</span>
                <span>Last update : {formatRelativeDate(match.match_date)}</span>
              </div>
            </header>

            <figure className="mb-8 overflow-hidden bg-[var(--mist)]">
              <Image
                src={match.featured_image}
                alt={match.title}
                width={1200}
                height={675}
                priority
                className="h-auto w-full object-cover"
                sizes="(max-width: 1024px) 100vw, 800px"
              />
            </figure>

            <MatchContent match={match} />

            {faqs.length > 0 ? <FaqSection faqs={faqs} /> : null}

            {/* CRITICAL: no ads inside or adjacent to download controls */}
            <div className="mt-4">
              <DownloadSection match={match} />
            </div>

            {/* Bottom unit well below downloads — clear separation */}
            <div className="mt-14 border-t border-[var(--line)] pt-10">
              <AdBanner position="bottom" />
            </div>
          </article>

          <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
            {featured ? <FeaturedPost match={featured} /> : null}
            <AdSidebar />
          </aside>
        </div>
      </Container>
    </>
  );
}
