import React from 'react';
import Image from 'next/image';
import { getImgPath } from '@/utils/pathUtils';

type Props = { project: any };

export default function ProjectCard({ project }: Props) {
  const badge = project?.type === 'gov' ? 'GOV' : 'PRIVATE';
  const img = project?.image ? getImgPath(project.image) : undefined;

  return (
    <div className="bg-white dark:bg-gray-800 rounded shadow-sm overflow-hidden">
      {img && (
        <div className="w-full h-44 relative">
          <Image src={img} alt={project.title} fill className="object-cover" />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h4 className="text-midnight_text dark:text-white font-semibold">{project.title}</h4>
          <span className="text-xs font-semibold px-2 py-1 rounded bg-midnight_text text-white">{badge}</span>
        </div>
        <p className="text-gray mt-2">{project.summary}</p>
      </div>
    </div>
  );
}