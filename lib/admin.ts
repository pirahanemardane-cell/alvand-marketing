/** Shared admin gate — keep in sync with Supabase Auth allow-list. */
export const ADMIN_EMAILS = ["alvandmarketing.com@gmail.com"] as const;

export function isAdminEmail(email?: string | null): boolean {
  return Boolean(email && ADMIN_EMAILS.includes(email as (typeof ADMIN_EMAILS)[number]));
}
