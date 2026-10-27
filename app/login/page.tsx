"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBreadcrumb from "@/components/Breadcrumb";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (err) {
        setError("ایمیل یا رمز عبور نادرست است.");
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError("ورود انجام نشد. متغیرهای سوپابیس را در Vercel بررسی کنید.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="w-full min-h-screen">
      <Navbar />
      <section className="pt-28 pb-24 px-5 sm:px-8 md:px-12 lg:px-16 xl:px-24">
        <PageBreadcrumb items={[{ label: "ورود" }]} />
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-2">ورود</h1>
          <p className="text-muted-foreground text-sm mb-8">
            با ایمیل و رمز عبور وارد شوید.
          </p>
          <form onSubmit={onSubmit} className="space-y-4">
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
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-accent text-accent-foreground font-bold text-sm py-3.5 disabled:opacity-60"
            >
              {loading ? "..." : "ورود"}
            </button>
          </form>
          <p className="mt-6 text-sm text-muted-foreground">
            حساب ندارید؟{" "}
            <Link href="/register" className="text-accent font-bold">
              ثبت‌نام
            </Link>
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
