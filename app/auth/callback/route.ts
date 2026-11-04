import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { resolveIsAdmin } from "@/lib/admin";

function safeNext(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) {
    return "/dashboard";
  }
  return raw;
}

/**
 * Supabase email-confirm / recovery / magic-link land here with ?code=.
 * Exchange the code for a session cookie, then send the user onward.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeNext(url.searchParams.get("next"));
  const origin = url.origin;

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error || !data.session) {
      return NextResponse.redirect(`${origin}/login?error=auth_exchange`);
    }

    // Prefer explicit next; otherwise route admin to /admin.
    let dest = next;
    if (dest === "/dashboard" || dest === "/") {
      const admin = await resolveIsAdmin(supabase, data.session.user);
      if (admin) dest = "/admin";
    }
    return NextResponse.redirect(`${origin}${dest}`);
  } catch {
    return NextResponse.redirect(`${origin}/login?error=auth_exchange`);
  }
}
