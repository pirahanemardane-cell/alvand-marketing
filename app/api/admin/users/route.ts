import { NextResponse } from "next/server";
import {
  createServiceClientOrThrow,
  hasServiceEnv,
  requireAdminUser,
} from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/admin";

export async function GET() {
  const user = await requireAdminUser();
  if (!user) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  if (!hasServiceEnv()) {
    return NextResponse.json(
      { error: "supabase_not_configured" },
      { status: 503 }
    );
  }

  try {
    const service = createServiceClientOrThrow();
    const { data: profiles, error } = await service
      .from("profiles")
      .select("id, full_name, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Enrich with Auth emails (service role). Fail soft if listUsers unavailable.
    const emailById = new Map<string, string>();
    try {
      const { data: listed, error: listErr } =
        await service.auth.admin.listUsers({ page: 1, perPage: 200 });
      if (!listErr && listed?.users) {
        for (const u of listed.users) {
          if (u.email) emailById.set(u.id, u.email);
        }
      }
    } catch {
      // ignore enrichment failure
    }

    const users = (profiles ?? []).map((p) => {
      const email = emailById.get(p.id) ?? null;
      return {
        ...p,
        email,
        role: isAdminEmail(email) ? "admin" : "user",
      };
    });

    return NextResponse.json({ users });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
