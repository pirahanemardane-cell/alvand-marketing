#!/usr/bin/env python3
"""Convert service-plp DOCX files into lib/services.ts content."""

from __future__ import annotations

import json
import os
import re
import sys
from pathlib import Path

import mammoth
from bs4 import BeautifulSoup, NavigableString, Tag

DOCX_DIR = Path(
    "/cursor/stores/bc-7622b6eb-ed98-4c41-a575-821dde6494d9/docs/service-plp-docx"
)
OUT_TS = Path("/workspace/lib/services.ts")
OUT_JSON = Path("/tmp/docx-extract/services-parsed.json")

PERSIAN_NUMS = "۰۱۲۳۴۵۶۷۸۹"


def to_persian_num(n: int) -> str:
    s = f"{n:02d}"
    return "".join(PERSIAN_NUMS[int(c)] for c in s)


def clean_text(s: str) -> str:
    if not s:
        return ""
    s = s.replace("\xa0", " ").replace("\u200c", "\u200c")
    s = re.sub(r"[ \t]+", " ", s)
    s = s.replace("\\.", ".")
    s = s.strip()
    # Drop authoring placeholders that shouldn't ship
    s = re.sub(r"\[نیاز به تأیید[^\]]*\]", "", s).strip()
    s = re.sub(r"\s{2,}", " ", s)
    return s


def cell_text(td: Tag) -> str:
    # Prefer plain text; keep link labels
    return clean_text(td.get_text(" ", strip=True))


def parse_table(table: Tag) -> dict | None:
    rows_el = table.find_all("tr")
    if not rows_el:
        return None
    headers: list[str] = []
    rows: list[list[str]] = []
    first = rows_el[0]
    ths = first.find_all("th")
    tds = first.find_all("td")
    if ths and not tds:
        headers = [cell_text(th) for th in ths]
        body = rows_el[1:]
    else:
        # treat first row as header if all strong / th-like
        cells = first.find_all(["th", "td"])
        headers = [cell_text(c) for c in cells]
        body = rows_el[1:]
    for tr in body:
        cells = tr.find_all(["td", "th"])
        if not cells:
            continue
        row = [cell_text(c) for c in cells]
        if any(row):
            # pad/truncate to header width
            if headers:
                if len(row) < len(headers):
                    row = row + [""] * (len(headers) - len(row))
                elif len(row) > len(headers):
                    row = row[: len(headers)]
            rows.append(row)
    if not headers or not rows:
        return None
    return {"headers": headers, "rows": rows}


def extract_spec(soup: BeautifulSoup) -> dict[str, str]:
    tables = soup.find_all("table")
    if not tables:
        return {}
    spec: dict[str, str] = {}
    for tr in tables[0].find_all("tr"):
        cells = tr.find_all(["td", "th"])
        if len(cells) >= 2:
            k = cell_text(cells[0])
            v = cell_text(cells[1])
            spec[k] = v
    return spec


def slug_from_spec(spec: dict[str, str], fallback: str) -> str:
    addr = spec.get("آدرس", "")
    m = re.search(r"/services/([^\s\)\"']+)", addr)
    if m:
        slug = m.group(1).replace("\\", "").rstrip("/")
        return slug
    return fallback


def rewrite_links_in_text(text: str) -> str:
    """Strip absolute site URLs to path-only forms inside prose (already plain text)."""
    text = re.sub(
        r"https?://alvandmarketing\.ir(/[^\s\)\]\"]*)",
        r"\1",
        text,
    )
    return text


def is_scaffold_heading(text: str) -> bool:
    t = clean_text(text)
    if t in ("مشخصات صفحه", "مرحله دوم: محتوا", "مرحله دوم محتوا"):
        return True
    if t.startswith("مرحله اول"):
        return True
    return False


def normalize_heading(text: str) -> str:
    return clean_text(text)


COST_HINT = re.compile(r"هزینه|قیمت|تعرفه|چقدر")


