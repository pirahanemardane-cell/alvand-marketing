"use client";

import { useState } from "react";

/**
 * Markdown / in-body figure: landscape fills the content column;
 * portrait stays centered with a sensible max width (no awkward stretch).
 */
export default function ContentBodyFigure({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  const [portrait, setPortrait] = useState(false);

  return (
    <figure
      className={
        portrait
          ? "my-6 mx-auto flex w-full max-w-md flex-col items-center"
          : "my-6 mx-auto flex w-full flex-col items-center"
      }
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="mx-auto h-auto w-full object-contain"
        loading="lazy"
        onLoad={(e) => {
          const el = e.currentTarget;
          if (el.naturalWidth > 0 && el.naturalHeight >= el.naturalWidth) {
            setPortrait(true);
          }
        }}
      />
      {caption ? (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground leading-persian">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
