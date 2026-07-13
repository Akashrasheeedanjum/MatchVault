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
    <div className={cn("my-8", className)}>
      <AdUnit
        slot={slot}
        format="auto"
        label={`In-Article Ad #${index}`}
        className="min-h-[250px]"
      />
    </div>
  );
}
