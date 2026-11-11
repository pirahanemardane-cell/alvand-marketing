#!/usr/bin/env node
/**
 * Import package PLP WebP images → Sharp (light) → Cloudflare R2,
 * refresh service bodies from pages.json (images + diagrams), and
 * rewrite hub + PLP entries in lib/service-images.ts.
 *
 * Env: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET,
 *      NEXT_PUBLIC_R2_PUBLIC_BASE_URL
 */
import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { spawn } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PKG = path.join(
  ROOT,
  "content-package/supabase-package/supabase-package"
);
const PAGES_JSON = path.join(PKG, "data/pages.json");
const WEBP_DIR = path.join(PKG, "assets/images/plp");
const SERVICE_TS = path.join(ROOT, "lib/service-images.ts");
const STAGING = path.join(ROOT, ".r2-staging/plp-package");
const MANIFEST = path.join(STAGING, "plp-images-manifest.json");
const WEBP_QUALITY = 80;
const MAX_WIDTH = 1600;

function requireEnv(name) {
  const v = process.env[name];
  if (!v?.trim()) {
    console.error(`MISSING env: ${name}`);
    process.exit(2);
  }
  return v.trim();
}

function resolveAccountId(raw) {
  const stripped = raw.trim();
  const m = stripped.match(/^([0-9a-fA-F]{32})\.r2\.cloudflarestorage\.com/);
  if (m) return m[1];
  if (/^[0-9a-fA-F]{32}$/.test(stripped)) return stripped;
  console.error("bad R2_ACCOUNT_ID");
  process.exit(2);
}

function slugFromFullPath(fullPath) {
  if (fullPath === "/services") return "";
  return fullPath.replace(/^\/services\//, "");
}

function varNameForSlug(slug, images = []) {
  if (!slug) return "hubServiceImages";
  // Prefer stable plp-NN from package filename (Persian slugs are not ASCII-safe).
  const fn = images[0]?.filename || "";
  const m = fn.match(/^plp-(\d{2})/);
  if (m) return `img_plp_${m[1]}`;
  const fallback = createHash("sha256")
    .update(slug)
    .digest("hex")
    .slice(0, 10);
  return `img_plp_${fallback}`;
}

function esc(s) {
  return JSON.stringify(s ?? "");
}

async function mapPool(concurrency, items, fn) {
  const results = new Array(items.length);
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => worker())
  );
  return results;
}

async function processWebp(srcAbs, destAbs) {
  await fs.mkdir(path.dirname(destAbs), { recursive: true });
  const img = sharp(srcAbs, { failOn: "none" });
  const meta = await img.metadata();
  let pipeline = sharp(srcAbs, { failOn: "none" });
  if ((meta.width || 0) > MAX_WIDTH) {
    pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }
  await pipeline.webp({ quality: WEBP_QUALITY, effort: 6 }).toFile(destAbs);
  const outMeta = await sharp(destAbs).metadata();
  const buf = await fs.readFile(destAbs);
  return {
    width: outMeta.width || meta.width || 0,
    height: outMeta.height || meta.height || 0,
    bytes: buf.length,
    sha256: createHash("sha256").update(buf).digest("hex"),
    body: buf,
  };
}

