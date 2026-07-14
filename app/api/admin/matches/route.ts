import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
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
    const result = await saveMatchMarkdown(body, false);
    revalidatePath("/");
    revalidatePath("/matches");
    revalidatePath(`/matches/${result.slug}`);
    revalidatePath("/admin");
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create match";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
