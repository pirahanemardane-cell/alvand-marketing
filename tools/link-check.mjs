#!/usr/bin/env node
// Link check for alvandmarketing.ir. Node 18+, no dependencies.
// Fails (exit 1) if ANY of these returns 4xx/5xx (or redirects into one):
//   1. every URL of the old live sitemap snapshot (data/live-urls-2026-11-11.json) -> must be 200 or a single 301/308 to a 200 page
//   2. every URL in <base>/sitemap.xml -> must be 200 (no redirects inside the sitemap)
//   3. every internal <a href> found on those pages -> must resolve to 200 (a redirect hop is reported as a warning: fix the link)
// Usage: node tools/link-check.mjs --base http://localhost:3000 [--old data/live-urls-2026-11-11.json] [--max-pages N] [--concurrency 4]
import { readFileSync } from 'node:fs';
const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, arr) => (v.startsWith('--') ? a.concat([[v.slice(2), arr[i + 1]]]) : a), []));
const BASE = (args.base || 'http://localhost:3000').replace(/\/$/, '');
const OLD = args.old || new URL('../data/live-urls-2026-11-11.json', import.meta.url).pathname;
const MAX = Number(args['max-pages'] || 1e9), CONC = Number(args.concurrency || 4);
const SITE = 'https://alvandmarketing.ir';
const enc = (p) => encodeURI(p.normalize('NFC'));
const toUrl = (p) => BASE + (p.startsWith('/') ? enc(p) : p);
const norm = (href) => { try { const u = new URL(href, SITE); if (u.host !== 'alvandmarketing.ir' && !href.startsWith('/')) return null; let p = decodeURI(u.pathname).normalize('NFC'); if (p.length > 1) p = p.replace(/\/$/, ''); return p; } catch { return null; } };
const cache = new Map();
async function check(path) {
  if (cache.has(path)) return cache.get(path);
  const pr = (async () => {
    let url = toUrl(path), hops = [];
    for (let i = 0; i < 5; i++) {
      const r = await fetch(url, { redirect: 'manual', headers: { 'user-agent': 'alvand-link-check' } });
      if (r.status >= 300 && r.status < 400) { const loc = new URL(r.headers.get('location'), url).toString(); hops.push([r.status, loc]); url = loc; continue; }
      return { status: r.status, hops, html: r.headers.get('content-type')?.includes('text/html') ? await r.text() : null };
    }
    return { status: 'TOO_MANY_REDIRECTS', hops };
  })();
  cache.set(path, pr); return pr;
}
async function pool(items, fn) { const out = []; let i = 0; await Promise.all(Array.from({ length: CONC }, async () => { while (i < items.length) { const k = i++; out[k] = await fn(items[k]); } })); return out; }
const errors = [], warnings = [];
const old = JSON.parse(readFileSync(OLD, 'utf8')).map((x) => x.path ?? x);
const smXml = await (await fetch(BASE + '/sitemap.xml')).text();
const sm = [...smXml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => norm(m[1])).filter(Boolean);
await pool(old, async (p) => { const r = await check(p); if (r.status !== 200) errors.push({ type: 'old-sitemap-url', path: p, status: r.status, hops: r.hops }); else if (r.hops.length > 1) warnings.push({ type: 'redirect-chain', path: p, hops: r.hops }); });
const pages = sm.slice(0, MAX); const linkSrc = new Map();
await pool(pages, async (p) => {
  const r = await check(p);
  if (r.status !== 200 || r.hops.length) errors.push({ type: 'sitemap-url', path: p, status: r.status, hops: r.hops });
  for (const m of (r.html || '').matchAll(/<a\b[^>]*href="([^"#]+)"/g)) {
    const t = norm(m[1].replace(/&amp;/g, '&')); if (!t || /^\/(_next|api)\b/.test(t) || /\.[a-z0-9]{2,5}$/i.test(t) || /^(mailto|tel):/.test(m[1])) continue;
    if (!linkSrc.has(t)) linkSrc.set(t, new Set()); linkSrc.get(t).add(p);
  }
});
await pool([...linkSrc.keys()], async (t) => { const r = await check(t.split('?')[0]); const from = [...linkSrc.get(t)].slice(0, 5);
  if (r.status !== 200) errors.push({ type: 'internal-link', target: t, status: r.status, from });
  else if (r.hops.length) warnings.push({ type: 'internal-link-via-redirect', target: t, hops: r.hops, from }); });
console.log(JSON.stringify({ base: BASE, oldUrls: old.length, sitemapUrls: sm.length, linksChecked: linkSrc.size, errors, warnings }, null, 1));
if (errors.length) { console.error(`LINK CHECK FAILED: ${errors.length} error(s)`); process.exit(1); }
console.error('LINK CHECK PASSED');
