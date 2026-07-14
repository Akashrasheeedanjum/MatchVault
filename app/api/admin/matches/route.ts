import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { saveMatchMarkdown, type MatchFormInput } from "@/lib/admin-matches";

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const body = (await request.json()) as MatchFormInput;
    if (!body.title || !body.contentHtml) {
      return NextResponse.json(
        { error: "Title and article content are required." },
        { status: 400 },
      );
    }
    const result = saveMatchMarkdown(body, false);
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create match";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
