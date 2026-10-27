"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import Breadcrumb from "@/components/Breadcrumb";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace("/login");
        return;
      }
      setUser(data.user);
      setLoading(false);
    });
  }, [router]);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/");
  }

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-muted">در حال بارگذاری...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="w-full px-4 md:px-8 py-10">
      <Breadcrumb
        items={[
          { label: "خانه", href: "/" },
          { label: "پنل کاربری" },
        ]}
      />

      <h1 className="mt-6 text-3xl font-heavy">پنل کاربری</h1>
      <p className="mt-2 text-muted leading-persian">
        خوش آمدید. از اینجا می‌توانید اطلاعات حساب خود را مدیریت کنید.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2 max-w-3xl">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-bold mb-4">اطلاعات حساب</h2>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-muted">ایمیل</dt>
              <dd className="mt-1 font-medium">{user.email}</dd>
            </div>
            <div>
              <dt className="text-muted">شناسه کاربر</dt>
              <dd className="mt-1 font-mono text-xs break-all">{user.id}</dd>
            </div>
            <div>
              <dt className="text-muted">تاریخ عضویت</dt>
              <dd className="mt-1">
                {user.created_at
                  ? new Date(user.created_at).toLocaleDateString("fa-IR")
                  : "—"}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-bold mb-4">دسترسی سریع</h2>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="/بلاگ" className="text-accent hover:underline">
                مشاهده مقالات
              </Link>
            </li>
            <li>
              <Link href="/تماس" className="text-accent hover:underline">
                تماس با ما
              </Link>
            </li>
            <li>
              <button
                onClick={handleSignOut}
                className="text-red-500 hover:underline"
              >
                خروج از حساب
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
