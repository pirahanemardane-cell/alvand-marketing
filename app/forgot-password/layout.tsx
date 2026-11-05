import type { ReactNode } from "react";
import { privateRouteMetadata } from "@/lib/seo/private-layout";

export const metadata = privateRouteMetadata;

export default function ForgotPasswordLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
