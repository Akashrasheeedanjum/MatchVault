import { AD_SLOTS } from "@/lib/adsense";
import { AdUnit } from "@/components/ads/AdUnit";
import { cn } from "@/lib/utils";

export function AdBanner({
  position = "top",
  className,
}: {
  position?: "top" | "bottom";
  className?: string;
}) {
  const slot =
    position === "top" ? AD_SLOTS.bannerTop : AD_SLOTS.bannerBottom;

  return (
    <AdUnit
      slot={slot}
      format="horizontal"
      label={`Banner Ad ${position === "top" ? "#1" : "#2"}`}
      className={cn("w-full min-h-[90px]", className)}
    />
  );
}
