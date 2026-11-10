#!/usr/bin/env python3
"""Extract blog DOCX corpus + emit seed JSON (markdown bodies, Persian slugs)."""

from __future__ import annotations

import json
import re
from pathlib import Path

import mammoth
from bs4 import BeautifulSoup, NavigableString, Tag

BATCH = Path(
    "/cursor/stores/bc-7622b6eb-ed98-4c41-a575-821dde6494d9/docs/blog-batch/unpacked"
)
OUT = Path("/tmp/blog-extract/blogs.json")
MANIFEST = Path("/tmp/blog-extract/blog-manifest.json")

# file stem → (pack folder, order index from blog-plan)
DOC_MAP: list[tuple[str, str, int]] = [
    ("BLOG-seo_beb2", "01-seo-chist.docx", 1),
    ("BLOG-seo_beb2", "02-seo-technical-chist.docx", 2),
    ("BLOG-seo_beb2", "03-seo-dakheli-chist.docx", 3),
    ("BLOG-seo_beb2", "04-seo-khareji-chist.docx", 4),
    ("BLOG-seo_beb2", "05-seo-mahalli-chist.docx", 5),
    ("BLOG-seo_beb2", "06-tafavot-seo-dakheli-khareji.docx", 6),
    ("BLOG-seo_beb2", "07-seo-technical-va-mohtavayi.docx", 7),
    ("BLOG-seo_beb2", "08-seo-cheghadr-tool-mikeshad.docx", 8),
    ("BLOG-seo_beb2", "09-chegone-seo-kar-shavim.docx", 9),
    ("BLOG-seo_beb2", "10-shoghl-seo-chist.docx", 10),
    ("BLOG-web-design_c3e1", "11-khadamat-tarahi-site-chist.docx", 11),
    ("BLOG-web-design_c3e1", "12-tafavot-wordpress-kodnevisi.docx", 12),
    ("BLOG-web-design_c3e1", "13-hazine-tarahi-site-chghadr.docx", 13),
    ("BLOG-web-design_c3e1", "14-tarahi-site-chghadr-tool-mikeshad.docx", 14),
    ("BLOG-app-api_457b", "15-web-application-chist.docx", 15),
    ("BLOG-app-api_457b", "16-tafavot-application-web-app.docx", 16),
    ("BLOG-app-api_457b", "17-entekhab-sherkat-tarahi-application.docx", 17),
    ("BLOG-app-api_457b", "18-narm-afzar-sakht-application.docx", 18),
    ("BLOG-app-api_457b", "19-api-chist.docx", 19),
    ("BLOG-app-api_457b", "20-rest-api-chist.docx", 20),
    ("BLOG-app-api_457b", "21-karbord-api-chist.docx", 21),
    ("BLOG-ads_0f07", "22-tablighat-interneti-chist.docx", 22),
    ("BLOG-ads_0f07", "23-tablighat-keliki-chist.docx", 23),
    ("BLOG-ads_0f07", "24-tablighat-banari-chist.docx", 24),
    ("BLOG-ads_0f07", "25-site-haye-tablighat-banari.docx", 25),
    ("BLOG-ads_0f07", "26-google-ads-chist.docx", 26),
    ("BLOG-ads_0f07", "27-entekhab-sherkat-google-ads.docx", 27),
    ("BLOG-ads_0f07", "28-tafavot-seo-google-ads.docx", 28),
    ("BLOG-ads_0f07", "29-reportage-chist.docx", 29),
    ("BLOG-ads_0f07", "30-push-notification-chist.docx", 30),
    ("BLOG-content-social-ai_e0dd", "31-tolid-mohtava-chist.docx", 31),
    ("BLOG-content-social-ai_e0dd", "32-hoosh-masnooi-tolid-matn.docx", 32),
    ("BLOG-content-social-ai_e0dd", "33-chatbot-chist.docx", 33),
    ("BLOG-content-social-ai_e0dd", "34-automation-bazaryabi-chist.docx", 34),
    ("BLOG-content-social-ai_e0dd", "35-shabake-ejtemaei-chist.docx", 35),
    ("BLOG-content-social-ai_e0dd", "36-shabake-ejtemaei-baraye-tablighat.docx", 36),
    ("BLOG-digital-marketing_ea0e", "37-digital-marketing-chist.docx", 37),
    ("BLOG-digital-marketing_ea0e", "38-sherkat-digital-marketing-chist.docx", 38),
    ("BLOG-digital-marketing_ea0e", "39-moshavere-digital-marketing-chist.docx", 39),
    ("BLOG-digital-marketing_ea0e", "40-branding-chist.docx", 40),
    ("BLOG-digital-marketing_ea0e", "41-email-marketing-chist.docx", 41),
    ("BLOG-site-support_f309", "42-poshtibani-fanni-site-chist.docx", 42),
    ("BLOG-site-support_f309", "43-entekhab-poshtibani-site.docx", 43),
    ("BLOG-site-support_f309", "44-amniat-site-chist.docx", 44),
    ("BLOG-site-support_f309", "45-monitoring-site-chist.docx", 45),
    ("BLOG-site-support_f309", "46-afzoneh-afzayesh-sorat-wordpress.docx", 46),
    ("BLOG-analytics_e884", "47-google-analytics-chist.docx", 47),
    ("BLOG-analytics_e884", "48-google-tag-manager-chist.docx", 48),
    ("BLOG-analytics_e884", "49-google-tag-chist.docx", 49),
    ("BLOG-analytics_e884", "50-google-search-console-chist.docx", 50),
]