def ensure_consult_cta(answer: str, question: str = "") -> str:
    a = clean_text(answer)
    q = clean_text(question)
    costish = bool(COST_HINT.search(a) or COST_HINT.search(q))
    if costish and "مشاوره" not in a and "فرم تماس" not in a and "جلسه شناخت" not in a:
        a = a.rstrip(".") + ". برای برآورد دقیق، درخواست مشاوره رایگان ثبت کنید یا از فرم تماس پیام بدهید."
    return a


def iter_content_nodes(soup: BeautifulSoup):
    """Yield content nodes after 'مرحله دوم: محتوا' heading, else after page title."""
    body = soup.body if soup.body else soup
    started = False
    for el in body.descendants:
        if not isinstance(el, Tag):
            continue
        if el.name in ("h1", "h2", "h3"):
            t = el.get_text(" ", strip=True)
            if "مرحله دوم" in t and "محتوا" in t:
                started = True
                continue
            if not started and el.name == "h1":
                # wait for مرحله دوم; if never found, start after first content h2
                continue
        if not started:
            continue
        # only top-ish block elements that are direct structural
        if el.name in ("h2", "h3", "p", "ul", "ol", "table"):
            # skip nested duplicates: only yield if parent isn't another yielded container
            parent = el.parent
            if parent and parent.name in ("td", "th", "li"):
                continue
            # avoid nested p inside table etc already handled
            if el.name == "p" and el.find_parent("table"):
                continue
            if el.name in ("ul", "ol") and el.find_parent("table"):
                continue
            yield el


def collect_sections(soup: BeautifulSoup) -> list[dict]:
    """Parse content into ordered sections with heading/level/paras/items/tables."""
    sections: list[dict] = []
    current: dict | None = None

    def ensure(heading: str | None, level: int):
        nonlocal current
        current = {
            "heading": heading,
            "level": level,
            "paragraphs": [],
            "items": [],
            "tables": [],
        }
        sections.append(current)

    # If no مرحله دوم, fall back: start at first h2 that isn't scaffold
    nodes = list(iter_content_nodes(soup))
    if not nodes:
        body = soup.body if soup.body else soup
        started = False
        for el in body.find_all(["h2", "h3", "p", "ul", "ol", "table"]):
            if el.name in ("h2", "h3") and is_scaffold_heading(el.get_text(" ", strip=True)):
                if "مرحله دوم" in el.get_text():
                    started = True
                continue
            if el.name in ("h2", "h3") and el.get_text(" ", strip=True) == "مشخصات صفحه":
                continue
            if el.name == "h2" and not started:
                # skip heading hierarchy table's following — start at content hero-like h2
                started = True
            if not started:
                continue
            if el.find_parent("table"):
                continue
            nodes.append(el)

    for el in nodes:
        if el.name in ("h2", "h3"):
            text = normalize_heading(el.get_text(" ", strip=True))
            if is_scaffold_heading(text):
                continue
            ensure(text, 2 if el.name == "h2" else 3)
            continue
        if current is None:
            ensure(None, 2)
        assert current is not None
        if el.name == "p":
            t = clean_text(el.get_text(" ", strip=True))
            t = rewrite_links_in_text(t)
            if t:
                current["paragraphs"].append(t)
        elif el.name in ("ul", "ol"):
            for li in el.find_all("li", recursive=False):
                t = clean_text(li.get_text(" ", strip=True))
                t = rewrite_links_in_text(t)
                if t:
                    current["items"].append(t)
        elif el.name == "table":
            tbl = parse_table(el)
            if tbl:
                current["tables"].append(tbl)
    return sections


def match_heading(h: str | None, *needles: str) -> bool:
    if not h:
        return False
    return any(n in h for n in needles)


def short_desc_from_intro(intro: list[str], title: str) -> str:
    if not intro:
        return title
    # first sentence-ish, capped
    text = intro[0]
    # trim to ~120 chars at word boundary
    if len(text) <= 140:
        return text
    cut = text[:140]
    if " " in cut:
        cut = cut.rsplit(" ", 1)[0]
    return cut.rstrip("،,;") + "…"


