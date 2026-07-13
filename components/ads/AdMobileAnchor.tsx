"use client";

import { useState } from "react";
import { AD_SLOTS } from "@/lib/adsense";
import { AdUnit } from "@/components/ads/AdUnit";

export function AdMobileAnchor() {
  const [collapsed, setCollapsed] = useState(false);

  if (collapsed) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--line)] bg-[var(--surface)]/95 backdrop-blur lg:hidden">
      <button
        type="button"
        onClick={() => setCollapsed(true)}
        className="absolute right-2 top-1 z-10 rounded px-2 py-0.5 text-xs text-[var(--muted)]"
        aria-label="Close ad"
      >
        Close
      </button>
      <AdUnit
        slot={AD_SLOTS.mobileAnchor}
        format="horizontal"
        label="Mobile Anchor Ad"
        className="min-h-[50px] px-2 pb-2 pt-5"
      />
    </div>
  );
}
