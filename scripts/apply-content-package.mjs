#!/usr/bin/env node
/**
 * Map Grok content package (pages.json) onto this repo's model:
 * - services: lib/content/package-services.json (+ overview)
 * - redirects: lib/content/package-redirects.json
 * - blog upsert payload: /tmp/content-package-blog-seed.json
 * - mermaid fences → /diagrams/*.svg image markdown
 *
 * Does NOT drop/create Supabase pages tables; services stay code/JSON-driven,
 * blog stays in existing blog_posts.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PKG = path.join(
  ROOT,
  "content-package/supabase-package/supabase-package"
);
const PAGES_JSON = path.join(PKG, "data/pages.json");
const MAPPING_JSON = path.join(PKG, "assets/diagrams/mapping.json");
const SEED_SQL = path.join(PKG, "seed.sql");
const OUT_DIR = path.join(ROOT, "lib/content");

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
function toPersianNum(n) {
  return String(n)
    .split("")
    .map((c) => (/[0-9]/.test(c) ? PERSIAN_DIGITS[Number(c)] : c))
    .join("");
}

function stripFaqHeading(md) {
  // content_md should already exclude FAQ, but drop trailing FAQ H2 if present
  return (md || "").replace(
    /\n##\s*سؤالات متداول[\s\S]*$/u,
    ""
  );
}

function firstParagraphs(md, limit = 3) {
  const lines = stripFaqHeading(md).replace(/\r\n/g, "\n").split("\n");
  const paras = [];
  let i = 0;
  // skip first H2
  while (i < lines.length && !lines[i].startsWith("## ")) i++;
  if (i < lines.length && lines[i].startsWith("## ")) i++;
  let buf = [];
  const flush = () => {
    const t = buf.join(" ").trim();
    if (t) paras.push(t);
    buf = [];
  };
  for (; i < lines.length && paras.length < limit; i++) {
    const t = lines[i].trim();
    if (!t) {
      flush();
      continue;
    }
    if (t.startsWith("#") || t.startsWith("|") || /^[-*] /.test(t) || /^\d+\. /.test(t) || t.startsWith("```")) {
      flush();
      if (paras.length >= limit) break;
      if (t.startsWith("##")) break;
      continue;
    }
    buf.push(t.replace(/\*\*/g, ""));
  }
  flush();
  return paras;
}

