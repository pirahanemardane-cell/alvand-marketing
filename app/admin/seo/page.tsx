'use client';

import { useEffect, useState } from 'react';
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
import { Search } from 'lucide-react';

const ADMIN_EMAIL = 'alvandmarketing.com@gmail.com';

const TABS: { key: string; label: string; slug: string }[] = [
  { key: 'home', label: 'صفحه اصلی', slug: '' },
  { key: 'services', label: 'خدمات', slug: 'خدمات' },
  { key: 'blog', label: 'لیست بلاگ', slug: 'بلاگ' },
  { key: 'contact', label: 'تماس', slug: 'تماس' },
];

export default function AdminSeoPage() {
  const router = useRouter();
  const [tab, setTab] = useState('home');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [title, setTitle] = useState('');
  const [bodyPreview, setBodyPreview] = useState('');
  const [seo, setSeo] = useState<SeoPanelValue>(emptySeoValue());

  useEffect(() => {
    async function init() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.email !== ADMIN_EMAIL) {
        router.replace('/login');
        return;
      }
    }
    void init();
  }, [router]);

  useEffect(() => {
    setLoading(true);
    setMsg('');
    void (async () => {
      try {
        const res = await fetch(`/api/admin/seo?key=${encodeURIComponent(tab)}`);
        const json = await res.json();
        if (res.ok && json.row) {
          const r = json.row;
          setTitle(String(r.title ?? ''));
          setBodyPreview(String(r.body_preview ?? ''));
          setSeo(
            emptySeoValue({
              metaTitle: String(r.meta_title ?? ''),
              metaDescription: String(r.meta_description ?? ''),
              focusKeyphrases: Array.isArray(r.focus_keyphrases)
                ? r.focus_keyphrases
                : [],
              ogTitle: String(r.og_title ?? ''),
              ogDescription: String(r.og_description ?? ''),
              ogImageUrl: String(r.og_image_url ?? ''),
              robotsIndex: r.robots_index !== false,
              robotsFollow: r.robots_follow !== false,
              canonicalUrl: String(r.canonical_url ?? ''),
            })
          );
        } else {
          const label = TABS.find((t) => t.key === tab)?.label || tab;
          setTitle(label);
          setBodyPreview('');
          setSeo(emptySeoValue());
        }
      } catch {
        setMsg('خطا در بارگذاری');
      }
      setLoading(false);
    })();
  }, [tab]);

  async function save() {
    setBusy(true);
    setMsg('');
    try {
      const res = await fetch('/api/admin/seo', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page_key: tab,
          title,
          body_preview: bodyPreview,
          meta_title: seo.metaTitle,
          meta_description: seo.metaDescription,
          focus_keyphrases: seo.focusKeyphrases,
          og_title: seo.ogTitle,
          og_description: seo.ogDescription,
          og_image_url: seo.ogImageUrl,
          robots_index: seo.robotsIndex,
          robots_follow: seo.robotsFollow,
          canonical_url: seo.canonicalUrl,
        }),
      });
      setMsg(res.ok ? 'ذخیره شد' : 'خطا در ذخیره');
    } catch {
      setMsg('خطا در ارتباط');
    }
    setBusy(false);
  }

  const slug = TABS.find((t) => t.key === tab)?.slug || '';

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="mx-auto w-full max-w-3xl px-4 pt-28 pb-16 md:px-8">
        <Breadcrumb
          items={[
            { label: 'خانه', href: '/' },
            { label: 'ادمین', href: '/admin' },
            { label: 'سئو' },
          ]}
        />

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="flex items-center gap-2 text-3xl font-heavy">
            <Search className="h-7 w-7 text-accent" />
            سئو صفحات
          </h1>
          <div className="flex gap-2">
            <Link
              href="/admin/blog"
              className="rounded-xl border border-border bg-card px-4 py-2 text-sm hover:border-accent"
            >
              مدیریت بلاگ
            </Link>
            <Link
              href="/admin"
              className="rounded-xl border border-border bg-card px-4 py-2 text-sm hover:border-accent"
            >
              پنل ادمین
            </Link>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={
                tab === t.key
                  ? 'rounded-xl bg-accent px-4 py-2 text-sm font-bold text-accent-foreground'
                  : 'rounded-xl bg-muted px-4 py-2 text-sm'
              }
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="mt-10 text-center text-muted-foreground">در حال بارگذاری...</p>
        ) : (
          <div className="mt-6 space-y-4">
            <label className="block space-y-1 text-sm">
              <span>عنوان صفحه (H1)</span>
              <input
                className="w-full rounded-xl border border-border bg-background px-3 py-2 outline-none focus:border-accent"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
            <label className="block space-y-1 text-sm">
              <span>متن کوتاه برای تحلیل (اختیاری)</span>
              <textarea
                className="min-h-[80px] w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                value={bodyPreview}
                onChange={(e) => setBodyPreview(e.target.value)}
              />
            </label>

            <SeoAnalysisPanel
              pageName={title}
              slug={slug}
              shortDescription={seo.metaDescription || bodyPreview}
              body={bodyPreview}
              value={seo}
              onChange={setSeo}
              siteName="الوند مارکتینگ"
              siteUrl="https://alvandmarketing.ir"
            />

            {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
            <button
              type="button"
              disabled={busy}
              onClick={() => void save()}
              className="rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-accent-foreground disabled:opacity-50"
            >
              {busy ? '…' : 'ذخیره'}
            </button>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
