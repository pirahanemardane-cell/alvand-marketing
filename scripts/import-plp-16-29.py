#!/usr/bin/env python3
"""Import PLP 16 (کدنویسی) + PLP 29 (گوگل ادز) into lib/services.ts."""

from __future__ import annotations

import importlib.util
import re
import sys
from pathlib import Path

ROOT = Path("/workspace")
HELPER = ROOT / "scripts" / "import-service-plp-docx.py"
BATCH = Path(
    "/cursor/stores/bc-7622b6eb-ed98-4c41-a575-821dde6494d9/docs/blog-batch/unpacked/PLP-16-29-update_6c50"
)
OUT_TS = ROOT / "lib" / "services.ts"

spec = importlib.util.spec_from_file_location("svc_import", HELPER)
mod = importlib.util.module_from_spec(spec)
assert spec.loader
sys.modules["svc_import"] = mod
spec.loader.exec_module(mod)


def insert_after_parent(ts: str, parent_slug: str, emitted: str) -> str:
    """Insert a withFullDesc({...}) block after the parent service object."""
    # Find parent slug line then the closing `  }),` of that withFullDesc
    marker = f'    slug: "{parent_slug}",'
    idx = ts.find(marker)
    if idx < 0:
        # try with unicode escapes already in file as Persian
        marker = f"    slug: {mod.ts_string(parent_slug)},"
        idx = ts.find(marker)
    if idx < 0:
        raise SystemExit(f"Parent slug not found: {parent_slug}")

    # Walk forward to matching end of withFullDesc — look for `\n  }),\n` after idx
    # Services are `  withFullDesc({ ... })` possibly followed by comma
    start_with = ts.rfind("  withFullDesc({", 0, idx)
    if start_with < 0:
        raise SystemExit("withFullDesc start not found")

    depth = 0
    i = start_with + len("  withFullDesc(")
    # i points at '{'
    while i < len(ts):
        ch = ts[i]
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                # expect `)` then optional `,`
                end = i + 1
                if end < len(ts) and ts[end] == ")":
                    end += 1
                had_comma = end < len(ts) and ts[end] == ","
                if had_comma:
                    end += 1
                # emitted block needs a trailing comma before the next sibling
                block = ("\n" if had_comma else ",\n") + emitted + ","
                return ts[:end] + block + ts[end:]
        i += 1
    raise SystemExit("Could not find end of parent service")


def main() -> None:
    docs = [
        (BATCH / "16-tarahi-site-kodnevisi.docx", 16),
        (BATCH / "29-google-ads.docx", 29),
    ]
    built = []
    for path, num in docs:
        if not path.exists():
            raise SystemExit(f"Missing {path}")
        svc = mod.build_service(path, num)
        # Force expected slugs from approved update pack
        if num == 16:
            svc["slug"] = "طراحی-سایت/کدنویسی"
            svc["title"] = "طراحی سایت کدنویسی"
            svc["num"] = mod.to_persian_num(16)
        else:
            svc["slug"] = "تبلیغات-اینترنتی/گوگل-ادز"
            svc["title"] = "گوگل ادز"
            svc["num"] = mod.to_persian_num(29)
        built.append(svc)
        print(svc["slug"], svc["seoTitle"][:60])

    ts = OUT_TS.read_text(encoding="utf-8")
    for svc in built:
        if f'slug: "{svc["slug"]}"' in ts or f"slug: {mod.ts_string(svc['slug'])}" in ts:
            print(f"Already present: {svc['slug']} — skip insert")
            continue
        parent = svc["slug"].rsplit("/", 1)[0]
        emitted = mod.emit_service(svc)
        ts = insert_after_parent(ts, parent, emitted)
        print(f"Inserted {svc['slug']} after {parent}")

    # Drop WordPress comparison table residue if still present under کدنویسی — content comes from DOCX
    OUT_TS.write_text(ts, encoding="utf-8")
    print("Updated", OUT_TS)


if __name__ == "__main__":
    main()
