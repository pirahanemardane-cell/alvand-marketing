import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { resolveIsAdmin } from "@/lib/admin";
import { LEGACY_SERVICE_SLUGS } from "@/lib/seo/service-redirects";

/**
 * Legacy Persian pathnames (and their percent-encoded forms) rewrite to
 * ASCII App Router folders. Next.js 15 matches encoded request paths
 * against route definitions inconsistently for non-ASCII segments
 * (see https://github.com/vercel/next.js/issues/10084).
 *
 * Also refreshes the Supabase auth session when env is configured,
 * and gates /dashboard + /admin on the server (not only client).
 */
const PERSIAN_ROOT: Record<string, string> = {
  خدمات: "services",
  بلاگ: "blog",
  تماس: "contact",
  ورود: "login",
  "ثبت-نام": "register",
  "فراموشی-رمز": "forgot-password",
  "تغییر-رمز": "reset-password",
};

function decodePathname(pathname: string): string {
  try {
    return decodeURIComponent(pathname);
  } catch {
    return pathname;
  }
}

/** 301 old service slugs → canonical (avoids catch-all soft-nav 404). */
function legacyServiceRedirect(request: NextRequest): NextResponse | null {
  const decoded = decodePathname(request.nextUrl.pathname);
  const segments = decoded.split("/").filter(Boolean);
  if (segments.length < 2) return null;

  let root = segments[0];
  const rest = segments.slice(1);
  if (PERSIAN_ROOT[root]) root = PERSIAN_ROOT[root];
  if (root !== "services" || rest.length !== 1) return null;

  const canonical = LEGACY_SERVICE_SLUGS[rest[0]];
  if (!canonical) return null;

  const dest = request.nextUrl.clone();
  dest.pathname = `/services/${encodeURIComponent(canonical)}`;
  return NextResponse.redirect(dest, 301);
}

function applyPersianRewrite(request: NextRequest): NextRequest {
  const decoded = decodePathname(request.nextUrl.pathname);
  const segments = decoded.split("/").filter(Boolean);
  if (segments.length === 0) return request;

  const root = segments[0];
  const asciiRoot = PERSIAN_ROOT[root];
  if (!asciiRoot) return request;

  const rest = segments.slice(1).map((s) => encodeURIComponent(s));
  const url = request.nextUrl.clone();
  url.pathname = "/" + [asciiRoot, ...rest].join("/");
  return new NextRequest(url, request);
}

function panelGate(pathname: string): "dashboard" | "admin" | null {
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return "admin";
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    return "dashboard";
  }
  return null;
}

export async function middleware(request: NextRequest) {
  const legacy = legacyServiceRedirect(request);
  if (legacy) return legacy;

  const rewritten = applyPersianRewrite(request);
  const isRewrite = rewritten.nextUrl.pathname !== request.nextUrl.pathname;
  const path = rewritten.nextUrl.pathname;
  const gate = panelGate(path);

  // Never drop Supabase ?code= on gated (or any) routes — exchange via callback.
  if (path !== "/auth/callback" && rewritten.nextUrl.searchParams.get("code")) {
    const cb = rewritten.nextUrl.clone();
    cb.pathname = "/auth/callback";
    if (!cb.searchParams.get("next")) {
      const intended =
        path === "/login" || path === "/" ? "/dashboard" : path;
      cb.searchParams.set("next", intended);
    }
    return NextResponse.redirect(cb);
  }

  let response = isRewrite
    ? NextResponse.rewrite(rewritten.nextUrl)
    : NextResponse.next({ request: { headers: request.headers } });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    // Without Supabase env, panels cannot authenticate — send to login.
    if (gate) {
      const login = request.nextUrl.clone();
      login.pathname = "/login";
      login.searchParams.set("next", path);
      return NextResponse.redirect(login);
    }
    return response;
  }

  try {
    const supabase = createServerClient(url, anon, {
      cookies: {
        getAll() {
          return rewritten.cookies.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options?: Record<string, unknown>;
          }[]
        ) {
          cookiesToSet.forEach(({ name, value }) =>
            rewritten.cookies.set(name, value)
          );
          response = isRewrite
            ? NextResponse.rewrite(rewritten.nextUrl)
            : NextResponse.next({ request: { headers: request.headers } });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (gate) {
      if (!user) {
        const login = rewritten.nextUrl.clone();
        login.pathname = "/login";
        login.searchParams.set("next", path);
        const redirect = NextResponse.redirect(login);
        response.cookies.getAll().forEach((c) => {
          redirect.cookies.set(c.name, c.value);
        });
        return redirect;
      }
      if (gate === "admin") {
        const adminOk = await resolveIsAdmin(supabase, user);
        if (!adminOk) {
          const dash = rewritten.nextUrl.clone();
          dash.pathname = "/dashboard";
          const redirect = NextResponse.redirect(dash);
          response.cookies.getAll().forEach((c) => {
            redirect.cookies.set(c.name, c.value);
          });
          return redirect;
        }
      }
    }
  } catch {
    // ignore auth refresh failures in middleware; still block panels
    if (gate) {
      const login = rewritten.nextUrl.clone();
      login.pathname = "/login";
      login.searchParams.set("next", path);
      return NextResponse.redirect(login);
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
