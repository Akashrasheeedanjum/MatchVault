import { ADSENSE_ENABLED, AD_SLOTS } from "@/lib/adsense";
import { AdUnit } from "@/components/ads/AdUnit";

/** Sticky mobile ad — only when slot configured (best after AdSense approval). */
export function AdMobileAnchor() {
  if (!ADSENSE_ENABLED || !AD_SLOTS.mobileAnchor) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--line)] bg-[var(--surface)]/95 backdrop-blur lg:hidden">
      <AdUnit
        slot={AD_SLOTS.mobileAnchor}
        format="horizontal"
        label="Mobile Advertisement"
        className="min-h-[50px] px-2 pb-2 pt-1"
      />
    </div>
  );
}
