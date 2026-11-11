import { absoluteUrl } from "@/lib/seo/site";

/**
 * Organization / contact facts — ONLY from project source (contact page, footer).
 * Do not invent street address; contact page has city only (تهران).
 */
export const SITE_ORG = {
  name: "الوند مارکتینگ",
  alternateName: "Alvand Marketing",
  url: "https://alvandmarketing.ir/",
  /** Logo used in header/footer via public icon fallback for schema */
  logoPath: "/icon.png",
  email: "info@alvandmarketing.ir",
  telephones: ["+982186095954", "+989921863063"] as const,
  sameAs: ["https://t.me/alvandmarketing"] as const,
  addressLocality: "تهران",
  addressCountry: "IR",
  authorName: "امیر شادکام نژاد",
  authorId: "amir-shadkam-nejad",
} as const;

export function organizationNode() {
  const orgId = "https://alvandmarketing.ir/#organization";
  return {
    "@type": "Organization",
    "@id": orgId,
    name: SITE_ORG.name,
    alternateName: SITE_ORG.alternateName,
    url: SITE_ORG.url,
    logo: absoluteUrl(SITE_ORG.logoPath),
    email: SITE_ORG.email,
    telephone: [...SITE_ORG.telephones],
    sameAs: [...SITE_ORG.sameAs],
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE_ORG.addressLocality,
      addressCountry: SITE_ORG.addressCountry,
    },
    contactPoint: SITE_ORG.telephones.map((telephone) => ({
      "@type": "ContactPoint",
      contactType: "customer support",
      telephone,
      availableLanguage: ["fa"],
      email: SITE_ORG.email,
    })),
    areaServed: {
      "@type": "Country",
      name: "Iran",
      identifier: "IR",
    },
  };
}

export function authorPersonNode() {
  return {
    "@type": "Person",
    "@id": `https://alvandmarketing.ir/#author-${SITE_ORG.authorId}`,
    name: SITE_ORG.authorName,
    worksFor: { "@id": "https://alvandmarketing.ir/#organization" },
  };
}
