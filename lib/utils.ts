export function cn(...inputs: Array<string | false | null | undefined>) {
  return inputs.filter(Boolean).join(" ");
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Relative labels for article feeds: Latest, 2 days ago, 3 weeks ago… */
export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return formatDate(dateString);

  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const startOfDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const diffDays = Math.round(
    (startOfToday.getTime() - startOfDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays <= 0) return "Latest";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;

  const weeks = Math.floor(diffDays / 7);
  if (diffDays < 30) {
    return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  }

  const months =
    (now.getFullYear() - date.getFullYear()) * 12 +
    (now.getMonth() - date.getMonth());
  if (months < 12) {
    const m = Math.max(1, months);
    return m === 1 ? "1 month ago" : `${m} months ago`;
  }

  const years = Math.floor(months / 12);
  return years === 1 ? "1 year ago" : `${years} years ago`;
}

export function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

export function absoluteUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://matchvault.com";
  return `${base.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}
