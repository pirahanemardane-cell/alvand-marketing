'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import { createClient } from '@/lib/supabase/client';
import SeoAnalysisPanel, {
  emptySeoValue,
  type SeoPanelValue,
} from '@/components/admin/SeoAnalysisPanel';
import { toSlug } from '@/lib/slug';

const ADMIN_EMAIL = 'alvandmarketing.com@gmail.com';

export default function AdminBlogEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [body, setBody] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>('draft');
  const [seo, setSeo] = useState<SeoPanelValue>(emptySeoValue());

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.email !== ADMIN_EMAIL) {
        router.replace('/login');
        return;
      }
      try {
        const res = await fetch(`/api/admin/blog?id=${encodeURIComponent(id)}`);
        const json = await res.json();
        if (!res.ok || !json.item) {
          setMsg('پست پیدا نشد');
          setLoading(false);
          return;
        }
        const p = json.item;
        setTitle(p.title || '');
        setSlug(p.slug || '');
        setExcerpt(p.excerpt || '');
        setBody(p.body || '');
        setCoverUrl(p.cover_url || '');
        setStatus(p.status || 'draft');
        setSeo(
          emptySeoValue({
            metaTitle: p.meta_title || '',
            metaDescription: p.meta_description || '',
            focusKeyphrases: p.focus_keyphrase
              ? [p.focus_keyphrase]
              : [],
            ogTitle: p.og_title || '',
            ogDescription: p.og_description || '',
            ogImageUrl: p.og_image_url || '',
            robotsIndex: p.robots_index !== false,
            robotsFollow: p.robots_follow !== false,
            canonicalUrl: p.canonical_url || '',
          })
        );
      } catch {
        setMsg('خطا در بارگذاری');
      }
      setLoading(false);
    }
    void load();
  }, [id, router]);

  async function save() {
    setSaving(true);
    setMsg('');
    try {
      const res = await fetch('/api/admin/blog', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          title,
          slug: slug || toSlug(title),
          excerpt,
          body,
          cover_url: coverUrl || null,
          status,
          meta_title: seo.metaTitle,
          meta_description: seo.metaDescription,
          focus_keyphrase: seo.focusKeyphrases[0] || null,
          og_title: seo.ogTitle,
          og_description: seo.ogDescription,
          og_image_url: seo.ogImageUrl,
          robots_index: seo.robotsIndex,
          robots_follow: seo.robotsFollow,
          canonical_url: seo.canonicalUrl || null,
        }),
      });
      setMsg(res.ok ? 'ذخیره شد' : 'خطا در ذخیره');
    } catch {
      setMsg('خطا در ارتباط');
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-muted-foreground">در حال بارگذاری...</p>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="mx-auto w-full max-w-3xl px-4 pt-28 pb-16 md:px-8">
        <Breadcrumb
          items={[
            { label: 'خانه', href: '/' },
            { label: 'ادمین', href: '/admin' },
            { label: 'بلاگ', href: '/admin/blog' },
            { label: 'ویرایش' },
          ]}
        />

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-heavy">ویرایش پست</h1>
          <Link
            href="/admin/blog"
            className="rounded-xl border border-border px-4 py-2 text-sm hover:border-accent"
          >
            بازگشت به لیست
          </Link>
        </div>

        <div className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-5">
          <label className="block space-y-1 text-sm">
            <span>عنوان</span>
            <input
              className="w-full rounded-xl border border-border bg-background px-3 py-2 outline-none focus:border-accent"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <label className="block space-y-1 text-sm">
            <span>اسلاگ</span>
            <input
              className="w-full rounded-xl border border-border bg-background px-3 py-2 font-mono text-sm outline-none focus:border-accent"
              dir="ltr"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </label>
          <label className="block space-y-1 text-sm">
            <span>خلاصه</span>
            <textarea
              className="min-h-[60px] w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
            />
          </label>
          <label className="block space-y-1 text-sm">
            <span>متن کامل</span>
            <textarea
              className="min-h-[200px] w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </label>
          <label className="block space-y-1 text-sm">
            <span>آدرس تصویر کاور</span>
            <input
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
              dir="ltr"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
            />
          </label>
          <label className="block space-y-1 text-sm">
            <span>وضعیت</span>
            <select
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as typeof status)
              }
            >
              <option value="draft">پیش‌نویس</option>
              <option value="published">منتشر</option>
              <option value="archived">بایگانی</option>
            </select>
          </label>
        </div>

        <SeoAnalysisPanel
          pageName={title}
          slug={`بلاگ/${slug}`}
          shortDescription={excerpt}
          body={body}
          imageUrl={coverUrl}
          value={seo}
          onChange={setSeo}
          siteName="الوند مارکتینگ"
          siteUrl="https://alvandmarketing.ir"
        />

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={saving}
            onClick={() => void save()}
            className="rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-accent-foreground disabled:opacity-50"
          >
            {saving ? '…' : 'ذخیره پست + SEO'}
          </button>
          {msg && <span className="text-sm text-muted-foreground">{msg}</span>}
        </div>
      </div>
      <Footer />
    </main>
  );
}
