#!/usr/bin/env node
/**
 * Sitewide unique images: keep first use of each Unsplash photo id,
 * replace later duplicates with new Unsplash-origin photos (Picsum→Unsplash)
 * → Sharp WebP → R2, then patch lib/service-images.ts and lib/blog-images.ts.
 *
 * Env: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET,
 *      NEXT_PUBLIC_R2_PUBLIC_BASE_URL
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const STAGING = path.join(ROOT, ".r2-staging/dedupe-unique");
const SERVICE_TS = path.join(ROOT, "lib/service-images.ts");
const BLOG_TS = path.join(ROOT, "lib/blog-images.ts");
const REPORT = path.join(ROOT, ".r2-staging/dedupe-report.json");

const FEATURED_W = 1200;
const RELATED_W = 900;
const FEATURED_Q = 68;
const RELATED_Q = 64;

/** Extra curated Unsplash photo ids (photo-{id}) not already in maps. */
const CURATED_EXTRA = [
  "1497366216548-37526070297c",
  "1497366753-2827c45918ac",
  "1497215727881-8985b31d3f0d",
  "1556761175-5973dc0f32e7",
  "1521737711867-e3b97375f902",
  "1522071820081-009f0129c71c",
  "1517245386807-bb43f82c33c4",
  "1600880292203-757bb62b4baf",
  "1542744173-8e7e53415bb0",
  "1553877522-43269d4ea984",
  "1559136555-9303baea8ebd",
  "1531482615713-2afd69097998",
  "1552664730-b2891e8f1bac",
  "1573164713714-d95e436ab8d6",
  "1551836022-d5d88e9218df",
  "1519389950479-df925b403d19",
  "1531482615713-2afd69097998",
  "1486312338219-ce68d2c6f44d",
  "1516321318423-f06f85e504b3",
  "1454165804606-c3d57bc86b40",
  "1460925895917-afdab827c52f",
  "1551288049-bebda4e38f71",
  "1498050108023-c5249f4df085",
  "1461749280684-dccba630e2f6",
  "1581291518857-4e27b48ff24e",
  "1586717791821-3f44a563fa4c",
  "1559028012-481c04fa702d",
  "1517694712202-14dd9538aa97",
  "1512941937728-9a9c4e8e4f8b",
  "1551650975-87deedd944c3",
  "1511707171634-5f897ff02aa9",
  "1555066931-4365d14bab8c",
  "1677442136019-21780ecad995",
  "1620712943543-bcc4688e7485",
  "1677756119517-56d7268e9a4d",
  "1561070790-a4932d1eadca",
  "1611162617474-5b21e11e480f",
  "1611162616305-c69b3fa7fbe0",
  "1529156069898-49953e39b3ac",
  "1558494949-ef010cbdcc31",
  "1563986768609-322da13575f3",
  "1555949963-aa79dcee981c",
  "1581092160562-40aa08e78837",
  "1533750349088-cd871a92f312",
  "1557804506-669a67965ba0",
  "1432888622747-4eb9a39eef0c",
  "1434626882399-7c2aa07f4e21",
  "1451187580459-43490279c0fa",
  "1556742049-0cfed4f6a45d",
  "1455390582262-044cdead277a",
  "1434030216411-0b793f80b178",
  "1574717024653-61fd2cf4d44d",
  "1478737270239-2f02b77fc618",
  "1504711434969-e33886168f5c",
  "1488646953014-85cb44e25828",
  "1566073771259-6a8506099945",
  "1488085061387-422e29b40080",
  "1589829085413-56de8ae18c73",
  "1506784983876-595ef4968cb3",
  "1526779259212-939e647799d0",
  "1576091160399-112ba8d25d1d",
  "1519494026892-80bbd2d6fd0d",
  "1579684385127-1ef15d508118",
  "1606811841689-23dfddce3e95",
  "1570172619644-dfd58ae2a63e",
  "1540555700478-4be289fbecef",
  "1517248135467-4c7edcad34c4",
  "1556910103-1c02745aae4d",
  "1521017432531-fbd92d768814",
  "1414235077428-338989a2e8c0",
  "1560518883-ce09059eeffa",
  "1560448204-e02f11c3d0e2",
  "1502672260266-1c1ef2d93688",
  "1600596542815-ffad4c1539a9",
  "1522202176988-66273c2fd55f",
  "1509062522246-3755977927d7",
  "1456513080850-7bf58dfa0290",
  "1565793297195-9477e0b8f83c",
  "1586528116311-ad8dd3c8310d",
  "1504917595217-d4dc5ebe6121",
  "1497215727881-8985b31d3f0d",
  "1504384308090-c894fdcc538d",
  "1517245386807-bb43f82c33c4",
  "1553877522-43269d4ea984",
  "1559136555-9303baea8ebd",
  "1573164574572-cbbae3903d35",
  "1519389950479-df925b403d19",
  "1488590528505-98d2b5aba04b",
  "1518770660439-4636190af475",
  "1550751827-4bd374c3f58b",
  "1517430816045-df4b7de11d1d",
  "1526374960328-7f5faa1e0b0f",
  "1555949963-aa79dcee981c",
  "1467232004584-a241de8bcf5d",
  "1556761175-b413da4baf72",
  "1544197150-b99a41b7c5c3",
  "1516321497483-6cfb6f0a5e3e",
  "1499951360447-b19be8cafe2f",
  "1453928582365-b6ad33cbcf64",
  "1483058712412-4245e9b90334",
  "1499750310107-5fef28a66643",
  "1432888498266-38ffec0f1ddf",
  "1504639725590-34d0984388bd",
  "1517694712202-14dd9538aa97",
  "1523475524864-6ac7552c4d1f",
  "1555949963-ff9fe0c870eb",
  "1555949963-aa79dcee981c",
  "1563013544-824ae1b704d3",
  "1556740758-90de374c12ad",
  "1556742049-0cfed4f6a45d",
  "1460925895917-afdab827c52f",
  "1551836022-d5d88e9218df",
  "1552664730-d307ca884978",
  "1600880292089-90a7e086ee0c",
  "1573496359142-b8d87734a5a2",
  "1573497019940-1cfe2fef73ba",
  "1556761175-4b46a572b786",
  "1556761175-b413da4baf72",
  "1542744173-05336fcc7ad4",
  "1557804507-caae4c4e0e91",
  "1560264280-a9e0f3c8e8e8",
  "1517245386807-bb43f82c33c4",
  "1498050108023-c5249f4df085",
  "1555066931-4365d14bab8c",
  "1516321318423-f06f85e504b3",
  "1531297484001-80022131f5a1",
  "1484788984921-03950022c9ef",
  "1517694471592-6e0e0e0e0e0e",
  "1496171367470-9ed9a91ea931",
  "1485827404703-89b55fcc595e",
  "1517694471592-4e0e0e0e0e0e",
  "1516321497483-6cfb6f0a5e3e",
  "1550751827-4bd374c3f58b",
  "1518770660439-4636190af475",
  "1488590528505-98d2b5aba04b",
  "1517430816045-df4b7de11d1d",
  "1531297484001-80022131f5a1",
  "1555949963-ff9fe0c870eb",
  "1563013544-824ae1b704d3",
  "1556740758-90de374c12ad",
  "1573496359142-b8d87734a5a2",
  "1573497019940-1cfe2fef73ba",
  "1556761175-4b46a572b786",
  "1542744173-05336fcc7ad4",
  "1557804507-caae4c4e0e91",
  "1600880292089-90a7e086ee0c",
  "1496171367470-9ed9a91ea931",
  "1485827404703-89b55fcc595e",
  "1484788984921-03950022c9ef",
  "1504384308090-c894fdcc538d",
  "1573164574572-cbbae3903d35",
  "1453928582365-b6ad33cbcf64",
  "1483058712412-4245e9b90334",
  "1499750310107-5fef28a66643",
  "1504639725590-34d0984388bd",
  "1523475524864-6ac7552c4d1f",
  "1544197150-b99a41b7c5c3",
  "1499951360447-b19be8cafe2f",
  "1551836022-4ec5a6e0e0e0",
  "1559136555-9303baea8ebd",
  "1553877522-43269d4ea984",
  "1531482615713-2afd69097998",
  "1573164713714-d95e436ab8d6",
  "1519389950479-df925b403d19",
  "1497366753-2827c45918ac",
  "1497215727881-8985b31d3f0d",
  "1600880292203-757bb62b4baf",
  "1542744173-8e7e53415bb0",
  "1529156069898-49953e39b3ac",
  "1611162616305-c69b3fa7fbe0",
  "1478737270239-2f02b77fc618",
  "1574717024653-61fd2cf4d44d",
  "1620712943543-bcc4688e7485",
  "1677756119517-56d7268e9a4d",
  "1566073771259-6a8506099945",
  "1488085061387-422e29b40080",
  "1589829085413-56de8ae18c73",
  "1506784983876-595ef4968cb3",
  "1526779259212-939e647799d0",
  "1606811841689-23dfddce3e95",
  "1570172619644-dfd58ae2a63e",
  "1540555700478-4be289fbecef",
  "1600596542815-ffad4c1539a9",
  "1509062522246-3755977927d7",
  "1456513080850-7bf58dfa0290",
  "1565793297195-9477e0b8f83c",
  "1586528116311-ad8dd3c8310d",
  "1504917595217-d4dc5ebe6121",
  "1432888498266-38ffec0f1ddf",
  "1556761175-5973dc0f32e7",
  "1497366216548-37526070297c",
  // more variety — office / devices / city / people
  "1522075469459-6e0e0e0e0e0e",
  "1492724441517-5f8f9e0e0e0e",
  "1507679799987-c73779587ccf",
  "1515378791036-0648a3ef77b2",
  "1522202176988-66273c2fd55f",
  "1531482615713-2afd69097998",
  "1552664730-b2891e8f1bac",
  "1557804506-669a67965ba0",
  "1560264280-88b8826a0e0e",
  "1573497019940-1cfe2fef73ba",
  "1581092160562-40aa08e78837",
  "1596526131086-c0c1e0e0e0e0",
  "1600880292203-757bb62b4baf",
  "1611162617474-5b21e11e480f",
  "1634942823686-ba4e0b0e0e0e",
  "1666214280557-f1b5022eb634",
  "1683148616914-0e0e0e0e0e0e",
  "1695049400464-0e0e0e0e0e0e",
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
  const m = raw.match(/^([0-9a-fA-F]{32})\.r2\.cloudflarestorage\.com/);
  if (m) return m[1];
  if (/^[0-9a-fA-F]{32}$/.test(raw)) return raw;
  // tolerate accountId embedded in longer strings
  const m2 = raw.match(/([0-9a-fA-F]{32})/);
  if (m2) return m2[1];
  console.error("bad R2_ACCOUNT_ID");
  process.exit(2);
}