CATEGORY_SLUGS = {
    "سئو": "سئو",
    "طراحی سایت": "طراحی-سایت",
    "اپلیکیشن، وب‌اپ و API": "اپلیکیشن-و-api",
    "اپلیکیشن، وب اپ و API": "اپلیکیشن-و-api",
    "تبلیغات اینترنتی": "تبلیغات-اینترنتی",
    "محتوا، شبکه‌های اجتماعی و هوش مصنوعی": "محتوا-و-شبکه-های-اجتماعی",
    "محتوا، شبکه های اجتماعی و هوش مصنوعی": "محتوا-و-شبکه-های-اجتماعی",
    "دیجیتال مارکتینگ و برندینگ": "دیجیتال-مارکتینگ",
    "پشتیبانی، امنیت و سرعت سایت": "پشتیبانی-سایت",
    "آنالیتیکس و ابزارهای گوگل": "آنالیتیکس",
}

# Known destinations after this batch (services + blogs). Others unwrap to text.
KNOWN_SERVICE_PREFIXES = {
    "طراحی-سایت",
    "طراحی-سایت/وردپرس",
    "طراحی-سایت/وردپرس/مهاجرت",
    "طراحی-سایت/پزشکی",
    "طراحی-سایت/لندینگ-پیج",
    "طراحی-سایت/رستوران",
    "طراحی-سایت/املاک",
    "طراحی-سایت/آموزشی",
    "طراحی-سایت/صنعتی",
    "طراحی-سایت/دندانپزشکی",
    "طراحی-سایت/کلینیک-زیبایی",
    "طراحی-سایت/خدماتی",
    "طراحی-سایت/گردشگری",
    "طراحی-سایت/چندزبانه",
    "طراحی-سایت/نوبت-دهی",
    "طراحی-سایت/خبری",
    "طراحی-سایت/حقوقی",
    "طراحی-سایت/کدنویسی",
    "سئو",
    "سئو/فروشگاهی",
    "سئو/پزشکی",
    "سئو/بین-المللی",
    "تولید-محتوا",
    "تولید-محتوا/ویدیویی",
    "تبلیغات-اینترنتی",
    "تبلیغات-اینترنتی/بنری",
    "تبلیغات-اینترنتی/رپورتاژ-آگهی",
    "تبلیغات-اینترنتی/پوش-نوتیفیکیشن",
    "تبلیغات-اینترنتی/شبکه‌های-اجتماعی",
    "تبلیغات-اینترنتی/گوگل-ادز",
    "شبکه‌های-اجتماعی",
    "اینستاگرام",
    "لینکدین",
    "هوش-مصنوعی",
    "ایمیل-مارکتینگ",
    "آنالیتیکس",
    "آنالیتیکس/گوگل-آنالیتیکس",
    "آنالیتیکس/تگ-منیجر",
    "آنالیتیکس/سرچ-کنسول",
    "پشتیبانی-سایت",
    "پشتیبانی-سایت/افزایش-سرعت",
    "پشتیبانی-سایت/امنیت",
    "پشتیبانی-سایت/امنیت/پاکسازی-هک",
    "پشتیبانی-سایت/مانیتورینگ",
    "پشتیبانی-سایت/نصب-قالب-و-افزونه",
    "پشتیبانی-سایت/رفع-ارور",
    "پشتیبانی-سایت/فروشگاهی",
    "اپلیکیشن-و-وب-اپ",
    "اپلیکیشن-و-وب-اپ/وب-اپلیکیشن",
    "اپلیکیشن-و-وب-اپ/فروشگاهی",
    "ای‌پی‌آی-و-یکپارچه‌سازی",
    "مشاوره-دیجیتال-مارکتینگ",
    "برندینگ",
}

