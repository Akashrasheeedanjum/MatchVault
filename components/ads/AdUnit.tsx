"use client";

import { useEffect, useRef } from "react";
import {
  ADSENSE_CLIENT_ID,
  ADSENSE_ENABLED,
  type AdFormat,
} from "@/lib/adsense";
import { cn } from "@/lib/utils";

interface AdUnitProps {
  slot: string;
  format?: AdFormat;
  className?: string;
  label?: string;
  fullWidthResponsive?: boolean;
}

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

export function AdUnit({
  slot,
  format = "auto",
  className,
  label = "Advertisement",
  fullWidthResponsive = true,
}: AdUnitProps) {
  const pushed = useRef(false);

  useEffect(() => {
    if (!ADSENSE_ENABLED || !slot || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense may be blocked by extensions
    }
  }, [slot]);

  if (!ADSENSE_ENABLED || !slot) {
    return (
      <div
        className={cn(
          "flex min-h-[90px] items-center justify-center rounded-md border border-dashed border-[var(--line)] bg-[var(--mist)] text-xs text-[var(--muted)]",
          className,
        )}
        aria-hidden="true"
      >
        {label} placeholder
      </div>
    );
  }

  return (
    <div className={cn("ad-slot overflow-hidden", className)}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
      />
    </div>
  );
}
