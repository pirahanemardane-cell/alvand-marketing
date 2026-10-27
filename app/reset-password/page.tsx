'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import { createClient } from '@/lib/supabase/client';

const ADMIN_EMAIL = 'alvandmarketing.com@gmail.com';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [sessionOk, setSessionOk] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setSessionOk(true);
      setReady(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) setSessionOk(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (password.length < 6) {
      setError('رمز عبور حداقل ۶ کاراکتر باشد.');
      return;
    }
    if (password !== password2) {
      setError('تکرار رمز با رمز جدید یکسان نیست.');
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error: err } = await supabase.auth.updateUser({ password });
      if (err) {
        setError('تغییر رمز انجام نشد. لینک منقضی شده؛ دوباره درخواست دهید.');
        return;
      }
      setMessage('رمز عبور با موفقیت تغییر کرد.');
      const email = data.user?.email ?? '';
      setTimeout(() => {
        router.replace(email === ADMIN_EMAIL ? '/admin' : '/dashboard');
      }, 1200);
    } catch {
      setError('خطا رخ داد. دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="pt-28 pb-24 px-5 sm:px-8 md:px-12 lg:px-16">
        <div className="max-w-md mx-auto">
          <Breadcrumb items={[{ label: 'تغییر رمز عبور' }]} />
          <div className="mt-6 rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h1 className="text-3xl font-heavy mb-2 text-center">تغییر رمز عبور</h1>
            <p className="text-muted-foreground text-sm mb-8 text-center">رمز جدید خود را وارد کنید.</p>
            {!ready ? (
              <p className="text-center text-muted-foreground text-sm">در حال بارگذاری...</p>
            ) : !sessionOk ? (
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">لینک معتبر نیست یا منقضی شده است.</p>
                <Link href="/forgot-password" className="inline-block text-accent font-bold hover:underline text-sm">
                  فراموشی رمز عبور
                </Link>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">رمز جدید</label>
                  <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background text-foreground px-4 py-3 text-sm outline-none focus:border-accent" dir="ltr" autoComplete="new-password" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">تکرار رمز جدید</label>
                  <input type="password" required minLength={6} value={password2} onChange={(e) => setPassword2(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background text-foreground px-4 py-3 text-sm outline-none focus:border-accent" dir="ltr" autoComplete="new-password" />
                </div>
                {error && <p className="text-sm text-red-500 bg-red-500/10 rounded-lg px-3 py-2 text-center">{error}</p>}
                {message && <p className="text-sm text-accent bg-accent/10 rounded-lg px-3 py-2 text-center">{message}</p>}
                <button type="submit" disabled={loading} className="w-full rounded-full bg-accent text-accent-foreground font-bold text-sm py-3.5 disabled:opacity-60 text-center">
                  {loading ? 'در حال ذخیره...' : 'ذخیره رمز جدید'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
