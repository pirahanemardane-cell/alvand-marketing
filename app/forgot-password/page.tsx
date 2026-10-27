'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
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
      const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${origin}/reset-password`,
      });
      if (err) {
        setError('ارسال لینک انجام نشد. ایمیل را بررسی کنید.');
        return;
      }
      setMessage(
        'ایمیل ارسال شد. صندوق ورودی و اسپم را چک کنید.'
      );
    } catch {
      setError('خطا در ارسال. دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="pt-28 pb-24 px-5 sm:px-8 md:px-12 lg:px-16">
        <div className="max-w-md mx-auto">
          <Breadcrumb items={[{ label: 'فراموشی رمز عبور' }]} />
          <div className="mt-6 rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h1 className="text-3xl font-heavy mb-2 text-center">فراموشی رمز عبور</h1>
            <p className="text-muted-foreground text-sm mb-8 text-center">
              ایمیل حساب خود را وارد کنید تا لینک بازیابی ارسال شود.
            </p>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">ایمیل</label>
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
              {error && (
                <p className="text-sm text-red-500 bg-red-500/10 rounded-lg px-3 py-2 text-center">{error}</p>
              )}
              {message && (
                <p className="text-sm text-accent bg-accent/10 rounded-lg px-3 py-2 text-center">{message}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-accent text-accent-foreground font-bold text-sm py-3.5 disabled:opacity-60 text-center"
              >
                {loading ? 'در حال ارسال...' : 'ارسال لینک بازیابی'}
              </button>
            </form>
            <p className="mt-6 text-sm text-muted-foreground text-center">
              <Link href="/login" className="text-accent font-bold hover:underline">بازگشت به ورود</Link>
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