def build_service(docx_path: Path, index: int) -> dict:
    with open(docx_path, "rb") as f:
        html = mammoth.convert_to_html(f).value
    soup = BeautifulSoup(html, "lxml")
    title = clean_text(soup.find("h1").get_text(" ", strip=True)) if soup.find("h1") else docx_path.stem
    spec = extract_spec(soup)
    slug = slug_from_spec(spec, title.replace(" ", "-"))
    seo_title = clean_text(spec.get("عنوان سئو پیشنهادی", f"{title} | الوند مارکتینگ"))
    seo_desc = clean_text(spec.get("توضیحات متا پیشنهادی", ""))

    sections = collect_sections(soup)

    hero_heading = title
    intro: list[str] = []
    for_who_heading = "این خدمت برای چه کسب‌وکارهایی مناسب است"
    for_who: list[str] = []
    deliverables_heading = "آنچه تحویل می‌گیرید"
    deliverables: list[str] = []
    process_heading = "مراحل اجرا"
    process: list[str] = []
    faq: list[dict] = []
    before: list[dict] = []
    after: list[dict] = []

    # First section with h2 is typically hero
    consumed = set()
    if sections and sections[0].get("heading"):
        hero_heading = sections[0]["heading"]
        intro = list(sections[0]["paragraphs"])
        # bold CTA lines stay as paragraphs
        consumed.add(0)

    phase = "before"  # before process vs after
    process_seen = False

    i = 1
    while i < len(sections):
        sec = sections[i]
        h = sec.get("heading") or ""

        if match_heading(h, "سؤالات متداول", "سوالات متداول"):
            # following h3s are Q, paragraphs are A — but mammoth may put Q as h3 sections
            j = i + 1
            while j < len(sections):
                qs = sections[j]
                qh = qs.get("heading") or ""
                if qs["level"] == 2:
                    break
                q = qh
                a_parts = list(qs["paragraphs"])
                if qs["items"]:
                    a_parts.extend(qs["items"])
                a = " ".join(a_parts).strip()
                if q and a:
                    faq.append({"q": q, "a": ensure_consult_cta(a, q)})
                j += 1
            i = j
            continue

        if match_heading(
            h,
            "این خدمت برای چه",
            "برای چه کسب‌وکار",
            "برای چه سایت",
            "مناسب است",
        ) and ("چه" in h or "مناسب" in h):
            if match_heading(h, "این خدمت برای چه", "برای چه"):
                for_who_heading = h
                for_who = list(sec["items"]) or [
                    p for p in sec["paragraphs"] if p
                ]
                consumed.add(i)
                i += 1
                continue

        if (
            not deliverables
            and sec["items"]
            and match_heading(
                h,
                "آنچه در",
                "آنچه تحویل",
                "تحویل می‌گیرید",
                "تحویل میگیرید",
                "استاندارد هر محتوا",
                "پیش‌نیاز",
                "لیست خدمات پشتیبانی",
                "لیست خدمات",
            )
        ):
            deliverables_heading = h
            deliverables = list(sec["items"])
            block = section_to_block(sec, skip_items=True)
            if block and (block.get("paragraphs") or block.get("table")):
                before.append(block)
            i += 1
            continue

        if match_heading(h, "مراحل"):
            process_heading = h
            process = []
            if sec.get("tables"):
                # Prefer step table over trailing note lists
                tbl = sec["tables"][0]
                for row in tbl.get("rows") or []:
                    if not row:
                        continue
                    if len(row) == 1:
                        process.append(row[0])
                    else:
                        lead = row[0]
                        rest = " — ".join(c for c in row[1:] if c)
                        process.append(f"{lead}: {rest}" if rest else lead)
            if not process:
                process = list(sec["items"])
            if not process:
                block = section_to_block(sec)
                if block:
                    before.append(block)
            else:
                for p in sec.get("paragraphs") or []:
                    after.append({"paragraphs": [p], "level": 3})
                if sec.get("items"):
                    after.append(
                        {
                            "heading": "نکته درباره اصلاحات و تأیید",
                            "level": 3,
                            "items": list(sec["items"]),
                        }
                    )
            process_seen = True
            phase = "after"
            i += 1
            continue

        block = section_to_block(sec)
        if block:
            if phase == "before":
                before.append(block)
            else:
                after.append(block)
        i += 1

    # If forWho empty, try find any matching section again loosely
    if not for_who:
        for sec in sections:
            h = sec.get("heading") or ""
            if "مناسب" in h and sec["items"]:
                for_who_heading = h
                for_who = list(sec["items"])
                # remove from before/after if duplicated
                before = [b for b in before if b.get("heading") != h]
                after = [b for b in after if b.get("heading") != h]
                break

    if not deliverables:
        for sec in sections:
            h = sec.get("heading") or ""
            if match_heading(h, "آنچه", "استاندارد", "پیش‌نیاز", "تحویل") and sec["items"]:
                deliverables_heading = h
                deliverables = list(sec["items"])
                before = [b for b in before if b.get("heading") != h]
                after = [b for b in after if b.get("heading") != h]
                break

    if not deliverables:
        # Fall back: first before-block with a solid item list
        for b in list(before):
            items = b.get("items") or []
            if len(items) >= 3 and b.get("heading"):
                deliverables_heading = b["heading"]
                deliverables = list(items)
                before = [x for x in before if x is not b]
                # keep table/paras from that block if any
                leftover = {k: v for k, v in b.items() if k in ("paragraphs", "table", "level", "heading") and k != "items"}
                if leftover.get("table") or leftover.get("paragraphs"):
                    before.insert(0, {**leftover, "heading": leftover.get("heading"), "level": leftover.get("level") or 3})
                break

    if not deliverables:
        # Last resort: synthesize from first comparison/services table rows
        for b in before:
            tbl = b.get("table")
            if not tbl or len(tbl.get("rows") or []) < 2:
                continue
            deliverables_heading = b.get("heading") or "دامنه خدمت"
            deliverables = []
            for row in tbl["rows"]:
                if not row:
                    continue
                if len(row) == 1:
                    deliverables.append(row[0])
                else:
                    deliverables.append(f"{row[0]} — {row[1]}")
            break

    # If still no process, keep empty (UI will hide)
    if not intro and sections:
        intro = list(sections[0].get("paragraphs") or [])

    short = short_desc_from_intro(intro, title)

    return {
        "slug": slug,
        "num": to_persian_num(index),
        "title": title,
        "shortDesc": short,
        "heroHeading": hero_heading,
        "intro": intro,
        "seoTitle": seo_title,
        "seoDescription": seo_desc,
        "forWhoHeading": for_who_heading,
        "forWho": for_who,
        "deliverablesHeading": deliverables_heading,
        "deliverables": deliverables,
        "processHeading": process_heading,
        "process": process,
        "beforeProcess": before,
        "afterProcess": after,
        "faq": faq,
        "source": docx_path.name,
    }


