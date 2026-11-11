#!/usr/bin/env node
/**
 * Import package PDP WebP images → Sharp (light) → Cloudflare R2,
 * refresh PDP service bodies from pages.json (images + diagrams), and
 * rewrite PDP entries in lib/service-images.ts.
 *
 * Does NOT re-upload PLP assets (already shipped in #52).
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

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PKG = path.join(
  ROOT,
  "content-package/supabase-package/supabase-package"
);
const PAGES_JSON = path.join(PKG, "data/pages.json");
const MAPPING_JSON = path.join(PKG, "assets/diagrams/mapping.json");
const WEBP_DIR = path.join(PKG, "assets/images/pdp");
const SERVICE_TS = path.join(ROOT, "lib/service-images.ts");
const BODIES_DIR = path.join(ROOT, "lib/content/bodies/services");
const STAGING = path.join(ROOT, ".r2-staging/pdp-package");
const MANIFEST = path.join(STAGING, "pdp-images-manifest.json");
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
  // Allow accountId.r2.cloudflarestorage.com/bucket form seen in env.
  const m2 = stripped.match(/^([0-9a-fA-F]{32})\./);
  if (m2) return m2[1];
  console.error("bad R2_ACCOUNT_ID");
  process.exit(2);
}

function slugFromFullPath(fullPath) {
  return fullPath.replace(/^\/services\//, "");
}

function varNameForSlug(slug, images = []) {
  const fn = images[0]?.filename || "";
  const m = fn.match(/^pdp-(\d{2})/);
  if (m) return `img_pdp_${m[1]}`;
  const fallback = createHash("sha256")
    .update(slug)
    .digest("hex")
    .slice(0, 10);
  return `img_pdp_${fallback}`;
}

function esc(s) {
  return JSON.stringify(s ?? "");
}

function stripFaqHeading(md) {
  return (md || "").replace(/\n##\s*سؤالات متداول[\s\S]*$/u, "");
}

function replaceMermaid(md, fullPath, mappingByPath) {
  const blocks = mappingByPath.get(fullPath) || [];
  let idx = 0;
  return (md || "").replace(/```mermaid\n[\s\S]*?```/g, () => {
    const block = blocks[idx++];
    if (!block) return "";
    const file = path.basename(block.svg);
    const alt = block.alt_fa || "نمودار";
    return `\n![${alt}](/diagrams/${file})\n`;
  });
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

function buildAssetLine(img, role) {
  const mediaPath = `images/pdp/${img.filename}`;
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

async function writePdpBodies(pdpPages, mappingByPath) {
  await fs.mkdir(BODIES_DIR, { recursive: true });
  let written = 0;
  for (const page of pdpPages) {
    const slug = slugFromFullPath(page.full_path);
    const contentMd = replaceMermaid(
      stripFaqHeading(page.content_md),
      page.full_path,
      mappingByPath
    );
    const fname = `${slug.replace(/\//g, "__")}.md`;
    await fs.writeFile(path.join(BODIES_DIR, fname), contentMd || "", "utf8");
    written++;
  }
  return written;
}

async function patchServiceImages(pdpPages) {
  let src = await fs.readFile(SERVICE_TS, "utf8");

  // related already array from PLP import; keep idempotent.
  src = src.replace(
    /related: \[ServiceImageAsset, ServiceImageAsset, ServiceImageAsset\];/,
    "related: ServiceImageAsset[];"
  );

  const consts = [];
  const mapEntries = [];
  /** @type {Map<string, string>} */
  const slugToVar = new Map();

  for (const page of pdpPages) {
    const slug = slugFromFullPath(page.full_path);
    const images = (page.images || [])
      .filter((i) => i.status === "ready")
      .slice()
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
    if (!images.length) continue;
    const varName = varNameForSlug(slug, images);
    if ([...slugToVar.values()].includes(varName)) {
      throw new Error(`duplicate image const name ${varName} for slug ${slug}`);
    }
    slugToVar.set(slug, varName);
    consts.push(buildImageSetConst(varName, images));
    mapEntries.push(`  ${esc(slug)}: ${varName},`);
  }

  // Remove prior generated PDP consts (img_pdp_*).
  src = src.replace(/\nconst img_pdp_[\w]+: ServiceImageSet = \{[\s\S]*?\n\};\n?/g, "\n");

  // Insert PDP consts before serviceImagesBySlug.
  const pdpConsts = consts.join("\n\n");
  const marker = "export const serviceImagesBySlug";
  const at = src.indexOf(marker);
  if (at < 0) throw new Error("serviceImagesBySlug not found");
  src = `${src.slice(0, at)}${pdpConsts}\n\n${src.slice(at)}`;

  const mapMatch = src.match(
    /export const serviceImagesBySlug: Record<string, ServiceImageSet> = \{([\s\S]*?)\n\};/
  );
  if (!mapMatch) throw new Error("could not parse serviceImagesBySlug");
  const existingLines = mapMatch[1]
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("//"));

  const pdpSlugSet = new Set(slugToVar.keys());
  const kept = [];
  for (const line of existingLines) {
    const m = line.match(/^"([^"]+)":\s*(\w+),?$/);
    if (!m) continue;
    const slug = m[1];
    if (pdpSlugSet.has(slug)) continue;
    if (m[2].startsWith("img_pdp_")) continue;
    kept.push(`  ${esc(slug)}: ${m[2]},`);
  }

  // Drop old Unsplash PDP const blocks that are no longer referenced.
  const newMapBody = [...kept, ...mapEntries.sort()].join("\n");
  src = src.replace(
    /export const serviceImagesBySlug: Record<string, ServiceImageSet> = \{[\s\S]*?\n\};/,
    `export const serviceImagesBySlug: Record<string, ServiceImageSet> = {\n${newMapBody}\n};`
  );

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
    pdpConsts: consts.length,
    mapEntries: mapEntries.length,
    keptOther: kept.length,
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
  const pdpPages = pages
    .filter((p) => p.page_type === "pdp")
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  const mapping = JSON.parse(await fs.readFile(MAPPING_JSON, "utf8"));
  const mappingByPath = new Map();
  for (const row of mapping) {
    if (!mappingByPath.has(row.full_path)) mappingByPath.set(row.full_path, []);
    mappingByPath.get(row.full_path).push(row);
  }
  for (const [, arr] of mappingByPath) {
    arr.sort((a, b) => a.block_index - b.block_index);
  }

  /** @type {{filename: string, page: string, abs: string, meta: any}[]} */
  const jobs = [];
  const seenSha = new Map();
  const seenName = new Set();

  for (const page of pdpPages) {
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
      try {
        await fs.access(abs);
      } catch {
        throw new Error(`missing webp file: ${abs}`);
      }
      jobs.push({ filename: img.filename, page: page.full_path, abs, meta: img });
    }
  }

  await fs.rm(STAGING, { recursive: true, force: true });
  await fs.mkdir(STAGING, { recursive: true });

  console.log(`Processing ${jobs.length} PDP images…`);
  const uploaded = await mapPool(4, jobs, async (job) => {
    const staged = path.join(STAGING, job.filename);
    const processed = await processWebp(job.abs, staged);
    const key = `media/images/pdp/${job.filename}`;
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

  console.log("Writing PDP bodies (package images + diagrams)…");
  const bodiesWritten = await writePdpBodies(pdpPages, mappingByPath);

  console.log("Patching lib/service-images.ts (PDP entries only)…");
  const patchStats = await patchServiceImages(pdpPages);

  const report = {
    uploaded: uploaded.length,
    uniqueFilenames: seenName.size,
    uniqueShaUploaded: new Set(uploaded.map((u) => u.sha256)).size,
    pdpPages: pdpPages.length,
    bodiesWritten,
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
