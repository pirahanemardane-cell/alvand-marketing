import "server-only";
import {
  getServiceBySlug,
  servicesOverview,
  type Service,
  type ServicesOverview,
} from "@/lib/services";
import { loadPackageBody } from "@/lib/content/load-body";

/** Hub overview with markdown body loaded from disk (server-only). */
export function getServicesOverviewWithBody(): ServicesOverview {
  return {
    ...servicesOverview,
    contentMd: loadPackageBody(servicesOverview.bodyFile),
  };
}

/** Resolve a service and attach its markdown body (server-only). */
export function getServiceBySlugWithBody(slug: string): Service | undefined {
  const base = getServiceBySlug(slug);
  if (!base) return undefined;
  return {
    ...base,
    contentMd: loadPackageBody(base.bodyFile),
  };
}