API_LEGACY = "api-و-یکپارچه‌سازی"
API_CANON = "ای‌پی‌آی-و-یکپارچه‌سازی"


def clean_text(s: str) -> str:
    if not s:
        return ""
    s = s.replace("\xa0", " ")
    s = re.sub(r"[ \t]+", " ", s)
    s = re.sub(r"\[نیاز به تأیید[^\]]*\]", "", s)
    s = re.sub(r"\s{2,}", " ", s).strip()
    return s


def rewrite_href(href: str | None) -> str | None:
    if not href:
        return None
    href = href.strip()
    href = re.sub(r"^https?://alvandmarketing\.ir", "", href)
    if href.startswith("/services/"):
        rest = href[len("/services/") :].rstrip("/")
        rest = rest.replace(API_LEGACY, API_CANON)
        return f"/services/{rest}"
    if href.startswith("/blog/"):
        return href.rstrip("/")
    if href.startswith("/contact"):
        return "/contact"
    return None


def path_is_known(path: str) -> bool:
    if path == "/contact" or path == "/services" or path == "/blog":
        return True
    if path.startswith("/services/"):
        slug = path[len("/services/") :]
        return slug in KNOWN_SERVICE_PREFIXES
    if path.startswith("/blog/"):
        # all blogs in this corpus are known once imported
        return True
    return False


def inline_md(el: Tag) -> str:
    parts: list[str] = []
    for child in el.children:
        if isinstance(child, NavigableString):
            parts.append(str(child))
            continue
        if not isinstance(child, Tag):
            continue
        if child.name == "a":
            text = clean_text(child.get_text(" ", strip=True))
            href = rewrite_href(child.get("href"))
            # Prefer title text; if anchor is bare URL, derive title from last segment
            if text.startswith("http") or text.startswith("/"):
                if href and href.startswith("/blog/"):
                    text = href.split("/")[-1].replace("-", " ")
                elif href and href.startswith("/services/"):
                    text = href.split("/")[-1].replace("-", " ")
            if href and path_is_known(href) and text:
                parts.append(f"[{text}]({href})")
            elif text:
                parts.append(text)
            continue
        if child.name in ("strong", "b"):
            t = clean_text(child.get_text(" ", strip=True))
            if t:
                parts.append(f"**{t}**")
            continue
        if child.name in ("em", "i"):
            t = clean_text(child.get_text(" ", strip=True))
            if t:
                parts.append(f"*{t}*")
            continue
        if child.name == "br":
            parts.append("\n")
            continue
        parts.append(inline_md(child) if child.name else clean_text(child.get_text(" ", strip=True)))
    return clean_text("".join(parts))


def cell_text(td: Tag) -> str:
    return clean_text(td.get_text(" ", strip=True))