def section_to_block(sec: dict, skip_items: bool = False) -> dict | None:
    h = sec.get("heading")
    paras = list(sec.get("paragraphs") or [])
    items = [] if skip_items else list(sec.get("items") or [])
    tables = list(sec.get("tables") or [])
    if not h and not paras and not items and not tables:
        return None
    block: dict = {}
    if h:
        block["heading"] = h
        block["level"] = sec.get("level") or 2
    if paras:
        block["paragraphs"] = paras
    if items:
        block["items"] = items
    if tables:
        # one table per block (first); extra tables become sibling blocks handled by caller ideally
        block["table"] = tables[0]
    # If multiple tables, only first — extras appended as paragraphs note skipped; improve below
    return block


def build_overview(docx_path: Path, hub_short: dict[str, str]) -> dict:
    with open(docx_path, "rb") as f:
        html = mammoth.convert_to_html(f).value
    soup = BeautifulSoup(html, "lxml")
    title = clean_text(soup.find("h1").get_text(" ", strip=True)) if soup.find("h1") else "خدمات دیجیتال مارکتینگ"
    spec = extract_spec(soup)
    seo_title = clean_text(spec.get("عنوان سئو پیشنهادی", title))
    seo_desc = clean_text(spec.get("توضیحات متا پیشنهادی", ""))
    sections = collect_sections(soup)

    hero_heading = title
    intro: list[str] = []
    criteria_heading = "پیش از انتخاب خدمت، این چهار معیار را مشخص کنید"
    criteria: list[str] = []
    outputs_heading = "خدمات الوند مارکتینگ و خروجی هرکدام"
    comparison_heading = "مقایسه سریع خدمات"
    comparison_table = {"headers": [], "rows": []}
    guide_heading = "راهنمای انتخاب سریع: کدام خدمت برای کدام وضعیت"
    guide_table = {"headers": [], "rows": []}
    budget_heading = "ترتیب پیشنهادی شروع برای بودجه محدود"
    budget_order: list[str] = []
    budget_note = ""
    tips_heading = "نکات تخصصی پیش از عقد قرارداد"
    tips: list[str] = []
    cta_note = "برای انتخاب خدمت مناسب، درخواست مشاوره رایگان ثبت کنید."
    faq: list[dict] = []
    output_groups: list[dict] = []

    if sections:
        hero_heading = sections[0].get("heading") or hero_heading
        intro = list(sections[0].get("paragraphs") or [])

    i = 1
    while i < len(sections):
        sec = sections[i]
        h = sec.get("heading") or ""

        if match_heading(h, "سؤالات متداول", "سوالات متداول"):
            j = i + 1
            while j < len(sections):
                qs = sections[j]
                if qs["level"] == 2:
                    break
                q = qs.get("heading") or ""
                a = " ".join(qs.get("paragraphs") or [])
                if q and a:
                    faq.append({"q": q, "a": ensure_consult_cta(a, q)})
                j += 1
            i = j
            continue

        if match_heading(h, "چهار معیار", "پیش از انتخاب"):
            criteria_heading = h
            criteria = list(sec["items"])
            i += 1
            continue

        if match_heading(h, "خدمات الوند مارکتینگ و خروجی"):
            outputs_heading = h
            i += 1
            # consume following h3 groups until comparison or guide
            while i < len(sections):
                g = sections[i]
                gh = g.get("heading") or ""
                if g["level"] == 2:
                    break
                if match_heading(gh, "مقایسه سریع"):
                    break
                # parse bullets for shortDesc map
                group_intro = " ".join(g.get("paragraphs") or [])
                items_out = []
                for item in g.get("items") or []:
                    # "Title: blurb" or "Title — blurb"
                    m = re.match(r"^(.+?)[:：]\s*(.+)$", item)
                    if m:
                        tname, blurb = clean_text(m.group(1)), clean_text(m.group(2))
                        # strip markdown-ish bold leftovers
                        tname = tname.strip("*_ ")
                        hub_short[tname] = blurb
                        items_out.append({"title": tname, "blurb": blurb})
                    else:
                        items_out.append({"title": "", "blurb": item})
                output_groups.append(
                    {"heading": gh, "intro": group_intro, "items": items_out}
                )
                i += 1
            continue

        if match_heading(h, "مقایسه سریع"):
            comparison_heading = h
            if sec["tables"]:
                comparison_table = sec["tables"][0]
            i += 1
            continue

        if match_heading(h, "راهنمای انتخاب سریع", "کدام خدمت برای کدام"):
            guide_heading = h
            if sec["tables"]:
                guide_table = sec["tables"][0]
            i += 1
            continue

        if match_heading(h, "ترتیب پیشنهادی", "بودجه محدود"):
            budget_heading = h
            budget_order = list(sec["items"]) or list(sec["paragraphs"])
            # note may be in paragraphs after items
            notes = [p for p in sec["paragraphs"] if "ترکیب" in p or "هم‌زمان" in p or " همزمان" in p]
            if notes:
                budget_note = notes[0]
            elif len(sec["paragraphs"]) > len(budget_order):
                budget_note = sec["paragraphs"][-1]
            i += 1
            continue

        if match_heading(h, "نکات تخصصی"):
            tips_heading = h
            tips = list(sec["items"])
            for p in sec["paragraphs"]:
                if "مشاوره" in p or "درخواست" in p:
                    cta_note = p
            i += 1
            continue

        # orphan comparison as h3
        if match_heading(h, "مقایسه سریع") and sec["tables"]:
            comparison_heading = h
            comparison_table = sec["tables"][0]
        i += 1

    # Also harvest short blurbs from any leftover list under outputs if hub_short empty
    return {
        "title": title,
        "heroHeading": hero_heading,
        "intro": intro,
        "criteriaHeading": criteria_heading,
        "criteria": criteria,
        "outputsHeading": outputs_heading,
        "outputGroups": output_groups,
        "comparisonHeading": comparison_heading,
        "comparisonTable": comparison_table,
        "guideHeading": guide_heading,
        "guideTable": guide_table,
        "budgetOrderHeading": budget_heading,
        "budgetOrder": budget_order,
        "budgetNote": budget_note
        or "شروع هم‌زمان همه کانال‌ها بدون مسئول پاسخ‌گویی به لید، اثر هر خدمت را خنثی می‌کند.",
        "tipsHeading": tips_heading,
        "tips": tips,
        "ctaNote": cta_note,
        "faq": faq,
        "seoTitle": seo_title,
        "seoDescription": seo_desc,
    }


