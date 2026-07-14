import { configureCloudinary } from "@/lib/cloudinary";

const FOLDER = "matchvault/articles";
const INDEX_ID = `${FOLDER}/_index`;

type ArticleIndex = {
  articles: Record<string, { url: string; updatedAt: string }>;
};

export function cloudinaryArticlePublicId(slug: string): string {
  return `${FOLDER}/${slug}`;
}

export function isServerlessReadonlyFs(): boolean {
  return Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
}

export function isCloudinaryConfigured(): boolean {
  const cloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    process.env.CLOUDINARY_CLOUD_NAME;
  return Boolean(
    cloudName &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

function cloudName(): string {
  return (
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    process.env.CLOUDINARY_CLOUD_NAME ||
    ""
  );
}

async function uploadRawBuffer(
  publicId: string,
  buffer: Buffer,
): Promise<{ publicId: string; url: string }> {
  const cloudinary = configureCloudinary();

  const result = await new Promise<{
    public_id: string;
    secure_url?: string;
    url?: string;
  }>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "raw",
          public_id: publicId,
          overwrite: true,
          invalidate: true,
        },
        (error, uploaded) => {
          if (error || !uploaded) {
            reject(error || new Error("Cloudinary upload failed"));
            return;
          }
          resolve({
            public_id: uploaded.public_id,
            secure_url: uploaded.secure_url,
            url: uploaded.url,
          });
        },
      )
      .end(buffer);
  });

  const url = result.secure_url || result.url;
  if (!url) throw new Error("Cloudinary did not return a file URL");

  return { publicId: result.public_id, url };
}

async function readIndex(): Promise<ArticleIndex> {
  const name = cloudName();
  if (!name) return { articles: {} };

  const candidates = [
    `https://res.cloudinary.com/${name}/raw/upload/${INDEX_ID}`,
    `https://res.cloudinary.com/${name}/raw/upload/v1/${INDEX_ID}`,
  ];

  for (const url of candidates) {
    try {
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) continue;
      const data = (await response.json()) as ArticleIndex;
      return { articles: data.articles || {} };
    } catch {
      // try next
    }
  }

  return { articles: {} };
}

async function writeIndex(index: ArticleIndex): Promise<void> {
  const body = Buffer.from(JSON.stringify(index, null, 2), "utf8");
  await uploadRawBuffer(INDEX_ID, body);
}

/** Upload markdown article as a Cloudinary raw file (persists on Vercel). */
export async function uploadArticleMarkdown(
  slug: string,
  markdown: string,
): Promise<{ publicId: string; url: string }> {
  const publicId = cloudinaryArticlePublicId(slug);
  const uploaded = await uploadRawBuffer(
    publicId,
    Buffer.from(markdown, "utf8"),
  );

  const index = await readIndex();
  index.articles[slug] = {
    url: uploaded.url,
    updatedAt: new Date().toISOString(),
  };
  await writeIndex(index);

  return uploaded;
}

export async function deleteArticleMarkdown(slug: string): Promise<boolean> {
  if (!isCloudinaryConfigured()) return false;
  const cloudinary = configureCloudinary();
  const publicId = cloudinaryArticlePublicId(slug);

  let destroyed = false;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
    destroyed = true;
  } catch {
    destroyed = false;
  }

  try {
    const index = await readIndex();
    if (index.articles[slug]) {
      delete index.articles[slug];
      await writeIndex(index);
      destroyed = true;
    }
  } catch {
    // ignore index update failure
  }

  return destroyed;
}

export async function listCloudinaryArticleUrls(): Promise<
  Array<{ slug: string; url: string }>
> {
  if (!isCloudinaryConfigured()) return [];

  const index = await readIndex();
  const fromIndex = Object.entries(index.articles)
    .filter(([, meta]) => Boolean(meta.url))
    .map(([slug, meta]) => ({ slug, url: meta.url }));

  if (fromIndex.length > 0) return fromIndex;

  // Fallback: Admin API listing (slower)
  try {
    const cloudinary = configureCloudinary();
    const articles: Array<{ slug: string; url: string }> = [];
    let nextCursor: string | undefined;

    do {
      const result = (await cloudinary.api.resources({
        type: "upload",
        resource_type: "raw",
        prefix: `${FOLDER}/`,
        max_results: 500,
        next_cursor: nextCursor,
      })) as {
        resources?: Array<{
          public_id: string;
          secure_url?: string;
          url?: string;
        }>;
        next_cursor?: string;
      };

      for (const resource of result.resources || []) {
        if (resource.public_id === INDEX_ID || resource.public_id.endsWith("/_index")) {
          continue;
        }
        const slug = resource.public_id
          .replace(`${FOLDER}/`, "")
          .replace(/\.md$/i, "");
        if (!slug) continue;
        articles.push({
          slug,
          url: resource.secure_url || resource.url || "",
        });
      }
      nextCursor = result.next_cursor;
    } while (nextCursor);

    return articles.filter((item) => item.url);
  } catch {
    return [];
  }
}

export async function fetchArticleMarkdownBySlug(
  slug: string,
): Promise<string | null> {
  if (!isCloudinaryConfigured()) return null;

  const index = await readIndex();
  const indexedUrl = index.articles[slug]?.url;
  const name = cloudName();
  const candidates = [
    indexedUrl,
    name ? `https://res.cloudinary.com/${name}/raw/upload/${cloudinaryArticlePublicId(slug)}` : "",
    name
      ? `https://res.cloudinary.com/${name}/raw/upload/v1/${cloudinaryArticlePublicId(slug)}`
      : "",
  ].filter(Boolean) as string[];

  for (const url of candidates) {
    try {
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) continue;
      const text = await response.text();
      if (text.trim()) return text;
    } catch {
      // try next candidate
    }
  }

  return null;
}

export async function fetchAllCloudinaryMarkdown(): Promise<
  Array<{ slug: string; markdown: string }>
> {
  const listed = await listCloudinaryArticleUrls();
  const results: Array<{ slug: string; markdown: string }> = [];

  await Promise.all(
    listed.map(async (item) => {
      try {
        const response = await fetch(item.url, { cache: "no-store" });
        if (!response.ok) return;
        const markdown = await response.text();
        if (markdown.trim()) results.push({ slug: item.slug, markdown });
      } catch {
        // skip broken remote file
      }
    }),
  );

  return results;
}
