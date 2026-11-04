import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
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
    const name = String(body.name ?? "").trim().slice(0, 80);
    const phone = String(body.phone ?? "").trim().slice(0, 40);
    const message = String(body.message ?? "").trim().slice(0, 2000);

    if (name.length < 2 || phone.length < 8) {
      return NextResponse.json(
        { error: "نام و شماره تماس را کامل وارد کنید." },
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
      // Table may not exist yet — surface clear message
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
    const msg = e instanceof Error ? e.message : "خطا در ثبت پیام";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