function normKey(unsplashId, mediaPath) {
  const base = path.basename(mediaPath, ".webp");
  const fromPath = base.match(/(?:featured|related-\d+)-(.+)$/);
  let s = fromPath ? fromPath[1] : String(unsplashId).replace(/^[123]-/, "");
  const m = s.match(/(\d{10,}[a-z0-9-]*)/i);
  if (m) return m[1].replace(/[^a-z0-9-]/gi, "").slice(0, 22);
  // picsum / slug style
  return String(unsplashId).replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 24);
}

function parseAssets(src, fileLabel) {
  const re =
    /asset\(\s*"([^"]+)"\s*,\s*"([^"]*)"\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*"([^"]*)"\s*,\s*"([^"]+)"\s*\)/g;
  const out = [];
  let m;
  while ((m = re.exec(src))) {
    out.push({
      fileLabel,
      full: m[0],
      index: m.index,
      path: m[1],
      alt: m[2],
      width: +m[3],
      height: +m[4],
      photographer: m[5],
      unsplashId: m[6],
      key: normKey(m[6], m[1]),
      role: /featured-/.test(m[1])
        ? "featured"
        : /related-1-/.test(m[1])
          ? "related-1"
          : /related-2-/.test(m[1])
            ? "related-2"
            : /related-3-/.test(m[1])
              ? "related-3"
              : "other",
    });
  }
  return out;
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

function unsplashUrl(id, w) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;
}