def ts_string(s: str) -> str:
    return json.dumps(s, ensure_ascii=False)


def emit_table(table: dict, indent: int) -> str:
    sp = " " * indent
    lines = [f"{sp}{{", f"{sp}  headers: ["]
    for h in table.get("headers") or []:
        lines.append(f"{sp}    {ts_string(h)},")
    lines.append(f"{sp}  ],")
    lines.append(f"{sp}  rows: [")
    for row in table.get("rows") or []:
        cells = ", ".join(ts_string(c) for c in row)
        lines.append(f"{sp}    [{cells}],")
    lines.append(f"{sp}  ],")
    lines.append(f"{sp}}}")
    return "\n".join(lines)


def emit_block(block: dict, indent: int) -> str:
    sp = " " * indent
    lines = [f"{sp}{{"]
    if block.get("heading"):
        lines.append(f"{sp}  heading: {ts_string(block['heading'])},")
    if block.get("level"):
        lines.append(f"{sp}  level: {block['level']},")
    if block.get("paragraphs"):
        lines.append(f"{sp}  paragraphs: [")
        for p in block["paragraphs"]:
            lines.append(f"{sp}    {ts_string(p)},")
        lines.append(f"{sp}  ],")
    if block.get("items"):
        lines.append(f"{sp}  items: [")
        for it in block["items"]:
            lines.append(f"{sp}    {ts_string(it)},")
        lines.append(f"{sp}  ],")
    if block.get("table"):
        lines.append(f"{sp}  table: {emit_table(block['table'], indent + 2).lstrip()},")
    lines.append(f"{sp}}}")
    return "\n".join(lines)


