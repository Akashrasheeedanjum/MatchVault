const ARTICLES_DIR = "content/matches/articles";

export function isGitHubConfigured(): boolean {
  return Boolean(process.env.GITHUB_TOKEN && getGitHubRepo());
}

export function getGitHubRepo(): string | null {
  if (process.env.GITHUB_REPO?.trim()) {
    return process.env.GITHUB_REPO.trim().replace(/\.git$/, "");
  }
  const owner = process.env.VERCEL_GIT_REPO_OWNER;
  const slug = process.env.VERCEL_GIT_REPO_SLUG;
  if (owner && slug) return `${owner}/${slug}`;
  return null;
}

export function getGitHubBranch(): string {
  return (
    process.env.GITHUB_BRANCH?.trim() ||
    process.env.VERCEL_GIT_COMMIT_REF?.trim() ||
    "main"
  );
}

function articlePath(slug: string): string {
  return `${ARTICLES_DIR}/${slug}.md`;
}

function authHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN is not set");
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };
}

async function getFileMeta(
  slug: string,
): Promise<{ sha: string; path: string } | null> {
  const repo = getGitHubRepo();
  if (!repo) return null;
  const path = articlePath(slug);
  const branch = getGitHubBranch();
  const url = `https://api.github.com/repos/${repo}/contents/${path}?ref=${encodeURIComponent(branch)}`;

  const response = await fetch(url, {
    headers: authHeaders(),
    cache: "no-store",
  });

  if (response.status === 404) return null;
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub read failed (${response.status}): ${text}`);
  }

  const data = (await response.json()) as { sha?: string };
  if (!data.sha) return null;
  return { sha: data.sha, path };
}

/** Commit markdown into content/matches/articles/{slug}.md on GitHub. */
export async function commitArticleToGitHub(
  slug: string,
  markdown: string,
  message: string,
): Promise<{ path: string; htmlUrl?: string }> {
  const repo = getGitHubRepo();
  if (!repo) {
    throw new Error(
      "GITHUB_REPO is missing. Set GITHUB_REPO=owner/repo or deploy from GitHub on Vercel.",
    );
  }

  const path = articlePath(slug);
  const existing = await getFileMeta(slug);
  const branch = getGitHubBranch();

  const response = await fetch(
    `https://api.github.com/repos/${repo}/contents/${path}`,
    {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({
        message,
        content: Buffer.from(markdown, "utf8").toString("base64"),
        branch,
        ...(existing?.sha ? { sha: existing.sha } : {}),
      }),
    },
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub save failed (${response.status}): ${text}`);
  }

  const data = (await response.json()) as {
    content?: { html_url?: string; path?: string };
  };

  return {
    path: data.content?.path || path,
    htmlUrl: data.content?.html_url,
  };
}

export async function deleteArticleFromGitHub(slug: string): Promise<boolean> {
  if (!isGitHubConfigured()) return false;
  const repo = getGitHubRepo();
  if (!repo) return false;

  const existing = await getFileMeta(slug);
  if (!existing) return false;

  const response = await fetch(
    `https://api.github.com/repos/${repo}/contents/${existing.path}`,
    {
      method: "DELETE",
      headers: authHeaders(),
      body: JSON.stringify({
        message: `Delete article ${slug}`,
        sha: existing.sha,
        branch: getGitHubBranch(),
      }),
    },
  );

  if (!response.ok && response.status !== 404) {
    const text = await response.text();
    throw new Error(`GitHub delete failed (${response.status}): ${text}`);
  }

  return response.ok || response.status === 404;
}

export async function githubArticleExists(slug: string): Promise<boolean> {
  if (!isGitHubConfigured()) return false;
  try {
    return Boolean(await getFileMeta(slug));
  } catch {
    return false;
  }
}
