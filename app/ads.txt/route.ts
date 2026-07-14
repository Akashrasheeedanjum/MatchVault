import { NextResponse } from "next/server";

/**
 * Serves /ads.txt for AdSense seller verification.
 * Format: google.com, pub-XXXXXXXX, DIRECT, f08c47fec0942fa0
 */
export function GET() {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "";
  const publisher = clientId.replace(/^ca-/, "").trim();

  const body = publisher
    ? `google.com, ${publisher}, DIRECT, f08c47fec0942fa0\n`
    : `# Add NEXT_PUBLIC_ADSENSE_CLIENT_ID (ca-pub-xxxxxxxx) to publish your ads.txt line\n`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
