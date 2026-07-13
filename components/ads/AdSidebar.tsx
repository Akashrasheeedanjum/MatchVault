import { AD_SLOTS } from "@/lib/adsense";
import { AdUnit } from "@/components/ads/AdUnit";
import { cn } from "@/lib/utils";

export function AdSidebar({ className }: { className?: string }) {
  return (
    <div className={cn("hidden lg:block", className)}>
      <AdUnit
        slot={AD_SLOTS.sidebar}
        format="rectangle"
        label="Sidebar Ad 300x250"
        className="min-h-[250px] w-full max-w-[300px]"
        fullWidthResponsive={false}
      />
    </div>
  );
}
