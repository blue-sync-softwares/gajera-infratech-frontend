'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Icon } from '@iconify/react';

type Props = { images: string[] };

export default function GalleryGrid({ images = [] }: Props) {
  const [lightbox, setLightbox] = useState<string | null>(null);

  if (!images.length) {
    return <p className="text-gray">No images available.</p>;
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setLightbox(src)}
            className="rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm"
            aria-label={`Open image ${i + 1}`}
          >
            <div className="w-full h-40 relative">
              <Image src={src} alt={`img-${i}`} fill className="object-cover" />
            </div>
          </button>
        ))}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="relative max-w-4xl w-full max-h-full" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute top-3 right-3 z-60 text-white bg-black/40 hover:bg-black/60 rounded-full p-2"
              onClick={() => setLightbox(null)}
              aria-label="Close image"
            >
              <Icon icon="mdi:close" className="w-6 h-6" />
            </button>

            <div className="w-full h-[80vh] md:h-[85vh] relative rounded-md overflow-hidden">
              <Image src={lightbox} alt="Enlarged" fill className="object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}