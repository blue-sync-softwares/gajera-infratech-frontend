import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getImgPath } from '@/utils/pathUtils';

type Project = {
  project_id: string;
  project_name: string;
  project_description: string;
  project_type: string;
  project__features: string[];
  project_images: string[];
  slug: string;
};

type Props = { 
  project: Project;
  index?: number;
};

export default function ProjectCard({ project, index = 0 }: Props) {
  const badge = project?.project_type === 'gov' ? 'Government' : 'Private';
  const badgeColor = project?.project_type === 'gov' ? 'bg-blue-500' : 'bg-primary';
  const img = project?.project_images?.[0] ? getImgPath(project.project_images[0]) : undefined;

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-border/50"
      data-aos="fade-up"
      data-aos-duration="800"
      data-aos-delay={`${index * 100}`}
    >
      {/* Image Section */}
      {img && (
        <div className="w-full h-52 relative overflow-hidden">
          <Image 
            src={img} 
            alt={project.project_name} 
            fill 
            className="object-cover transition-transform duration-500 group-hover:scale-110" 
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Badge */}
          <div className="absolute top-4 right-4">
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${badgeColor} text-white shadow-lg uppercase tracking-wide`}>
              {badge}
            </span>
          </div>

          {/* Project ID Badge */}
          <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/90 text-midnight_text">
              ID: {project.project_id}
            </span>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="p-5">
        {/* Title */}
        <h4 className="text-lg md:text-xl font-bold text-midnight_text dark:text-white mb-3 line-clamp-2 group-hover:text-primary dark:group-hover:text-primary transition-colors duration-300">
          {project.project_name}
        </h4>

        {/* Description */}
        <p className="text-sm md:text-base text-gray dark:text-slate-300 mb-4 line-clamp-3 leading-relaxed">
          {project.project_description}
        </p>

        {/* Features */}
        {project.project__features && project.project__features.length > 0 && (
          <div className="mb-4">
            <h5 className="text-xs font-semibold text-midnight_text dark:text-white mb-2 uppercase tracking-wide">
              Key Features
            </h5>
            <div className="flex flex-wrap gap-2">
              {project.project__features.slice(0, 3).map((feature, i) => (
                <span 
                  key={i}
                  className="text-xs px-2.5 py-1 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary rounded-md border border-primary/20"
                >
                  {feature}
                </span>
              ))}
              {project.project__features.length > 3 && (
                <span className="text-xs px-2.5 py-1 bg-gray/10 text-gray rounded-md">
                  +{project.project__features.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-border/30 flex items-center justify-between">
          {/* Image Count */}
          {project.project_images && project.project_images.length > 1 && (
            <div className="flex items-center gap-1.5 text-gray dark:text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs font-medium">{project.project_images.length} Photos</span>
            </div>
          )}

          {/* View Details Link */}
          <Link
            href={`/properties/properties-list/${project.slug}`}
            className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1 group/link transition-all duration-300"
          >
            <span>View Details</span>
            <svg 
              className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}