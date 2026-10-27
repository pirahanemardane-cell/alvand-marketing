'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import { createClient } from '@/lib/supabase/client';

const ADMIN_EMAIL = 'alvandmarketing.com@gmail.com';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error: err } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (err) {
        setError('ایمیل یا رمز عبور نادرست است.');
        return;
      }
      const userEmail = data.user?.email ?? email;
      if (userEmail === ADMIN_EMAIL) {
        router.replace('/admin');
      } else {
        router.replace('/dashboard');
      }
      router.refresh();
    } catch {
      setError('ورود انجام نشد. دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="pt-28 pb-24 px-5 sm:px-8 md:px-12 lg:px-16">
        <div className="max-w-md mx-auto">
          <Breadcrumb items={[{ label: 'ورود' }]} />
          <div className="mt-6 rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h1 className="text-3xl font-heavy mb-2 text-center">ورود</h1>
            <p className="text-muted-foreground text-sm mb-8 text-center">
              با ایمیل و رمز عبور وارد شوید.
            </p>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  ایمیل
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background text-foreground px-4 py-3 text-sm outline-none focus:border-accent transition-colors"
                  dir="ltr"
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  رمز عبور
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background text-foreground px-4 py-3 text-sm outline-none focus:border-accent transition-colors"
                  dir="ltr"
                  autoComplete="current-password"
                />
              </div>
              {error && (
                <p className="text-sm text-red-500 bg-red-500/10 rounded-lg px-3 py-2 text-center">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-accent text-accent-foreground font-bold text-sm py-3.5 disabled:opacity-60 hover:opacity-90 transition-opacity text-center"
              >
                {loading ? 'در حال ورود...' : 'ورود'}
              </button>
            </form>
            <p className="mt-4 text-sm text-center">
              <Link href="/forgot-password" className="text-muted-foreground hover:text-accent transition-colors">
                فراموشی رمز عبور؟
              </Link>
            </p>
            <p className="mt-6 text-sm text-muted-foreground text-center">
              حساب ندارید؟{' '}
              <Link href="/register" className="text-accent font-bold hover:underline">
                ثبت‌نام
              </Link>
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
