#!/usr/bin/env python3
"""Center PageLoader, use only CircularProgress, keep Supabase realtime."""
from __future__ import annotations

import re
import subprocess
from pathlib import Path

ROOT = Path.cwd()

PAGE_LOADER = r'''"use client";

import {
  CircularProgress,
  CircularProgressIndicator,
  CircularProgressRange,
  CircularProgressTrack,
} from "@/components/ui/circular-progress";

export default function PageLoader({
  label,
  size = 56,
  fullScreen = true,
}: {
  label?: string;
  size?: number;
  fullScreen?: boolean;
}) {
  return (
    <div
      className={
        fullScreen
          ? "fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-background text-foreground"
          : "flex min-h-[40vh] w-full flex-col items-center justify-center gap-4 bg-background text-foreground"
      }
      role="status"
      aria-live="polite"
    >
      <CircularProgress value={null} size={size} thickness={4} label={label ?? "بارگذاری"}>
        <CircularProgressIndicator>
          <CircularProgressTrack />
          <CircularProgressRange />
        </CircularProgressIndicator>
      </CircularProgress>
      {label ? (
        <p className="text-sm text-muted-foreground">{label}</p>
      ) : null}
    </div>
  );
}
'''

APP_LOADING = r'''import PageLoader from "@/components/PageLoader";

export default function Loading() {
  return <PageLoader />;
}
'''

CIRCULAR_PROGRESS = None  # written only if missing


def ensure_circular_progress() -> None:
    path = ROOT / "components" / "ui" / "circular-progress.tsx"
    if path.exists():
        print("OK circular-progress exists")
        return
    # minimal note — user should have run previous script
    print("WARN: components/ui/circular-progress.tsx missing — run apply-loader-and-theme-fix.py first")


def patch_globals() -> None:
    g = ROOT / "app" / "globals.css"
    if not g.exists():
        return
    t = g.read_text(encoding="utf-8")
    t = t.replace(
        "  transition: background-color 0.6s ease, color 0.6s ease;\n",
        "  /* no theme color transition on navigation */\n",
    )
    if "--animate-spin-around" not in t:
        t += """

/* CircularProgress indeterminate */
:root {
  --animate-spin-around: spin-around 0.8s linear infinite;
}
@keyframes spin-around {
  0% { transform: rotate(-90deg); }
  100% { transform: rotate(270deg); }
}
"""
    g.write_text(t, encoding="utf-8")
    print("OK globals.css")


def write_loader_files() -> None:
    (ROOT / "components" / "PageLoader.tsx").write_text(PAGE_LOADER, encoding="utf-8")
    print("OK PageLoader (centered full screen)")
    (ROOT / "app" / "loading.tsx").write_text(APP_LOADING, encoding="utf-8")
    print("OK app/loading.tsx")
    # nested route loadings point to same component
    for sub in ("admin", "dashboard", "login", "register", "forgot-password", "reset-password"):
        d = ROOT / "app" / sub
        if d.is_dir():
            (d / "loading.tsx").write_text(APP_LOADING, encoding="utf-8")
            print(f"OK app/{sub}/loading.tsx")


def inject_pageloader_import(t: str) -> str:
    if "PageLoader" in t and "from \"@/components/PageLoader\"" in t:
        return t
    if "from \"@/components/Navbar\"" in t:
        return t.replace(
            "from \"@/components/Navbar\";",
            "from \"@/components/Navbar\";\nimport PageLoader from \"@/components/PageLoader\";",
            1,
        )
    if "from '@/components/Navbar'" in t:
        return t.replace(
            "from '@/components/Navbar';",
            "from '@/components/Navbar';\nimport PageLoader from '@/components/PageLoader';",
            1,
        )
    # prepend after "use client"
    if t.lstrip().startswith('"use client"'):
        return t.replace(
            '"use client";',
            '"use client";\n\nimport PageLoader from "@/components/PageLoader";',
            1,
        )
    return 'import PageLoader from "@/components/PageLoader";\n' + t


