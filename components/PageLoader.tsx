"use client";

import {
  CircularProgress,
  CircularProgressIndicator,
  CircularProgressRange,
  CircularProgressTrack,
} from "@/components/ui/circular-progress";

export default function PageLoader({
  label,
  size = 56,
  fullScreen = true,
}: {
  label?: string;
  size?: number;
  fullScreen?: boolean;
}) {
  return (
    <div
      className={
        fullScreen
          ? "fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-background text-foreground"
          : "flex min-h-[40vh] w-full flex-col items-center justify-center gap-4 bg-background text-foreground"
      }
      role="status"
      aria-live="polite"
    >
      <CircularProgress value={null} size={size} thickness={4} label={label ?? "بارگذاری"}>
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
