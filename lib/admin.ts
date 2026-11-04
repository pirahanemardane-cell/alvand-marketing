/** Shared admin gate — email allowlist remains a migrate fallback next to profiles.role. */
export const ADMIN_EMAILS = ["alvandmarketing.com@gmail.com"] as const;

export function isAdminEmail(email?: string | null): boolean {
  return Boolean(
    email && ADMIN_EMAILS.includes(email as (typeof ADMIN_EMAILS)[number])
  );
}

export function isAdminRole(role?: string | null): boolean {
  return role === "admin";
}

/** Sync check when both email and role are already known. */
export function isAdminAccount(opts: {
  email?: string | null;
  role?: string | null;
}): boolean {
  return isAdminEmail(opts.email) || isAdminRole(opts.role);
}

/** Minimal query surface — accepts browser/server/middleware Supabase clients. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabase = { from: (table: string) => any };

/**
 * Email allowlist OR profiles.role = 'admin'.
 * Safe if the role column is missing (falls back to email only).
 */
export async function resolveIsAdmin(
  client: AnySupabase,
  user: { id: string; email?: string | null }
): Promise<boolean> {
  if (isAdminEmail(user.email)) return true;
  try {
    const { data, error } = await client
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    if (error || !data) return false;
    return isAdminRole((data as { role?: string | null }).role);
  } catch {
    return false;
  }
}