function firstH2(md) {
  const m = (md || "").match(/^##\s+(.+)$/m);
  return m ? m[1].trim() : "";
}

function shortFrom(text, max = 140) {
  const t = (text || "").replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return t.slice(0, max - 1).trimEnd() + "…";
}

function replaceMermaid(md, fullPath, mappingByPath) {
  const blocks = mappingByPath.get(fullPath) || [];
  let idx = 0;
  return (md || "").replace(/```mermaid\n[\s\S]*?```/g, () => {
    const block = blocks[idx++];
    if (!block) {
      return ""; // drop unmatched fence rather than leave raw mermaid
    }
    const file = path
      .basename(block.png || block.svg || "diagram.png")
      .replace(/\.png$/i, ".webp")
      .replace(/\.svg$/i, ".webp");
    const alt = block.alt_fa || "نمودار";
    return `\n![${alt}](/diagrams/${file})\n`;
  });
}

function parseRedirectsFromSeed(sql) {
  const rows = [];
  const re =
    /insert into public\.redirects \(source_path,destination_path,status_code,reason\) values \(\$alv\$(.*?)\$alv\$,\$alv\$(.*?)\$alv\$,(\d+),\$alv\$(.*?)\$alv\$\)/g;
  let m;
  while ((m = re.exec(sql))) {
    rows.push({
      source: m[1],
      destination: m[2],
      statusCode: Number(m[3]),
      reason: m[4],
    });
  }
  return rows;
}

function serviceFromPage(page, index, mappingByPath) {
  const slug = page.full_path.replace(/^\/services\/?/, "");
  if (!slug || page.full_path === "/services") return null;
  const contentMd = replaceMermaid(
    stripFaqHeading(page.content_md),
    page.full_path,
    mappingByPath
  );
  const intros = firstParagraphs(page.content_md, 3);
  const hero = firstH2(page.content_md) || page.title;
  const faqs = (page.faqs || [])
    .slice()
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .map((f) => ({
      q: f.question,
      a: (f.answer_md || "").replace(/\n+/g, " ").trim(),
    }));
  return {
    slug,
    num: toPersianNum(String(index).padStart(2, "0")),
    title: page.title,
    shortDesc: shortFrom(page.excerpt || intros[0] || page.meta_description || ""),
    heroHeading: hero,
    intro: intros.length ? intros : [page.meta_description || page.title],
    seoTitle: page.seo_title,
    seoDescription: page.meta_description,
    forWhoHeading: "این خدمت برای چه کسانی مناسب است",
    forWho: [],
    deliverablesHeading: "خروجی‌ها",
    deliverables: [],
    processHeading: "مراحل همکاری",
    process: [],
    beforeProcess: [],
    afterProcess: [],
    faq: faqs,
    contentMd,
    canonicalUrl: page.canonical_url,
  };
}

function overviewFromHub(hub, mappingByPath) {
  const contentMd = replaceMermaid(
    stripFaqHeading(hub.content_md),
    hub.full_path,
    mappingByPath
  );
  const intros = firstParagraphs(hub.content_md, 3);
  const faqs = (hub.faqs || [])
    .slice()
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .map((f) => ({
      q: f.question,
      a: (f.answer_md || "").replace(/\n+/g, " ").trim(),
    }));
  return {
    title: hub.title,
    heroHeading: firstH2(hub.content_md) || hub.title,
    intro: intros.length ? intros : [hub.meta_description || hub.title],
    criteriaHeading: "پیش از انتخاب خدمت",
    criteria: [],
    outputsHeading: "خدمات الوند مارکتینگ",
    comparisonHeading: "مقایسه خدمات",
    comparisonTable: { headers: ["خدمت", "توضیح"], rows: [] },
    guideHeading: "راهنمای انتخاب",
    guideTable: { headers: ["وضعیت", "پیشنهاد"], rows: [] },
    budgetOrderHeading: "ترتیب منطقی سرمایه‌گذاری",
    budgetOrder: [],
    budgetNote: "",
    tipsHeading: "نکات مهم",
    tips: [],
    ctaNote:
      "جلسه اول مشاوره رایگان است. وضعیت فعلی را بگویید تا مسیر منطقی پیشنهاد شود.",
    faq: faqs,
    seoTitle: hub.seo_title,
    seoDescription: hub.meta_description,
    contentMd,
    canonicalUrl: hub.canonical_url,
  };
}

/**
 * Twelve in-article panels. Inserted under the heading that matches the
 * article's actual step — captions carry the explanation, not dense type
 * inside the image. Filenames are unique site-wide.
 */
const BLOG_PANELS = {
  "/blog/طراحی-سایت/تفاوت-طراحی-سایت-وردپرس-با-کدنویسی": [
    {
      heading: "مقایسه وردپرس و کدنویسی اختصاصی",
      file: "blog-12-tafavot-wordpress-kodnevisi-panel-1.webp",
      alt: "اسکرین‌شات واقعی ویرایشگر بلوک وردپرس روی سایت آزمایشی با عنوان نمونه",
      caption:
        "ویرایشگر بلوک (گوتنبرگ) در وردپرس آزمایشی: عنوان صفحه «example» و بوم دیداری. این همان ویرایش بصری است و محتوای مشتری واقعی در تصویر نیست.",
    },
    {
      heading: "نکات تخصصی برای این انتخاب",
      file: "blog-12-tafavot-wordpress-kodnevisi-panel-2.webp",
      alt: "اسکرین‌شات واقعی ویرایشگر پرونده پوسته وردپرس روی همان سایت آزمایشی",
      caption:
        "ویرایشگر پرونده پوسته در همان سایت آزمایشی: تغییر در سطح فایل کد، در برابر ویرایش بصری بلوک. فایل بازشده نمونه است و رمز یا کلید واقعی ندارد.",
    },
  ],
  "/blog/پشتیبانی-سایت/افزونه-افزایش-سرعت-سایت-وردپرس": [
    {
      heading: "اول تشخیص: سایت شما چرا کند است",
      file: "blog-46-afzoneh-afzayesh-sorat-wordpress-panel-2.webp",
      alt: "اسکرین‌شات واقعی صفحه سلامت سایت وردپرس روی سایت آزمایشی",
      caption:
        "ابزار سلامت سایت در وردپرس آزمایشی، پیش از انتخاب افزونه. اول وضعیت عملکرد و خطا دیده می‌شود تا افزونه سرعت بی‌دلیل نصب نشود.",
    },
    {
      heading: "دسته‌های افزونه افزایش سرعت",
      file: "blog-46-afzoneh-afzayesh-sorat-wordpress-panel-1.webp",
      alt: "اسکرین‌شات واقعی صفحه افزودن افزونه وردپرس با جعبه جست‌وجو",
      caption:
        "صفحه افزودن افزونه در وردپرس آزمایشی: جعبه جست‌وجو و فهرست نتایج عمومی. تصویر یک افزونه را به‌عنوان بهترین معرفی نمی‌کند.",
    },
  ],
  "/blog/آنالیتیکس/گوگل-آنالیتیکس-چیست": [
    {
      heading: "گزارش‌هایی که صاحب کسب‌وکار باید ببیند",
      file: "blog-47-google-analytics-chist-panel-1.webp",
      alt: "نمونه بازسازی‌شده گزارش جذب ترافیک GA4 با داده فرضی",
      caption:
        "نمونه بازسازی‌شده گزارش Traffic acquisition در GA4 برای example-shop.ir. اعداد فرضی‌اند. این همان گزارش اول فهرست است: هر کانال چند کاربر و چند رویداد کلیدی آورده است.",
    },
    {
      heading: "تنظیمات اولیه ضروری",
      file: "blog-47-google-analytics-chist-panel-2.webp",
      alt: "نمونه بازسازی‌شده فهرست رویدادها و جریان داده وب در GA4",
      caption:
        "نمونه بازسازی‌شده Admin و رویدادهای GA4 با شناسه فرضی. اینجا رویدادهای کلیدی (فرم، تماس، خرید) علامت می‌خورند؛ بدون آن‌ها گزارش فقط شمارنده بازدید است.",
    },
  ],
  "/blog/آنالیتیکس/گوگل-تگ-منیجر-چیست": [
    {
      heading: "سه مفهوم اصلی: تگ، تریگر، متغیر",
      file: "blog-48-google-tag-manager-chist-panel-1.webp",
      alt: "نمونه بازسازی‌شده فهرست تگ‌های گوگل تگ منیجر با داده فرضی",
      caption:
        "نمونه بازسازی‌شده فهرست Tags در یک ظرف آزمایشی. تگ‌ها نمونه‌اند (رویداد GA4) و به حساب مشتری وصل نیستند.",
    },
    {
      heading: "مراحل راه‌اندازی",
      file: "blog-48-google-tag-manager-chist-panel-2.webp",
      alt: "نمونه بازسازی‌شده پیش‌نمایش Tag Assistant و یک تگ اجراشده",
      caption:
        "نمونه بازسازی‌شده آزمون پیش‌نمایش روی example-shop.ir. این تصویر همان مورد «تست در حالت پیش‌نمایش» در فهرست راه‌اندازی است، نه گام جداگانه‌ای بیرون از فهرست.",
    },
  ],
  "/blog/آنالیتیکس/گوگل-تگ-چیست": [
    {
      heading: "گوگل تگ چیست و کجای سایت قرار می‌گیرد",
      file: "blog-49-google-tag-chist-panel-1.webp",
      alt: "نمونه بازسازی‌شده قطعه نصب گوگل تگ gtag با شناسه فرضی",
      caption:
        "نمونه بازسازی‌شده دستور نصب گوگل تگ (gtag.js) در جریان وب GA4. شناسه G-SAMPLE فرضی است و نباید در سایت واقعی کپی شود.",
    },
    {
      heading: "تفاوت گوگل تگ و گوگل تگ منیجر",
      file: "blog-49-google-tag-chist-panel-2.webp",
      alt: "نمونه بازسازی‌شده دو قطعه نصب گوگل تگ منیجر در head و body",
      caption:
        "نمونه بازسازی‌شده نصب تگ منیجر: یک قطعه در head و یک قطعه noscript بلافاصله پس از body. شناسه ظرف فرضی است و با قطعه تکی gtag فرق دارد.",
    },
  ],
  "/blog/آنالیتیکس/گوگل-سرچ-کنسول-چیست": [
    {
      heading: "گزارش‌های کلیدی سرچ کنسول",
      file: "blog-50-google-search-console-chist-panel-1.webp",
      alt: "نمونه بازسازی‌شده گزارش عملکرد سرچ کنسول با داده فرضی",
      caption:
        "نمونه بازسازی‌شده گزارش Performance برای example-shop.ir. کلیک، نمایش و جایگاه فرضی‌اند. این همان ردیف Performance در جدول گزارش‌های کلیدی است.",
    },
    {
      heading: "اتصال سایت به سرچ کنسول",
      file: "blog-50-google-search-console-chist-panel-2.webp",
      alt: "نمونه بازسازی‌شده بخش نقشه‌های سایت سرچ کنسول با داده فرضی",
      caption:
        "نمونه بازسازی‌شده بخش Sitemaps. وضعیت «موفق» و تعداد صفحات فرضی است. این تصویر گام ۳ همان بخش اتصال است: ثبت نقشه سایت، نه یک شماره ساختگی جدا.",
    },
  ],
};

function insertBlogPanels(md, fullPath) {
  const panels = BLOG_PANELS[fullPath];
  if (!panels) return md;
  let out = md;
  for (const panel of panels) {
    const marker = `## ${panel.heading}`;
    const block = `\n![${panel.alt}](/images/blog/${panel.file})\n*${panel.caption}*\n`;
    if (!out.includes(marker)) {
      throw new Error(`Blog panel heading missing: ${fullPath} :: ${panel.heading}`);
    }
    if (out.includes(panel.file)) continue;
    out = out.replace(marker, `${marker}\n${block}`);
  }
  return out;
}

function blogFromPage(page, mappingByPath) {
  const slug = page.full_path.replace(/^\/blog\//, "");
  const body = insertBlogPanels(
    replaceMermaid(
      stripFaqHeading(page.content_md),
      page.full_path,
      mappingByPath
    ),
    page.full_path
  );
  // Append FAQ as markdown if present
  const faqs = (page.faqs || [])
    .slice()
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
  let fullBody = body.trim();
  if (faqs.length) {
    fullBody += "\n\n## سؤالات متداول\n\n";
    for (const f of faqs) {
      fullBody += `### ${f.question}\n\n${(f.answer_md || "").trim()}\n\n`;
    }
  }
  return {
    slug,
    title: page.title,
    excerpt: page.excerpt || page.meta_description || "",
    body: fullBody.trim(),
    category_slug: page.category_slug,
    category_name: page.category?.name || null,
    seo_title: page.seo_title,
    seo_description: page.meta_description,
    canonical_url: page.canonical_url,
    author_slug: page.author_slug || "amir-shadkam-nejad",
    author_name: "امیر شادکام نژاد",
    og_title: page.og_title || page.seo_title,
    og_description: page.og_description || page.meta_description,
    og_image: page.og_image || null,
  };
}

async function main() {
  const raw = JSON.parse(await fs.readFile(PAGES_JSON, "utf8"));
  const pages = raw.pages;
  const mapping = JSON.parse(await fs.readFile(MAPPING_JSON, "utf8"));
  const mappingByPath = new Map();
  for (const row of mapping) {
    if (!mappingByPath.has(row.full_path)) mappingByPath.set(row.full_path, []);
    mappingByPath.get(row.full_path).push(row);
  }
  for (const [, arr] of mappingByPath) {
    arr.sort((a, b) => a.block_index - b.block_index);
  }

  const hub = pages.find((p) => p.full_path === "/services");
  if (!hub) throw new Error("hub /services missing");

  const servicePages = pages
    .filter((p) => p.page_type === "plp" || p.page_type === "pdp")
    .filter((p) => p.full_path !== "/services")
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  const servicesRaw = servicePages
    .map((p, i) => serviceFromPage(p, i + 1, mappingByPath))
    .filter(Boolean);

  const bodiesDir = path.join(OUT_DIR, "bodies");
  const svcBodiesDir = path.join(bodiesDir, "services");
  await fs.mkdir(svcBodiesDir, { recursive: true });

  const services = [];
  for (const s of servicesRaw) {
    const fname = `${s.slug.replace(/\//g, "__")}.md`;
    await fs.writeFile(path.join(svcBodiesDir, fname), s.contentMd || "", "utf8");
    const { contentMd: _c, ...meta } = s;
    services.push({ ...meta, bodyFile: `services/${fname}` });
  }

  const overviewRaw = overviewFromHub(hub, mappingByPath);
  await fs.writeFile(
    path.join(bodiesDir, "overview.md"),
    overviewRaw.contentMd || "",
    "utf8"
  );
  const { contentMd: _oc, ...overviewRest } = overviewRaw;
  const overview = { ...overviewRest, bodyFile: "overview.md" };

  const blogPages = pages
    .filter((p) => p.page_type === "blog")
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  const blogPosts = blogPages.map((p) => blogFromPage(p, mappingByPath));

  const seedSql = await fs.readFile(SEED_SQL, "utf8");
  const redirects = parseRedirectsFromSeed(seedSql);

  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.writeFile(
    path.join(OUT_DIR, "package-services.json"),
    JSON.stringify(services, null, 0),
    "utf8"
  );
  await fs.writeFile(
    path.join(OUT_DIR, "package-overview.json"),
    JSON.stringify(overview, null, 0),
    "utf8"
  );
  await fs.writeFile(
    path.join(OUT_DIR, "package-redirects.json"),
    JSON.stringify(redirects, null, 2),
    "utf8"
  );
  await fs.writeFile(
    path.join(OUT_DIR, "package-blog-categories.json"),
    JSON.stringify(raw.blog_categories || [], null, 2),
    "utf8"
  );
  const blogSeed = {
    categories: raw.blog_categories || [],
    posts: blogPosts,
  };
  await fs.writeFile(
    path.join(OUT_DIR, "package-blog-posts.json"),
    JSON.stringify(blogSeed),
    "utf8"
  );
  await fs.writeFile(
    "/tmp/content-package-blog-seed.json",
    JSON.stringify(blogSeed),
    "utf8"
  );

  const newCount = servicePages.filter((p) =>
    String(p.legacy_status || "").startsWith("new")
  ).length;
  const updateCount = servicePages.length - newCount;
  console.log(
    JSON.stringify(
      {
        services: services.length,
        serviceUpdatesApprox: updateCount,
        serviceNew: newCount,
        blog: blogPosts.length,
        redirects: redirects.length,
        hub: true,
        totalPackagePages: pages.length,
      },
      null,
      2
    )
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
