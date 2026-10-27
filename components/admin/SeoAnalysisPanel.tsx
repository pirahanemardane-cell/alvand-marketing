"use client";

import { useMemo, useState } from "react";
import { analyzeSeo, type SeoAnalysisResult } from "@/lib/seo/analyze";
import {
  measurePixelWidth,
  PIXEL_LIMITS,
  truncateToPixels,
} from "@/lib/seo/pixel";
import {
  suggestMetaTitle,
  suggestMetaDescription,
  suggestSocial,
} from "@/lib/seo/suggest";
import { summarizeText } from "@/lib/seo/summarize";

export type SeoPanelValue = {
  metaTitle: string;
  metaDescription: string;
  focusKeyphrases: string[];
  ogTitle: string;
  ogDescription: string;
  ogImageUrl: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  canonicalUrl: string;
};

export function emptySeoValue(
  partial?: Partial<SeoPanelValue>
): SeoPanelValue {
  return {
    metaTitle: "",
    metaDescription: "",
    focusKeyphrases: [],
    ogTitle: "",
    ogDescription: "",
    ogImageUrl: "",
    robotsIndex: true,
    robotsFollow: true,
    canonicalUrl: "",
    ...partial,
  };
}

type Props = {
  pageName: string;
  slug?: string;
  shortDescription?: string;
  body?: string;
  imageUrl?: string;
  siteName?: string;
  siteUrl?: string;
  value: SeoPanelValue;
  onChange: (next: SeoPanelValue) => void;
};

function scoreColor(score: number) {
  if (score >= 75) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 50) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

function barColor(score: number) {
  if (score >= 75) return "bg-emerald-500";
  if (score >= 50) return "bg-amber-500";
  return "bg-red-500";
}

function statusDot(status: "good" | "ok" | "bad" | "na") {
  if (status === "good") return "bg-emerald-500";
  if (status === "ok") return "bg-amber-400";
  if (status === "bad") return "bg-red-500";
  return "bg-muted-foreground/40";
}

