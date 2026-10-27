#!/usr/bin/env python3
"""Apply: remove theme nav animation + CircularProgress page loader."""
from __future__ import annotations

import re
import subprocess
from pathlib import Path

ROOT = Path.cwd()


def main() -> None:
    # ── globals.css ──────────────────────────────────────────────
    g = ROOT / "app" / "globals.css"
    t = g.read_text(encoding="utf-8")
    t = t.replace(
        "  transition: background-color 0.6s ease, color 0.6s ease;\n",
        "  /* no theme color transition on navigation */\n",
    )
    if "--animate-spin-around" not in t:
        t += """

/* CircularProgress indeterminate */
:root {
  --animate-spin-around: spin-around 0.8s linear infinite;
}
@keyframes spin-around {
  0% { transform: rotate(-90deg); }
  100% { transform: rotate(270deg); }
}
"""
    g.write_text(t, encoding="utf-8")
    print("OK globals.css")

    # ── Navbar: strip layoutId toggle animation ──────────────────
    nav = ROOT / "components" / "Navbar.tsx"
    n = nav.read_text(encoding="utf-8")
    # Remove motion.span blocks with layoutId="nav-toggle-bg"
    n2 = re.sub(
        r"\s*\{mode === [\"']morning[\"'] && \(\s*<motion\.span[\s\S]*?layoutId=[\"']nav-toggle-bg[\"'][\s\S]*?/>\s*\)\}",
        "",
        n,
    )
    n2 = re.sub(
        r"\s*\{mode === [\"']night[\"'] && \(\s*<motion\.span[\s\S]*?layoutId=[\"']nav-toggle-bg[\"'][\s\S]*?/>\s*\)\}",
        "",
        n2,
    )
    # Fallback: replace any remaining layoutId spans with static span
    if "layoutId=\"nav-toggle-bg\"" in n2 or "layoutId='nav-toggle-bg'" in n2:
        n2 = re.sub(
            r"<motion\.span\s+layoutId=[\"']nav-toggle-bg[\"'][\s\S]*?/>",
            '<span className="absolute inset-0 rounded-full bg-accent" aria-hidden />',
            n2,
        )
    # Instant background on active toggle buttons
    n2 = n2.replace(
        "relative rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-medium transition-colors duration-300",
        "relative rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-medium",
    )
    # Add solid bg classes when mode matches (if not already using layoutId bg)
    # Ensure active state has bg-accent without animation
    for mode_name in ("morning", "night"):
        pattern = (
            rf"(onClick=\{{\(\) => setMode\(\"{mode_name}\"\)\}}\s*"
            rf"className=\{{`relative rounded-full[^`]*\$\{{"
            rf"mode === \"{mode_name}\"\s*\?\s*\")([^\"]*)(\")"
        )
        def _fix(m: re.Match[str], mn=mode_name) -> str:
            classes = m.group(2)
            if "bg-accent" not in classes:
                classes = "bg-accent text-accent-foreground " + classes
            return m.group(1) + classes + m.group(3)

        n2, c = re.subn(pattern, _fix, n2)
        if c:
            print(f"  toggle {mode_name} active bg patched ({c})")

    nav.write_text(n2, encoding="utf-8")
    print("OK Navbar.tsx (layoutId removed)" if n != n2 else "Navbar: no layoutId found or already clean")

    # ── circular-progress.tsx ────────────────────────────────────
    ui = ROOT / "components" / "ui"
    ui.mkdir(parents=True, exist_ok=True)
    (ui / "circular-progress.tsx").write_text(CIRCULAR_PROGRESS, encoding="utf-8")
    print("OK components/ui/circular-progress.tsx")

    # ── PageLoader ───────────────────────────────────────────────
    (ROOT / "components" / "PageLoader.tsx").write_text(PAGE_LOADER, encoding="utf-8")
    print("OK components/PageLoader.tsx")

    # ── app/loading.tsx ──────────────────────────────────────────
    (ROOT / "app" / "loading.tsx").write_text(APP_LOADING, encoding="utf-8")
    print("OK app/loading.tsx")

    # ── admin / dashboard loading blocks ─────────────────────────
    for rel in ("app/admin/page.tsx", "app/dashboard/page.tsx"):
        p = ROOT / rel
        if not p.exists():
            print(f"SKIP missing {rel}")
            continue
        t = p.read_text(encoding="utf-8")
        if "PageLoader" in t:
            print(f"{rel}: already has PageLoader")
            continue
        if 'from "@/components/Navbar"' in t:
            t = t.replace(
                'from "@/components/Navbar"',
                'from "@/components/Navbar";\nimport PageLoader from "@/components/PageLoader"',
                1,
            )
            # fix double semicolon if any
            t = t.replace(
                'from "@/components/Navbar";\nimport PageLoader from "@/components/PageLoader";',
                'from "@/components/Navbar";\nimport PageLoader from "@/components/PageLoader";',
            )
        elif "from '@/components/Navbar'" in t:
            t = t.replace(
                "from '@/components/Navbar'",
                "from '@/components/Navbar';\nimport PageLoader from '@/components/PageLoader'",
                1,
            )
        t2, n = re.subn(
            r"if \(loading\) \{\s*return \(\s*<main className=\"min-h-screen bg-background text-foreground\">\s*<Navbar />\s*<div className=\"min-h-\[50vh\] flex items-center justify-center\">\s*<p className=\"text-muted-foreground\">[^<]*</p>\s*</div>\s*<Footer />\s*</main>\s*\);\s*\}",
            """if (loading) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <Navbar />
        <PageLoader label="در حال بارگذاری..." />
        <Footer />
      </main>
    );
  }""",
            t,
            count=1,
        )
        if n:
            p.write_text(t2, encoding="utf-8")
            print(f"OK {rel} PageLoader")
        else:
            print(f"WARN {rel}: loading block not matched — edit manually if needed")

    # ── npm dep ──────────────────────────────────────────────────
    try:
        subprocess.run(
            ["npm", "ls", "@radix-ui/react-slot"],
            cwd=ROOT,
            check=True,
            capture_output=True,
        )
        print("OK @radix-ui/react-slot already installed")
    except subprocess.CalledProcessError:
        print("Installing @radix-ui/react-slot ...")
        subprocess.run(
            ["npm", "install", "@radix-ui/react-slot", "--save"],
            cwd=ROOT,
            check=True,
        )

    print("\nDone. Now run:")
    print("  git add -A && git status")
    print('  git commit -m "ui: remove theme toggle page animation; CircularProgress page loader"')
    print("  git push origin main")


