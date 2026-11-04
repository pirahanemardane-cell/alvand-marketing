/**
 * Optional Sentry-compatible error reporting.
 * No-ops when SENTRY_DSN / NEXT_PUBLIC_SENTRY_DSN are unset.
 * Uses a lightweight ingest POST (no @sentry/nextjs — keeps production builds warning-free).
 *
 * Env / secret names:
 * - SENTRY_DSN (server)
 * - NEXT_PUBLIC_SENTRY_DSN (browser)
 */

type ParsedDsn = {
  publicKey: string;
  host: string;
  projectId: string;
};

function activeDsn(): string | undefined {
  return process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN || undefined;
}

function parseDsn(dsn: string): ParsedDsn | null {
  try {
    const u = new URL(dsn);
    const publicKey = u.username;
    const projectId = u.pathname.replace(/^\//, "").split("/")[0];
    if (!publicKey || !projectId || !u.host) return null;
    return { publicKey, host: u.host, projectId };
  } catch {
    return null;
  }
}

let serverReady = false;
let clientReady = false;

/** Server/edge bootstrap — no heavy SDK. */
export async function initServerSentry(): Promise<void> {
  if (!activeDsn()) return;
  serverReady = true;
}

/** Client bootstrap — no heavy SDK. */
export async function initClientSentry(): Promise<void> {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;
  clientReady = true;
}

export async function captureException(
  err: unknown,
  extra?: Record<string, unknown>
): Promise<void> {
  const dsn = activeDsn();
  if (!dsn) return;
  const parsed = parseDsn(dsn);
  if (!parsed) return;

  const message =
    err instanceof Error
      ? err.message
      : typeof err === "string"
        ? err
        : "Unknown error";
  const stack = err instanceof Error ? err.stack : undefined;

  const event = {
    event_id: crypto.randomUUID().replace(/-/g, ""),
    timestamp: Date.now() / 1000,
    platform: "javascript",
    level: "error",
    server_name:
      typeof process !== "undefined" ? process.env.VERCEL_URL || "alvand" : "browser",
    exception: {
      values: [
        {
          type: err instanceof Error ? err.name : "Error",
          value: message,
          stacktrace: stack
            ? {
                frames: stack
                  .split("\n")
                  .slice(1, 12)
                  .map((line) => ({ filename: line.trim(), function: "?" })),
              }
            : undefined,
        },
      ],
    },
    extra: extra || undefined,
    tags: {
      runtime: typeof window === "undefined" ? "server" : "browser",
      sentry_init: String(serverReady || clientReady),
    },
  };

  const url = `https://${parsed.host}/api/${parsed.projectId}/store/`;
  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Sentry-Auth": `Sentry sentry_version=7, sentry_key=${parsed.publicKey}, sentry_client=alvand-lite/1.0`,
      },
      body: JSON.stringify(event),
      // Don't hang requests on observability
      signal: AbortSignal.timeout(2500),
    });
  } catch {
    // never throw from observability
  }
}
