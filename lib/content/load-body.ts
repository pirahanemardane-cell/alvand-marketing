import { readFileSync } from "node:fs";
import path from "node:path";

const BODIES_ROOT = path.join(process.cwd(), "lib/content/bodies");

/** Load a package markdown body by relative path under lib/content/bodies. */
export function loadPackageBody(bodyFile: string | undefined | null): string {
  if (!bodyFile) return "";
  const full = path.join(BODIES_ROOT, bodyFile);
  try {
    return readFileSync(full, "utf8");
  } catch {
    return "";
  }
}