async function probeUnsplash(id) {
  try {
    const res = await fetch(unsplashUrl(id, 200), {
      headers: { "User-Agent": "AlvandMarketingDedupe/1.0", Accept: "image/*" },
      redirect: "follow",
    });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 800) return null;
    return { kind: "unsplash", id, photographer: "Unsplash", bufPreview: null };
  } catch {
    return null;
  }
}

async function picsumInfo(id) {
  const res = await fetch(`https://picsum.photos/id/${id}/info`, {
    headers: { "User-Agent": "AlvandMarketingDedupe/1.0" },
  });
  if (!res.ok) return null;
  const j = await res.json();
  const slug = String(j.url || "").split("/").pop() || `picsum${id}`;
  return {
    kind: "picsum",
    id: `picsum-${id}`,
    picsumId: id,
    photographer: j.author || "Unsplash",
    slug,
    download: `https://picsum.photos/id/${id}/1600/1200`,
  };
}

async function downloadImage(photo, width) {
  const url =
    photo.kind === "unsplash"
      ? unsplashUrl(photo.id, width)
      : `https://picsum.photos/id/${photo.picsumId}/${width}/${Math.round(width * 0.67)}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "AlvandMarketingDedupe/1.0", Accept: "image/*" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`download ${res.status} ${photo.id}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 800) throw new Error(`small ${photo.id}`);
  return buf;
}

