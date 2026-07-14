export interface Goalscorer {
  player: string;
  time: string;
  team: "home" | "away";
}

export interface MatchStatPair {
  home: number;
  away: number;
}

/** Image + related text block — admin can add as many as needed. */
export interface ContentSection {
  image: string;
  text_html: string;
}

export interface MatchFrontmatter {
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string;
  /** Repeated blocks: image then related text. */
  content_sections?: ContentSection[];
  google_drive_url?: string;
  popular?: boolean;
  content_format?: "markdown" | "html";
  match_date?: string;
  /** Legacy / optional — filled with defaults if missing. */
  youtube_url?: string;
  league?: string;
  team_home?: string;
  team_away?: string;
  score_home?: number;
  score_away?: number;
  goalscorers?: Goalscorer[];
  possession?: MatchStatPair;
  shots?: MatchStatPair;
  referee?: string;
  tags?: string[];
  gallery_images?: string[];
  download_size?: string;
  download_format?: string;
  faq?: { question: string; answer: string }[];
}

export interface MatchPost {
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string;
  content_sections?: ContentSection[];
  google_drive_url?: string;
  popular?: boolean;
  content_format?: "markdown" | "html";
  match_date: string;
  youtube_url: string;
  league: string;
  team_home: string;
  team_away: string;
  score_home: number;
  score_away: number;
  goalscorers: Goalscorer[];
  possession: MatchStatPair;
  shots: MatchStatPair;
  referee: string;
  tags: string[];
  gallery_images?: string[];
  download_size?: string;
  download_format?: string;
  faq?: { question: string; answer: string }[];
  content: string;
  contentHtml: string;
  readingTime: string;
  leagueSlug: string;
}

export interface LeagueInfo {
  name: string;
  slug: string;
  description: string;
}
