#!/usr/bin/env node
/**
 * Convert site images to WebP (sharp) and upload to Cloudflare R2 under media/.
 * Env (values never logged): R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY,
 * R2_BUCKET, NEXT_PUBLIC_R2_PUBLIC_BASE_URL
 *
 * R2_ACCOUNT_ID may be a bare 32-char id, or a mistaken
 * `{id}.r2.cloudflarestorage.com/{bucket}` value (normalized here).
 */
import { createReadStream, promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const OUT_DIR = path.join(ROOT, ".r2-staging");

const WEBP_QUALITY = 82;

/** Favicon / PWA icons stay local. */
const KEEP_LOCAL = new Set([
  "favicon.png",
  "icon.png",
  "icon1.png",
  "apple-icon.png",
  "icon0.svg",
  "web-app-manifest-192x192.png",
  "web-app-manifest-512x512.png",
]);

function requireEnv(name) {
  const v = process.env[name];
  if (!v || !String(v).trim()) {
    console.error(`MISSING env: ${name}`);
    process.exit(2);
  }
  return String(v).trim();
}

function resolveAccountId(raw, bucket) {
  const stripped = raw.trim();
  const m = stripped.match(
    /^([0-9a-fA-F]{32})\.r2\.cloudflarestorage\.com(?:\/(.*))?$/
  );
  if (m) {
    if (m[2] && m[2] !== bucket) {
      console.warn(
        "WARN: R2_ACCOUNT_ID embeds an endpoint path whose bucket segment differs from R2_BUCKET; using R2_BUCKET."
      );
    }
    console.warn(
      "WARN: R2_ACCOUNT_ID looks like `{id}.r2.cloudflarestorage.com[/{bucket}]`. Using extracted 32-char account id. Human should set R2_ACCOUNT_ID to the bare account id only (Cursor + Vercel)."
    );
    return m[1];
  }
  if (/^[0-9a-fA-F]{32}$/.test(stripped)) return stripped;
  console.error(
    "R2_ACCOUNT_ID has unexpected shape (need 32-char hex account id). Refusing to guess further."
  );
  process.exit(2);
}

async function listMigratable() {
  const files = [];
  async function walk(dir, rel = "") {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const ent of entries) {
      const relPath = rel ? `${rel}/${ent.name}` : ent.name;
      const abs = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        if (ent.name === "fonts") continue;
        await walk(abs, relPath);
        continue;
      }
      if (KEEP_LOCAL.has(relPath) || KEEP_LOCAL.has(ent.name)) continue;
      const ext = path.extname(ent.name).toLowerCase();
      if (![".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif", ".bmp"].includes(ext)) {
        continue;
      }
      files.push({ abs, relPath });
    }
  }
  await walk(PUBLIC);
  return files;
}

async function toWebp(abs, outAbs) {
  await fs.mkdir(path.dirname(outAbs), { recursive: true });
  await sharp(abs)
    .webp({ quality: WEBP_QUALITY, effort: 6 })
    .toFile(outAbs);
  const [srcStat, outStat] = await Promise.all([fs.stat(abs), fs.stat(outAbs)]);
  return { srcBytes: srcStat.size, outBytes: outStat.size };
}

async function main() {
  const accountRaw = requireEnv("R2_ACCOUNT_ID");
  const accessKeyId = requireEnv("R2_ACCESS_KEY_ID");
  const secretAccessKey = requireEnv("R2_SECRET_ACCESS_KEY");
  const bucket = requireEnv("R2_BUCKET");
  const publicBase = requireEnv("NEXT_PUBLIC_R2_PUBLIC_BASE_URL").replace(
    /\/$/,
    ""
  );
  const accountId = resolveAccountId(accountRaw, bucket);
  const endpoint = `https://${accountId}.r2.cloudflarestorage.com`;

  const client = new S3Client({
    region: "auto",
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
  });

  const files = await listMigratable();
  if (!files.length) {
    console.log("No migratable images found under public/.");
    return;
  }

  await fs.rm(OUT_DIR, { recursive: true, force: true });
  await fs.mkdir(OUT_DIR, { recursive: true });

  const mapping = [];
  let failures = 0;

  for (const { abs, relPath } of files) {
    const webpRel = relPath.replace(/\.[^.]+$/, ".webp");
    const key = `media/${webpRel}`;
    const staged = path.join(OUT_DIR, webpRel);

    console.log(`CONVERT ${relPath} -> ${key}`);
    const sizes = await toWebp(abs, staged);

    const body = await fs.readFile(staged);
    try {
      await client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: body,
          ContentType: "image/webp",
          CacheControl: "public, max-age=31536000, immutable",
        })
      );
      await client.send(
        new HeadObjectCommand({ Bucket: bucket, Key: key })
      );
    } catch (err) {
      failures += 1;
      const code = err?.name || err?.Code || err?.$metadata?.httpStatusCode;
      console.error(`UPLOAD_FAIL key=${key} code=${code} message=${err?.message || err}`);
      mapping.push({
        local: `/${relPath}`,
        key,
        cdn: `${publicBase}/${key}`,
        status: "upload_failed",
        error: String(code),
      });
      continue;
    }

    const cdnUrl = `${publicBase}/${key}`;
    let publicOk = false;
    let publicStatus = null;
    try {
      const res = await fetch(cdnUrl, { method: "HEAD" });
      publicStatus = res.status;
      publicOk = res.ok;
      if (!publicOk) {
        const getRes = await fetch(cdnUrl, { method: "GET", headers: { Range: "bytes=0-0" } });
        publicStatus = getRes.status;
        publicOk = getRes.ok || getRes.status === 206;
      }
    } catch (err) {
      publicStatus = `fetch_error:${err?.cause?.code || err?.message || "unknown"}`;
    }

    console.log(
      `OK ${key} ${sizes.srcBytes}->${sizes.outBytes}B public=${publicOk ? "yes" : "NO"} status=${publicStatus}`
    );
    mapping.push({
      local: `/${relPath}`,
      key,
      cdn: cdnUrl,
      status: publicOk ? "ok" : "uploaded_but_public_unreachable",
      publicStatus,
      bytes: sizes,
    });
  }

  const mapPath = path.join(OUT_DIR, "mapping.json");
  await fs.writeFile(mapPath, JSON.stringify(mapping, null, 2));
  console.log(`Wrote ${mapPath}`);
  console.log(`Done: ${mapping.length} files, failures=${failures}`);
  if (failures) process.exit(1);
  if (mapping.some((m) => m.status !== "ok")) {
    console.warn(
      "Some objects uploaded but public CDN HEAD/GET failed. Check R2 public access / custom domain / CORS."
    );
    process.exit(3);
  }
}

main().catch((err) => {
  console.error("FATAL", err?.message || err);
  process.exit(1);
});
