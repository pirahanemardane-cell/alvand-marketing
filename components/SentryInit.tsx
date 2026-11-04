"use client";

import { useEffect } from "react";
import { initClientSentry } from "@/lib/observability";

/** Mount-once client Sentry bootstrap (no-op without NEXT_PUBLIC_SENTRY_DSN). */
export default function SentryInit() {
  useEffect(() => {
    void initClientSentry();
  }, []);
  return null;
}
