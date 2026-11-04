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

export async function notifyContactLead(
  lead: ContactLeadPayload
): Promise<"sent" | "skipped" | "failed"> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.CONTACT_NOTIFY_EMAIL?.trim();
  if (!apiKey || !to) return "skipped";

  const from =
    process.env.CONTACT_NOTIFY_FROM?.trim() || "Alvand Contact <onboarding@resend.dev>";

  const text = [
    "پیام جدید از فرم تماس الوند مارکتینگ",
    "",
    `نام: ${lead.name}`,
    `تلفن: ${lead.phone}`,
    `پیام: ${lead.message || "(خالی)"}`,
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
        subject: `فرم تماس: ${lead.name}`,
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
