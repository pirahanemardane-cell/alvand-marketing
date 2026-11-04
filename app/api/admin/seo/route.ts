import { NextRequest, NextResponse } from "next/server";
import {
  createServiceClientOrThrow,
  hasServiceEnv,
  requireAdminUser,
} from "@/lib/supabase/admin";

function serviceUnavailable() {
  return NextResponse.json(
    { error: "supabase_not_configured" },
    { status: 503 }
  );
}

export async function GET(req: NextRequest) {
  const user = await requireAdminUser();
  if (!user) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  if (!hasServiceEnv()) return serviceUnavailable();

  const key = req.nextUrl.searchParams.get("key");
  const sb = createServiceClientOrThrow();

  if (key) {
    const { data, error } = await sb
      .from("seo_pages")
      .select("*")
      .eq("page_key", key)
      .maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ row: data });
  }

  const { data, error } = await sb.from("seo_pages").select("*").order("page_key");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data ?? [] });
}

export async function PATCH(req: NextRequest) {
  const user = await requireAdminUser();
  if (!user) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  if (!hasServiceEnv()) return serviceUnavailable();

  const body = await req.json();
  const page_key = String(body.page_key || "").trim();
  if (!page_key) return NextResponse.json({ error: "invalid" }, { status: 400 });

  const row = {
    page_key,
    title: body.title ?? null,
    body_preview: body.body_preview ?? null,
    meta_title: body.meta_title ?? null,
    meta_description: body.meta_description ?? null,
    focus_keyphrases: Array.isArray(body.focus_keyphrases)
      ? body.focus_keyphrases
      : [],
    og_title: body.og_title ?? null,
    og_description: body.og_description ?? null,
    og_image_url: body.og_image_url ?? null,
    robots_index: body.robots_index !== false,
    robots_follow: body.robots_follow !== false,
    canonical_url: body.canonical_url ?? null,
    updated_at: new Date().toISOString(),
  };

  const sb = createServiceClientOrThrow();
  const { error } = await sb.from("seo_pages").upsert(row, { onConflict: "page_key" });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
