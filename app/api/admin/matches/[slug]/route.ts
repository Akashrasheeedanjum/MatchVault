import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-api";
import {
  deleteMatchMarkdown,
  saveMatchMarkdown,
  type MatchFormInput,
} from "@/lib/admin-matches";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const { slug } = await context.params;
    const body = (await request.json()) as MatchFormInput;
    const payload = { ...body, slug: body.slug || slug };
    const result = await saveMatchMarkdown(payload, true);
    revalidatePath("/");
    revalidatePath("/matches");
    revalidatePath(`/matches/${result.slug}`);
    revalidatePath("/admin");
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update match";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const { slug } = await context.params;
    await deleteMatchMarkdown(slug);
    revalidatePath("/");
    revalidatePath("/matches");
    revalidatePath(`/matches/${slug}`);
    revalidatePath("/admin");
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete match";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