export default function SeoAnalysisPanel({
  pageName,
  slug = "",
  shortDescription = "",
  body = "",
  imageUrl = "",
  siteName = "الوند مارکتینگ",
  siteUrl = "https://alvandmarketing.ir",
  value,
  onChange,
}: Props) {
  const [showSocial, setShowSocial] = useState(false);
  const [kpInput, setKpInput] = useState("");
  const [msg, setMsg] = useState("");

  const effectiveTitle =
    value.metaTitle.trim() ||
    (pageName ? `${pageName} | ${siteName}` : siteName);
  const effectiveDesc =
    value.metaDescription.trim() || shortDescription.slice(0, 160) || "";

  const analysis: SeoAnalysisResult = useMemo(
    () =>
      analyzeSeo({
        keyphrases: value.focusKeyphrases,
        title: effectiveTitle,
        metaDescription: effectiveDesc,
        h1: pageName,
        intro: shortDescription,
        body,
        robotsIndex: value.robotsIndex,
      }),
    [
      value.focusKeyphrases,
      effectiveTitle,
      effectiveDesc,
      pageName,
      shortDescription,
      body,
      value.robotsIndex,
    ]
  );

  const displayUrl = `${siteUrl.replace(/\/$/, "")}/${slug.replace(/^\//, "")}`;
  const titlePx = measurePixelWidth(effectiveTitle);
  const descPx = measurePixelWidth(effectiveDesc);
  const serpTitle = truncateToPixels(effectiveTitle, PIXEL_LIMITS.titleDesktop);
  const serpDesc = truncateToPixels(effectiveDesc, PIXEL_LIMITS.descDesktop);

  function patch(partial: Partial<SeoPanelValue>) {
    onChange({ ...value, ...partial });
  }

  function addKeyphrase() {
    const t = kpInput.trim();
    if (!t || value.focusKeyphrases.length >= 5) return;
    if (
      value.focusKeyphrases.some((k) => k.toLowerCase() === t.toLowerCase())
    ) {
      setKpInput("");
      return;
    }
    patch({ focusKeyphrases: [...value.focusKeyphrases, t] });
    setKpInput("");
  }

  const suggestPayload = {
    pageName,
    shortDescription,
    body,
    focusKeyphrases: value.focusKeyphrases,
    siteName,
  };

  function applyAll() {
    const metaTitle = suggestMetaTitle(suggestPayload);
    const metaDescription = suggestMetaDescription(suggestPayload);
    const social = suggestSocial(suggestPayload);
    onChange({
      ...value,
      metaTitle,
      metaDescription,
      ogTitle: social.ogTitle,
      ogDescription: social.ogDescription,
    });
    setMsg("پیشنهاد SEO اعمال شد");
  }

  return (
    <div className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-bold">تحلیل و بهینه‌سازی SEO</h3>
        <div className="flex items-center gap-4 text-sm">
          <span className={scoreColor(analysis.score)}>
            SEO: <strong>{analysis.score}</strong>/100
          </span>
          <span className={scoreColor(analysis.readabilityScore)}>
            خوانایی: <strong>{analysis.readabilityScore}</strong>/100
          </span>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <div>
          <div className="mb-1 flex justify-between text-xs text-muted-foreground">
            <span>امتیاز SEO</span>
            <span>{analysis.score}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full transition-all ${barColor(analysis.score)}`}
              style={{ width: `${analysis.score}%` }}
            />
          </div>
        </div>
        <div>
          <div className="mb-1 flex justify-between text-xs text-muted-foreground">
            <span>خوانایی</span>
            <span>{analysis.readabilityScore}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full transition-all ${barColor(analysis.readabilityScore)}`}
              style={{ width: `${analysis.readabilityScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* SERP preview */}
      <div className="rounded-xl border border-border bg-background p-4">
        <p className="mb-2 text-xs text-muted-foreground">پیش‌نمایش گوگل</p>
        <p className="text-sm text-blue-700 dark:text-blue-400" dir="ltr">
          {displayUrl}
        </p>
        <p className="mt-1 text-lg font-medium text-blue-800 dark:text-blue-300">
          {serpTitle}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{serpDesc}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={applyAll}
          className="rounded-xl bg-accent px-3 py-1.5 text-xs font-bold text-accent-foreground"
        >
          پیشنهاد کامل SEO
        </button>
        <button
          type="button"
          onClick={() =>
            patch({ metaTitle: suggestMetaTitle(suggestPayload) })
          }
          className="rounded-xl border border-border px-3 py-1.5 text-xs"
        >
          پیشنهاد Title
        </button>
        <button
          type="button"
          onClick={() =>
            patch({ metaDescription: suggestMetaDescription(suggestPayload) })
          }
          className="rounded-xl border border-border px-3 py-1.5 text-xs"
        >
          پیشنهاد Description
        </button>
        <button
          type="button"
          onClick={() => {
            const sum = summarizeText(body || shortDescription || "", {
              keyphrase: value.focusKeyphrases[0],
            });
            if (sum) {
              patch({ metaDescription: sum });
              setMsg("خلاصه از متن اعمال شد");
            } else setMsg("متنی برای خلاصه نیست");
          }}
          className="rounded-xl border border-border px-3 py-1.5 text-xs"
        >
          خلاصه از متن
        </button>
        {msg && (
          <span className="self-center text-xs text-muted-foreground">{msg}</span>
        )}
      </div>

      {/* Keyphrases */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">
          کلیدواژه کانونی — تا ۵ مورد
        </label>
        <div className="flex flex-wrap gap-2">
          {value.focusKeyphrases.map((k, i) => (
            <span
              key={`${k}-${i}`}
              className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs"
            >
              {i === 0 && <span className="font-bold text-accent">۱</span>}
              {k}
              <button
                type="button"
                className="text-muted-foreground hover:text-red-500"
                onClick={() =>
                  patch({
                    focusKeyphrases: value.focusKeyphrases.filter(
                      (_, idx) => idx !== i
                    ),
                  })
                }
              >
                ×
              </button>
            </span>
          ))}
        </div>
        {value.focusKeyphrases.length < 5 && (
          <div className="flex gap-2">
            <input
              className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
              placeholder="کلیدواژه + Enter"
              value={kpInput}
              onChange={(e) => setKpInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addKeyphrase();
                }
              }}
            />
            <button
              type="button"
              onClick={addKeyphrase}
              className="rounded-xl bg-accent px-3 py-2 text-sm font-bold text-accent-foreground"
            >
              افزودن
            </button>
          </div>
        )}
      </div>

      <label className="block space-y-1 text-sm">
        <span className="flex justify-between gap-2">
          <span>عنوان SEO (Title)</span>
          <span
            className={
              analysis.titleStatus === "over"
                ? "text-red-600"
                : analysis.titleStatus === "warn"
                  ? "text-amber-600"
                  : "text-muted-foreground"
            }
          >
            {titlePx}px / {PIXEL_LIMITS.titleDesktop}px
          </span>
        </span>
        <input
          className="w-full rounded-xl border border-border bg-background px-3 py-2 outline-none focus:border-accent"
          value={value.metaTitle}
          onChange={(e) => patch({ metaTitle: e.target.value })}
          placeholder={`${pageName} | ${siteName}`}
        />
      </label>

      <label className="block space-y-1 text-sm">
        <span className="flex justify-between gap-2">
          <span>توضیح متا (Meta Description)</span>
          <span
            className={
              analysis.descStatus === "over"
                ? "text-red-600"
                : analysis.descStatus === "warn"
                  ? "text-amber-600"
                  : "text-muted-foreground"
            }
          >
            {descPx}px / {PIXEL_LIMITS.descDesktop}px
          </span>
        </span>
        <textarea
          className="min-h-[80px] w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          value={value.metaDescription}
          onChange={(e) => patch({ metaDescription: e.target.value })}
          placeholder="توضیح کوتاه برای نتایج گوگل"
        />
      </label>

      <div className="flex flex-wrap gap-4 text-sm">
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={value.robotsIndex}
            onChange={(e) => patch({ robotsIndex: e.target.checked })}
          />
          index
        </label>
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={value.robotsFollow}
            onChange={(e) => patch({ robotsFollow: e.target.checked })}
          />
          follow
        </label>
      </div>

      <label className="block space-y-1 text-sm">
        <span>Canonical URL (اختیاری)</span>
        <input
          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          dir="ltr"
          value={value.canonicalUrl}
          onChange={(e) => patch({ canonicalUrl: e.target.value })}
          placeholder={displayUrl}
        />
      </label>

      <button
        type="button"
        onClick={() => setShowSocial((v) => !v)}
        className="text-sm text-accent hover:underline"
      >
        {showSocial ? "بستن Social / OG" : "Open Graph / Social"}
      </button>

      {showSocial && (
        <div className="space-y-3 rounded-xl border border-border p-4">
          <label className="block space-y-1 text-sm">
            <span>OG Title</span>
            <input
              className="w-full rounded-xl border border-border bg-background px-3 py-2"
              value={value.ogTitle}
              onChange={(e) => patch({ ogTitle: e.target.value })}
            />
          </label>
          <label className="block space-y-1 text-sm">
            <span>OG Description</span>
            <textarea
              className="min-h-[60px] w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
              value={value.ogDescription}
              onChange={(e) => patch({ ogDescription: e.target.value })}
            />
          </label>
          <label className="block space-y-1 text-sm">
            <span>OG Image URL</span>
            <input
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
              dir="ltr"
              value={value.ogImageUrl}
              onChange={(e) => patch({ ogImageUrl: e.target.value })}
              placeholder={imageUrl || "https://..."}
            />
          </label>
        </div>
      )}

      {/* Checks list */}
      <ul className="space-y-2 border-t border-border pt-4">
        {analysis.checks.map((c) => (
          <li key={c.id} className="flex items-start gap-2 text-sm">
            <span
              className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${statusDot(c.status)}`}
            />
            <div>
              <span className="font-medium">{c.label}</span>
              <span className="text-muted-foreground"> — {c.message}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
