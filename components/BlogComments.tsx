"use client";

import {
  CircularProgress,
  CircularProgressIndicator,
  CircularProgressRange,
  CircularProgressTrack,
} from "@/components/ui/circular-progress";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { containsLink } from "@/lib/comments";
import type { User } from "@supabase/supabase-js";

type Comment = {
  id: string;
  author_name: string;
  body: string;
  created_at: string;
};

export default function BlogComments({ postSlug }: { postSlug: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) {
        const metaName =
          data.user.user_metadata?.full_name ||
          data.user.email?.split("@")[0] ||
          "";
        setName(metaName);
      }
      setAuthReady(true);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/comments?post=${encodeURIComponent(postSlug)}`
      );
      const data = await res.json();
      setComments(data.comments ?? []);
    } catch {
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [postSlug]);

  useEffect(() => {
    load();
  }, [load]);

  // Realtime: new/updated comments for this post
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`blog-comments:${postSlug}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "blog_comments",
          filter: `post_slug=eq.${postSlug}`,
        },
        () => {
          void load();
        },
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [postSlug, load]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!user) {
      setError("برای ثبت نظر ابتدا وارد حساب کاربری شوید.");
      return;
    }

    if (containsLink(body) || containsLink(name)) {
      setError("قرار دادن لینک در نظرات مجاز نیست.");
      return;
    }

    if (body.trim().length < 3) {
      setError("متن نظر خیلی کوتاه است.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postSlug,
          authorName: name,
          authorEmail: user.email,
          body,
          userId: user.id,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "ثبت نظر ناموفق بود.");
        return;
      }
      setMessage(
        data.message || "نظر شما ثبت شد و پس از تأیید ادمین منتشر می‌شود."
      );
      setBody("");
    } catch {
      setError("ارتباط با سرور برقرار نشد.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-14 border-t border-border pt-10">
      <h2 className="text-xl font-bold mb-2">نظرات</h2>
      <p className="text-caption text-muted-foreground mb-6 leading-persian">
        فقط کاربران ثبت‌نام‌شده می‌توانند نظر بگذارند. نظر پس از تأیید ادمین
        منتشر می‌شود. قرار دادن لینک مجاز نیست.
      </p>

      {!authReady ? (
        <p className="text-sm text-muted mb-8">در حال بررسی وضعیت ورود...</p>
      ) : !user ? (
        <div className="mb-10 rounded-xl border border-border bg-card p-6 text-center">
          <p className="text-sm leading-persian mb-4">
            برای ثبت نظر ابتدا وارد حساب کاربری خود شوید یا ثبت‌نام کنید.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/login"
              className="rounded-full bg-accent text-accent-foreground font-bold text-sm px-6 py-2.5"
            >
              ورود
            </Link>
            <Link
              href="/register"
              className="rounded-full border border-border text-sm px-6 py-2.5 hover:bg-card"
            >
              ثبت‌نام
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4 mb-10">
          <div>
            <label htmlFor="c-name" className="block text-sm font-medium mb-1.5">
              نام نمایشی
            </label>
            <input
              id="c-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-accent"
              placeholder="نام شما"
              maxLength={80}
            />
          </div>
          <div>
            <label htmlFor="c-body" className="block text-sm font-medium mb-1.5">
              متن نظر
            </label>
            <textarea
              id="c-body"
              required
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-accent resize-none"
              placeholder="نظر خود را بنویسید (بدون لینک)"
              maxLength={1000}
            />
          </div>
          {error && (
            <p className="text-sm text-red-500" role="alert">
              {error}
            </p>
          )}
          {message && (
            <p className="text-sm text-accent" role="status">
              {message}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-accent text-accent-foreground font-bold text-sm px-7 py-3 disabled:opacity-60"
          >
            {submitting ? "در حال ارسال..." : "ارسال نظر"}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {loading && (
          <div className="flex justify-center py-8">
            <CircularProgress value={null} size={40} thickness={3}>
              <CircularProgressIndicator>
                <CircularProgressTrack />
                <CircularProgressRange />
              </CircularProgressIndicator>
            </CircularProgress>
          </div>
        )}
        {!loading && comments.length === 0 && (
          <p className="text-caption text-muted-foreground">
            هنوز نظری تأیید نشده است.
          </p>
        )}
        {comments.map((c) => (
          <div
            key={c.id}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="font-medium text-sm">{c.author_name}</span>
              <span className="text-xs text-muted">
                {new Date(c.created_at).toLocaleDateString("fa-IR")}
              </span>
            </div>
            <p className="text-sm leading-persian whitespace-pre-wrap">
              {c.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