def extract_spec(soup: BeautifulSoup) -> dict[str, str]:
    tables = soup.find_all("table")
    if not tables:
        return {}
    spec: dict[str, str] = {}
    for tr in tables[0].find_all("tr"):
        cells = tr.find_all(["td", "th"])
        if len(cells) >= 2:
            spec[cell_text(cells[0])] = cell_text(cells[1])
    return spec


def slug_from_spec(spec: dict[str, str]) -> str:
    addr = spec.get("آدرس پیشنهادی") or spec.get("آدرس") or ""
    addr = addr.replace("پیشنهادی:", "").replace("موجود:", "").strip()
    m = re.search(r"/blog/([^\s\)\"']+)", addr)
    if m:
        return m.group(1).rstrip("/")
    return ""


def is_scaffold_heading(text: str) -> bool:
    t = clean_text(text)
    if t in ("مشخصات مقاله", "مشخصات صفحه", "مرحله دوم: محتوا", "مرحله دوم محتوا"):
        return True
    if t.startswith("مرحله اول"):
        return True
    if t.startswith("لینک"):
        return True
    return False


def iter_content_nodes(soup: BeautifulSoup):
    body = soup.body if soup.body else soup
    started = False
    for el in body.find_all(["h1", "h2", "h3", "p", "ul", "ol", "table"]):
        if el.name in ("h1", "h2", "h3"):
            t = el.get_text(" ", strip=True)
            if "مرحله دوم" in t and "محتوا" in t:
                started = True
                continue
            if is_scaffold_heading(t):
                continue
            if el.name == "h1":
                continue
        if not started:
            continue
        if el.find_parent("table"):
            continue
        if el.name in ("ul", "ol") and el.find_parent(["li"]):
            continue
        yield el


def table_to_md(table: Tag) -> str:
    rows_el = table.find_all("tr")
    if not rows_el:
        return ""
    rows: list[list[str]] = []
    for tr in rows_el:
        cells = [cell_text(c) for c in tr.find_all(["td", "th"])]
        if any(cells):
            rows.append(cells)
    if len(rows) < 2:
        return ""
    width = max(len(r) for r in rows)
    norm = [r + [""] * (width - len(r)) for r in rows]
    header = norm[0]
    lines = [
        "| " + " | ".join(header) + " |",
        "| " + " | ".join("---" for _ in header) + " |",
    ]
    for r in norm[1:]:
        lines.append("| " + " | ".join(r) + " |")
    return "\n".join(lines)


COST_HINT = re.compile(r"هزینه|قیمت|تعرفه|چقدر")


def ensure_consult_cta(text: str) -> str:
    a = clean_text(text)
    if COST_HINT.search(a) and "مشاوره" not in a and "فرم تماس" not in a:
        a = (
            a.rstrip(".")
            + ". برای برآورد دقیق، درخواست مشاوره رایگان ثبت کنید یا از [فرم تماس](/contact) پیام بدهید."
        )
    return a


def build_body_md(soup: BeautifulSoup) -> tuple[list[str], str]:
    """Return (h2_titles_in_order, markdown body)."""
    lines: list[str] = []
    h2s: list[str] = []
    in_faq = False
    for el in iter_content_nodes(soup):
        if el.name in ("h2", "h3"):
            text = clean_text(el.get_text(" ", strip=True))
            if not text or is_scaffold_heading(text):
                continue
            level = 2 if el.name == "h2" else 3
            if level == 2:
                h2s.append(text)
                in_faq = "سؤال" in text or "سوال" in text
            prefix = "##" if level == 2 else "###"
            lines.append("")
            lines.append(f"{prefix} {text}")
            lines.append("")
            continue
        if el.name == "p":
            t = inline_md(el)
            if not t:
                continue
            if in_faq:
                t = ensure_consult_cta(t)
            lines.append(t)
            lines.append("")
            continue
        if el.name in ("ul", "ol"):
            for i, li in enumerate(el.find_all("li", recursive=False), 1):
                t = inline_md(li)
                if not t:
                    continue
                bullet = f"{i}." if el.name == "ol" else "-"
                lines.append(f"{bullet} {t}")
            lines.append("")
            continue
        if el.name == "table":
            # skip meta tables accidentally included
            md = table_to_md(el)
            if md and "مورد" not in md.split("\n", 1)[0]:
                lines.append(md)
                lines.append("")
    body = "\n".join(lines).strip() + "\n"
    return h2s, body


