import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function isAdmin(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  // fallback: check via cookie session is complex; we trust client for now
  // and use service role only after simple gate in page
  return true;
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, approved } = await req.json();
    if (!id || typeof approved !== 'boolean') {
      return NextResponse.json({ error: 'invalid' }, { status: 400 });
    }

    const supabase = getAdminClient();
    const { error } = await supabase
      .from('blog_comments')
      .update({ approved })
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'invalid' }, { status: 400 });
    }

    const supabase = getAdminClient();
    const { error } = await supabase.from('blog_comments').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
