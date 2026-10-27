'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  MessageSquare,
  FileText,
  Phone,
  LogOut,
  Settings,
  Shield,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { User as SbUser } from '@supabase/supabase-js';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';

const ADMIN_EMAILS = ['alvandmarketing.com@gmail.com'];

type Profile = {
  id: string;
  full_name: string | null;
  created_at: string;
};

type Comment = {
  id: string;
  post_slug: string;
  body: string;
  approved: boolean;
  created_at: string;
};

export default function DashboardPage() {
  const [user, setUser] = useState<SbUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [fullName, setFullName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPassword2, setNewPassword2] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        router.replace('/login');
        return;
      }
      setUser(auth.user);

      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', auth.user.id)
        .maybeSingle();
      if (prof) {
        setProfile(prof);
        setFullName(prof.full_name || '');
      }

      const { data: myComments } = await supabase
        .from('blog_comments')
        .select('id, post_slug, body, approved, created_at')
        .eq('user_id', auth.user.id)
        .order('created_at', { ascending: false });
      setComments(myComments || []);
      setLoading(false);
    }
    load();
  }, [router]);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setSaveMsg('');
    const supabase = createClient();
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName.trim() || null })
      .eq('id', user.id);
    setSaving(false);
    if (error) {
      setSaveMsg('خطا در ذخیره. دوباره تلاش کنید.');
    } else {
      setSaveMsg('ذخیره شد.');
      setProfile((p) => (p ? { ...p, full_name: fullName.trim() || null } : p));
    }
  }

  
  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwMsg('');
    if (newPassword.length < 6) {
      setPwMsg('رمز حداقل ۶ کاراکتر باشد.');
      return;
    }
    if (newPassword !== newPassword2) {
      setPwMsg('تکرار رمز یکسان نیست.');
      return;
    }
    setPwLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPwLoading(false);
    if (error) setPwMsg('تغییر رمز ناموفق بود.');
    else {
      setPwMsg('رمز عبور تغییر کرد.');
      setNewPassword('');
      setNewPassword2('');
    }
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace('/');
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="min-h-[50vh] flex items-center justify-center">
          <p className="text-muted-foreground">در حال بارگذاری...</p>
        </div>
        <Footer />
      </main>
    );
  }

  if (!user) return null;

  const isAdmin = ADMIN_EMAILS.includes(user.email ?? '');
  const pendingCount = comments.filter((c) => !c.approved).length;
  const approvedCount = comments.filter((c) => c.approved).length;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="w-full max-w-6xl mx-auto px-4 md:px-8 pt-28 pb-16">
        <Breadcrumb
          items={[
            { label: 'خانه', href: '/' },
            { label: 'پنل کاربری' },
          ]}
        />

        <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heavy">پنل کاربری</h1>
            <p className="mt-2 text-muted-foreground leading-persian">
              خوش آمدید
              {profile?.full_name || fullName
                ? `، ${profile?.full_name || fullName}`
                : ''}
              .
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {isAdmin && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card text-sm font-medium hover:border-accent transition-colors"
              >
                <Shield className="h-4 w-4 text-accent" />
                پنل ادمین
              </Link>
            )}
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card text-sm font-medium text-red-500 hover:border-red-500/40 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              خروج
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'نظرات من', value: comments.length, icon: MessageSquare },
            { label: 'تایید شده', value: approvedCount, icon: CheckCircle2 },
            { label: 'در انتظار', value: pendingCount, icon: Clock },
            {
              label: 'عضویت',
              value: user.created_at
                ? new Date(user.created_at).toLocaleDateString('fa-IR')
                : '—',
              icon: User,
              small: true,
            },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-border bg-card p-4"
            >
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
                <s.icon className="h-4 w-4" />
                {s.label}
              </div>
              <p
                className={`font-bold text-foreground ${
                  s.small ? 'text-sm' : 'text-2xl'
                }`}
              >
                {s.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-5">
              <Settings className="h-5 w-5 text-accent" />
              <h2 className="text-lg font-bold">اطلاعات حساب</h2>
            </div>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-1.5">
                  ایمیل
                </label>
                <input
                  type="email"
                  value={user.email || ''}
                  disabled
                  className="w-full rounded-xl border border-border bg-muted/40 px-3 py-2.5 text-sm text-muted-foreground cursor-not-allowed"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1.5">
                  نام نمایشی
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  maxLength={80}
                  placeholder="نام و نام خانوادگی"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent transition-colors"
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-accent text-accent-foreground text-sm font-bold disabled:opacity-50"
                >
                  {saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                </button>
                {saveMsg && (
                  <span className="text-sm text-muted-foreground">{saveMsg}</span>
                )}
              </div>
            </form>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold mb-5">دسترسی سریع</h2>
            <ul className="space-y-2">
              {[
                { href: '/بلاگ', label: 'مشاهده و کامنت در مقالات', icon: FileText },
                { href: '/تماس', label: 'درخواست مشاوره رایگان', icon: Phone },
                { href: '/خدمات', label: 'مشاهده خدمات', icon: FileText },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 border border-transparent hover:border-border hover:bg-muted/40 transition-colors text-sm"
                  >
                    <item.icon className="h-4 w-4 text-accent shrink-0" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>


          <section className="mt-8 rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold mb-5">تغییر رمز عبور</h2>
            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm text-muted-foreground mb-1.5">رمز جدید</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength={6}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent" dir="ltr" autoComplete="new-password" />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1.5">تکرار رمز جدید</label>
                <input type="password" value={newPassword2} onChange={(e) => setNewPassword2(e.target.value)} minLength={6}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent" dir="ltr" autoComplete="new-password" />
              </div>
              <div className="flex items-center gap-3">
                <button type="submit" disabled={pwLoading} className="px-5 py-2.5 rounded-xl bg-accent text-accent-foreground text-sm font-bold disabled:opacity-50">
                  {pwLoading ? '...' : 'تغییر رمز'}
                </button>
                {pwMsg && <span className="text-sm text-muted-foreground">{pwMsg}</span>}
              </div>
            </form>
          </section>

        <section className="mt-8 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <MessageSquare className="h-5 w-5 text-accent" />
            <h2 className="text-lg font-bold">نظرات من</h2>
          </div>
          {comments.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              هنوز نظری ثبت نکرده‌اید.{' '}
              <Link href="/بلاگ" className="text-accent hover:underline">
                به بلاگ بروید
              </Link>
            </p>
          ) : (
            <ul className="space-y-4">
              {comments.map((c) => (
                <li
                  key={c.id}
                  className="rounded-xl border border-border p-4 bg-background"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <Link
                      href={`/بلاگ/${c.post_slug}`}
                      className="text-sm text-accent hover:underline"
                    >
                      {c.post_slug}
                    </Link>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                        c.approved
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                          : 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
                      }`}
                    >
                      {c.approved ? (
                        <>
                          <CheckCircle2 className="h-3 w-3" /> تایید شده
                        </>
                      ) : (
                        <>
                          <Clock className="h-3 w-3" /> در انتظار تایید
                        </>
                      )}
                    </span>
                  </div>
                  <p className="text-sm text-foreground leading-persian">{c.body}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {new Date(c.created_at).toLocaleDateString('fa-IR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <Footer />
    </main>
  );
}