def excerpt_from_body(body: str, fallback: str) -> str:
    for line in body.splitlines():
        t = line.strip()
        if not t or t.startswith("#") or t.startswith("|") or t.startswith("-"):
            continue
        if t.startswith("**") and t.endswith("**"):
            continue
        t = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", t)
        t = t.replace("**", "")
        if len(t) > 180:
            cut = t[:180]
            if " " in cut:
                cut = cut.rsplit(" ", 1)[0]
            return cut + "…"
        return t
    return fallback[:160]


def parse_doc(path: Path, order: int) -> dict:
    with open(path, "rb") as f:
        html = mammoth.convert_to_html(f).value
    soup = BeautifulSoup(html, "lxml")
    spec = extract_spec(soup)
    h1 = soup.find("h1")
    title = clean_text(spec.get("عنوان مقاله (H1)") or (h1.get_text(" ", strip=True) if h1 else path.stem))
    slug = slug_from_spec(spec)
    if not slug:
        raise SystemExit(f"No slug for {path}")
    category = clean_text(spec.get("دسته", "بلاگ"))
    category_slug = CATEGORY_SLUGS.get(category)
    if not category_slug:
        # fuzzy
        for k, v in CATEGORY_SLUGS.items():
            if k in category or category in k:
                category_slug = v
                break
        if not category_slug:
            category_slug = category.replace(" ", "-")
    seo_title = clean_text(spec.get("عنوان سئو پیشنهادی") or f"{title} | بلاگ الوند مارکتینگ")
    seo_desc = clean_text(spec.get("توضیحات متا پیشنهادی") or "")
    focus = clean_text(spec.get("کلمه کلیدی اصلی") or "")
    h2s, body = build_body_md(soup)
    excerpt = excerpt_from_body(body, title)
    if not seo_desc:
        seo_desc = excerpt
    return {
        "order": order,
        "source": f"{path.parent.name}/{path.name}",
        "title": title,
        "slug": slug,
        "category": category,
        "category_slug": category_slug,
        "seo_title": seo_title,
        "seo_description": seo_desc,
        "focus_keyphrase": focus,
        "excerpt": excerpt,
        "body": body,
        "h2_headings": h2s,
        "canonical_url": f"/blog/{slug}",
    }


def main() -> None:
    OUT.parent.mkdir(parents=True, exist_ok=True)
    posts: list[dict] = []
    for pack, fname, order in DOC_MAP:
        path = BATCH / pack / fname
        if not path.exists():
            raise SystemExit(f"Missing {path}")
        post = parse_doc(path, order)
        posts.append(post)
        print(f"{order:02d} {post['slug']} ({len(post['body'])} chars)")

    # populate known blog paths already used during parse — re-parse not needed;
    # links to other blogs were accepted via path_is_known(/blog/) == True

    cats = []
    seen = set()
    for p in posts:
        key = p["category_slug"]
        if key in seen:
            continue
        seen.add(key)
        cats.append(
            {
                "name": p["category"],
                "slug": p["category_slug"],
                "sort_order": len(cats) + 1,
            }
        )

    payload = {"categories": cats, "posts": posts}
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    MANIFEST.write_text(
        json.dumps(
            [
                {
                    "order": p["order"],
                    "source": p["source"],
                    "slug": p["slug"],
                    "route": f"/blog/{p['slug']}",
                    "category": p["category"],
                    "title": p["title"],
                    "seo_title": p["seo_title"],
                }
                for p in posts
            ],
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )
    print(f"Wrote {len(posts)} posts → {OUT}")


if __name__ == "__main__":
    main()
