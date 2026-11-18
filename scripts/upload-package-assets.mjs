#!/usr/bin/env node
/**
 * Upload package WebP assets to R2 under media/.
 * Existing keys are copied to media/_backup-2026-11-18/ before overwrite.
 * Does not delete unrelated objects.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
  CopyObjectCommand,
} from "@aws-sdk/client-s3";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PREFIXES = [
  "images/featured",
  "images/plp",
  "images/pdp",
  "images/blog",
  "diagrams",
];

function requireEnv(name) {
  const v = process.env[name];
  if (!v?.trim()) {
    console.error(`MISSING env: ${name}`);
    process.exit(2);
  }
  return v.trim();
}

function resolveAccountId(raw) {
  const m = raw.match(/^([0-9a-fA-F]{32})/);
  if (!m) {
    console.error("R2_ACCOUNT_ID shape refused");
    process.exit(2);
  }
  return m[1];
}

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const abs = path.join(dir, name);
    if (statSync(abs).isDirectory()) walk(abs, acc);
    else if (name.endsWith(".webp")) acc.push(abs);
  }
  return acc;
}

async function pool(items, n, fn) {
  const q = items.slice();
  const workers = Array.from({ length: n }, async () => {
    while (q.length) await fn(q.shift());
  });
  await Promise.all(workers);
}

async function main() {
  const accountId = resolveAccountId(requireEnv("R2_ACCOUNT_ID"));
  const bucket = requireEnv("R2_BUCKET");
  const publicBase = requireEnv("NEXT_PUBLIC_R2_PUBLIC_BASE_URL").replace(/\/$/, "");
  const client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: requireEnv("R2_ACCESS_KEY_ID"),
      secretAccessKey: requireEnv("R2_SECRET_ACCESS_KEY"),
    },
  });

  const files = [];
  for (const prefix of PREFIXES) {
    const dir = path.join(ROOT, "public", prefix);
    for (const abs of walk(dir)) {
      const rel = path.relative(path.join(ROOT, "public"), abs).split(path.sep).join("/");
      files.push({ abs, key: `media/${rel}`, backup: `media/_backup-2026-11-18/${rel}` });
    }
  }
  console.log(`files=${files.length}`);
  let uploaded = 0;
  let backed = 0;
  let failed = 0;
  await pool(files, 8, async (file) => {
    try {
      try {
        await client.send(new HeadObjectCommand({ Bucket: bucket, Key: file.key }));
        await client.send(new CopyObjectCommand({
          Bucket: bucket,
          Key: file.backup,
          CopySource: `${bucket}/${file.key}`,
        }));
        backed += 1;
      } catch (err) {
        const status = err?.$metadata?.httpStatusCode;
        if (status !== 404) throw err;
      }
      const body = readFileSync(file.abs);
      await client.send(new PutObjectCommand({
        Bucket: bucket,
        Key: file.key,
        Body: body,
        ContentType: "image/webp",
        CacheControl: "public, max-age=31536000, immutable",
      }));
      uploaded += 1;
      if (uploaded % 40 === 0) console.log(`uploaded ${uploaded}/${files.length} backed=${backed}`);
    } catch (err) {
      failed += 1;
      console.error(`FAIL ${file.key} ${err?.name || ""} ${err?.message || err}`);
    }
  });
  console.log(`done uploaded=${uploaded} backedUp=${backed} failed=${failed}`);
  const probes = [
    `${publicBase}/media/images/featured/featured-plp-01-khadamat-digital-marketing.webp`,
    `${publicBase}/media/images/blog/blog-12-tafavot-wordpress-kodnevisi-panel-1.webp`,
    `${publicBase}/media/diagrams/plp-01-khadamat-digital-marketing-diagram-1.webp`,
  ];
  for (const url of probes) {
    const res = await fetch(url, { method: "HEAD" });
    console.log(`probe ${res.status} ${url.split("/media/")[1]}`);
  }
  if (failed) process.exit(1);
}

main().catch((err) => {
  console.error("FATAL", err?.message || err);
  process.exit(1);
});
