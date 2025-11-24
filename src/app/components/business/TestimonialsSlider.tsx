'use client';
import React from 'react';
import Image from 'next/image';

type Testimonial = {
  id: number;
  name: string;
  message: string;
  project_id: number;
  image_src?: string;
};

type Props = { 
  items: Testimonial[];
};

export default function TestimonialsSlider({ items = [] }: Props) {
  if (!items.length) {
    return (
      <p className="text-gray text-center py-8">No testimonials available.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {items.map((testimonial) => (
        <div 
          key={testimonial.id} 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border border-border/50"
          data-aos="fade-up"
          data-aos-duration="800"
        >
          {/* Quote Icon */}
          <div className="mb-4">
            <svg 
              className="w-10 h-10 text-primary/30" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
            </svg>
          </div>

          {/* Message */}
          <p className="text-base md:text-lg text-gray dark:text-slate-300 mb-6 leading-relaxed italic">
            "{testimonial.message}"
          </p>

          {/* Author Section */}
          <div className="flex items-center gap-4 pt-4 border-t border-border/30">
            {/* Avatar */}
            {testimonial.image_src ? (
              <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-primary/20">
                <Image 
                  src={testimonial.image_src} 
                  alt={testimonial.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 ring-2 ring-primary/20">
                <span className="text-primary font-semibold text-lg">
                  {testimonial.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            {/* Name */}
            <div>
              <p className="font-semibold text-base md:text-lg text-midnight_text dark:text-white">
                {testimonial.name}
              </p>
              <p className="text-sm text-gray dark:text-slate-400">
                Project #{testimonial.project_id}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}