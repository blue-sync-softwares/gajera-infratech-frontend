'use client';
import React, { useState } from 'react';
import MarkdownBlock from './MarkdownBlock';
import GalleryGrid from './GalleryGrid';
import TestimonialsSlider from './TestimonialsSlider';
import ProjectFilters from './ProjectFilters';
import ProjectCard from './ProjectCard';

type GalleryImage = {
  image_title: string;
  image_src: string;
  type_of_image: string;
};

type Props = {
  overview: { html?: string };
  gallery?: GalleryImage[];
  testimonials?: any[];
  projects?: any[];
  projectTypes?: string[];
};

export default function BusinessTabs({ overview, gallery = [], testimonials = [], projects = [], projectTypes = [] }: Props) {
  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'gallery', label: 'Gallery' },
  ];

  if (testimonials.length) tabs.push({ key: 'testimonials', label: 'Testimonials' });
  if (projects.length) tabs.push({ key: 'projects', label: 'Projects' });

  const [active, setActive] = useState<string>('overview');
  const [activeProjectFilter, setActiveProjectFilter] = useState<string>('all');

  // Filter projects based on selected filter
  const filteredProjects = activeProjectFilter === 'all' 
    ? projects 
    : projects.filter((project: any) => project.project_type === activeProjectFilter);

  const handleFilterChange = (filter: string) => {
    setActiveProjectFilter(filter);
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-center gap-2 border-b border-border">
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
          <div>
            {projectTypes.length > 0 && (
              <div className="mb-4">
                <ProjectFilters 
                  projectTypes={projectTypes} 
                  onFilterChange={handleFilterChange}
                  activeFilter={activeProjectFilter}
                />
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((p: any, i: number) => (
                  <ProjectCard key={i} project={p} index={i} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <svg 
                    className="w-16 h-16 mx-auto text-gray/30 dark:text-slate-600 mb-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="text-lg font-semibold text-midnight_text dark:text-white mb-2">
                    No Projects Found
                  </p>
                  <p className="text-gray dark:text-slate-400">
                    No projects match the selected filter. Try selecting a different category.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}