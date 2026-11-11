import Image from "next/image";
import type { ServiceImageAsset, ServiceImageSet } from "@/lib/service-images";
import { serviceImageSrc } from "@/lib/service-images";

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
  const isPlpPackage = image.path.includes("images/plp/");
  return (
    <figure
      className={`mx-auto flex w-full flex-col items-center ${className ?? ""}`}
    >
      <div
        className={
          isPlpPackage
            ? "relative w-full max-w-5xl overflow-hidden rounded-2xl border border-border bg-muted"
            : "relative aspect-[16/9] w-full max-w-5xl overflow-hidden rounded-2xl border border-border bg-muted"
        }
      >
        <Image
          src={serviceImageSrc(image)}
          alt={image.alt}
          title={image.alt}
          width={image.width}
          height={image.height}
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 1200px"
          className={
            isPlpPackage
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
 */
export function ServiceInlineImage({
  image,
  className,
}: {
  image: ServiceImageAsset;
  className?: string;
}) {
  const isPlpPackage = image.path.includes("images/plp/");
  return (
    <figure
      className={
        className ??
        "mx-auto mt-5 mb-2 flex w-full max-w-3xl flex-col items-center"
      }
    >
      <div
        className={
          isPlpPackage
            ? "relative w-full overflow-hidden rounded-xl border border-border bg-muted"
            : "relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-border bg-muted"
        }
      >
        <Image
          src={serviceImageSrc(image)}
          alt={image.alt}
          title={image.alt}
          width={image.width}
          height={image.height}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 70vw, 900px"
          className={
            isPlpPackage
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
