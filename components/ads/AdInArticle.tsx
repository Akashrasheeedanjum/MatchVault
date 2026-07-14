import { AD_SLOTS } from "@/lib/adsense";
import { AdUnit } from "@/components/ads/AdUnit";
import { cn } from "@/lib/utils";

export function AdInArticle({
  index = 1,
  className,
}: {
  index?: 1 | 2;
  className?: string;
}) {
  const slot = index === 1 ? AD_SLOTS.inArticle1 : AD_SLOTS.inArticle2;

  return (
    <div
      className={cn(
        "my-10 border-y border-[var(--line)] py-6",
        className,
      )}
    >
      <AdUnit
        slot={slot}
        format="auto"
        label={`In-article advertisement ${index}`}
        className="min-h-[250px]"
      />
    </div>
  );
}
