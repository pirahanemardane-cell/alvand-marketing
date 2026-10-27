'use client';

import { useEffect, useState } from 'react';
import SeoAnalysisPanel, { emptySeoValue, type SeoPanelValue } from '@/components/admin/SeoAnalysisPanel';

const PAGE_TABS: { key: string; label: string; slug: string }[] = [
  { key: 'home', label: 'صفحه اصلی', slug: '' },
  { key: 'services', label: 'خدمات', slug: 'خدمات' },
  { key: 'blog', label: 'لیست بلاگ', slug: 'بلاگ' },
  { key: 'contact', label: 'تماس', slug: 'تماس' },
];

export default function AdminSeoPanel() {
  const [tab, setTab] = useState('home');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [title, setTitle] = useState('');
  const [bodyPreview, setBodyPreview] = useState('');
  const [seo, setSeo] = useState<SeoPanelValue>(emptySeoValue());

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
          setSeo(emptySeoValue({
            metaTitle: String(r.meta_title ?? ''),
            metaDescription: String(r.meta_description ?? ''),
            focusKeyphrases: Array.isArray(r.focus_keyphrases) ? r.focus_keyphrases : [],
            ogTitle: String(r.og_title ?? ''),
            ogDescription: String(r.og_description ?? ''),
            ogImageUrl: String(r.og_image_url ?? ''),
            robotsIndex: r.robots_index !== false,
            robotsFollow: r.robots_follow !== false,
            canonicalUrl: String(r.canonical_url ?? ''),
          }));
        } else {
          setTitle(PAGE_TABS.find((t) => t.key === tab)?.label || tab);
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
          page_key: tab, title, body_preview: bodyPreview,
          meta_title: seo.metaTitle, meta_description: seo.metaDescription,
          focus_keyphrases: seo.focusKeyphrases, og_title: seo.ogTitle,
          og_description: seo.ogDescription, og_image_url: seo.ogImageUrl,
          robots_index: seo.robotsIndex, robots_follow: seo.robotsFollow,
          canonical_url: seo.canonicalUrl,
        }),
      });
      setMsg(res.ok ? 'ذخیره شد' : 'خطا در ذخیره');
    } catch {
      setMsg('خطا در ارتباط');
    }
    setBusy(false);
  }

  const slug = PAGE_TABS.find((t) => t.key === tab)?.slug || '';

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4">
      <div className="flex flex-wrap gap-2">
        {PAGE_TABS.map((t) => (
          <button key={t.key} type="button" onClick={() => setTab(t.key)}
            className={tab === t.key ? 'rounded-xl bg-accent px-4 py-2 text-sm font-bold text-accent-foreground' : 'rounded-xl bg-muted px-4 py-2 text-sm'}>
            {t.label}
          </button>
        ))}
      </div>
      {loading ? (
        <p className="py-10 text-center text-muted-foreground">در حال بارگذاری...</p>
      ) : (
        <div className="space-y-4">
          <label className="block space-y-1 text-sm">
            <span>عنوان صفحه (H1)</span>
            <input className="w-full rounded-xl border border-border bg-background px-3 py-2 text-base outline-none focus:border-accent"
              value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label className="block space-y-1 text-sm">
            <span>متن کوتاه برای تحلیل (اختیاری)</span>
            <textarea className="min-h-[80px] w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
              value={bodyPreview} onChange={(e) => setBodyPreview(e.target.value)} />
          </label>
          <SeoAnalysisPanel pageName={title} slug={slug}
            shortDescription={seo.metaDescription || bodyPreview} body={bodyPreview}
            value={seo} onChange={setSeo} siteName="الوند مارکتینگ" siteUrl="https://alvandmarketing.ir" />
          {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
          <button type="button" disabled={busy} onClick={() => void save()}
            className="rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-accent-foreground disabled:opacity-50">
            {busy ? '…' : 'ذخیره'}
          </button>
        </div>
      )}
    </div>
  );
}
