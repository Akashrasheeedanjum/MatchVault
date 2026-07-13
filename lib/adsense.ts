export const ADSENSE_CLIENT_ID =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "";

export const ADSENSE_ENABLED = Boolean(ADSENSE_CLIENT_ID);

export const AD_SLOTS = {
  bannerTop: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BANNER_TOP || "",
  bannerBottom: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BANNER_BOTTOM || "",
  inArticle1: process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_ARTICLE_1 || "",
  inArticle2: process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_ARTICLE_2 || "",
  sidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR || "",
  mobileAnchor: process.env.NEXT_PUBLIC_ADSENSE_SLOT_MOBILE_ANCHOR || "",
} as const;

export type AdFormat = "auto" | "horizontal" | "rectangle" | "vertical";
