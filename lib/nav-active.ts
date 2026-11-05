/**
 * Pathname/hash matching for Alvand site nav (App Router).
 * Hash links like `/#process` are current only on `/` with that fragment.
 * Section hubs (`/services`, `/blog`) stay current for nested routes unless `exact`.
 */
export function isNavItemActive(
  href: string,
  pathname: string,
  hash = "",
  options?: { exact?: boolean }
): boolean {
  let path = pathname || "/";
  try {
    path = decodeURIComponent(path);
  } catch {
    /* keep raw pathname */
  }
  const frag = hash.startsWith("#") ? hash.slice(1) : hash;

  if (href.includes("#")) {
    const [baseRaw, section = ""] = href.split("#");
    const base = baseRaw === "" ? "/" : baseRaw;
    if (path !== base) return false;
    return frag === section;
  }

  if (href === "/") {
    // Home is current only with no in-page section hash
    return path === "/" && !frag;
  }

  if (options?.exact) {
    return path === href;
  }

  return path === href || path.startsWith(`${href}/`);
}
