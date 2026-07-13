export interface Goalscorer {
  player: string;
  time: string;
  team: "home" | "away";
}

export interface MatchStatPair {
  home: number;
  away: number;
}

export interface MatchFrontmatter {
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string;
  youtube_url: string;
  league: string;
  match_date: string;
  team_home: string;
  team_away: string;
  score_home: number;
  score_away: number;
  goalscorers: Goalscorer[];
  possession: MatchStatPair;
  shots: MatchStatPair;
  referee: string;
  tags: string[];
  download_url?: string;
  download_size?: string;
  download_format?: string;
  faq?: { question: string; answer: string }[];
  popular?: boolean;
  content_format?: "markdown" | "html";
}

export interface MatchPost extends MatchFrontmatter {
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
