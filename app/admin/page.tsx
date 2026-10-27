'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  MessageSquare,
  LayoutDashboard,
  CheckCircle2,
  XCircle,
  Trash2,
  Clock,
  Shield,
  LogOut,
  RefreshCw,
  FileText,
  Search,
  User,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import AdminBlogPanel from '@/components/admin/AdminBlogPanel';
import AdminSeoPanel from '@/components/admin/AdminSeoPanel';

const ADMIN_EMAIL = 'alvandmarketing.com@gmail.com';

type Profile = {
  id: string;
  email?: string;
  full_name: string | null;
  created_at: string;
  role?: string;
};

type Comment = {
  id: string;
  post_slug: string;
  author_name: string;
  author_email: string | null;
  body: string;
  approved: boolean;
  created_at: string;
  user_id: string | null;
};

type Tab = 'overview' | 'users' | 'comments' | 'blog' | 'seo';

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('overview');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const router = useRouter();

  const loadData = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email !== ADMIN_EMAIL) {
      router.push('/login');
      return;
    }

    const { data: profilesData } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    const { data: commentsData } = await supabase
      .from('blog_comments')
      .select('*')
      .order('created_at', { ascending: false });

    const counts: Record<string, number> = {};
    commentsData?.forEach((c) => {
      if (c.user_id) counts[c.user_id] = (counts[c.user_id] || 0) + 1;
    });

    setProfiles(profilesData || []);
    setComments(commentsData || []);
    setCommentCounts(counts);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleComment(id: string, approved: boolean) {
    setActionLoading(id);
    try {
      const res = await fetch('/api/admin/comments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, approved }),
      });
      if (res.ok) {
        setComments((prev) =>
          prev.map((c) => (c.id === id ? { ...c, approved } : c))
        );
      } else {
        alert('خطا در بروزرسانی نظر');
      }
    } catch {
      alert('خطا در ارتباط با سرور');
    }
    setActionLoading(null);
  }

  async function handleDeleteComment(id: string) {
    if (!confirm('این نظر حذف شود؟')) return;
    setActionLoading(id);
    try {
      const res = await fetch('/api/admin/comments', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setComments((prev) => prev.filter((c) => c.id !== id));
      }
    } catch {
      alert('خطا در حذف');
    }
    setActionLoading(null);
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace('/');
  }

  const pendingComments = comments.filter((c) => !c.approved);
  const approvedComments = comments.filter((c) => c.approved);

  if (loading) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="min-h-[50vh] flex items-center justify-center">
          <p className="text-muted-foreground">در حال بارگذاری پنل ادمین...</p>
        </div>
        <Footer />
      </main>
    );
  }

  const tabs: {
    id: Tab;
    label: string;
    icon: typeof LayoutDashboard;
    badge?: number;
  }[] = [
    { id: 'overview', label: 'خلاصه', icon: LayoutDashboard },
    { id: 'users', label: 'کاربران', icon: Users, badge: profiles.length },
    { id: 'comments', label: 'نظرات', icon: MessageSquare, badge: pendingComments.length },
    { id: 'blog', label: 'مدیریت بلاگ', icon: FileText },
    { id: 'seo', label: 'سئو صفحات', icon: Search },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-28 pb-16">
        <Breadcrumb
          items={[
            { label: 'خانه', href: '/' },
            { label: 'پنل ادمین' },
          ]}
        />

        <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heavy flex items-center gap-2">
              <Shield className="h-7 w-7 text-accent" />
              پنل ادمین
            </h1>
            <p className="mt-2 text-muted-foreground text-sm">
              مدیریت کاربران، نظرات و محتوای سایت
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                loadData();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card text-sm hover:border-accent transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              بروزرسانی
            </button>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card text-sm hover:border-accent transition-colors"
            >
              پنل کاربری
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card text-sm text-red-500 hover:border-red-500/40 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              خروج
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2 border-b border-border">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-xl border border-b-0 transition-colors ${
                tab === t.id
                  ? 'bg-card text-foreground border-border -mb-px'
                  : 'bg-transparent text-muted-foreground border-transparent hover:text-foreground'
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
              {typeof t.badge === 'number' && (
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    t.id === 'comments' && t.badge > 0
                      ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'کل کاربران', value: profiles.length, icon: Users, color: 'text-sky-500' },
                  { label: 'کل نظرات', value: comments.length, icon: MessageSquare, color: 'text-violet-500' },
                  { label: 'در انتظار تایید', value: pendingComments.length, icon: Clock, color: 'text-amber-500' },
                  { label: 'تایید شده', value: approvedComments.length, icon: CheckCircle2, color: 'text-emerald-500' },
                ].map((s) => (
                  <div key={s.label} className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
                      <s.icon className={`h-4 w-4 ${s.color}`} />
                      {s.label}
                    </div>
                    <p className="text-3xl font-bold">{s.value}</p>
                  </div>
                ))}
              </div>

              {pendingComments.length > 0 && (
                <div className="rounded-2xl border border-amber-500/30 bg-card p-5">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-500" />
                    نظرات در انتظار تایید
                  </h3>
                  <ul className="space-y-3">
                    {pendingComments.slice(0, 5).map((c) => (
                      <li
                        key={c.id}
                        className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-border p-3 bg-background"
                      >
                        <div className="min-w-0 flex-1 text-right">
                          <p className="text-sm font-medium">
                            {c.author_name}
                            <span className="text-muted-foreground font-normal">
                              {' '}· {c.post_slug}
                            </span>
                          </p>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {c.body}
                          </p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleComment(c.id, true)}
                            disabled={actionLoading === c.id}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium disabled:opacity-50"
                          >
                            تایید
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteComment(c.id)}
                            disabled={actionLoading === c.id}
                            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-medium disabled:opacity-50"
                          >
                            حذف
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  {pendingComments.length > 5 && (
                    <button
                      type="button"
                      onClick={() => setTab('comments')}
                      className="mt-3 text-sm text-accent hover:underline"
                    >
                      مشاهده همه ({pendingComments.length})
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {tab === 'users' && (
            <div className="rounded-2xl border border-border bg-card overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead className="bg-muted/60 border-b border-border">
                  <tr>
                    <th className="p-4 font-medium text-muted-foreground">نقش</th>
                    <th className="p-4 font-medium text-muted-foreground">ایمیل</th>
                    <th className="p-4 font-medium text-muted-foreground">اسم</th>
                    <th className="p-4 font-medium text-muted-foreground">تاریخ ثبت‌نام</th>
                    <th className="p-4 font-medium text-muted-foreground">تعداد نظرات</th>
                  </tr>
                </thead>
                <tbody>
                  {profiles.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground">
                        کاربری ثبت نشده است
                      </td>
                    </tr>
                  ) : (
                    profiles.map((profile) => {
                      const isAdmin =
                        profile.email === ADMIN_EMAIL || profile.role === 'admin';
                      return (
                        <tr
                          key={profile.id}
                          className="border-b border-border last:border-0 hover:bg-muted/30"
                        >
                          <td className="p-4">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                                isAdmin
                                  ? 'bg-red-500/15 text-red-600 dark:text-red-400'
                                  : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                              }`}
                            >
                              {isAdmin ? 'ادمین' : 'کاربر'}
                            </span>
                          </td>
                          <td className="p-4 text-foreground" dir="ltr">
                            {profile.email || '—'}
                          </td>
                          <td className="p-4">{profile.full_name || '—'}</td>
                          <td className="p-4 text-muted-foreground">
                            {new Date(profile.created_at).toLocaleDateString('fa-IR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="p-4 font-semibold">
                            {commentCounts[profile.id] || 0}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'comments' && (
            <div className="space-y-4">
              {comments.length === 0 ? (
                <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
                  نظری ثبت نشده است
                </div>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="rounded-2xl border border-border bg-card p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <div className="text-right min-w-0">
                        <p className="font-semibold text-foreground">{comment.author_name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {comment.author_email || '—'} ·{' '}
                          {new Date(comment.created_at).toLocaleDateString('fa-IR', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          مقاله:{' '}
                          <Link
                            href={`/بلاگ/${comment.post_slug}`}
                            className="text-accent hover:underline"
                          >
                            {comment.post_slug}
                          </Link>
                        </p>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${
                          comment.approved
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                            : 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
                        }`}
                      >
                        {comment.approved ? 'تایید شده' : 'در انتظار'}
                      </span>
                    </div>

                    <p className="text-sm text-foreground leading-relaxed mb-4 whitespace-pre-wrap border-r-2 border-border pr-3">
                      {comment.body}
                    </p>

                    <div className="flex flex-wrap gap-2 justify-end">
                      {!comment.approved ? (
                        <button
                          type="button"
                          onClick={() => handleComment(comment.id, true)}
                          disabled={actionLoading === comment.id}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium disabled:opacity-50"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          تایید
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleComment(comment.id, false)}
                          disabled={actionLoading === comment.id}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium disabled:opacity-50"
                        >
                          <XCircle className="h-4 w-4" />
                          لغو تایید
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDeleteComment(comment.id)}
                        disabled={actionLoading === comment.id}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        حذف
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === 'blog' ? <AdminBlogPanel /> : null}

          {tab === 'seo' ? <AdminSeoPanel /> : null}

        </div>
      </div>

      <Footer />
    </main>
  );
}
