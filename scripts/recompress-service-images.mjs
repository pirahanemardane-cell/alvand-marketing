#!/usr/bin/env node
/**
 * Recompress existing service WebPs (lighter) and overwrite on R2.
 * Also rewrites width/height in lib/service-images.ts.
 *
 * Featured: max 1200w, webp q=68
 * Related/inline: max 900w, webp q=64
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const STAGING = path.join(ROOT, ".r2-staging/services-v2");
const OUT_TS = path.join(ROOT, "lib/service-images.ts");
const ASSIGN = "/tmp/service-image-assignments.json";

function requireEnv(name) {
  const v = process.env[name];
  if (!v?.trim()) {
    console.error(`MISSING env: ${name}`);
    process.exit(2);
  }
  return v.trim();
}

function resolveAccountId(raw) {
  const m = raw.match(/^([0-9a-fA-F]{32})\.r2\.cloudflarestorage\.com/);
  if (m) return m[1];
  if (/^[0-9a-fA-F]{32}$/.test(raw)) return raw;
  console.error("bad R2_ACCOUNT_ID");
  process.exit(2);
}

function unsplashUrl(id, w) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;
}

function altFor(title, role, idx) {
  if (role === "featured") return `تصویر شاخص ${title} — الوند مارکتینگ`;
  return `تصویر مرتبط ${idx + 1} برای ${title} — الوند مارکتینگ`;
}

async function mapPool(n, items, fn) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(n, items.length) }, async () => {
      while (i < items.length) {
        const idx = i++;
        out[idx] = await fn(items[idx], idx);
      }
    })
  );
  return out;
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

  const { pages } = JSON.parse(await fs.readFile(ASSIGN, "utf8"));
  const jobs = [];
  for (const [slug, page] of Object.entries(pages)) {
    const roles = ["featured", "related-1", "related-2", "related-3"];
    page.photos.forEach((photo, i) => {
      const role = roles[i];
      const isFeatured = i === 0;
      const w = isFeatured ? 1200 : 900;
      const quality = isFeatured ? 68 : 64;
      const filename = `${role}-${photo.id.slice(0, 15)}.webp`;
      const mediaPath = `images/services/${page.folder}/${filename}`;
      jobs.push({
        slug,
        title: page.title,
        folder: page.folder,
        role,
        photo,
        w,
        quality,
        mediaPath,
        stagingAbs: path.join(STAGING, page.folder, filename),
        alt: altFor(page.title, isFeatured ? "featured" : "related", i - 1),
      });
    });
  }

  console.log(`recompress jobs=${jobs.length}`);
  const sizes = [];
  await mapPool(6, jobs, async (job) => {
    await fs.mkdir(path.dirname(job.stagingAbs), { recursive: true });
    const tmp = job.stagingAbs + ".src.jpg";
    const res = await fetch(unsplashUrl(job.photo.id, Math.max(job.w, 1000)), {
      headers: { "User-Agent": "AlvandMarketingImageImporter/1.2" },
    });
    if (!res.ok) throw new Error(`${res.status} ${job.photo.id}`);
    await fs.writeFile(tmp, Buffer.from(await res.arrayBuffer()));
    const meta = await sharp(tmp)
      .rotate()
      .resize({
        width: job.w,
        withoutEnlargement: true,
        fit: "inside",
      })
      .webp({ quality: job.quality, effort: 6, smartSubsample: true })
      .toFile(job.stagingAbs);
    job.width = meta.width;
    job.height = meta.height;
    const st = await fs.stat(job.stagingAbs);
    job.bytes = st.size;
    sizes.push(st.size);
    await fs.unlink(tmp).catch(() => {});
  });
  sizes.sort((a, b) => a - b);
  const kb = (n) => (n / 1024).toFixed(1);
  console.log(
    `sizeKB min=${kb(sizes[0])} median=${kb(sizes[Math.floor(sizes.length / 2)])} max=${kb(sizes.at(-1))} avg=${kb(sizes.reduce((a, b) => a + b, 0) / sizes.length)}`
  );

  let uploaded = 0;
  await mapPool(6, jobs, async (job) => {
    const body = await fs.readFile(job.stagingAbs);
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: `media/${job.mediaPath}`,
        Body: body,
        ContentType: "image/webp",
        CacheControl: "public, max-age=31536000, immutable",
      })
    );
    uploaded++;
    if (uploaded % 25 === 0) console.log(`uploaded ${uploaded}`);
  });
  console.log(`uploaded=${uploaded}`);

  const sample = `${publicBase}/media/${jobs[0].mediaPath}`;
  const head = await fetch(sample, { method: "HEAD" });
  console.log(`CDN ${head.status}`);

  // regenerate TS (same shape as before)
  const ts = [];
  const j = (s) => JSON.stringify(s);
  ts.push(`import { mediaUrl } from "@/lib/media";`);
  ts.push("");
  ts.push(`export type ServiceImageAsset = {`);
  ts.push(`  /** Path under media/ for mediaUrl() */`);
  ts.push(`  path: string;`);
  ts.push(`  alt: string;`);
  ts.push(`  width: number;`);
  ts.push(`  height: number;`);
  ts.push(`  photographer: string;`);
  ts.push(`  unsplashId: string;`);
  ts.push(`};`);
  ts.push("");
  ts.push(`export type ServiceImageSet = {`);
  ts.push(`  featured: ServiceImageAsset;`);
  ts.push(`  related: [ServiceImageAsset, ServiceImageAsset, ServiceImageAsset];`);
  ts.push(`};`);
  ts.push("");
  ts.push(`function asset(`);
  ts.push(`  path: string,`);
  ts.push(`  alt: string,`);
  ts.push(`  width: number,`);
  ts.push(`  height: number,`);
  ts.push(`  photographer: string,`);
  ts.push(`  unsplashId: string`);
  ts.push(`): ServiceImageAsset {`);
  ts.push(`  return { path, alt, width, height, photographer, unsplashId };`);
  ts.push(`}`);
  ts.push("");
  ts.push(`export function serviceImageSrc(image: ServiceImageAsset): string {`);
  ts.push(`  return mediaUrl(image.path);`);
  ts.push(`}`);
  ts.push("");

  function emit(name, pageJobs) {
    const f = pageJobs.find((x) => x.role === "featured");
    const r = pageJobs.filter((x) => x.role.startsWith("related"));
    ts.push(`const ${name}: ServiceImageSet = {`);
    ts.push(
      `  featured: asset(${j(f.mediaPath)}, ${j(f.alt)}, ${f.width}, ${f.height}, ${j(f.photo.photographer)}, ${j(f.photo.id)}),`
    );
    ts.push(`  related: [`);
    for (const x of r) {
      ts.push(
        `    asset(${j(x.mediaPath)}, ${j(x.alt)}, ${x.width}, ${x.height}, ${j(x.photo.photographer)}, ${j(x.photo.id)}),`
      );
    }
    ts.push(`  ],`);
    ts.push(`};`);
    ts.push("");
  }

  emit(
    "hubServiceImages",
    jobs.filter((x) => x.slug === "__hub__")
  );
  ts.push(`export { hubServiceImages };`);
  ts.push("");

  const entries = [];
  for (const slug of Object.keys(pages)) {
    if (slug === "__hub__") continue;
    const folder = pages[slug].folder;
    const name = "img_" + folder.replace(/-/g, "_");
    emit(
      name,
      jobs.filter((x) => x.slug === slug)
    );
    entries.push([slug, name]);
  }

  ts.push(
    `export const serviceImagesBySlug: Record<string, ServiceImageSet> = {`
  );
  for (const [slug, name] of entries) {
    ts.push(`  ${j(slug)}: ${name},`);
  }
  ts.push(`};`);
  ts.push("");
  ts.push(
    `export function getServiceImages(slug: string): ServiceImageSet | undefined {`
  );
  ts.push(`  const decoded = (() => {`);
  ts.push(
    `    try { return decodeURIComponent(slug); } catch { return slug; }`
  );
  ts.push(`  })();`);
  ts.push(
    `  return serviceImagesBySlug[slug] || serviceImagesBySlug[decoded];`
  );
  ts.push(`}`);
  ts.push("");
  ts.push(`export function getHubImages(): ServiceImageSet {`);
  ts.push(`  return hubServiceImages;`);
  ts.push(`}`);
  ts.push("");

  await fs.writeFile(OUT_TS, ts.join("\n"));
  await fs.writeFile(
    path.join(ROOT, ".r2-staging/service-images-manifest.json"),
    JSON.stringify(
      {
        hosting: "r2",
        publicBase,
        pages: Object.keys(pages).length,
        imagesPerPage: 4,
        totalImages: jobs.length,
        uploaded,
        sampleCdnStatus: head.status,
        compression: {
          featuredMaxW: 1200,
          relatedMaxW: 900,
          featuredQuality: 68,
          relatedQuality: 64,
          sizeKB: {
            min: Number(kb(sizes[0])),
            median: Number(kb(sizes[Math.floor(sizes.length / 2)])),
            max: Number(kb(sizes.at(-1))),
            avg: Number(
              kb(sizes.reduce((a, b) => a + b, 0) / sizes.length)
            ),
          },
        },
        placement: "inline-under-section-headings",
        catalog: "verified-unsplash-ids-v2-light",
      },
      null,
      2
    )
  );
  console.log(`Wrote ${OUT_TS}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