def emit_service(svc: dict) -> str:
    lines = ["  withFullDesc({"]
    for key in (
        "slug",
        "num",
        "title",
        "shortDesc",
        "heroHeading",
    ):
        lines.append(f"    {key}: {ts_string(svc[key])},")
    lines.append("    intro: [")
    for p in svc["intro"]:
        lines.append(f"      {ts_string(p)},")
    lines.append("    ],")
    lines.append(f"    seoTitle: {ts_string(svc['seoTitle'])},")
    lines.append(f"    seoDescription: {ts_string(svc['seoDescription'])},")
    lines.append(f"    forWhoHeading: {ts_string(svc['forWhoHeading'])},")
    lines.append("    forWho: [")
    for p in svc["forWho"]:
        lines.append(f"      {ts_string(p)},")
    lines.append("    ],")
    lines.append(f"    deliverablesHeading: {ts_string(svc['deliverablesHeading'])},")
    lines.append("    deliverables: [")
    for p in svc["deliverables"]:
        lines.append(f"      {ts_string(p)},")
    lines.append("    ],")
    lines.append(f"    processHeading: {ts_string(svc['processHeading'])},")
    lines.append("    process: [")
    for p in svc["process"]:
        lines.append(f"      {ts_string(p)},")
    lines.append("    ],")
    lines.append("    beforeProcess: [")
    for b in svc["beforeProcess"]:
        lines.append(emit_block(b, 6) + ",")
    lines.append("    ],")
    lines.append("    afterProcess: [")
    for b in svc["afterProcess"]:
        lines.append(emit_block(b, 6) + ",")
    lines.append("    ],")
    lines.append("    faq: [")
    for item in svc["faq"]:
        lines.append("      {")
        lines.append(f"        q: {ts_string(item['q'])},")
        lines.append(f"        a: {ts_string(item['a'])},")
        lines.append("      },")
    lines.append("    ],")
    lines.append("  })")
    return "\n".join(lines)


