import Image from "next/image";
import type { ServiceImageAsset, ServiceImageSet } from "@/lib/service-images";
import { serviceImageSrc } from "@/lib/service-images";

function FeaturedImage({
  image,
  priority,
  className,
}: {
  image: ServiceImageAsset;
  priority?: boolean;
  className?: string;
}) {
  return (
    <figure className={className}>
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border bg-muted">
        <Image
          src={serviceImageSrc(image)}
          alt={image.alt}
          title={image.alt}
          width={image.width}
          height={image.height}
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
          className="h-full w-full object-cover"
          priority={priority}
        />
      </div>
      <figcaption className="sr-only">{image.alt}</figcaption>
    </figure>
  );
}

export function ServiceRelatedGallery({
  images,
}: {
  images: ServiceImageAsset[];
}) {
  return (
    <section className="mb-14 w-full" aria-label="تصاویر مرتبط">
      <h2 className="text-xl font-bold mb-4 leading-persian-tight">
        تصاویر مرتبط
      </h2>
      <div className="grid sm:grid-cols-3 gap-4 w-full">
        {images.map((image) => (
          <figure key={image.path} className="min-w-0">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-muted">
              <Image
                src={serviceImageSrc(image)}
                alt={image.alt}
                title={image.alt}
                width={image.width}
                height={image.height}
                sizes="(max-width: 640px) 100vw, 33vw"
                className="h-full w-full object-cover"
              />
            </div>
            <figcaption className="mt-2 text-caption text-muted-foreground line-clamp-2 leading-persian">
              {image.alt}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

/** Hub page hero featured image. */
export function ServiceHubHeroImage({ images }: { images: ServiceImageSet }) {
  return (
    <FeaturedImage
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
      />
    </div>
  );
}

/** PDP featured (تصویر شاخص) only. */
export function ServicePdpFeatured({ images }: { images: ServiceImageSet }) {
  return (
    <FeaturedImage
      image={images.featured}
      priority
      className="mb-12 w-full"
    />
  );
}

/** PDP featured + related gallery (single block). */
export function ServicePdpImages({ images }: { images: ServiceImageSet }) {
  return (
    <>
      <ServicePdpFeatured images={images} />
      <ServiceRelatedGallery images={[...images.related]} />
    </>
  );
}
