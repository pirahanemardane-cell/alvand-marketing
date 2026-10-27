'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import { createClient } from '@/lib/supabase/client';

const ADMIN_EMAIL = 'alvandmarketing.com@gmail.com';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const origin = window.location.origin;
      const { data, error: err } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName.trim() },
          emailRedirectTo: `${origin}/dashboard`,
        },
      });
      if (err) {
        setError(
          err.message.includes('already')
            ? 'این ایمیل قبلاً ثبت شده است.'
            : 'ثبت‌نام انجام نشد.'
        );
        return;
      }
      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          full_name: fullName.trim() || null,
        });
      }
      if (data.session) {
        const userEmail = data.user?.email ?? email;
        if (userEmail === ADMIN_EMAIL) {
          router.replace('/admin');
        } else {
          router.replace('/dashboard');
        }
        router.refresh();
      } else {
        setMessage('ثبت‌نام انجام شد. لینک تایید به ایمیل شما ارسال شد؛ بعد از تایید وارد شوید.');
        setTimeout(() => router.replace('/login'), 1500);
      }
    } catch {
      setError('ثبت‌نام انجام نشد. دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="pt-28 pb-24 px-5 sm:px-8 md:px-12 lg:px-16">
        <div className="max-w-md mx-auto">
          <Breadcrumb items={[{ label: 'ثبت‌نام' }]} />
          <div className="mt-6 rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h1 className="text-3xl font-heavy mb-2 text-center">ثبت‌نام</h1>
            <p className="text-muted-foreground text-sm mb-8 text-center">
              با ایمیل حساب بسازید.
            </p>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  نام
                </label>
                <input
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background text-foreground px-4 py-3 text-sm outline-none focus:border-accent transition-colors"
                  placeholder="نام و نام خانوادگی"
                  autoComplete="name"
                />
              </div>
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
                  autoComplete="new-password"
                />
                <p className="mt-1 text-xs text-muted-foreground text-center">
                  حداقل ۶ کاراکتر
                </p>
              </div>
              {error && (
                <p className="text-sm text-red-500 bg-red-500/10 rounded-lg px-3 py-2 text-center">
                  {error}
                </p>
              )}
              {message && (
                <p className="text-sm text-accent bg-accent/10 rounded-lg px-3 py-2 text-center">
                  {message}
                </p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-accent text-accent-foreground font-bold text-sm py-3.5 disabled:opacity-60 hover:opacity-90 transition-opacity text-center"
              >
                {loading ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
              </button>
            </form>
            <p className="mt-6 text-sm text-muted-foreground text-center">
              قبلاً ثبت‌نام کرده‌اید؟{' '}
              <Link href="/login" className="text-accent font-bold hover:underline">
                ورود
              </Link>
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
