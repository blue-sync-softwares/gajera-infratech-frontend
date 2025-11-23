import React from 'react';
import Image from 'next/image';

type Props = {
  title: string;
  tagline?: string;
  ctaText?: string;
  ctaHref?: string;
  image?: string;
};

export default function BusinessHero({ title, tagline, ctaText, ctaHref, image }: Props) {
  return (
    <div className="py-8 lg:py-12">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-6">
        <div className="flex-1">
          <h1 className="text-4xl lg:text-5xl font-bold text-midnight_text dark:text-white mb-4">{title}</h1>
          {tagline && <p className="text-lg text-gray mb-6">{tagline}</p>}
          {ctaText && (
            <a
              href={ctaHref}
              className="inline-block px-6 py-3 bg-primary text-white rounded-md shadow-sm hover:opacity-90"
            >
              {ctaText}
            </a>
          )}
        </div>

        {image && (
          <div className="w-full lg:w-1/3 rounded-lg overflow-hidden shadow">
            <Image src={image} alt={title} width={640} height={420} className="w-full h-full object-cover" />
          </div>
        )}
      </div>
    </div>
  );
}