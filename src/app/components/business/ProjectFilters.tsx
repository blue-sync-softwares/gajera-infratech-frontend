'use client';
import React, { useState, useEffect } from 'react';

type Props = {
  projectTypes: string[];
  onFilterChange?: (filter: string) => void;
  activeFilter?: string;
};

export default function ProjectFilters({ projectTypes = [], onFilterChange, activeFilter: externalActiveFilter }: Props) {
  const [activeFilter, setActiveFilter] = useState<string>(externalActiveFilter || 'all');

  // Sync internal state with external prop
  useEffect(() => {
    if (externalActiveFilter !== undefined) {
      setActiveFilter(externalActiveFilter);
    }
  }, [externalActiveFilter]);

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    if (onFilterChange) {
      onFilterChange(filter);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm font-semibold text-midnight_text dark:text-white mr-2">
          Filter by:
        </span>

        {projectTypes.map((type, index) => (
          <button
            key={type}
            onClick={() => handleFilterClick(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 capitalize ${
              activeFilter === type
                ? 'bg-primary text-white shadow-md shadow-primary/30'
                : 'bg-white dark:bg-gray-800 text-gray dark:text-slate-300 hover:bg-primary/10 dark:hover:bg-gray-700 border border-border'
            }`}
          >
            {type === 'gov' ? 'Government' : type === 'private' ? 'Private' : type}
          </button>
        ))}
      </div>

      {/* Active Filter Indicator */}
      {activeFilter !== 'all' && (
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 dark:bg-primary/20 rounded-full text-sm transition-all duration-300">
          <span className="text-midnight_text dark:text-white font-medium">
            Showing:
          </span>
          <span className="text-primary font-semibold capitalize">
            {activeFilter === 'gov' ? 'Government' : activeFilter === 'private' ? 'Private' : activeFilter}
          </span>
          <button
            onClick={() => handleFilterClick('all')}
            className="ml-1 text-gray hover:text-primary transition-colors"
            aria-label="Clear filter"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}