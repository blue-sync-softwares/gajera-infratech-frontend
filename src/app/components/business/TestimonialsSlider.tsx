'use client';
import React from 'react';

type Props = { items: any[] };

export default function TestimonialsSlider({ items = [] }: Props) {
  if (!items.length) return <p className="text-gray">No testimonials available.</p>;

  return (
    <div className="space-y-6">
      {items.map((t, i) => (
        <div key={i} className="p-4 bg-white dark:bg-gray-800 rounded shadow-sm">
          <p className="text-base text-gray dark:text-slate-300">"{t.text}"</p>
          <p className="mt-3 font-semibold text-midnight_text dark:text-white">— {t.author}</p>
        </div>
      ))}
    </div>
  );
}