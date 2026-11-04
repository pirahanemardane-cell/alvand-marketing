import { redirect } from "next/navigation";

/**
 * Natural URL people type or bookmark. Create UI lives on `/admin/blog`
 * (inline draft form) — avoid falling through to `[id]` with id="new".
 */
export default function AdminBlogNewPage() {
  redirect("/admin/blog?create=1");
}
