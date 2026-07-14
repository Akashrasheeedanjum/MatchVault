import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { configureCloudinary, formatBytes } from "@/lib/cloudinary";
import {
  commitImageToGitHub,
  isGitHubConfigured,
} from "@/lib/article-github";

export const runtime = "nodejs";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_BYTES = 100 * 1024 * 1024; // 100MB (Cloudinary free tier limits apply)

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const cloudinary = configureCloudinary();
    const formData = await request.formData();
    const file = formData.get("file");
    const kind = String(formData.get("kind") || "image");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const isVideo = kind === "video" || file.type.startsWith("video/");
    const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;

    if (file.size > maxBytes) {
      return NextResponse.json(
        {
          error: `File too large. Max ${isVideo ? "100MB for video" : "10MB for images"}.`,
        },
        { status: 400 },
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const resourceType = isVideo ? "video" : "image";
    const folder = isVideo ? "matchvault/downloads" : "matchvault/images";

    const uploaded = await new Promise<{
      secure_url: string;
      bytes: number;
      format?: string;
      resource_type: string;
      public_id: string;
    }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder,
            resource_type: resourceType,
            overwrite: false,
          },
          (error, result) => {
            if (error || !result) {
              reject(error || new Error("Upload failed"));
              return;
            }
            resolve({
              secure_url: result.secure_url,
              bytes: result.bytes || 0,
              format: result.format,
              resource_type: result.resource_type || resourceType,
              public_id: result.public_id,
            });
          },
        )
        .end(bytes);
    });

    let githubPath: string | undefined;
    let githubWarning: string | undefined;

    // Backup image into the repo when GITHUB_TOKEN is set
    if (!isVideo && isGitHubConfigured()) {
      try {
        const ext =
          uploaded.format ||
          file.name.split(".").pop() ||
          "jpg";
        const baseName = file.name.includes(".")
          ? file.name
          : `${file.name}.${ext}`;
        const committed = await commitImageToGitHub(baseName, bytes);
        githubPath = committed.path;
      } catch (error) {
        githubWarning =
          error instanceof Error
            ? error.message
            : "GitHub image commit failed";
      }
    }

    return NextResponse.json({
      ok: true,
      url: uploaded.secure_url,
      bytes: uploaded.bytes,
      size: formatBytes(uploaded.bytes),
      format: (uploaded.format || "").toUpperCase(),
      resourceType: uploaded.resource_type,
      publicId: uploaded.public_id,
      githubPath,
      githubWarning,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Cloudinary upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
