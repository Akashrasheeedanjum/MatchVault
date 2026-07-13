import type { MatchPost } from "@/types";
import { AdInArticle } from "@/components/ads/AdInArticle";

function splitHtmlIntoParagraphs(html: string): string[] {
  const parts = html
    .split(/(?=<p[\s>])/)
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts : [html];
}

export function MatchContent({ match }: { match: MatchPost }) {
  const paragraphs = splitHtmlIntoParagraphs(match.contentHtml);

  return (
    <div className="prose-match">
      {paragraphs.map((paragraph, index) => (
        <div key={index}>
          <div dangerouslySetInnerHTML={{ __html: paragraph }} />
          {index === 0 && <AdInArticle index={1} />}
          {index === 2 && <AdInArticle index={2} />}
        </div>
      ))}
    </div>
  );
}
