#!/usr/bin/env node
/**
 * Upsert all 50 package blog posts into existing blog_posts / blog_categories.
 * Env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (never logged).
 * Scoped refresh of the 50 package slugs only.
 * Dry-run unless APPLY=1. Writes a backup JSON before any update.
 * Already-published rows keep their id and published_at.
 */
import { promises as fs } from "node:fs";
import { createClient } from "@supabase/supabase-js";

function publishAssetUrl(assetPath) {
  if (!assetPath) return null;
  const base = (process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL || "").replace(/\/$/, "");
  if (base && assetPath.startsWith("/")) return `${base}/media${assetPath}`;
  return assetPath;
}

function publishBody(body) {
  return (body || "").replace(
    /\]\((\/(?:images|diagrams)\/[^)\s]+)\)/g,
    (_, assetPath) => `](${publishAssetUrl(assetPath)})`
  );
}

function requireEnv(name) {
  const v = process.env[name];
  if (!v?.trim()) {
    console.error(`MISSING env: ${name}`);
    process.exit(2);
  }
  return v.trim();
}

async function main() {
  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const key = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  const sb = createClient(url, key, { auth: { persistSession: false } });

  const seedPath = new URL(
    "../lib/content/package-blog-posts.json",
    import.meta.url
  );
  const raw = await fs.readFile(seedPath, "utf8");
  const { categories, posts } = JSON.parse(raw);
  const apply = process.env.APPLY === "1";
  console.log(apply ? "Mode: APPLY" : "Mode: DRY_RUN (set APPLY=1 to write)");

  /** @type {Record<string, string>} */
  const catIds = {};

  for (const cat of categories) {
    const slug = cat.slug;
    const { data: existing } = await sb
      .from("blog_categories")
      .select("id, slug")
      .eq("slug", slug)
      .maybeSingle();
    const payload = {
      name: cat.name,
      description: cat.description || cat.name,
      is_active: true,
      updated_at: new Date().toISOString(),
    };
    if (existing?.id) {
      catIds[slug] = existing.id;
      if (apply) {
        const { error } = await sb
          .from("blog_categories")
          .update(payload)
          .eq("id", existing.id);
        if (error) {
          console.error("category update", slug, error.message);
          process.exit(1);
        }
      }
      continue;
    }
    if (!apply) continue;
    const { data, error } = await sb
      .from("blog_categories")
      .insert({
        ...payload,
        slug,
        sort_order: cat.sort_order ?? 0,
      })
      .select("id")
      .single();
    if (error) {
      console.error("category insert", slug, error.message);
      process.exit(1);
    }
    catIds[slug] = data.id;
  }
  console.log(`categories prepared=${categories.length}`);

  if (!apply) {
    console.log(`Would upsert posts=${posts.length}`);
    return;
  }

  const backup = [];
  for (const post of posts) {
    const { data } = await sb
      .from("blog_posts")
      .select("*")
      .eq("slug", post.slug)
      .maybeSingle();
    if (data) backup.push(data);
  }
  const backupPath = "/tmp/alvand-blog-backup.json";
  await fs.writeFile(backupPath, JSON.stringify(backup));
  console.log(`backup posts=${backup.length} file=${backupPath}`);

  let upserted = 0;
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const row = {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      body: publishBody(post.body),
      category_id: catIds[post.category_slug] || null,
      status: "published",
      meta_title: post.seo_title,
      meta_description: post.seo_description,
      og_title: post.og_title || post.seo_title,
      og_description: post.og_description || post.seo_description,
      robots_index: true,
      robots_follow: true,
      canonical_url: post.canonical_url,
      cover_url: publishAssetUrl(post.og_image),
      og_image_url: publishAssetUrl(post.og_image),
      updated_at: new Date().toISOString(),
    };

    const { data: existing } = await sb
      .from("blog_posts")
      .select("id, published_at")
      .eq("slug", post.slug)
      .maybeSingle();

    if (existing?.id) {
      const { error } = await sb
        .from("blog_posts")
        .update({
          ...row,
          published_at: existing.published_at || new Date().toISOString(),
        })
        .eq("id", existing.id);
      if (error) {
        console.error("post update", post.slug, error.message);
        process.exit(1);
      }
    } else {
      const { error } = await sb.from("blog_posts").insert({
        ...row,
        published_at: new Date(Date.UTC(2026, 10, 11, 12, 0, i)).toISOString(),
      });
      if (error) {
        console.error("post insert", post.slug, error.message);
        process.exit(1);
      }
    }
    upserted++;
  }
  console.log(`blog posts upserted=${upserted}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