def emit_overview(o: dict) -> str:
    lines = ["export const servicesOverview: ServicesOverview = {"]
    lines.append(f"  title: {ts_string(o['title'])},")
    lines.append(f"  heroHeading: {ts_string(o['heroHeading'])},")
    lines.append("  intro: [")
    for p in o["intro"]:
        lines.append(f"    {ts_string(p)},")
    lines.append("  ],")
    lines.append(f"  criteriaHeading: {ts_string(o['criteriaHeading'])},")
    lines.append("  criteria: [")
    for p in o["criteria"]:
        lines.append(f"    {ts_string(p)},")
    lines.append("  ],")
    lines.append(f"  outputsHeading: {ts_string(o['outputsHeading'])},")
    lines.append(f"  comparisonHeading: {ts_string(o['comparisonHeading'])},")
    lines.append("  comparisonTable: " + emit_table(o["comparisonTable"], 2).lstrip() + ",")
    lines.append(f"  guideHeading: {ts_string(o['guideHeading'])},")
    lines.append("  guideTable: " + emit_table(o["guideTable"], 2).lstrip() + ",")
    lines.append(f"  budgetOrderHeading: {ts_string(o['budgetOrderHeading'])},")
    lines.append("  budgetOrder: [")
    for p in o["budgetOrder"]:
        lines.append(f"    {ts_string(p)},")
    lines.append("  ],")
    lines.append(f"  budgetNote: {ts_string(o['budgetNote'])},")
    lines.append(f"  tipsHeading: {ts_string(o['tipsHeading'])},")
    lines.append("  tips: [")
    for p in o["tips"]:
        lines.append(f"    {ts_string(p)},")
    lines.append("  ],")
    lines.append(f"  ctaNote: {ts_string(o['ctaNote'])},")
    lines.append("  faq: [")
    for item in o["faq"]:
        lines.append("    {")
        lines.append(f"      q: {ts_string(item['q'])},")
        lines.append(f"      a: {ts_string(item['a'])},")
        lines.append("    },")
    lines.append("  ],")
    lines.append(f"  seoTitle: {ts_string(o['seoTitle'])},")
    lines.append(f"  seoDescription: {ts_string(o['seoDescription'])},")
    lines.append("};")
    return "\n".join(lines)


HEADER = '''export type ServiceTable = {
  headers: string[];
  rows: string[][];
};

export type ServiceBlock = {
  heading?: string;
  level?: 2 | 3;
  paragraphs?: string[];
  items?: string[];
  table?: ServiceTable;
};

export type Service = {
  slug: string;
  num: string;
  title: string;
  shortDesc: string;
  heroHeading: string;
  intro: string[];
  seoTitle: string;
  seoDescription: string;
  forWhoHeading: string;
  forWho: string[];
  deliverablesHeading: string;
  deliverables: string[];
  processHeading: string;
  process: string[];
  /** Extra sections in document order (between deliverables and process, or after process). */
  beforeProcess: ServiceBlock[];
  afterProcess: ServiceBlock[];
  faq: { q: string; a: string }[];
  /** @deprecated alias kept for search/filter compatibility */
  fullDesc: string;
};

export type ServicesOverview = {
  title: string;
  heroHeading: string;
  intro: string[];
  criteriaHeading: string;
  criteria: string[];
  outputsHeading: string;
  comparisonHeading: string;
  comparisonTable: ServiceTable;
  guideHeading: string;
  guideTable: ServiceTable;
  budgetOrderHeading: string;
  budgetOrder: string[];
  budgetNote: string;
  tipsHeading: string;
  tips: string[];
  ctaNote: string;
  faq: { q: string; a: string }[];
  seoTitle: string;
  seoDescription: string;
};

'''

