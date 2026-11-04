import { NextResponse } from "next/server";
import {
  createServiceClientOrThrow,
  hasServiceEnv,
  requireAdminUser,
} from "@/lib/supabase/admin";
import { isAdminAccount } from "@/lib/admin";

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
    // role column is additive — fall back if migration not applied yet
    let profiles: {
      id: string;
      full_name: string | null;
      created_at: string;
      role?: string | null;
    }[] | null = null;
    let error: { message: string } | null = null;

    {
      const res = await service
        .from("profiles")
        .select("id, full_name, created_at, role")
        .order("created_at", { ascending: false });
      if (res.error && /role/i.test(res.error.message)) {
        const fallback = await service
          .from("profiles")
          .select("id, full_name, created_at")
          .order("created_at", { ascending: false });
        profiles = fallback.data;
        error = fallback.error;
      } else {
        profiles = res.data;
        error = res.error;
      }
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Enrich with Auth emails (service role). Paginate; fail soft if unavailable.
    const emailById = new Map<string, string>();
    try {
      for (let page = 1; page <= 20; page++) {
        const { data: listed, error: listErr } =
          await service.auth.admin.listUsers({ page, perPage: 200 });
        if (listErr || !listed?.users?.length) break;
        for (const u of listed.users) {
          if (u.email) emailById.set(u.id, u.email);
        }
        if (listed.users.length < 200) break;
      }
    } catch {
      // ignore enrichment failure
    }

    const users = (profiles ?? []).map((p) => {
      const email = emailById.get(p.id) ?? null;
      const role = isAdminAccount({ email, role: p.role }) ? "admin" : "user";
      return {
        ...p,
        email,
        role,
      };
    });

    return NextResponse.json({ users });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
