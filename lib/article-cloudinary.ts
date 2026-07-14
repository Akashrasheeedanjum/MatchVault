import { configureCloudinary } from "@/lib/cloudinary";

const FOLDER = "matchvault/articles";

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

/** Upload markdown article as a Cloudinary raw file (persists on Vercel). */
export async function uploadArticleMarkdown(
  slug: string,
  markdown: string,
): Promise<{ publicId: string; url: string }> {
  const cloudinary = configureCloudinary();
  const publicId = cloudinaryArticlePublicId(slug);
  const dataUri = `data:text/markdown;base64,${Buffer.from(markdown, "utf8").toString("base64")}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    resource_type: "raw",
    public_id: publicId,
    overwrite: true,
    invalidate: true,
  });

  return {
    publicId: result.public_id as string,
    url: (result.secure_url || result.url) as string,
  };
}

export async function deleteArticleMarkdown(slug: string): Promise<boolean> {
  if (!isCloudinaryConfigured()) return false;
  const cloudinary = configureCloudinary();
  const publicId = cloudinaryArticlePublicId(slug);
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
    return true;
  } catch {
    return false;
  }
}

export async function listCloudinaryArticleUrls(): Promise<
  Array<{ slug: string; url: string }>
> {
  if (!isCloudinaryConfigured()) return [];

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
      resources?: Array<{ public_id: string; secure_url?: string; url?: string }>;
      next_cursor?: string;
    };

    for (const resource of result.resources || []) {
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
}

export async function fetchArticleMarkdownBySlug(
  slug: string,
): Promise<string | null> {
  if (!isCloudinaryConfigured()) return null;

  const cloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    process.env.CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return null;

  const publicId = cloudinaryArticlePublicId(slug);
  const url = `https://res.cloudinary.com/${cloudName}/raw/upload/${publicId}`;

  try {
    const response = await fetch(url, { next: { revalidate: 30 } });
    if (!response.ok) return null;
    return await response.text();
  } catch {
    return null;
  }
}

export async function fetchAllCloudinaryMarkdown(): Promise<
  Array<{ slug: string; markdown: string }>
> {
  const listed = await listCloudinaryArticleUrls();
  const results: Array<{ slug: string; markdown: string }> = [];

  await Promise.all(
    listed.map(async (item) => {
      try {
        const response = await fetch(item.url, { next: { revalidate: 30 } });
        if (!response.ok) return;
        const markdown = await response.text();
        results.push({ slug: item.slug, markdown });
      } catch {
        // skip broken remote file
      }
    }),
  );

  return results;
}
