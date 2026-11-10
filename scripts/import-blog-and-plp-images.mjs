#!/usr/bin/env node
/**
 * Unsplash → Sharp WebP → R2 for 50 blogs + PLP 16/29.
 * Writes lib/blog-images.ts and patches lib/service-images.ts entries.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const STAGING = path.join(ROOT, ".r2-staging");
const WEBP_QUALITY = 78;
const FEATURED_W = 1400;
const RELATED_W = 1000;

const PHOTOS = {
  seoLaptop: { id: "1432888622747-4eb9a39eef0c", photographer: "Stephen Dawson" },
  keywords: { id: "1434626882399-7c2aa07f4e21", photographer: "William Iven" },
  searchBar: { id: "1486312338219-ce68d2c6f44d", photographer: "Glenn Carstens-Peters" },
  analytics: { id: "1551288049-bebda4e38f71", photographer: "Luke Chesser" },
  codeScreen: { id: "1461749280684-dccba630e2f6", photographer: "Mohammad Rahmani" },
  laptopCode: { id: "1498050108023-c5249f4df085", photographer: "Christopher Gower" },
  webDesigner: { id: "1581291518857-4e27b48ff24e", photographer: "Sigmund" },
  uiWireframe: { id: "1586717791821-3f44a563fa4c", photographer: "Hal Gatewood" },
  mobileApp: { id: "1512941937728-9a9c4e8e4f8b", photographer: "Daniel Korpai" },
  apiCode: { id: "1555066931-4365d14bab8c", photographer: "Fotis Fotopoulos" },
  megaphone: { id: "1557804506-669a67965ba0", photographer: "Austin Distel" },
  billboard: { id: "1533750349088-cd871a92f312", photographer: "Stephen Dawson" },
  socialPhone: { id: "1611162617474-5b21e11e480f", photographer: "Solen Feyissa" },
  writingDesk: { id: "1455390582262-044cdead277a", photographer: "Aaron Burden" },
  contentCreate: { id: "1434030216411-0b793f80b178", photographer: "Green Chameleon" },
  aiRobot: { id: "1677442136019-21780ecad995", photographer: "Growtika" },
  teamMeeting: { id: "1552664730-d307ca884978", photographer: "Campaign Creators" },
  brandColors: { id: "1561070790-a4932d1eadca", photographer: "Balázs Kétyi" },
  emailInbox: { id: "1563986768494-4dee2763ff36", photographer: "Solen Feyissa" },
  serverRoom: { id: "1558494949-ef010cbdcc31", photographer: "Taylor Vick" },
  lockSecurity: { id: "1563986768609-322da13575f3", photographer: "FlyD" },
  monitoring: { id: "1555949963-aa79dcee981c", photographer: "Fotis Fotopoulos" },
  speedBlur: { id: "1556761175-b413da4baf72", photographer: "Austin Distel" },
  deskStrategy: { id: "1454165804606-c3d57bc86b40", photographer: "Scott Graham" },
  growthChart: { id: "1460925895917-afdab827c52f", photographer: "Luke Chesser" },
  newspaper: { id: "1504711434969-e33886168f5c", photographer: "AbsolutVision" },
  integration: { id: "1516321318423-f06f85e504b3", photographer: "Christin Hume" },
  pwaPhone: { id: "1511707171634-5f897ff02aa9", photographer: "William Iven" },
  appDesign: { id: "1551650975-87deedd944c3", photographer: "Ashutosh Gawali" },
  pluginCode: { id: "1517694712202-14dd9538aa97", photographer: "Lee Campbell" },
};

const FALLBACK = [
  "1556761175-b413da4baf72",
  "1454165804606-c3d57bc86b40",
  "1551288049-bebda4e38f71",
  "1498050108023-c5249f4df085",
  "1461749280684-dccba630e2f6",
  "1552664730-d307ca884978",
];

const CATEGORY_KEYS = {
  سئو: ["seoLaptop", "keywords", "searchBar", "analytics"],
  "طراحی سایت": ["laptopCode", "webDesigner", "uiWireframe", "codeScreen"],
  "اپلیکیشن، وب‌اپ و API": ["mobileApp", "appDesign", "apiCode", "pwaPhone"],
  "تبلیغات اینترنتی": ["megaphone", "billboard", "growthChart", "socialPhone"],
  "محتوا، شبکه‌های اجتماعی و هوش مصنوعی": [
    "writingDesk",
    "contentCreate",
    "aiRobot",
    "socialPhone",
  ],
  "دیجیتال مارکتینگ و برندینگ": [
    "teamMeeting",
    "brandColors",
    "deskStrategy",
    "emailInbox",
  ],
  "پشتیبانی، امنیت و سرعت سایت": [
    "serverRoom",
    "lockSecurity",
    "monitoring",
    "speedBlur",
  ],
  "آنالیتیکس و ابزارهای گوگل": [
    "analytics",
    "growthChart",
    "seoLaptop",
    "integration",
  ],
};

const PLP_PAGES = {
  "طراحی-سایت/کدنویسی": {
    folder: "custom-coding-website",
    title: "طراحی سایت کدنویسی",
    keys: ["codeScreen", "laptopCode", "uiWireframe", "apiCode"],
  },
  "تبلیغات-اینترنتی/گوگل-ادز": {
    folder: "google-ads",
    title: "گوگل ادز",
    keys: ["megaphone", "billboard", "growthChart", "seoLaptop"],
  },
};

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

function unsplashUrl(id, w) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;
}

async function download(url, dest) {
  const res = await fetch(url, {
    headers: { "User-Agent": "AlvandMarketingBlogImporter/1.0", Accept: "image/*" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 800) throw new Error(`small ${buf.length}`);
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, buf);
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

function folderFromSlug(slug) {
  return slug
    .replace(/\//g, "--")
    .replace(/[^\w\u0600-\u06FF-]+/g, "")
    .slice(0, 80) || "post";
}

function altFor(title, role, idx) {
  if (role === "featured") return `تصویر شاخص ${title} — الوند مارکتینگ`;
  return `تصویر مرتبط ${idx + 1} برای ${title} — الوند مارکتینگ`;
}

async function main() {
  const accountId = resolveAccountId(requireEnv("R2_ACCOUNT_ID"));
  const accessKeyId = requireEnv("R2_ACCESS_KEY_ID");
  const secretAccessKey = requireEnv("R2_SECRET_ACCESS_KEY");
  const bucket = requireEnv("R2_BUCKET");
  const publicBase = requireEnv("NEXT_PUBLIC_R2_PUBLIC_BASE_URL").replace(/\/$/, "");
  const client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });

  const blogs = JSON.parse(
    await fs.readFile("/tmp/blog-extract/blogs.json", "utf8")
  );

  /** @type {any[]} */
  const jobs = [];

  for (const post of blogs.posts) {
    const keys =
      CATEGORY_KEYS[post.category] ||
      CATEGORY_KEYS["دیجیتال مارکتینگ و برندینگ"];
    // rotate keys by order so posts in same category differ
    const rotated = [...keys.slice(post.order % 4), ...keys.slice(0, post.order % 4)];
    const folder = `blog/${folderFromSlug(post.slug)}`;
    const roles = ["featured", "related-1", "related-2", "related-3"];
    for (let i = 0; i < 4; i++) {
      const photo = PHOTOS[rotated[i]] || {
        id: FALLBACK[i % FALLBACK.length],
        photographer: "Unsplash",
      };
      const role = roles[i];
      const w = i === 0 ? FEATURED_W : RELATED_W;
      const filename = `${role}-${photo.id.slice(0, 13)}.webp`;
      const mediaPath = `images/${folder}/${filename}`;
      jobs.push({
        kind: "blog",
        slug: post.slug,
        title: post.title,
        role,
        photo,
        w,
        mediaPath,
        stagingAbs: path.join(STAGING, folder, filename),
        alt: altFor(post.title, i === 0 ? "featured" : "related", i - 1),
      });
    }
  }

  for (const [slug, page] of Object.entries(PLP_PAGES)) {
    const roles = ["featured", "related-1", "related-2", "related-3"];
    for (let i = 0; i < 4; i++) {
      const photo = PHOTOS[page.keys[i]];
      const role = roles[i];
      const w = i === 0 ? FEATURED_W : RELATED_W;
      const filename = `${role}-${photo.id.slice(0, 13)}.webp`;
      const mediaPath = `images/services/${page.folder}/${filename}`;
      jobs.push({
        kind: "service",
        slug,
        title: page.title,
        folder: page.folder,
        role,
        photo,
        w,
        mediaPath,
        stagingAbs: path.join(STAGING, "services", page.folder, filename),
        alt: altFor(page.title, i === 0 ? "featured" : "related", i - 1),
      });
    }
  }

  console.log(`jobs=${jobs.length} download+convert…`);
  await mapPool(8, jobs, async (job) => {
    const tmp = job.stagingAbs.replace(/\.webp$/, ".src");
    try {
      await download(unsplashUrl(job.photo.id, job.w), tmp);
    } catch (e) {
      const fid = FALLBACK[Math.floor(Math.random() * FALLBACK.length)];
      console.warn(`retry ${job.mediaPath}: ${e.message}`);
      job.photo = { ...job.photo, id: fid };
      await download(unsplashUrl(fid, job.w), tmp);
    }
    const meta = await sharp(tmp)
      .resize({ width: job.w, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY, effort: 4 })
      .toFile(job.stagingAbs);
    job.width = meta.width;
    job.height = meta.height;
    await fs.unlink(tmp).catch(() => {});
  });

  console.log("Upload R2…");
  let uploaded = 0;
  let skipped = 0;
  await mapPool(8, jobs, async (job) => {
    const key = `media/${job.mediaPath}`;
    try {
      await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
      skipped++;
      return;
    } catch {
      /* upload */
    }
    const body = await fs.readFile(job.stagingAbs);
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: "image/webp",
        CacheControl: "public, max-age=31536000, immutable",
      })
    );
    uploaded++;
  });
  console.log(`R2 uploaded=${uploaded} existed=${skipped}`);

  // blog-images.ts
  const blogSlugs = [...new Set(jobs.filter((j) => j.kind === "blog").map((j) => j.slug))];
  const blogLines = [];
  blogLines.push(`import { mediaUrl } from "@/lib/media";`);
  blogLines.push(`import type { ServiceImageAsset, ServiceImageSet } from "@/lib/service-images";`);
  blogLines.push("");
  blogLines.push(`function asset(`);
  blogLines.push(`  path: string, alt: string, width: number, height: number, photographer: string, unsplashId: string`);
  blogLines.push(`): ServiceImageAsset {`);
  blogLines.push(`  return { path, alt, width, height, photographer, unsplashId };`);
  blogLines.push(`}`);
  blogLines.push("");
  blogLines.push(`export function blogImageSrc(image: ServiceImageAsset): string {`);
  blogLines.push(`  return mediaUrl(image.path);`);
  blogLines.push(`}`);
  blogLines.push("");

  const coverMap = {};
  const entries = [];
  for (const slug of blogSlugs) {
    const pageJobs = jobs.filter((j) => j.kind === "blog" && j.slug === slug);
    const featured = pageJobs.find((j) => j.role === "featured");
    const related = pageJobs.filter((j) => j.role.startsWith("related"));
    const varName =
      "blog_" +
      Buffer.from(slug)
        .toString("base64url")
        .replace(/[^a-zA-Z0-9]/g, "")
        .slice(0, 24);
    blogLines.push(`const ${varName}: ServiceImageSet = {`);
    blogLines.push(
      `  featured: asset(${JSON.stringify(featured.mediaPath)}, ${JSON.stringify(featured.alt)}, ${featured.width}, ${featured.height}, ${JSON.stringify(featured.photo.photographer)}, ${JSON.stringify(featured.photo.id)}),`
    );
    blogLines.push(`  related: [`);
    for (const r of related) {
      blogLines.push(
        `    asset(${JSON.stringify(r.mediaPath)}, ${JSON.stringify(r.alt)}, ${r.width}, ${r.height}, ${JSON.stringify(r.photo.photographer)}, ${JSON.stringify(r.photo.id)}),`
      );
    }
    blogLines.push(`  ],`);
    blogLines.push(`};`);
    blogLines.push("");
    entries.push([slug, varName]);
    coverMap[slug] = {
      featuredUrl: `${publicBase}/media/${featured.mediaPath}`,
      path: featured.mediaPath,
    };
  }

  blogLines.push(`export const blogImagesBySlug: Record<string, ServiceImageSet> = {`);
  for (const [slug, v] of entries) {
    blogLines.push(`  ${JSON.stringify(slug)}: ${v},`);
  }
  blogLines.push(`};`);
  blogLines.push("");
  blogLines.push(`export function getBlogImages(slug: string): ServiceImageSet | undefined {`);
  blogLines.push(`  const decoded = (() => { try { return decodeURIComponent(slug); } catch { return slug; } })();`);
  blogLines.push(`  return blogImagesBySlug[slug] || blogImagesBySlug[decoded];`);
  blogLines.push(`}`);
  blogLines.push("");

  await fs.writeFile(path.join(ROOT, "lib/blog-images.ts"), blogLines.join("\n"), "utf8");
  await fs.writeFile(
    "/tmp/blog-extract/blog-images-map.json",
    JSON.stringify(coverMap, null, 2)
  );

  // Patch service-images.ts for two new PLPs
  const svcPath = path.join(ROOT, "lib/service-images.ts");
  let svc = await fs.readFile(svcPath, "utf8");
  for (const [slug, page] of Object.entries(PLP_PAGES)) {
    if (svc.includes(JSON.stringify(slug))) {
      console.log(`service images already has ${slug}`);
      continue;
    }
    const pageJobs = jobs.filter((j) => j.kind === "service" && j.slug === slug);
    const featured = pageJobs.find((j) => j.role === "featured");
    const related = pageJobs.filter((j) => j.role.startsWith("related"));
    const varName = "img_" + page.folder.replace(/-/g, "_");
    const block = [
      `const ${varName}: ServiceImageSet = {`,
      `  featured: asset(${JSON.stringify(featured.mediaPath)}, ${JSON.stringify(featured.alt)}, ${featured.width}, ${featured.height}, ${JSON.stringify(featured.photo.photographer)}, ${JSON.stringify(featured.photo.id)}),`,
      `  related: [`,
      ...related.map(
        (r) =>
          `    asset(${JSON.stringify(r.mediaPath)}, ${JSON.stringify(r.alt)}, ${r.width}, ${r.height}, ${JSON.stringify(r.photo.photographer)}, ${JSON.stringify(r.photo.id)}),`
      ),
      `  ],`,
      `};`,
      ``,
    ].join("\n");
    // insert before serviceImagesBySlug
    const marker = "export const serviceImagesBySlug";
    const at = svc.indexOf(marker);
    if (at < 0) throw new Error("serviceImagesBySlug not found");
    svc = svc.slice(0, at) + block + svc.slice(at);
    // add map entry
    const mapOpen = svc.indexOf("export const serviceImagesBySlug");
    const brace = svc.indexOf("{", mapOpen);
    svc =
      svc.slice(0, brace + 1) +
      `\n  ${JSON.stringify(slug)}: ${varName},` +
      svc.slice(brace + 1);
    console.log(`patched service images ${slug}`);
  }
  await fs.writeFile(svcPath, svc, "utf8");

  const manifest = {
    blogs: blogSlugs.length,
    blogImages: blogSlugs.length * 4,
    plpImages: 8,
    uploaded,
    existed: skipped,
    publicBase,
  };
  await fs.writeFile(
    path.join(STAGING, "blog-plp-images-manifest.json"),
    JSON.stringify(manifest, null, 2)
  );
  console.log(JSON.stringify(manifest));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
