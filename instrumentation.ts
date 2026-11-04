export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs" || process.env.NEXT_RUNTIME === "edge") {
    const { initServerSentry } = await import("@/lib/observability");
    await initServerSentry();
  }
}
