"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, LogOut, User, LayoutDashboard } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { User as SbUser } from "@supabase/supabase-js";

const ADMIN_EMAILS = ["alvandmarketing.com@gmail.com"];

export default function AuthButton({
  compact = false,
  onNavigate,
}: {
  compact?: boolean;
  onNavigate?: () => void;
}) {
  const [user, setUser] = useState<SbUser | null>(null);
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setReady(true);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    onNavigate?.();
    router.refresh();
    router.push("/");
  }

  if (!ready) {
    return (
      <span className="inline-flex h-9 w-16 rounded-full border border-border opacity-40" />
    );
  }

  if (user) {
    const isAdmin = ADMIN_EMAILS.includes(user.email ?? "");
    if (compact) {
      return (
        <div className="space-y-1">
          <Link
            href="/dashboard"
            onClick={onNavigate}
            className="flex items-center gap-3 w-full text-lg font-medium py-3 px-3 rounded-xl hover:bg-accent/10 transition-colors"
          >
            <LayoutDashboard className="h-5 w-5 opacity-70" />
            پنل کاربری
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              onClick={onNavigate}
              className="flex items-center gap-3 w-full text-lg font-medium py-3 px-3 rounded-xl hover:bg-accent/10 transition-colors"
            >
              <User className="h-5 w-5 opacity-70" />
              پنل ادمین
            </Link>
          )}
          <button
            type="button"
            onClick={signOut}
            className="flex items-center gap-3 w-full text-lg font-medium py-3 px-3 rounded-xl hover:bg-accent/10 transition-colors text-red-500"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            خروج
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <LayoutDashboard className="h-4 w-4" />
          پنل
        </Link>
        {isAdmin && (
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ادمین
          </Link>
        )}
        <button
          type="button"
          onClick={signOut}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          خروج
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      onClick={onNavigate}
      className={
        compact
          ? "flex items-center gap-3 w-full text-lg font-medium py-3 px-3 rounded-xl hover:bg-accent/10 hover:text-accent transition-colors"
          : "inline-flex items-center gap-1.5 rounded-full bg-accent text-accent-foreground px-3.5 py-1.5 text-sm font-bold hover:opacity-90 transition-opacity"
      }
    >
      {compact ? (
        <User className="h-5 w-5 opacity-70" />
      ) : (
        <LogIn className="h-4 w-4" />
      )}
      ورود
    </Link>
  );
}
