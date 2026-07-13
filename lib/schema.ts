import type { MatchPost } from "@/types";
import { absoluteUrl } from "@/lib/utils";

export function articleSchema(match: MatchPost) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: match.title,
    description: match.excerpt,
    image: absoluteUrl(match.featured_image),
    datePublished: match.match_date,
    dateModified: match.match_date,
    author: {
      "@type": "Organization",
      name: "MatchVault",
    },
    publisher: {
      "@type": "Organization",
      name: "MatchVault",
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/images/logo.svg"),
      },
    },
    mainEntityOfPage: absoluteUrl(`/matches/${match.slug}`),
  };
}

export function videoObjectSchema(match: MatchPost) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: match.title,
    description: match.excerpt,
    thumbnailUrl: absoluteUrl(match.featured_image),
    uploadDate: match.match_date,
    embedUrl: match.youtube_url,
    publisher: {
      "@type": "Organization",
      name: "MatchVault",
    },
  };
}

export function breadcrumbSchema(
  items: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}

export function faqSchema(
  faqs: { question: string; answer: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "MatchVault",
    url: absoluteUrl("/"),
    description:
      "Football match analysis, tactical breakdowns, and highlights from top European leagues.",
    potentialAction: {
      "@type": "SearchAction",
      target: absoluteUrl("/matches?q={search_term_string}"),
      "query-input": "required name=search_term_string",
    },
  };
}
