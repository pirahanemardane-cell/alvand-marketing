import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { containsLink, sanitizeCommentBody } from "@/lib/comments";
import {
  COMMENT_LIMIT,
  clientIp,
  rateLimit,
} from "@/lib/rate-limit";
import { captureException } from "@/lib/observability";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const postSlug = searchParams.get("post");
    if (!postSlug) {
      return NextResponse.json({ error: "post required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("blog_comments")
      .select("id, author_name, body, created_at")
      .eq("post_slug", postSlug)
      .eq("approved", true)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ comments: data ?? [] });
  } catch {
    return NextResponse.json({ comments: [] });
  }
}

export async function POST(request: Request) {
  try {
    const ip = clientIp(request);
    const limited = rateLimit(
      `comments:${ip}`,
      COMMENT_LIMIT.limit,
      COMMENT_LIMIT.windowMs
    );
    if (!limited.ok) {
      return NextResponse.json(
        { error: "تعداد نظرات زیاد است. کمی بعد دوباره تلاش کنید." },
        {
          status: 429,
          headers: { "Retry-After": String(limited.retryAfterSec) },
        }
      );
    }

    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      return NextResponse.json(
        { error: "supabase_not_configured" },
        { status: 503 }
      );
    }

    const body = await request.json();
    const postSlug = String(body.postSlug ?? "").trim();
    const authorName = String(body.authorName ?? "").trim();
    const authorEmail = String(body.authorEmail ?? "").trim();
    const text = sanitizeCommentBody(String(body.body ?? ""));

    // Honeypot
    const honey = String(body.website ?? "").trim();
    if (honey) {
      return NextResponse.json({
        ok: true,
        message: "نظر شما ثبت شد و پس از تأیید نمایش داده می‌شود.",
      });
    }

    if (!postSlug || authorName.length < 2 || text.length < 3) {
      return NextResponse.json(
        { error: "نام و متن نظر را کامل وارد کنید." },
        { status: 400 }
      );
    }

    if (containsLink(text) || containsLink(authorName)) {
      return NextResponse.json(
        { error: "قرار دادن لینک در نظرات مجاز نیست." },
        { status: 400 }
      );
    }

    const supabaseUser = await createClient();
    const {
      data: { user },
    } = await supabaseUser.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "برای ثبت نظر وارد حساب کاربری شوید." },
        { status: 401 }
      );
    }

    const userLimited = rateLimit(
      `comments:user:${user.id}`,
      COMMENT_LIMIT.limit,
      COMMENT_LIMIT.windowMs
    );
    if (!userLimited.ok) {
      return NextResponse.json(
        { error: "تعداد نظرات زیاد است. کمی بعد دوباره تلاش کنید." },
        {
          status: 429,
          headers: { "Retry-After": String(userLimited.retryAfterSec) },
        }
      );
    }

    const service = createServiceClient();
    const { data: postRow } = await service
      .from("blog_posts")
      .select("id")
      .eq("slug", postSlug)
      .eq("status", "published")
      .maybeSingle();
    if (!postRow) {
      return NextResponse.json(
        { error: "مقاله یافت نشد." },
        { status: 404 }
      );
    }

    const { error } = await service.from("blog_comments").insert({
      post_slug: postSlug,
      author_name: authorName.slice(0, 80),
      author_email: (authorEmail || user.email || "").slice(0, 120) || null,
      user_id: user.id,
      body: text,
      approved: false,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      message: "نظر شما ثبت شد و پس از تأیید نمایش داده می‌شود.",
    });
  } catch (e) {
    void captureException(e, { route: "/api/comments" });
    const msg = e instanceof Error ? e.message : "خطا در ثبت نظر";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
