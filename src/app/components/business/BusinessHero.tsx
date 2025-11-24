import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  title: string;
  tagline?: string;
  ctaText?: string;
  ctaHref?: string;
  image?: string;
};

export default function BusinessHero({ title, tagline, ctaText = "Get in Touch", ctaHref = "/contact", image }: Props) {
  return (
    <div className="relative w-full h-[500px] lg:h-[600px] overflow-hidden rounded-2xl shadow-2xl">
      {/* Background Image with Blur */}
      {image && (
        <div className="absolute inset-0">
          <Image 
            src={image} 
            alt={title} 
            fill
            className="object-cover"
            priority
          />
          {/* Blur Overlay */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
          {/* Gradient Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50"></div>
        </div>
      )}

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 lg:px-12">
        {/* Decorative Element */}
        <div 
          className="w-20 h-1 bg-primary mb-6 rounded-full"
          data-aos="fade-down"
          data-aos-duration="800"
        ></div>

        {/* Title */}
        <h1 
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 max-w-4xl leading-tight drop-shadow-lg"
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay="200"
        >
          {title}
        </h1>

        {/* Tagline */}
        {tagline && (
          <p 
            className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 max-w-3xl leading-relaxed drop-shadow-md"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="400"
          >
            {tagline}
          </p>
        )}

        {/* CTA Button */}
        <Link
          href={ctaHref}
          className="group relative inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg shadow-lg hover:bg-primary/90 transition-all duration-300 hover:scale-105 hover:shadow-xl"
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay="600"
        >
          <span>{ctaText}</span>
          <svg 
            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>

        {/* Decorative Bottom Element */}
        <div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay="800"
        >
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>

      {/* Corner Decorative Elements */}
      <div 
        className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full"
        data-aos="fade-left"
        data-aos-duration="1200"
      ></div>
      <div 
        className="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 rounded-tr-full"
        data-aos="fade-right"
        data-aos-duration="1200"
      ></div>
    </div>
  );
}