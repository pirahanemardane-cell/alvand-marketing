import { NextRequest, NextResponse } from "next/server";
import {
  createServiceClientOrThrow,
  hasServiceEnv,
  requireAdminUser,
} from "@/lib/supabase/admin";
import { captureException } from "@/lib/observability";

export async function GET() {
  const user = await requireAdminUser();
  if (!user) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  if (!hasServiceEnv()) {
    return NextResponse.json(
      { error: "supabase_not_configured" },
      { status: 503 }
    );
  }

  try {
    const supabase = createServiceClientOrThrow();
    const { data, error } = await supabase
      .from("blog_comments")
      .select(
        "id, post_slug, author_name, author_email, body, approved, created_at, user_id"
      )
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ comments: data ?? [] });
  } catch (e) {
    void captureException(e, { route: "/api/admin/comments", method: "GET" });
    const msg = e instanceof Error ? e.message : "error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const user = await requireAdminUser();
  if (!user) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  if (!hasServiceEnv()) {
    return NextResponse.json(
      { error: "supabase_not_configured" },
      { status: 503 }
    );
  }

  try {
    const { id, approved } = await req.json();
    if (!id || typeof approved !== "boolean") {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }

    const supabase = createServiceClientOrThrow();
    const { error } = await supabase
      .from("blog_comments")
      .update({ approved })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    void captureException(e, { route: "/api/admin/comments", method: "PATCH" });
    const msg = e instanceof Error ? e.message : "error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = await requireAdminUser();
  if (!user) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  if (!hasServiceEnv()) {
    return NextResponse.json(
      { error: "supabase_not_configured" },
      { status: 503 }
    );
  }

  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }

    const supabase = createServiceClientOrThrow();
    const { error } = await supabase.from("blog_comments").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    void captureException(e, { route: "/api/admin/comments", method: "DELETE" });
    const msg = e instanceof Error ? e.message : "error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
