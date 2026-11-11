import Image from "next/image";
import type { ServiceImageAsset, ServiceImageSet } from "@/lib/service-images";
import { serviceImageSrc } from "@/lib/service-images";

function isLandscape(image: ServiceImageAsset): boolean {
  return image.width > image.height;
}

/** Shared frame for featured + inline: landscape fills column; portrait capped. */
function imageFrameClass(
  landscape: boolean,
  isPackageInfographic: boolean
): string {
  if (isPackageInfographic) {
    return "relative w-full overflow-hidden rounded-2xl border border-border bg-muted";
  }
  return landscape
    ? "relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border bg-muted"
    : "relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-border bg-muted";
}

function landscapeSizes(landscape: boolean): string {
  return landscape
    ? "(max-width: 768px) 100vw, (max-width: 1280px) 92vw, 1400px"
    : "(max-width: 640px) 100vw, 28rem";
}

/** Featured / index image (hero). Eager when priority. */
export function ServiceFeaturedImage({
  image,
  priority,
  className,
}: {
  image: ServiceImageAsset;
  priority?: boolean;
  className?: string;
}) {
  const isPackageInfographic =
    image.path.includes("images/plp/") || image.path.includes("images/pdp/");
  const landscape = isLandscape(image);
  return (
    <figure
      className={`mx-auto flex w-full flex-col items-center ${
        landscape ? "" : "max-w-md"
      } ${className ?? ""}`}
    >
      <div className={imageFrameClass(landscape, isPackageInfographic)}>
        <Image
          src={serviceImageSrc(image)}
          alt={image.alt}
          title={image.alt}
          width={image.width}
          height={image.height}
          sizes={landscapeSizes(landscape)}
          className={
            isPackageInfographic
              ? "mx-auto h-auto w-full object-contain"
              : "h-full w-full object-cover"
          }
          priority={priority}
        />
      </div>
      <figcaption className="sr-only">{image.alt}</figcaption>
    </figure>
  );
}

/**
 * Single related image placed under a content heading (lazy, light sizes).
 * Not a gallery strip — one image nested in its section.
 * Landscape: same full-width centered treatment as featured. Portrait: capped.
 */
export function ServiceInlineImage({
  image,
  className,
}: {
  image: ServiceImageAsset;
  className?: string;
}) {
  const isPackageInfographic =
    image.path.includes("images/plp/") || image.path.includes("images/pdp/");
  const landscape = isLandscape(image);
  return (
    <figure
      className={`mx-auto mt-5 mb-2 flex w-full flex-col items-center ${
        landscape ? "" : "max-w-md"
      } ${className ?? ""}`}
    >
      <div className={imageFrameClass(landscape, isPackageInfographic)}>
        <Image
          src={serviceImageSrc(image)}
          alt={image.alt}
          title={image.alt}
          width={image.width}
          height={image.height}
          sizes={landscapeSizes(landscape)}
          className={
            isPackageInfographic
              ? "mx-auto h-auto w-full object-contain"
              : "h-full w-full object-cover"
          }
          loading="lazy"
        />
      </div>
      <figcaption className="sr-only">{image.alt}</figcaption>
    </figure>
  );
}

/** Hub page hero featured image. */
export function ServiceHubHeroImage({ images }: { images: ServiceImageSet }) {
  return (
    <ServiceFeaturedImage
      image={images.featured}
      priority
      className="mb-10 w-full"
    />
  );
}

/** Hub / listing card thumbnail (featured). */
export function ServiceCardImage({ image }: { image: ServiceImageAsset }) {
  return (
    <div className="relative mb-4 aspect-[16/10] w-full overflow-hidden rounded-xl border border-border bg-muted">
      <Image
        src={serviceImageSrc(image)}
        alt={image.alt}
        title={image.alt}
        width={image.width}
        height={image.height}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        loading="lazy"
      />
    </div>
  );
}

/** PDP featured (تصویر شاخص) only. */
export function ServicePdpFeatured({ images }: { images: ServiceImageSet }) {
  return (
    <ServiceFeaturedImage
      image={images.featured}
      priority
      className="mb-12 w-full"
    />
  );
}