function buildAssetCall(a) {
  return `asset("${a.path}", "${a.alt}", ${a.width}, ${a.height}, "${a.photographer}", "${a.unsplashId}")`;
}

async function main() {
  const accountId = resolveAccountId(requireEnv("R2_ACCOUNT_ID"));
  const accessKeyId = requireEnv("R2_ACCESS_KEY_ID");
  const secretAccessKey = requireEnv("R2_SECRET_ACCESS_KEY");
  const bucket = requireEnv("R2_BUCKET");
  requireEnv("NEXT_PUBLIC_R2_PUBLIC_BASE_URL");

  const client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });

  let serviceSrc = await fs.readFile(SERVICE_TS, "utf8");
  let blogSrc = await fs.readFile(BLOG_TS, "utf8");
  const assets = [
    ...parseAssets(serviceSrc, "service"),
    ...parseAssets(blogSrc, "blog"),
  ];

  const usedKeys = new Set();
  const keep = [];
  const replace = [];
  for (const a of assets) {
    if (usedKeys.has(a.key)) replace.push(a);
    else {
      usedKeys.add(a.key);
      keep.push(a);
    }
  }
  console.log(
    JSON.stringify({
      total: assets.length,
      keep: keep.length,
      replace: replace.length,
      usedKeys: usedKeys.size,
    })
  );

  // Build replacement photo pool
  const pool = [];
  const curatedUnique = [...new Set(CURATED_EXTRA)];
  console.log(`probing ${curatedUnique.length} curated unsplash ids…`);
  await mapPool(8, curatedUnique, async (id) => {
    const key = normKey(id, `featured-${id.slice(0, 15)}.webp`);
    if (usedKeys.has(key) || usedKeys.has(id.slice(0, 22))) return;
    const ok = await probeUnsplash(id);
    if (ok) {
      pool.push({ kind: "unsplash", id, photographer: "Unsplash", key });
      usedKeys.add(key);
    }
  });
  console.log(`curated ok pool=${pool.length}`);

  if (pool.length < replace.length) {
    console.log("filling pool from picsum…");
    for (let i = 0; i < 2000 && pool.length < replace.length + 20; i++) {
      const info = await picsumInfo(i);
      if (!info) continue;
      const key = normKey(info.id, `featured-${info.id}.webp`);
      if (usedKeys.has(key) || usedKeys.has(info.slug)) continue;
      pool.push({ ...info, key });
      usedKeys.add(key);
      usedKeys.add(info.slug);
      if (pool.length % 50 === 0) console.log(`pool=${pool.length}`);
    }
  }
  console.log(`final pool=${pool.length} need=${replace.length}`);
  if (pool.length < replace.length) {
    console.error("not enough unique photos");
    process.exit(1);
  }

  await fs.mkdir(STAGING, { recursive: true });
  const jobs = replace.map((a, i) => {
    const photo = pool[i];
    const isFeatured = a.role === "featured";
    const w = isFeatured ? FEATURED_W : RELATED_W;
    const q = isFeatured ? FEATURED_Q : RELATED_Q;
    const idShort = photo.id.replace(/^picsum-/, "p").slice(0, 15);
    const dir = path.dirname(a.path);
    const filename = `${a.role}-${idShort}.webp`;
    const mediaPath = `${dir}/${filename}`;
    return {
      asset: a,
      photo,
      w,
      q,
      mediaPath,
      stagingAbs: path.join(STAGING, mediaPath),
    };
  });

  console.log(`download+convert jobs=${jobs.length}`);
  await mapPool(6, jobs, async (job) => {
    await fs.mkdir(path.dirname(job.stagingAbs), { recursive: true });
    const raw = await downloadImage(job.photo, job.w);
    const meta = await sharp(raw)
      .resize({ width: job.w, withoutEnlargement: true })
      .webp({ quality: job.q, effort: 4 })
      .toFile(job.stagingAbs);
    job.width = meta.width;
    job.height = meta.height;
  });
  console.log("converted");

  let uploaded = 0;
  await mapPool(6, jobs, async (job) => {
    const body = await fs.readFile(job.stagingAbs);
    const key = `media/${job.mediaPath}`;
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
    if (uploaded % 40 === 0) console.log(`uploaded ${uploaded}/${jobs.length}`);
  });
  console.log(`uploaded=${uploaded}`);

  // Patch TS files (replace from end to preserve indices)
  const byFile = {
    service: jobs.filter((j) => j.asset.fileLabel === "service"),
    blog: jobs.filter((j) => j.asset.fileLabel === "blog"),
  };

  function applyPatches(src, fileJobs) {
    const sorted = [...fileJobs].sort((a, b) => b.asset.index - a.asset.index);
    let out = src;
    for (const job of sorted) {
      const next = {
        path: job.mediaPath,
        alt: job.asset.alt,
        width: job.width,
        height: job.height,
        photographer: job.photo.photographer || "Unsplash",
        unsplashId: job.photo.id,
      };
      const replacement = buildAssetCall(next);
      const before = out.slice(0, job.asset.index);
      const after = out.slice(job.asset.index + job.asset.full.length);
      // verify the slice still matches (indices from original — re-find)
      const at = before.length;
      const current = out.slice(at, at + job.asset.full.length);
      if (current === job.asset.full) {
        out = before + replacement + after;
      } else {
        // fallback: replace unique full match once from end
        const idx = out.lastIndexOf(job.asset.full);
        if (idx < 0) throw new Error(`cannot find asset ${job.asset.path}`);
        out = out.slice(0, idx) + replacement + out.slice(idx + job.asset.full.length);
      }
    }
    return out;
  }

  // Safer: replace each original full string exactly once, walking duplicates carefully
  function applyPatchesSafe(src, fileJobs) {
    let out = src;
    // Group by identical full match; replace later occurrences first within file order
    for (const job of fileJobs) {
      const next = buildAssetCall({
        path: job.mediaPath,
        alt: job.asset.alt,
        width: job.width,
        height: job.height,
        photographer: (job.photo.photographer || "Unsplash").replace(/"/g, ""),
        unsplashId: job.photo.id,
      });
      const target = job.asset.full;
      const idx = out.indexOf(target);
      if (idx < 0) {
        // try path-only locate
        throw new Error(`patch miss: ${job.asset.path}`);
      }
      out = out.slice(0, idx) + next + out.slice(idx + target.length);
    }
    return out;
  }

  // Process jobs in original asset order within each file so first duplicate match is the right one
  serviceSrc = applyPatchesSafe(serviceSrc, byFile.service);
  blogSrc = applyPatchesSafe(blogSrc, byFile.blog);

  await fs.writeFile(SERVICE_TS, serviceSrc);
  await fs.writeFile(BLOG_TS, blogSrc);

  const report = {
    kept: keep.length,
    replaced: jobs.length,
    uploaded,
    samples: jobs.slice(0, 5).map((j) => ({
      from: j.asset.path,
      to: j.mediaPath,
      photo: j.photo.id,
    })),
  };
  await fs.writeFile(REPORT, JSON.stringify(report, null, 2));
  console.log("done", JSON.stringify(report));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
