import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import {
  CONTACT_LIMIT,
  clientIp,
  rateLimit,
} from "@/lib/rate-limit";
import { captureException } from "@/lib/observability";

function countUrls(text: string): number {
  return (text.match(/https?:\/\/|www\./gi) || []).length;
}

export async function POST(request: Request) {
  try {
    const ip = clientIp(request);
    const limited = rateLimit(
      `contact:${ip}`,
      CONTACT_LIMIT.limit,
      CONTACT_LIMIT.windowMs
    );
    if (!limited.ok) {
      return NextResponse.json(
        { error: "تعداد درخواست‌ها زیاد است. کمی بعد دوباره تلاش کنید." },
        {
          status: 429,
          headers: { "Retry-After": String(limited.retryAfterSec) },
        }
      );
    }

    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      return NextResponse.json(
        { error: "supabase_not_configured" },
        { status: 503 }
      );
    }

    const body = await request.json();

    // Honeypot — bots fill hidden "website" field; humans never see it.
    const honey = String(body.website ?? body.company_url ?? "").trim();
    if (honey) {
      return NextResponse.json({
        ok: true,
        message: "پیام شما ثبت شد و به‌زودی تماس می‌گیریم.",
      });
    }

    const name = String(body.name ?? "").trim().slice(0, 80);
    const phone = String(body.phone ?? "").trim().slice(0, 40);
    const message = String(body.message ?? "").trim().slice(0, 2000);

    if (name.length < 2 || phone.length < 8) {
      return NextResponse.json(
        { error: "نام و شماره تماس را کامل وارد کنید." },
        { status: 400 }
      );
    }

    // Basic phone sanity (IR mobile / landline digits, optional +98)
    const phoneDigits = phone.replace(/[^\d+]/g, "");
    if (phoneDigits.replace(/\D/g, "").length < 8) {
      return NextResponse.json(
        { error: "شماره تماس معتبر نیست." },
        { status: 400 }
      );
    }

    if (countUrls(name) > 0 || countUrls(message) > 2) {
      return NextResponse.json(
        { error: "پیام نامعتبر است." },
        { status: 400 }
      );
    }

    const service = createServiceClient();
    const { error } = await service.from("contact_leads").insert({
      name,
      phone,
      message: message || null,
    });

    if (error) {
      return NextResponse.json(
        {
          error:
            error.message.includes("contact_leads")
              ? "جدول تماس هنوز در سوپابیس ساخته نشده؛ supabase/leads.sql را اجرا کنید."
              : error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "پیام شما ثبت شد و به‌زودی تماس می‌گیریم.",
    });
  } catch (e) {
    void captureException(e, { route: "/api/contact" });
    const msg = e instanceof Error ? e.message : "خطا در ثبت پیام";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
