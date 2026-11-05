export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs" || process.env.NEXT_RUNTIME === "edge") {
    const { initServerSentry } = await import("@/lib/observability");
    await initServerSentry();
  }
}

/** Catch unhandled App Router / route errors when a DSN is set (no-op otherwise). */
export async function onRequestError(
  err: unknown,
  request: { path: string; method: string },
  context: { routerKind: string; routePath: string; routeType: string }
) {
  const { captureException } = await import("@/lib/observability");
  await captureException(err, {
    path: request.path,
    method: request.method,
    routerKind: context.routerKind,
    routePath: context.routePath,
    routeType: context.routeType,
  });
}
