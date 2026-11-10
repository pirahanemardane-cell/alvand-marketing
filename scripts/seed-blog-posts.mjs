#!/usr/bin/env node
/**
 * Upsert blog categories + published posts from /tmp/blog-extract/blogs.json
 * Env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (never logged).
 */
import { promises as fs } from "node:fs";
import { createClient } from "@supabase/supabase-js";

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

  const raw = await fs.readFile("/tmp/blog-extract/blogs.json", "utf8");
  const { categories, posts } = JSON.parse(raw);

  /** @type {Record<string, string>} */
  const catIds = {};

  for (const cat of categories) {
    const { data: existing } = await sb
      .from("blog_categories")
      .select("id, slug")
      .eq("slug", cat.slug)
      .maybeSingle();
    if (existing?.id) {
      catIds[cat.slug] = existing.id;
      await sb
        .from("blog_categories")
        .update({
          name: cat.name,
          sort_order: cat.sort_order,
          is_active: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);
      continue;
    }
    const { data, error } = await sb
      .from("blog_categories")
      .insert({
        name: cat.name,
        slug: cat.slug,
        sort_order: cat.sort_order,
        is_active: true,
        description: cat.name,
      })
      .select("id")
      .single();
    if (error) {
      console.error("category insert", cat.slug, error.message);
      process.exit(1);
    }
    catIds[cat.slug] = data.id;
  }
  console.log(`categories upserted=${categories.length}`);

  // Optional cover URLs from blog-images map if present
  let coverBySlug = {};
  try {
    const imgRaw = await fs.readFile("/tmp/blog-extract/blog-images-map.json", "utf8");
    coverBySlug = JSON.parse(imgRaw);
  } catch {
    /* optional */
  }

  let upserted = 0;
  for (const post of posts) {
    const cover =
      coverBySlug[post.slug]?.featuredUrl ||
      coverBySlug[post.slug]?.cover_url ||
      null;
    const row = {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      body: post.body,
      category_id: catIds[post.category_slug] || null,
      status: "published",
      published_at: new Date(Date.UTC(2026, 10, 10, 12, 0, post.order)).toISOString(),
      meta_title: post.seo_title,
      meta_description: post.seo_description,
      focus_keyphrase: post.focus_keyphrase || null,
      og_title: post.seo_title,
      og_description: post.seo_description,
      og_image_url: cover,
      cover_url: cover,
      robots_index: true,
      robots_follow: true,
      canonical_url: post.canonical_url,
      updated_at: new Date().toISOString(),
    };

    const { data: existing } = await sb
      .from("blog_posts")
      .select("id")
      .eq("slug", post.slug)
      .maybeSingle();

    if (existing?.id) {
      const { error } = await sb.from("blog_posts").update(row).eq("id", existing.id);
      if (error) {
        console.error("update", post.slug, error.message);
        process.exit(1);
      }
    } else {
      const { error } = await sb.from("blog_posts").insert(row);
      if (error) {
        console.error("insert", post.slug, error.message);
        process.exit(1);
      }
    }
    upserted++;
    if (upserted % 10 === 0) console.log(`posts ${upserted}/${posts.length}`);
  }
  console.log(`posts upserted=${upserted}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
