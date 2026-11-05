/**
 * Optional email notify for contact form submissions via Resend.
 * No-ops cleanly when RESEND_API_KEY or CONTACT_NOTIFY_EMAIL is unset.
 *
 * Env / secret names (never commit values):
 * - RESEND_API_KEY
 * - CONTACT_NOTIFY_EMAIL
 * - CONTACT_NOTIFY_FROM (optional; defaults to onboarding@resend.dev)
 */

export type ContactLeadPayload = {
  name: string;
  phone: string;
  message: string;
};

/** Strip control chars so email bodies stay plain text. */
function plain(value: string, max = 2000): string {
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").slice(0, max);
}

export async function notifyContactLead(
  lead: ContactLeadPayload
): Promise<"sent" | "skipped" | "failed"> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.CONTACT_NOTIFY_EMAIL?.trim();
  if (!apiKey || !to) return "skipped";

  const from =
    process.env.CONTACT_NOTIFY_FROM?.trim() || "Alvand Contact <onboarding@resend.dev>";

  const name = plain(lead.name, 80);
  const phone = plain(lead.phone, 40);
  const message = plain(lead.message || "(خالی)", 2000);

  const text = [
    "پیام جدید از فرم تماس الوند مارکتینگ",
    "",
    `نام: ${name}`,
    `تلفن: ${phone}`,
    `پیام: ${message}`,
  ].join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `فرم تماس: ${name}`,
        text,
      }),
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return "failed";
    return "sent";
  } catch {
    return "failed";
  }
}
