import { NextRequest, NextResponse } from "next/server";

/**
 * Legacy Persian pathnames (and their percent-encoded forms) rewrite to
 * ASCII App Router folders. Next.js 15 matches encoded request paths
 * against route definitions inconsistently for non-ASCII segments
 * (see https://github.com/vercel/next.js/issues/10084).
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

export function middleware(request: NextRequest) {
  const decoded = decodePathname(request.nextUrl.pathname);
  const segments = decoded.split("/").filter(Boolean);
  if (segments.length === 0) {
    return NextResponse.next();
  }

  const root = segments[0];
  const asciiRoot = PERSIAN_ROOT[root];
  if (!asciiRoot) {
    return NextResponse.next();
  }

  const rest = segments.slice(1).map((s) => encodeURIComponent(s));
  const url = request.nextUrl.clone();
  url.pathname = "/" + [asciiRoot, ...rest].join("/");
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