CIRCULAR_PROGRESS = r'''"use client";

import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "@/lib/utils";

const CIRCULAR_PROGRESS_NAME = "CircularProgress";
const INDICATOR_NAME = "CircularProgressIndicator";
const TRACK_NAME = "CircularProgressTrack";
const RANGE_NAME = "CircularProgressRange";
const VALUE_TEXT_NAME = "CircularProgressValueText";
const DEFAULT_MAX = 100;

type ProgressState = "indeterminate" | "complete" | "loading";

function getProgressState(
  value: number | undefined | null,
  maxValue: number,
): ProgressState {
  return value == null
    ? "indeterminate"
    : value === maxValue
      ? "complete"
      : "loading";
}

function getIsValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function getIsValidMaxNumber(max: unknown): max is number {
  return getIsValidNumber(max) && max > 0;
}

function getIsValidValueNumber(
  value: unknown,
  min: number,
  max: number,
): value is number {
  return getIsValidNumber(value) && value <= max && value >= min;
}

function getDefaultValueText(value: number, min: number, max: number): string {
  const percentage = max === min ? 100 : ((value - min) / (max - min)) * 100;
  return `${Math.round(percentage)}%`;
}

interface CircularProgressContextValue {
  value: number | null;
  valueText: string | undefined;
  max: number;
  min: number;
  state: ProgressState;
  radius: number;
  thickness: number;
  size: number;
  center: number;
  circumference: number;
  percentage: number | null;
  valueTextId?: string;
}

const CircularProgressContext =
  React.createContext<CircularProgressContextValue | null>(null);

function useCircularProgressContext(consumerName: string) {
  const context = React.useContext(CircularProgressContext);
  if (!context) {
    throw new Error(
      `\`${consumerName}\` must be used within \`${CIRCULAR_PROGRESS_NAME}\``,
    );
  }
  return context;
}

interface CircularProgressProps extends React.ComponentProps<"div"> {
  value?: number | null | undefined;
  getValueText?(value: number, min: number, max: number): string;
  min?: number;
  max?: number;
  size?: number;
  thickness?: number;
  label?: string;
  asChild?: boolean;
}

function CircularProgress(props: CircularProgressProps) {
  const {
    value: valueProp = null,
    getValueText = getDefaultValueText,
    min: minProp = 0,
    max: maxProp,
    size = 48,
    thickness = 4,
    label,
    asChild,
    className,
    children,
    ...rootProps
  } = props;

  const rawMax = getIsValidMaxNumber(maxProp) ? maxProp : DEFAULT_MAX;
  const min = getIsValidNumber(minProp) ? minProp : 0;
  const max = rawMax <= min ? min + 1 : rawMax;

  const value = getIsValidValueNumber(valueProp, min, max)
    ? valueProp
    : getIsValidNumber(valueProp) && valueProp > max
      ? max
      : getIsValidNumber(valueProp) && valueProp < min
        ? min
        : null;

  const valueText = getIsValidNumber(value)
    ? getValueText(value, min, max)
    : undefined;

  const state = getProgressState(value, max);
  const radius = Math.max(0, (size - thickness) / 2);
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = getIsValidNumber(value)
    ? max === min
      ? 1
      : (value - min) / (max - min)
    : null;

  const labelId = React.useId();
  const valueTextId = React.useId();

  const contextValue = React.useMemo<CircularProgressContextValue>(
    () => ({
      value,
      valueText,
      max,
      min,
      state,
      radius,
      thickness,
      size,
      center,
      circumference,
      percentage,
      valueTextId,
    }),
    [
      value,
      valueText,
      max,
      min,
      state,
      radius,
      thickness,
      size,
      center,
      circumference,
      percentage,
      valueTextId,
    ],
  );

  const RootPrimitive = asChild ? Slot : "div";

  return (
    <CircularProgressContext.Provider value={contextValue}>
      <RootPrimitive
        role="progressbar"
        aria-describedby={valueText ? valueTextId : undefined}
        aria-labelledby={label ? labelId : undefined}
        aria-valuemax={max}
        aria-valuemin={min}
        aria-valuenow={getIsValidNumber(value) ? value : undefined}
        aria-valuetext={valueText}
        data-state={state}
        data-value={value ?? undefined}
        data-max={max}
        data-min={min}
        data-percentage={percentage}
        {...rootProps}
        className={cn(
          "relative inline-flex w-fit items-center justify-center",
          className,
        )}
      >
        {children}
        {label && <div id={labelId}>{label}</div>}
      </RootPrimitive>
    </CircularProgressContext.Provider>
  );
}

function CircularProgressIndicator(props: React.ComponentProps<"svg">) {
  const { className, ...indicatorProps } = props;
  const context = useCircularProgressContext(INDICATOR_NAME);

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={`0 0 ${context.size} ${context.size}`}
      data-state={context.state}
      data-value={context.value ?? undefined}
      data-max={context.max}
      data-min={context.min}
      data-percentage={context.percentage}
      width={context.size}
      height={context.size}
      {...indicatorProps}
      className={cn("-rotate-90 transform", className)}
    />
  );
}
CircularProgressIndicator.displayName = INDICATOR_NAME;

function CircularProgressTrack(props: React.ComponentProps<"circle">) {
  const { className, ...trackProps } = props;
  const context = useCircularProgressContext(TRACK_NAME);

  return (
    <circle
      data-state={context.state}
      cx={context.center}
      cy={context.center}
      r={context.radius}
      fill="none"
      stroke="currentColor"
      strokeWidth={context.thickness}
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
      {...trackProps}
      className={cn("text-muted-foreground/20", className)}
    />
  );
}

function CircularProgressRange(props: React.ComponentProps<"circle">) {
  const { className, ...rangeProps } = props;
  const context = useCircularProgressContext(RANGE_NAME);

  const strokeDasharray = context.circumference;
  const strokeDashoffset =
    context.state === "indeterminate"
      ? context.circumference * 0.75
      : context.percentage !== null
        ? context.circumference - context.percentage * context.circumference
        : context.circumference;

  return (
    <circle
      data-state={context.state}
      data-value={context.value ?? undefined}
      data-max={context.max}
      data-min={context.min}
      cx={context.center}
      cy={context.center}
      r={context.radius}
      fill="none"
      stroke="currentColor"
      strokeWidth={context.thickness}
      strokeLinecap="round"
      strokeDasharray={strokeDasharray}
      strokeDashoffset={strokeDashoffset}
      vectorEffect="non-scaling-stroke"
      {...rangeProps}
      className={cn(
        "origin-center text-accent transition-all duration-300 ease-in-out",
        context.state === "indeterminate" &&
          "motion-reduce:animate-none motion-safe:[animation:var(--animate-spin-around)]",
        className,
      )}
    />
  );
}

interface CircularProgressValueTextProps extends React.ComponentProps<"span"> {
  asChild?: boolean;
}

function CircularProgressValueText(props: CircularProgressValueTextProps) {
  const { asChild, className, children, ...valueTextProps } = props;
  const context = useCircularProgressContext(VALUE_TEXT_NAME);
  const ValueTextPrimitive = asChild ? Slot : "span";

  return (
    <ValueTextPrimitive
      id={context.valueTextId}
      data-state={context.state}
      {...valueTextProps}
      className={cn(
        "absolute inset-0 flex items-center justify-center font-medium text-sm text-foreground",
        className,
      )}
    >
      {children ?? context.valueText}
    </ValueTextPrimitive>
  );
}

function CircularProgressCombined(props: CircularProgressProps) {
  return (
    <CircularProgress {...props}>
      <CircularProgressIndicator>
        <CircularProgressTrack />
        <CircularProgressRange />
      </CircularProgressIndicator>
      <CircularProgressValueText />
    </CircularProgress>
  );
}

export {
  CircularProgress,
  CircularProgressCombined,
  CircularProgressIndicator,
  type CircularProgressProps,
  CircularProgressRange,
  CircularProgressTrack,
  CircularProgressValueText,
};

export default CircularProgress;
'''

PAGE_LOADER = r'''"use client";

import {
  CircularProgress,
  CircularProgressIndicator,
  CircularProgressRange,
  CircularProgressTrack,
} from "@/components/ui/circular-progress";

export default function PageLoader({
  label = "در حال بارگذاری...",
  size = 56,
}: {
  label?: string;
  size?: number;
}) {
  return (
    <div className="flex min-h-[50vh] w-full flex-col items-center justify-center gap-4 bg-background text-foreground">
      <CircularProgress value={null} size={size} thickness={4} label={label}>
        <CircularProgressIndicator>
          <CircularProgressTrack />
          <CircularProgressRange />
        </CircularProgressIndicator>
      </CircularProgress>
      {label ? (
        <p className="text-sm text-muted-foreground">{label}</p>
      ) : null}
    </div>
  );
}
'''

APP_LOADING = r'''import PageLoader from "@/components/PageLoader";

export default function Loading() {
  return <PageLoader />;
}
'''


if __name__ == "__main__":
    main()
