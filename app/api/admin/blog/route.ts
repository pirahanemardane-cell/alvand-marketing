import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { toSlug } from "@/lib/slug";

const ADMIN_EMAIL = "alvandmarketing.com@gmail.com";

function service() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function requireAdmin() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) return null;
  return user;
}

export async function GET(req: NextRequest) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const sb = service();
  const id = req.nextUrl.searchParams.get("id");

  if (id) {
    const { data, error } = await sb.from("blog_posts").select("*").eq("id", id).maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ item: data });
  }

  const { data, error } = await sb
    .from("blog_posts")
    .select("id, title, slug, status, published_at, created_at, excerpt, meta_title, category_id")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data ?? [] });
}

export async function POST(req: NextRequest) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const body = await req.json();
  const title = String(body.title || "").trim();
  if (!title) return NextResponse.json({ error: "title_required" }, { status: 400 });

  const slug = String(body.slug || toSlug(title)).trim() || toSlug(title);
  const status = body.status === "published" ? "published" : "draft";

  const sb = service();
  const { data, error } = await sb
    .from("blog_posts")
    .insert({
      title,
      slug,
      excerpt: body.excerpt ?? null,
      body: body.body ?? null,
      cover_url: body.cover_url ?? null,
      status,
      published_at: status === "published" ? new Date().toISOString() : null,
      author_id: user.id,
      meta_title: body.meta_title ?? null,
      meta_description: body.meta_description ?? null,
      focus_keyphrase: body.focus_keyphrase ?? null,
      og_title: body.og_title ?? null,
      og_description: body.og_description ?? null,
      og_image_url: body.og_image_url ?? null,
      category_id: body.category_id || null,
    })
    .select("id, slug")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, item: data });
}

export async function PATCH(req: NextRequest) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const body = await req.json();
  const id = body.id as string;
  if (!id) return NextResponse.json({ error: "invalid" }, { status: 400 });

  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  const fields = [
    "title", "slug", "excerpt", "body", "cover_url", "status",
    "meta_title", "meta_description", "focus_keyphrase",
    "og_title", "og_description", "og_image_url", "category_id",
    "robots_index", "robots_follow", "canonical_url",
  ];
  for (const f of fields) {
    if (body[f] !== undefined) patch[f] = body[f];
  }
  if (body.status === "published") {
    patch.published_at = new Date().toISOString();
  }

  const sb = service();
  const { error } = await sb.from("blog_posts").update(patch).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const body = await req.json();
  const id = body.id as string;
  if (!id) return NextResponse.json({ error: "invalid" }, { status: 400 });

  const sb = service();
  const { error } = await sb.from("blog_posts").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
