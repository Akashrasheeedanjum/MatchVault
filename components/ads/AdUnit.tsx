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

/**
 * Labeled AdSense unit — clear "Advertisement" caption helps policy compliance.
 * Never place this inside download blocks.
 */
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

  return (
    <aside
      className={cn("ad-unit my-2", className)}
      aria-label="Advertisement"
    >
      <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
        Advertisement
      </p>
      {!ADSENSE_ENABLED || !slot ? (
        <div
          className="flex min-h-[90px] items-center justify-center rounded-md border border-dashed border-[var(--line)] bg-[var(--mist)] text-xs text-[var(--muted)]"
          aria-hidden="true"
        >
          {label} placeholder
        </div>
      ) : (
        <div className="ad-slot overflow-hidden">
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client={ADSENSE_CLIENT_ID}
            data-ad-slot={slot}
            data-ad-format={format}
            data-full-width-responsive={
              fullWidthResponsive ? "true" : "false"
            }
          />
        </div>
      )}
    </aside>
  );
}
