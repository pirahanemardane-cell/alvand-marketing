/**
 * The only admin account. profiles.role is kept in sync in the database,
 * but authorization never trusts that column or user_metadata: a signed-in
 * user must present this email from the Auth user record.
 */
export const ADMIN_EMAILS = ["alvandmarketing.com@gmail.com"] as const;

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return ADMIN_EMAILS.some((allowed) => allowed === normalized);
}

export function isAdminRole(role?: string | null): boolean {
  return role === "admin";
}

/**
 * Admin is the designated email only. `role` is accepted so existing
 * call sites keep compiling; it does not grant access.
 */
export function isAdminAccount(opts: {
  email?: string | null;
  role?: string | null;
}): boolean {
  void opts.role;
  return isAdminEmail(opts.email);
}

/** Minimal query surface — accepts browser/server/middleware Supabase clients. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabase = { from: (table: string) => any };

/**
 * Admin gate. `client` is unused: profiles.role must not widen the allowlist.
 */
export async function resolveIsAdmin(
  client: AnySupabase,
  user: { id: string; email?: string | null }
): Promise<boolean> {
  void client;
  return isAdminEmail(user.email);
}
