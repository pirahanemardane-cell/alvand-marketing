"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBreadcrumb from "@/components/Breadcrumb";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error: err } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo:
            typeof window !== "undefined"
              ? `${window.location.origin}/`
              : undefined,
        },
      });
      if (err) {
        setError(err.message);
        return;
      }
      if (data.session) {
        router.push("/");
        router.refresh();
        return;
      }
      setMessage(
        "ثبت‌نام انجام شد. اگر تأیید ایمیل فعال باشد، لینک را از صندوق ورودی چک کنید."
      );
    } catch {
      setError("ثبت‌نام انجام نشد. متغیرهای سوپابیس را در Vercel بررسی کنید.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="w-full min-h-screen">
      <Navbar />
      <section className="pt-28 pb-24 px-5 sm:px-8 md:px-12 lg:px-16 xl:px-24">
        <PageBreadcrumb items={[{ label: "ثبت‌نام" }]} />
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-2">ثبت‌نام</h1>
          <p className="text-muted-foreground text-sm mb-8">
            با ایمیل حساب بسازید.
          </p>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">نام</label>
              <input
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">ایمیل</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-accent"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">رمز عبور</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-accent"
                dir="ltr"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            {message && <p className="text-sm text-accent">{message}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-accent text-accent-foreground font-bold text-sm py-3.5 disabled:opacity-60"
            >
              {loading ? "..." : "ثبت‌نام"}
            </button>
          </form>
          <p className="mt-6 text-sm text-muted-foreground">
            قبلاً ثبت‌نام کرده‌اید؟{" "}
            <Link href="/login" className="text-accent font-bold">
              ورود
            </Link>
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
