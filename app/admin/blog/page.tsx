'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import { createClient } from '@/lib/supabase/client';
import { FileText, Plus, RefreshCw } from 'lucide-react';

const ADMIN_EMAIL = 'alvandmarketing.com@gmail.com';

type Post = {
  id: string;
  title: string;
  slug: string;
  status: string;
  published_at: string | null;
  created_at: string;
  excerpt: string | null;
};

export default function AdminBlogPage() {
  const router = useRouter();
  const [items, setItems] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all');
  const [title, setTitle] = useState('');
  const [creating, setCreating] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email !== ADMIN_EMAIL) {
      router.replace('/login');
      return;
    }
    try {
      const res = await fetch('/api/admin/blog');
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'خطا در بارگذاری');
        setItems([]);
      } else {
        setItems(json.items || []);
      }
    } catch {
      setError('خطا در ارتباط با سرور');
    }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    let list = items;
    if (statusFilter !== 'all') list = list.filter((p) => p.status === statusFilter);
    const s = q.trim().toLowerCase();
    if (!s) return list;
    return list.filter(
      (p) => p.title.toLowerCase().includes(s) || p.slug.toLowerCase().includes(s)
    );
  }, [items, q, statusFilter]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), status: 'draft' }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error === 'title_required' ? 'عنوان لازم است' : 'ایجاد ناموفق');
      } else {
        setTitle('');
        if (json.item?.id) router.push(`/admin/blog/${json.item.id}`);
        else await load();
      }
    } catch {
      setError('خطا در ایجاد');
    }
    setCreating(false);
  }

  async function setStatus(id: string, status: 'draft' | 'published' | 'archived') {
    setBusyId(id);
    try {
      const res = await fetch('/api/admin/blog', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setItems((prev) =>
          prev.map((p) =>
            p.id === id
              ? {
                  ...p,
                  status,
                  published_at:
                    status === 'published'
                      ? p.published_at ?? new Date().toISOString()
                      : p.published_at,
                }
              : p
          )
        );
      } else setError('تغییر وضعیت ناموفق');
    } catch {
      setError('خطا');
    }
    setBusyId(null);
  }

  async function hardDelete(id: string, name: string) {
    if (!confirm(`حذف دائمی «${name}»؟`)) return;
    setBusyId(id);
    try {
      const res = await fetch('/api/admin/blog', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) setItems((prev) => prev.filter((p) => p.id !== id));
      else setError('حذف ناموفق');
    } catch {
      setError('خطا');
    }
    setBusyId(null);
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="mx-auto w-full max-w-7xl px-4 pt-28 pb-16 md:px-8">
        <Breadcrumb
          items={[
            { label: 'خانه', href: '/' },
            { label: 'ادمین', href: '/admin' },
            { label: 'بلاگ' },
          ]}
        />

        <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-heavy">
              <FileText className="h-7 w-7 text-accent" />
              مدیریت بلاگ
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              ایجاد، ویرایش، انتشار و SEO مقالات
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/seo"
              className="rounded-xl border border-border bg-card px-4 py-2 text-sm hover:border-accent"
            >
              سئو صفحات
            </Link>
            <Link
              href="/admin"
              className="rounded-xl border border-border bg-card px-4 py-2 text-sm hover:border-accent"
            >
              پنل ادمین
            </Link>
            <button
              type="button"
              onClick={() => void load()}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm hover:border-accent"
            >
              <RefreshCw className="h-4 w-4" />
              بروزرسانی
            </button>
          </div>
        </div>

        <form
          onSubmit={onCreate}
          className="mt-8 flex flex-wrap gap-2 rounded-2xl border border-border bg-card p-4"
        >
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="عنوان پست جدید (پیش‌نویس)"
            className="min-w-[200px] flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
            required
          />
          <button
            type="submit"
            disabled={creating}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-bold text-accent-foreground disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            {creating ? '…' : 'افزودن پیش‌نویس'}
          </button>
        </form>

        <div className="mt-4 flex flex-wrap gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="جستجو عنوان یا اسلاگ…"
            className="w-full max-w-md rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="draft">پیش‌نویس</option>
            <option value="published">منتشرشده</option>
            <option value="archived">بایگانی</option>
          </select>
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-500">{error}</p>
        )}

        {loading ? (
          <p className="mt-10 text-center text-muted-foreground">در حال بارگذاری...</p>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full text-right text-sm">
              <thead className="border-b border-border bg-muted/60">
                <tr>
                  <th className="p-4 font-medium text-muted-foreground">عنوان</th>
                  <th className="p-4 font-medium text-muted-foreground">اسلاگ</th>
                  <th className="p-4 font-medium text-muted-foreground">وضعیت</th>
                  <th className="p-4 font-medium text-muted-foreground">اقدام</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-muted-foreground">
                      پستی نیست. یک پیش‌نویس بسازید.
                    </td>
                  </tr>
                ) : (
                  filtered.map((p) => (
                    <tr
                      key={p.id}
                      className={`border-b border-border last:border-0 hover:bg-muted/30 ${
                        p.status === 'archived'
                          ? 'opacity-70'
                          : p.status === 'draft'
                            ? 'bg-muted/20'
                            : ''
                      }`}
                    >
                      <td className="p-4 font-medium">
                        <Link
                          href={`/admin/blog/${p.id}`}
                          className="hover:text-accent hover:underline"
                        >
                          {p.title}
                        </Link>
                      </td>
                      <td className="p-4 font-mono text-xs text-muted-foreground" dir="ltr">
                        {p.slug}
                      </td>
                      <td className="p-4 text-xs">
                        {p.status === 'published'
                          ? 'منتشر'
                          : p.status === 'archived'
                            ? 'بایگانی'
                            : 'پیش‌نویس'}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          <Link
                            href={`/admin/blog/${p.id}`}
                            className="rounded-lg border border-border px-2 py-1 text-xs hover:border-accent"
                          >
                            ویرایش / SEO
                          </Link>
                          {p.status !== 'published' && (
                            <button
                              type="button"
                              disabled={busyId === p.id}
                              onClick={() => void setStatus(p.id, 'published')}
                              className="rounded-lg border border-border px-2 py-1 text-xs disabled:opacity-50"
                            >
                              انتشار
                            </button>
                          )}
                          {p.status !== 'draft' && (
                            <button
                              type="button"
                              disabled={busyId === p.id}
                              onClick={() => void setStatus(p.id, 'draft')}
                              className="rounded-lg border border-border px-2 py-1 text-xs disabled:opacity-50"
                            >
                              پیش‌نویس
                            </button>
                          )}
                          {p.status !== 'archived' && (
                            <button
                              type="button"
                              disabled={busyId === p.id}
                              onClick={() => void setStatus(p.id, 'archived')}
                              className="rounded-lg border border-border px-2 py-1 text-xs disabled:opacity-50"
                            >
                              بایگانی
                            </button>
                          )}
                          <button
                            type="button"
                            disabled={busyId === p.id}
                            onClick={() => void hardDelete(p.id, p.title)}
                            className="rounded-lg border border-red-500/40 px-2 py-1 text-xs text-red-500 disabled:opacity-50"
                          >
                            حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
