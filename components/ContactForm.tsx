"use client";

import { useState } from "react";

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          phone: data.get("phone"),
          message: data.get("message"),
          website: data.get("website"),
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          typeof json.error === "string"
            ? json.error
            : "ارسال انجام نشد. دوباره تلاش کنید یا از واتساپ پیام بدهید."
        );
        return;
      }
      setSent(true);
    } catch {
      setError("خطا در ارتباط با سرور. از واتساپ پیام بدهید.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <p className="font-bold text-lg mb-2">پیام شما ثبت شد</p>
        <p className="text-caption text-muted-foreground leading-persian">
          تا ۲۴ ساعت با شما تماس می‌گیریم. اگر عجله دارید، از واتساپ پیام
          بدهید.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative space-y-4">
      {/* Honeypot — hidden from users, filled by simple bots */}
      <div className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="website">وب‌سایت</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1.5">
          نام
        </label>
        <input
          id="name"
          name="name"
          required
          minLength={2}
          maxLength={80}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-accent transition-colors"
          placeholder="نام شما"
        />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium mb-1.5">
          شماره تماس
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          minLength={8}
          maxLength={40}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-accent transition-colors"
          placeholder="۰۹۱۲..."
          dir="ltr"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-1.5">
          پیام (اختیاری)
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          maxLength={2000}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-accent transition-colors resize-none"
          placeholder="چه کمکی از ما می‌خواهید؟"
        />
      </div>
      {error && (
        <p className="text-sm text-red-500 bg-red-500/10 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto rounded-full bg-accent text-accent-foreground font-bold text-sm px-8 py-3.5 hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        {loading ? "در حال ارسال..." : "ارسال پیام"}
      </button>
      <p className="text-xs text-muted-foreground">
        با ارسال فرم، تا ۲۴ ساعت با شما تماس می‌گیریم.
      </p>
    </form>
  );
}
