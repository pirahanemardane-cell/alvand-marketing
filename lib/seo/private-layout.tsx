import type { Metadata } from "next";
import { privateRobots } from "@/lib/seo/site";

export const privateRouteMetadata: Metadata = {
  robots: privateRobots,
};
