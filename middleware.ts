import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Legacy Persian pathnames (and their percent-encoded forms) rewrite to
 * ASCII App Router folders. Next.js 15 matches encoded request paths
 * against route definitions inconsistently for non-ASCII segments
 * (see https://github.com/vercel/next.js/issues/10084).
 *
 * Also refreshes the Supabase auth session when env is configured.
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

export async function middleware(request: NextRequest) {
  const rewritten = applyPersianRewrite(request);
  const isRewrite = rewritten.nextUrl.pathname !== request.nextUrl.pathname;

  let response = isRewrite
    ? NextResponse.rewrite(rewritten.nextUrl)
    : NextResponse.next({ request: { headers: request.headers } });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
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
    await supabase.auth.getUser();
  } catch {
    // ignore auth refresh failures in middleware
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
