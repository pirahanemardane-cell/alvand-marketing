'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface Profile {
  id: string;
  email?: string;
  full_name: string | null;
  created_at: string;
  role?: string;
}

interface Comment {
  id: string;
  post_slug: string;
  author_name: string;
  author_email: string | null;
  body: string;
  approved: boolean;
  created_at: string;
  user_id: string | null;
}

type Tab = 'users' | 'comments';

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('users');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const router = useRouter();

  async function loadData() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email !== 'alvandmarketing.com@gmail.com') {
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
  }

  useEffect(() => {
    loadData();
  }, [router]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-100 p-8 flex items-center justify-center">
        <p className="text-zinc-800 text-lg">در حال بارگذاری پنل ادمین...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-right">پنل ادمین</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-zinc-300 pb-2">
          <button
            onClick={() => setTab('users')}
            className={`px-5 py-2.5 rounded-t-lg text-sm font-medium transition ${
              tab === 'users'
                ? 'bg-white text-zinc-900 shadow border border-b-0 border-zinc-300'
                : 'bg-zinc-200 text-zinc-600 hover:bg-zinc-300'
            }`}
          >
            کاربران ({profiles.length})
          </button>
          <button
            onClick={() => setTab('comments')}
            className={`px-5 py-2.5 rounded-t-lg text-sm font-medium transition ${
              tab === 'comments'
                ? 'bg-white text-zinc-900 shadow border border-b-0 border-zinc-300'
                : 'bg-zinc-200 text-zinc-600 hover:bg-zinc-300'
            }`}
          >
            نظرات ({comments.filter((c) => !c.approved).length} در انتظار)
          </button>
        </div>

        {/* Users Tab */}
        {tab === 'users' && (
          <div className="bg-white rounded-xl shadow border border-zinc-200 overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-zinc-800 text-white">
                <tr>
                  <th className="p-4 font-medium">نقش</th>
                  <th className="p-4 font-medium">ایمیل</th>
                  <th className="p-4 font-medium">اسم</th>
                  <th className="p-4 font-medium">تاریخ ثبت‌نام</th>
                  <th className="p-4 font-medium">تعداد نظرات</th>
                </tr>
              </thead>
              <tbody>
                {profiles.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-zinc-500">
                      کاربری ثبت نشده است
                    </td>
                  </tr>
                ) : (
                  profiles.map((profile) => {
                    const isAdmin =
                      profile.email === 'alvandmarketing.com@gmail.com' ||
                      profile.role === 'admin';
                    return (
                      <tr key={profile.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                        <td className="p-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              isAdmin
                                ? 'bg-red-100 text-red-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {isAdmin ? 'ادمین' : 'کاربر'}
                          </span>
                        </td>
                        <td className="p-4 text-zinc-800">{profile.email || '-'}</td>
                        <td className="p-4 text-zinc-800">{profile.full_name || '-'}</td>
                        <td className="p-4 text-zinc-600">
                          {new Date(profile.created_at).toLocaleDateString('fa-IR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="p-4 font-semibold text-zinc-900">
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

        {/* Comments Tab */}
        {tab === 'comments' && (
          <div className="space-y-4">
            {comments.length === 0 ? (
              <div className="bg-white rounded-xl shadow border border-zinc-200 p-8 text-center text-zinc-500">
                نظری ثبت نشده است
              </div>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-white rounded-xl shadow border border-zinc-200 p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div className="text-right">
                      <p className="font-semibold text-zinc-900">{comment.author_name}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {comment.author_email || '-'} ·{' '}
                        {new Date(comment.created_at).toLocaleDateString('fa-IR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      <p className="text-xs text-zinc-400 mt-1">
                        مقاله: {comment.post_slug}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        comment.approved
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {comment.approved ? 'تایید شده' : 'در انتظار'}
                    </span>
                  </div>

                  <p className="text-zinc-800 text-sm leading-relaxed mb-4 whitespace-pre-wrap border-r-2 border-zinc-200 pr-3">
                    {comment.body}
                  </p>

                  <div className="flex gap-2 justify-end">
                    {!comment.approved && (
                      <button
                        onClick={() => handleComment(comment.id, true)}
                        disabled={actionLoading === comment.id}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg disabled:opacity-50"
                      >
                        تایید
                      </button>
                    )}
                    {comment.approved && (
                      <button
                        onClick={() => handleComment(comment.id, false)}
                        disabled={actionLoading === comment.id}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg disabled:opacity-50"
                      >
                        لغو تایید
                      </button>
                    )}
                    <button
                      onClick={async () => {
                        if (!confirm('این نظر حذف شود؟')) return;
                        setActionLoading(comment.id);
                        const res = await fetch('/api/admin/comments', {
                          method: 'DELETE',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ id: comment.id }),
                        });
                        if (res.ok) {
                          setComments((prev) => prev.filter((c) => c.id !== comment.id));
                        }
                        setActionLoading(null);
                      }}
                      disabled={actionLoading === comment.id}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg disabled:opacity-50"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
