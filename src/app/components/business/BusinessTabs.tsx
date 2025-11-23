'use client';
import React, { useState } from 'react';
import MarkdownBlock from './MarkdownBlock';
import GalleryGrid from './GalleryGrid';

import TestimonialsSlider from './TestimonialsSlider';

type Props = {
  overview: { html?: string };
  gallery?: string[];
  testimonials?: any[];
  projects?: any[];
};

export default function BusinessTabs({ overview, gallery = [], testimonials = [], projects = [] }: Props) {
  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'gallery', label: 'Gallery' },
  ];

  if (testimonials.length) tabs.push({ key: 'testimonials', label: 'Testimonials' });
  if (projects.length) tabs.push({ key: 'projects', label: 'Projects' });

  const [active, setActive] = useState<string>('overview');

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`px-4 py-3 -mb-px text-base font-medium ${active === t.key ? 'text-primary border-b-2 border-primary' : 'text-gray hover:text-primary'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {active === 'overview' && (
          <div className="prose max-w-none dark:prose-invert">
            <MarkdownBlock html={overview.html || ''} />
          </div>
        )}

        {active === 'gallery' && (
          <GalleryGrid images={gallery} />
        )}

        {active === 'testimonials' && (
          <TestimonialsSlider items={testimonials} />
        )}

        {active === 'projects' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((p: any, i: number) => (
              <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded shadow-sm">
                <h4 className="font-semibold text-midnight_text dark:text-white">{p.title}</h4>
                <p className="text-gray mt-2">{p.summary}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}