FOOTER = '''
function withFullDesc(service: Omit<Service, "fullDesc">): Service {
  return {
    ...service,
    fullDesc: service.intro.join(" "),
  };
}

'''

GETTERS = '''
export function getServiceBySlug(slug: string): Service | undefined {
  const decoded = decodeURIComponent(slug);
  return services.find((s) => s.slug === slug || s.slug === decoded);
}

export function getAllServiceSlugs(): string[] {
  return services.map((s) => s.slug);
}
'''

# Preferred display order (hub children + wordpress)
ORDER = [
    "02-tarahi-site_d9d5.docx",
    "15-tarahi-site-wordpress_1e07.docx",
    "03-seo_225c.docx",
    "04-tolid-mohtava_2207.docx",
    "06-tablighat-interneti_60d5.docx",
    "07-shabake-haye-ejtemaei_0f1d.docx",
    "05-hoosh-masnooi_fb8c.docx",
    "12-email-marketing_78e1.docx",
    "10-abzarhaye-analytics_29f7.docx",
    "08-poshtibani-site_46b7.docx",
    "09-tarahi-sakht-application_853c.docx",
    "11-api-yekparche-sazi_bdb8.docx",
    "13-moshavere-digital-marketing_f8a4.docx",
    "14-branding_c719.docx",
]

# Title → better shortDesc overrides from hub when fuzzy match fails
TITLE_ALIASES = {
    "طراحی و ساخت اپلیکیشن": ["طراحی و ساخت اپلیکیشن", "اپلیکیشن"],
    "API و یکپارچه‌سازی": ["API و یکپارچه‌سازی", "API"],
    "برندینگ و هویت بصری": ["برندینگ و هویت بصری", "برندینگ"],
    "ابزارهای آنالیتیکس": ["ابزارهای آنالیتیکس", "آنالیتیکس"],
}


def apply_hub_shorts(services: list[dict], hub_short: dict[str, str]) -> None:
    for svc in services:
        title = svc["title"]
        if title in hub_short:
            svc["shortDesc"] = hub_short[title]
            continue
        # Soft match: hub key equals title ignoring ZWNJ/spacing only
        norm = lambda s: s.replace("\u200c", "").replace(" ", "")
        nt = norm(title)
        for k, v in hub_short.items():
            if norm(k) == nt:
                svc["shortDesc"] = v
                break


def main() -> int:
    hub_short: dict[str, str] = {}
    overview = build_overview(DOCX_DIR / "01-khadamat-digital-marketing_a058.docx", hub_short)

    services: list[dict] = []
    for i, name in enumerate(ORDER, start=1):
        path = DOCX_DIR / name
        if not path.exists():
            print("MISSING", path, file=sys.stderr)
            continue
        svc = build_service(path, i)
        services.append(svc)
        print(f"OK {name} -> {svc['slug']} faq={len(svc['faq'])} deliv={len(svc['deliverables'])} before={len(svc['beforeProcess'])} process={len(svc['process'])}")

    apply_hub_shorts(services, hub_short)

    # Fix wordpress slug: keep nested form from doc
    for svc in services:
        if svc["title"] == "طراحی سایت وردپرس":
            svc["slug"] = "طراحی-سایت/وردپرس"

    payload = {"overview": overview, "services": services, "hubShort": hub_short}
    OUT_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")

    parts = [HEADER, emit_overview(overview), "", FOOTER, "export const services: Service[] = ["]
    for i, svc in enumerate(services):
        parts.append(emit_service(svc) + ("," if i < len(services) - 1 else ""))
    parts.append("];")
    parts.append(GETTERS)
    OUT_TS.write_text("\n".join(parts) + "\n", encoding="utf-8")
    print("Wrote", OUT_TS, "services=", len(services))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