def replace_page_loading_blocks() -> None:
    pattern = re.compile(
        r"if \(loading\) \{\s*return \(\s*<main className=\"min-h-screen bg-background text-foreground\">\s*<Navbar />\s*"
        r"(?:<div className=\"min-h-\[50vh\] flex items-center justify-center\">\s*<p className=\"text-muted-foreground\">[^<]*</p>\s*</div>"
        r"|<PageLoader[^/]*/>)\s*"
        r"<Footer />\s*</main>\s*\);\s*\}",
        re.MULTILINE,
    )
    replacement = """if (loading) {
    return <PageLoader />;
  }"""
    for rel in ("app/admin/page.tsx", "app/dashboard/page.tsx"):
        p = ROOT / rel
        if not p.exists():
            print("SKIP", rel)
            continue
        t = p.read_text(encoding="utf-8")
        t = inject_pageloader_import(t)
        t2, n = pattern.subn(replacement, t, count=1)
        if n == 0:
            # simpler fallback
            t2, n = re.subn(
                r"if \(loading\) \{\s*return \([\s\S]*?\);\s*\}",
                replacement,
                t,
                count=1,
            )
        p.write_text(t2, encoding="utf-8")
        print(f"{'OK' if n else 'WARN'} {rel} loading -> PageLoader only")


def patch_blog_comments() -> None:
    p = ROOT / "components" / "BlogComments.tsx"
    if not p.exists():
        return
    t = p.read_text(encoding="utf-8")
    if "CircularProgress" not in t:
        t = t.replace(
            '"use client";',
            '''"use client";

import {
  CircularProgress,
  CircularProgressIndicator,
  CircularProgressRange,
  CircularProgressTrack,
} from "@/components/ui/circular-progress";''',
            1,
        )
    old = """{loading && (
          <p className="text-sm text-muted-foreground">
            در حال بارگذاری نظرات...
          </p>
        )}"""
    # flexible match
    t2, n = re.subn(
        r"\{loading && \(\s*<p[^>]*>[\s\S]*?</p>\s*\)\}",
        """{loading && (
          <div className="flex justify-center py-8">
            <CircularProgress value={null} size={40} thickness={3}>
              <CircularProgressIndicator>
                <CircularProgressTrack />
                <CircularProgressRange />
              </CircularProgressIndicator>
            </CircularProgress>
          </div>
        )}""",
        t,
        count=1,
    )
    if n == 0:
        t2, n = re.subn(
            r"\{loading && \([\s\S]*?\)\}",
            """{loading && (
          <div className="flex justify-center py-8">
            <CircularProgress value={null} size={40} thickness={3}>
              <CircularProgressIndicator>
                <CircularProgressTrack />
                <CircularProgressRange />
              </CircularProgressIndicator>
            </CircularProgress>
          </div>
        )}""",
            t,
            count=1,
        )
    p.write_text(t2, encoding="utf-8")
    print(f"{'OK' if n else 'WARN'} BlogComments spinner")

    # ensure realtime subscription stays
    if "postgres_changes" in t2 or "subscribe" in t2:
        print("OK BlogComments realtime subscription present")
    else:
        print("WARN: no realtime subscription found in BlogComments")


def patch_reset_password_text() -> None:
    p = ROOT / "app" / "reset-password" / "page.tsx"
    if not p.exists():
        return
    t = p.read_text(encoding="utf-8")
    if "PageLoader" not in t and "در حال بارگذاری" in t:
        t = inject_pageloader_import(t)
        t = re.sub(
            r"<p className=\"text-center text-muted-foreground text-sm\">در حال بارگذاری\.\.\.</p>",
            '<div className="flex justify-center py-12"><PageLoader fullScreen={false} /></div>',
            t,
            count=1,
        )
        p.write_text(t, encoding="utf-8")
        print("OK reset-password loader")


def strip_other_spinners() -> None:
    """Remove animate-spin utility usages if any."""
    for path in ROOT.rglob("*.tsx"):
        if "node_modules" in path.parts:
            continue
        t = path.read_text(encoding="utf-8")
        if "animate-spin" in t and "circular-progress" not in str(path):
            t2 = t.replace("animate-spin", "")
            path.write_text(t2, encoding="utf-8")
            print("stripped animate-spin in", path.relative_to(ROOT))


def main() -> None:
    ensure_circular_progress()
    patch_globals()
    write_loader_files()
    replace_page_loading_blocks()
    patch_blog_comments()
    patch_reset_password_text()
    strip_other_spinners()
    try:
        subprocess.run(
            ["npm", "ls", "@radix-ui/react-slot"],
            cwd=ROOT,
            check=True,
            capture_output=True,
        )
    except subprocess.CalledProcessError:
        subprocess.run(
            ["npm", "install", "@radix-ui/react-slot", "--save"],
            cwd=ROOT,
            check=True,
        )
    print("\nDone.")
    print("  git add -A && git commit -m 'ui: centered CircularProgress only; keep realtime' && git push")


if __name__ == "__main__":
    main()
