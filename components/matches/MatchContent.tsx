import Image from "next/image";
import type { MatchPost } from "@/types";
import { AdInArticle } from "@/components/ads/AdInArticle";
import { MatchVideo } from "@/components/matches/MatchVideo";

/**
 * Content-first body for AdSense:
 * original text + video first, then ads between later sections (never near downloads).
 */
export function MatchContent({ match }: { match: MatchPost }) {
  const intro = (match.contentHtml || "").trim();
  const sections = (match.content_sections || []).filter(
    (section) => section.image || section.text_html?.trim(),
  );

  return (
    <div className="article-body">
      {intro ? (
        <div
          className="prose-match"
          dangerouslySetInnerHTML={{ __html: intro }}
        />
      ) : null}

      <MatchVideo youtubeUrl={match.youtube_url || ""} title={match.title} />

      {/* If there are no sections, place one mid-article unit after main content */}
      {sections.length === 0 ? <AdInArticle index={1} /> : null}

      {sections.map((section, index) => (
        <section key={`section-${index}`} className="article-section">
          <hr className="article-rule" />
          {section.image ? (
            <figure className="article-figure">
              <Image
                src={section.image}
                alt={`${match.title} — photo ${index + 1}`}
                width={900}
                height={560}
                className="h-auto w-full object-cover"
                sizes="(max-width: 1024px) 100vw, 720px"
              />
            </figure>
          ) : null}
          {section.text_html?.trim() ? (
            <div
              className="prose-match"
              dangerouslySetInnerHTML={{ __html: section.text_html }}
            />
          ) : null}
          {/* Ads only after meaningful content blocks — not above the fold alone */}
          {index === 0 ? <AdInArticle index={1} /> : null}
          {index === 2 ? <AdInArticle index={2} /> : null}
        </section>
      ))}

      <hr className="article-rule" />
    </div>
  );
}