function runNode(script) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [script], {
      cwd: ROOT,
      stdio: "inherit",
      env: process.env,
    });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${script} exited ${code}`));
    });
  });
}

function buildAssetLine(img, role) {
  const mediaPath = `images/plp/${img.filename}`;
  const alt =
    img.alt_fa ||
    (role === "featured"
      ? `تصویر شاخص — الوند مارکتینگ`
      : `تصویر مرتبط — الوند مارکتینگ`);
  return `asset(${esc(mediaPath)}, ${esc(alt)}, ${img.width}, ${img.height}, ${esc("الوند مارکتینگ")}, ${esc(img.file_sha256.slice(0, 16))})`;
}

function buildImageSetConst(varName, images) {
  const featured = images[0];
  const related = images.slice(1);
  const relatedLines = related.map((img, i) =>
    `    ${buildAssetLine(img, `related-${i + 1}`)},`
  );
  return [
    `const ${varName}: ServiceImageSet = {`,
    `  featured: ${buildAssetLine(featured, "featured")},`,
    `  related: [`,
    ...relatedLines,
    `  ],`,
    `};`,
  ].join("\n");
}

async function patchServiceImages(plpPages) {
  let src = await fs.readFile(SERVICE_TS, "utf8");

  // Relax related tuple → array (keeps PDP 3-item arrays valid).
  src = src.replace(
    /related: \[ServiceImageAsset, ServiceImageAsset, ServiceImageAsset\];/,
    "related: ServiceImageAsset[];"
  );

  const consts = [];
  const mapEntries = [];
  const aliasPairs = [
    ["شبکه‌های-اجتماعی", "شبکه-های-اجتماعی"],
    ["شبکه‌های-اجتماعی/اینستاگرام", "شبکه-های-اجتماعی/اینستاگرام"],
    ["شبکه‌های-اجتماعی/لینکدین", "شبکه-های-اجتماعی/لینکدین"],
    ["تبلیغات-اینترنتی/شبکه‌های-اجتماعی", "تبلیغات-اینترنتی/شبکه-های-اجتماعی"],
    ["ای‌پی‌آی-و-یکپارچه‌سازی", "ای-پی-آی-و-یکپارچه-سازی"],
  ];

  /** @type {Map<string, string>} */
  const slugToVar = new Map();

  for (const page of plpPages) {
    const slug = slugFromFullPath(page.full_path);
    const images = (page.images || [])
      .filter((i) => i.status === "ready")
      .slice()
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
    if (!images.length) continue;
    const varName = varNameForSlug(slug, images);
    if ([...slugToVar.values()].includes(varName) && varName !== "hubServiceImages") {
      throw new Error(`duplicate image const name ${varName} for slug ${slug}`);
    }
    slugToVar.set(slug, varName);
    consts.push(buildImageSetConst(varName, images));
    if (!slug) {
      // hub handled separately as hubServiceImages
    } else {
      mapEntries.push(`  ${esc(slug)}: ${varName},`);
    }
  }

  // Add hyphen/ZWNJ aliases when the canonical PLP var exists.
  for (const [zwnj, hyphen] of aliasPairs) {
    const varName = slugToVar.get(hyphen) || slugToVar.get(zwnj);
    if (!varName) continue;
    if (!mapEntries.some((e) => e.includes(esc(zwnj)))) {
      mapEntries.push(`  ${esc(zwnj)}: ${varName},`);
    }
    if (!mapEntries.some((e) => e.includes(esc(hyphen)))) {
      mapEntries.push(`  ${esc(hyphen)}: ${varName},`);
    }
  }

  // Replace hubServiceImages const.
  const hubConst = consts.find((c) => c.startsWith("const hubServiceImages"));
  if (!hubConst) throw new Error("hub images missing");
  src = src.replace(
    /const hubServiceImages: ServiceImageSet = \{[\s\S]*?\n\};/,
    hubConst
  );

  // Remove any prior generated PLP consts (img_plp_*).
  src = src.replace(/\nconst img_plp_[\w]+: ServiceImageSet = \{[\s\S]*?\n\};\n?/g, "\n");

  // Insert PLP consts (non-hub) before serviceImagesBySlug.
  const plpConsts = consts.filter((c) => !c.startsWith("const hubServiceImages")).join("\n\n");
  const marker = "export const serviceImagesBySlug";
  const at = src.indexOf(marker);
  if (at < 0) throw new Error("serviceImagesBySlug not found");
  src = `${src.slice(0, at)}${plpConsts}\n\n${src.slice(at)}`;

  // Rebuild map: keep non-PLP entries, replace/add PLP entries.
  const mapMatch = src.match(
    /export const serviceImagesBySlug: Record<string, ServiceImageSet> = \{([\s\S]*?)\n\};/
  );
  if (!mapMatch) throw new Error("could not parse serviceImagesBySlug");
  const existingLines = mapMatch[1]
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("//"));

  const plpSlugSet = new Set(
    [...slugToVar.keys()].filter(Boolean)
  );
  for (const [a, b] of aliasPairs) {
    plpSlugSet.add(a);
    plpSlugSet.add(b);
  }

  const kept = [];
  for (const line of existingLines) {
    const m = line.match(/^"([^"]+)":\s*(\w+),?$/);
    if (!m) continue;
    const slug = m[1];
    if (plpSlugSet.has(slug)) continue; // replaced
    if (m[2].startsWith("img_plp_")) continue;
    kept.push(`  ${esc(slug)}: ${m[2]},`);
  }

  const newMapBody = [...mapEntries.sort(), ...kept].join("\n");
  src = src.replace(
    /export const serviceImagesBySlug: Record<string, ServiceImageSet> = \{[\s\S]*?\n\};/,
    `export const serviceImagesBySlug: Record<string, ServiceImageSet> = {\n${newMapBody}\n};`
  );

  // Drop old Unsplash const blocks that are no longer referenced in the map.
  const usedVars = new Set(
    [...newMapBody.matchAll(/: (\w+),/g)].map((m) => m[1])
  );
  usedVars.add("hubServiceImages");
  src = src.replace(
    /\nconst (img_[\w]+): ServiceImageSet = \{[\s\S]*?\n\};/g,
    (block, name) => (usedVars.has(name) ? block : "\n")
  );

  await fs.writeFile(SERVICE_TS, src, "utf8");
  return {
    plpConsts: consts.length,
    mapEntries: mapEntries.length,
    keptPdp: kept.length,
  };
}

async function main() {
  const accountId = resolveAccountId(requireEnv("R2_ACCOUNT_ID"));
  const accessKeyId = requireEnv("R2_ACCESS_KEY_ID");
  const secretAccessKey = requireEnv("R2_SECRET_ACCESS_KEY");
  const bucket = requireEnv("R2_BUCKET");
  const publicBase = requireEnv("NEXT_PUBLIC_R2_PUBLIC_BASE_URL").replace(
    /\/$/,
    ""
  );

  const client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });

  const raw = JSON.parse(await fs.readFile(PAGES_JSON, "utf8"));
  const pages = raw.pages;
  const plpPages = pages
    .filter((p) => p.page_type === "plp")
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  /** @type {{filename: string, page: string, abs: string, meta: any}[]} */
  const jobs = [];
  const seenSha = new Map();
  const seenName = new Set();

  for (const page of plpPages) {
    const images = (page.images || [])
      .filter((i) => i.status === "ready")
      .slice()
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
    for (const img of images) {
      if (seenName.has(img.filename)) {
        throw new Error(`duplicate filename in package: ${img.filename}`);
      }
      seenName.add(img.filename);
      if (img.file_sha256) {
        if (seenSha.has(img.file_sha256)) {
          throw new Error(
            `duplicate sha256 ${img.file_sha256}: ${seenSha.get(img.file_sha256)} vs ${img.filename}`
          );
        }
        seenSha.set(img.file_sha256, img.filename);
      }
      const abs = path.join(WEBP_DIR, img.filename);
      jobs.push({ filename: img.filename, page: page.full_path, abs, meta: img });
    }
  }

  await fs.rm(STAGING, { recursive: true, force: true });
  await fs.mkdir(STAGING, { recursive: true });

  console.log(`Processing ${jobs.length} PLP images…`);
  const uploaded = await mapPool(4, jobs, async (job) => {
    const staged = path.join(STAGING, job.filename);
    const processed = await processWebp(job.abs, staged);
    // Prefer package dimensions/sha when we did not need to shrink much;
    // always upload the sharp output for consistent CDN bytes.
    const key = `media/images/plp/${job.filename}`;
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: processed.body,
        ContentType: "image/webp",
        CacheControl: "public, max-age=31536000, immutable",
      })
    );
    await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    const cdnUrl = `${publicBase}/${key.split("/").map(encodeURIComponent).join("/")}`;
    // Keep registry width/height when close; else use processed.
    job.meta.width = processed.width || job.meta.width;
    job.meta.height = processed.height || job.meta.height;
    job.meta.file_sha256 = processed.sha256;
    job.meta.cdnUrl = cdnUrl;
    job.meta.bytes = processed.bytes;
    return {
      filename: job.filename,
      page: job.page,
      key,
      cdnUrl,
      width: job.meta.width,
      height: job.meta.height,
      sha256: processed.sha256,
      bytes: processed.bytes,
    };
  });

  // Refresh bodies (includes /images/plp markdown + diagram replacements).
  console.log("Applying content package bodies…");
  await runNode(path.join(ROOT, "scripts/apply-content-package.mjs"));

  console.log("Patching lib/service-images.ts…");
  const patchStats = await patchServiceImages(plpPages);

  const report = {
    uploaded: uploaded.length,
    uniqueFilenames: seenName.size,
    uniqueShaUploaded: new Set(uploaded.map((u) => u.sha256)).size,
    plpPages: plpPages.length,
    patchStats,
    sample: uploaded.slice(0, 3),
  };
  await fs.writeFile(MANIFEST, JSON.stringify({ report, uploaded }, null, 2));
  console.log(JSON.stringify(report, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
