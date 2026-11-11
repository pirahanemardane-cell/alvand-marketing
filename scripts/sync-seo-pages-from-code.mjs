/**
 * Upsert public seo_pages rows from code defaults (lib/seo/pages FALLBACKS +
 * lib/services seoTitle/seoDescription) so admin overrides match intended SEO
 * and live HTML can serve the same strings.
 *
 * Usage:
 *   DRY_RUN=1 node scripts/sync-seo-pages-from-code.mjs
 *   APPLY=1 node scripts/sync-seo-pages-from-code.mjs
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const APPLY = process.env.APPLY === "1";
const DRY_RUN = !APPLY;

const PIXEL_LIMITS = { titleSafe: 580, descSafe: 900, descMax: 920 };
const PERSIAN_WIDTH = 7.0;
const CHAR_WIDTH = {
  " ": 4.5,
  i: 4,
  l: 4,
  t: 5,
  f: 5,
  j: 4,
  r: 5.5,
  I: 5,
  ".": 4,
  ",": 4,
  "'": 3,
  '"': 5,
  "-": 5,
  _: 7,
  ":": 4,
  ";": 4,
  "!": 4,
  "?": 6,
  "/": 5,
  "\\": 5,
  "|": 4,
  m: 11,
  w: 11,
  M: 12,
  W: 13,
  "@": 12,
};

function measurePixelWidth(text) {
  if (!text) return 0;
  let w = 0;
  for (const ch of text) {
    if (CHAR_WIDTH[ch] != null) {
      w += CHAR_WIDTH[ch];
      continue;
    }
    const code = ch.charCodeAt(0);
    if (
      (code >= 0x0600 && code <= 0x06ff) ||
      (code >= 0x0750 && code <= 0x077f) ||
      (code >= 0xfb50 && code <= 0xfdff) ||
      (code >= 0xfe70 && code <= 0xfeff)
    ) {
      w += PERSIAN_WIDTH;
      continue;
    }
    if (ch >= "0" && ch <= "9") {
      w += 7.5;
      continue;
    }
    if (ch >= "A" && ch <= "Z") {
      w += 8.5;
      continue;
    }
    if (ch >= "a" && ch <= "z") {
      w += 7.2;
      continue;
    }
    w += 8;
  }
  return Math.round(w * 10) / 10;
}

function titleStatus(px) {
  if (px <= PIXEL_LIMITS.titleSafe) return "ok";
  if (px <= 600) return "warn";
  return "over";
}

function descStatus(px) {
  if (px <= PIXEL_LIMITS.descSafe) return "ok";
  if (px <= PIXEL_LIMITS.descMax) return "warn";
  return "over";
}

const STATIC = {
  home: {
    title: "الوند مارکتینگ",
    meta_title: "الوند مارکتینگ | آژانس دیجیتال مارکتینگ",
    meta_description:
      "الوند مارکتینگ — مثل کوه پشتتیم. آژانس دیجیتال مارکتینگ با استراتژی‌های پایدار و نتایج واقعی.",
  },
  services: {
    title: "خدمات",
    meta_title:
      "خدمات دیجیتال مارکتینگ؛ انتخاب خدمت مناسب | الوند مارکتینگ",
    meta_description:
      "خدمات دیجیتال مارکتینگ الوند: طراحی سایت، سئو، محتوا، تبلیغات و شبکه‌های اجتماعی. خدمت مناسب را در مشاوره رایگان مشخص کنید.",
  },
  blog: {
    title: "بلاگ",
    meta_title: "بلاگ | الوند مارکتینگ",
    meta_description:
      "مقالات کاربردی درباره سئو، تبلیغات، طراحی سایت و بازاریابی دیجیتال.",
  },
  contact: {
    title: "تماس با ما",
    meta_title: "تماس با ما | الوند مارکتینگ",
    meta_description:
      "برای مشاوره رایگان با الوند مارکتینگ تماس بگیرید. واتساپ، تلفن و فرم آنلاین.",
  },
};

function parseServices() {
  const src = fs.readFileSync(path.join(root, "lib/services.ts"), "utf8");
  const services = [];
  const re =
    /slug:\s*"([^"]+)"[\s\S]*?title:\s*"([^"]*)"[\s\S]*?seoTitle:\s*"([^"]*)"[\s\S]*?seoDescription:\s*"([^"]*)"/g;
  let m;
  while ((m = re.exec(src))) {
    services.push({
      slug: m[1],
      title: m[2],
      meta_title: m[3],
      meta_description: m[4],
    });
  }
  const ov = src.match(
    /export const servicesOverview[\s\S]*?title:\s*"([^"]*)"[\s\S]*?seoTitle:\s*"([^"]*)"[\s\S]*?seoDescription:\s*"([^"]*)"/
  );
  if (ov) {
    STATIC.services.title = ov[1];
    STATIC.services.meta_title = ov[2];
    STATIC.services.meta_description = ov[3];
  }
  return services;
}

function intendedRows(services) {
  const rows = [];
  for (const [page_key, v] of Object.entries(STATIC)) {
    rows.push({ page_key, ...v });
  }
  for (const s of services) {
    rows.push({
      page_key: `service:${s.slug}`,
      title: s.title,
      meta_title: s.meta_title,
      meta_description: s.meta_description,
    });
  }
  return rows;
}

async function supabaseFetch(pathname, { method = "GET", body, prefer } = {}) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  const headers = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };
  if (prefer) headers.Prefer = prefer;
  const res = await fetch(`${url}/rest/v1/${pathname}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`${method} ${pathname} → ${res.status}: ${text.slice(0, 400)}`);
  }
  return text ? JSON.parse(text) : null;
}

async function main() {
  const services = parseServices();
  const intended = intendedRows(services);
  const intendedKeys = new Set(intended.map((r) => r.page_key));

  console.log(`Parsed ${services.length} services + ${Object.keys(STATIC).length} static keys`);
  console.log(`Mode: ${DRY_RUN ? "DRY_RUN (set APPLY=1 to write)" : "APPLY"}`);

  const existing = await supabaseFetch("seo_pages?select=*&order=page_key.asc");
  const byKey = new Map(existing.map((r) => [r.page_key, r]));

  const pixelIssues = [];
  for (const row of intended) {
    const tPx = measurePixelWidth(row.meta_title);
    const dPx = measurePixelWidth(row.meta_description);
    const ts = titleStatus(tPx);
    const ds = descStatus(dPx);
    if (ts !== "ok" || ds !== "ok") {
      pixelIssues.push({
        page_key: row.page_key,
        titlePx: tPx,
        titleStatus: ts,
        descPx: dPx,
        descStatus: ds,
      });
    }
  }
  if (pixelIssues.length) {
    console.log("\nPixel warnings/overs (code source as-is):");
    for (const p of pixelIssues) console.log(JSON.stringify(p));
  } else {
    console.log("\nAll intended titles/descriptions within safe pixel limits.");
  }

  const mismatched = [];
  const missing = [];
  for (const row of intended) {
    const cur = byKey.get(row.page_key);
    if (!cur) {
      missing.push(row.page_key);
      continue;
    }
    if (
      cur.meta_title !== row.meta_title ||
      cur.meta_description !== row.meta_description
    ) {
      mismatched.push({
        page_key: row.page_key,
        live_title: cur.meta_title,
        code_title: row.meta_title,
        live_desc: cur.meta_description,
        code_desc: row.meta_description,
      });
    }
  }
  const orphans = existing
    .map((r) => r.page_key)
    .filter((k) => !intendedKeys.has(k));

  console.log(`\nExisting DB rows: ${existing.length}`);
  console.log(`Mismatched meta: ${mismatched.length}`);
  console.log(`Missing keys: ${missing.length}`);
  console.log(`Orphan keys: ${orphans.length}${orphans.length ? " → " + orphans.join(", ") : ""}`);

  if (DRY_RUN) {
    for (const m of mismatched.slice(0, 20)) {
      console.log(
        JSON.stringify({
          page_key: m.page_key,
          title_change: m.live_title !== m.code_title,
          desc_change: m.live_desc !== m.code_desc,
        })
      );
    }
    console.log("\nDry run only — no writes.");
    return;
  }

  const now = new Date().toISOString();
  const payload = intended.map((row) => {
    const prev = byKey.get(row.page_key);
    return {
      page_key: row.page_key,
      title: row.title,
      body_preview: prev?.body_preview ?? null,
      meta_title: row.meta_title,
      meta_description: row.meta_description,
      focus_keyphrases: prev?.focus_keyphrases ?? [],
      og_title: prev?.og_title || null,
      og_description: prev?.og_description || null,
      og_image_url: prev?.og_image_url || null,
      robots_index: prev?.robots_index !== false,
      robots_follow: prev?.robots_follow !== false,
      canonical_url: prev?.canonical_url || null,
      updated_at: now,
    };
  });

  // Upsert in chunks to keep payloads small
  const chunkSize = 20;
  for (let i = 0; i < payload.length; i += chunkSize) {
    const chunk = payload.slice(i, i + chunkSize);
    await supabaseFetch("seo_pages?on_conflict=page_key", {
      method: "POST",
      body: chunk,
      prefer: "resolution=merge-duplicates,return=minimal",
    });
    console.log(`Upserted ${i + chunk.length}/${payload.length}`);
  }

  for (const key of orphans) {
    await supabaseFetch(`seo_pages?page_key=eq.${encodeURIComponent(key)}`, {
      method: "DELETE",
      prefer: "return=minimal",
    });
    console.log(`Deleted orphan ${key}`);
  }

  const after = await supabaseFetch("seo_pages?select=page_key,meta_title,meta_description&order=page_key.asc");
  let stillWrong = 0;
  const afterMap = new Map(after.map((r) => [r.page_key, r]));
  for (const row of intended) {
    const cur = afterMap.get(row.page_key);
    if (
      !cur ||
      cur.meta_title !== row.meta_title ||
      cur.meta_description !== row.meta_description
    ) {
      stillWrong += 1;
      console.log("STILL_WRONG", row.page_key);
    }
  }
  console.log(
    `\nDone. DB rows=${after.length}, still_wrong=${stillWrong}, orphans_deleted=${orphans.length}`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
