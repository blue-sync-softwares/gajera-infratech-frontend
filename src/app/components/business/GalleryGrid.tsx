'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Icon } from '@iconify/react';

type GalleryImage = {
  image_title: string;
  image_src: { url: string };
  type_of_image: string;
};

type Props = { 
  images: GalleryImage[];
};

export default function GalleryGrid({ images = [] }: Props) {
  const [lightbox, setLightbox] = useState<string | null>(null);

  if (!images.length) {
    return <p className="text-gray">No images available.</p>;
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((item, i) => (
          <button
            key={i}
            onClick={() => setLightbox(item.image_src.url)}
            className="rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm"
            aria-label={`Open ${item.image_title}`}
          >
            <div className="w-full h-40 relative">
              <Image src={item.image_src.url} alt={item.image_title} fill className="object-cover" />
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
              className="absolute -top-12 right-0 z-10 text-white bg-black/40 hover:bg-black/60 rounded-full p-2 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setLightbox(null);
              }}
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