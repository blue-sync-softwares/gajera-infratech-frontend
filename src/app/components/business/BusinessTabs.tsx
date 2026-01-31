'use client';
import React, { useState } from 'react';
import MarkdownBlock from './MarkdownBlock';
import GalleryGrid from './GalleryGrid';
import TestimonialsSlider from './TestimonialsSlider';
import ProjectFilters from './ProjectFilters';
import ProjectCard from './ProjectCard';

type GalleryImage = {
  image_title: string;
  image_src: { url: string };
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
          <div className="max-w-5xl mx-auto">
            <div 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-10 md:p-16 border border-border/50 mb-12"
              data-aos="fade-up"
              data-aos-duration="800"
            >
              <div className="prose prose-xl max-w-none dark:prose-invert prose-headings:text-midnight_text dark:prose-headings:text-white prose-headings:mb-6 prose-headings:mt-8 first:prose-headings:mt-0 prose-p:text-gray dark:prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-6 prose-h2:text-3xl prose-h3:text-2xl">
                <MarkdownBlock html={overview.html || ''} />
              </div>
            </div>

            {/* Additional Info Cards */}
            <div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              data-aos="fade-up"
              data-aos-duration="800"
              data-aos-delay="200"
            >
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-xl p-8 text-center border border-primary/20 hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-midnight_text dark:text-white mb-3">Quality Assured</h4>
                <p className="text-base text-gray dark:text-slate-400 leading-relaxed">Premium standards in every project</p>
              </div>

              <div className="bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-xl p-8 text-center border border-primary/20 hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-midnight_text dark:text-white mb-3">Timely Delivery</h4>
                <p className="text-base text-gray dark:text-slate-400 leading-relaxed">On-time project completion</p>
              </div>

              <div className="bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-xl p-8 text-center border border-primary/20 hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-midnight_text dark:text-white mb-3">Expert Team</h4>
                <p className="text-base text-gray dark:text-slate-400 leading-relaxed">Experienced professionals</p>
              </div>
            </div>
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